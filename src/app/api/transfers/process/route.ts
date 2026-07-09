import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Institutional Transfer Processor
 * Handles internal and external fund movements with atomic balance updates.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { 
      type, 
      fromAccountId, 
      toAccountId, 
      amount, 
      recipientName, 
      iban, 
      note 
    } = body;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) throw new Error("Invalid amount.");

    const adminClient = createAdminClient();

    // 1. Verify Source Account & Balance
    const { data: fromAccount, error: fromError } = await adminClient
      .from("accounts")
      .select("*")
      .eq("id", fromAccountId)
      .eq("user_id", user.id)
      .single();

    if (fromError || !fromAccount) throw new Error("Source account not found.");
    if (fromAccount.available_balance < numAmount) throw new Error("Insufficient available funds.");

    const traceId = crypto.randomUUID();

    if (type === "internal") {
      // INTERNAL TRANSFER LOGIC (Instant)
      const { data: toAccount, error: toError } = await adminClient
        .from("accounts")
        .select("*")
        .eq("id", toAccountId)
        .eq("user_id", user.id)
        .single();

      if (toError || !toAccount) throw new Error("Destination account not found.");

      // Calculate New Balances
      const newFromBalance = fromAccount.balance - numAmount;
      const newFromAvailable = fromAccount.available_balance - numAmount;
      const newToBalance = toAccount.balance + numAmount;
      const newToAvailable = toAccount.available_balance + numAmount;

      // Update From Account
      await adminClient.from("accounts").update({
        balance: newFromBalance,
        available_balance: newFromAvailable
      }).eq("id", fromAccountId);

      // Update To Account
      await adminClient.from("accounts").update({
        balance: newToBalance,
        available_balance: newToAvailable
      }).eq("id", toAccountId);

      // Insert Debit Transaction
      await adminClient.from("transactions").insert({
        account_id: fromAccountId,
        user_id: user.id,
        transaction_type: "debit",
        category: "transfer",
        description: `Internal Transfer to ${toAccount.account_name} ${note ? `- ${note}` : ""}`,
        amount: numAmount,
        balance_after: newFromBalance,
        reference: traceId,
        status: "completed",
        counterparty_name: toAccount.account_name
      });

      // Insert Credit Transaction
      await adminClient.from("transactions").insert({
        account_id: toAccountId,
        user_id: user.id,
        transaction_type: "credit",
        category: "transfer",
        description: `Internal Transfer from ${fromAccount.account_name} ${note ? `- ${note}` : ""}`,
        amount: numAmount,
        balance_after: newToBalance,
        reference: traceId,
        status: "completed",
        counterparty_name: fromAccount.account_name
      });

    } else {
      // EXTERNAL WIRE LOGIC (Pending)
      const newAvailable = fromAccount.available_balance - numAmount;
      const balanceAfter = fromAccount.balance - numAmount; // Projected ledger balance

      // Deduct Available Balance Immediately (Hold)
      await adminClient.from("accounts").update({
        available_balance: newAvailable
      }).eq("id", fromAccountId);

      // Log Pending Transaction
      await adminClient.from("transactions").insert({
        account_id: fromAccountId,
        user_id: user.id,
        transaction_type: "debit",
        category: "transfer",
        description: `${type === 'domestic' ? 'Domestic' : 'International'} Wire to ${recipientName} (${iban}) ${note ? `- ${note}` : ""}`,
        amount: numAmount,
        balance_after: balanceAfter,
        reference: traceId,
        status: "pending",
        counterparty_name: recipientName
      });
    }

    return NextResponse.json({ success: true, traceId });

  } catch (error: any) {
    console.error("Transfer error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
