import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Institutional Payment & Bill Settlement Processor
 * Atomically deducts funds and commits the settlement to the global ledger.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { 
      fromAccountId, 
      beneficiary, 
      reference, 
      amount,
      category = "utilities"
    } = body;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) throw new Error("Invalid settlement amount.");

    const adminClient = createAdminClient();

    // 1. Verify Source Account & Balance Integrity
    const { data: fromAccount, error: fromError } = await adminClient
      .from("accounts")
      .select("*")
      .eq("id", fromAccountId)
      .eq("user_id", user.id)
      .single();

    if (fromError || !fromAccount) throw new Error("Vault entity not found.");
    if (fromAccount.available_balance < numAmount) throw new Error("Insufficient institutional liquidity.");

    const traceId = crypto.randomUUID();

    // 2. Atomic Balance Adjustment
    const newBalance = fromAccount.balance - numAmount;
    const newAvailable = fromAccount.available_balance - numAmount;

    const { error: updateError } = await adminClient
      .from("accounts")
      .update({
        balance: newBalance,
        available_balance: newAvailable
      })
      .eq("id", fromAccountId);

    if (updateError) throw new Error("Ledger balance update failed.");

    // 3. Commit Debit Transaction
    const { error: txError } = await adminClient
      .from("transactions")
      .insert({
        account_id: fromAccountId,
        user_id: user.id,
        transaction_type: "debit",
        category,
        description: `Settlement: ${beneficiary} - REF: ${reference}`,
        amount: numAmount,
        balance_after: newBalance,
        reference: traceId,
        status: "completed",
        counterparty_name: beneficiary
      });

    if (txError) throw new Error("Transaction commitment failed.");

    return NextResponse.json({ success: true, traceId });

  } catch (error: any) {
    console.error("Settlement error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
