import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Unified Ledger Monitor: Handles manual transaction edits with automatic balance consistency.
 * If status is changed to 'completed', the system attempts to update the associated account balance.
 */
export async function PATCH(req: NextRequest) {
  const traceId = crypto.randomUUID();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!callerProfile || !["admin", "supervisor", "executive"].includes(callerProfile.role)) {
    return NextResponse.json({ error: "Forbidden: Institutional role required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { transactionId, status, description, amount } = body as {
      transactionId: string;
      status?: "pending" | "completed" | "failed" | "reversed";
      description?: string;
      amount?: number;
    };

    if (!transactionId) {
      return NextResponse.json({ error: "transactionId is required." }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // 1. Fetch current transaction state
    const { data: tx, error: fetchError } = await adminClient
      .from("transactions")
      .select("*")
      .eq("id", transactionId)
      .single();

    if (fetchError || !tx) {
      return NextResponse.json({ error: "Transaction not found." }, { status: 404 });
    }

    let finalBalanceAfter = tx.balance_after;

    // 2. Consistency Logic: If status is being changed to 'completed' and it wasn't before
    if (status === "completed" && tx.status !== "completed") {
      const { data: account, error: accError } = await adminClient
        .from("accounts")
        .select("id, balance")
        .eq("id", tx.account_id)
        .single();

      if (accError || !account) {
        return NextResponse.json({ error: "Linked account not found for balance update." }, { status: 404 });
      }

      // Calculate new balance
      const shift = tx.transaction_type === "credit" ? (amount ?? tx.amount) : -(amount ?? tx.amount);
      const newBalance = Number(account.balance) + shift;
      finalBalanceAfter = newBalance;

      // Update Account
      const { error: updateAccError } = await adminClient
        .from("accounts")
        .update({ balance: newBalance, available_balance: newBalance })
        .eq("id", account.id);

      if (updateAccError) {
        throw new Error(`Failed to update account balance: ${updateAccError.message}`);
      }

      // Log Security Warning (Manual override)
      await adminClient.from("transactions").insert({
        user_id: user.id,
        account_id: account.id,
        transaction_type: "debit",
        category: "system_audit",
        description: `[SECURITY_OVERRIDE] Manual status change to COMPLETED for ${transactionId} by ${user.email}. Balance updated to ${newBalance}.`,
        amount: 0,
        balance_after: 0,
        status: "completed",
        reference: `audit-${crypto.randomUUID()}`
      });
    }

    // 3. Update Transaction
    const updates: any = {};
    if (status) updates.status = status;
    if (description) updates.description = description;
    if (typeof amount === 'number') updates.amount = amount;
    updates.balance_after = finalBalanceAfter;
    if (status === 'completed') updates.approved_by_id = user.id;

    const { data: updated, error: updateError } = await adminClient
      .from("transactions")
      .update(updates)
      .eq("id", transactionId)
      .select();

    if (updateError || !updated || updated.length === 0) {
      return NextResponse.json({ error: updateError?.message || "Failed to update transaction." }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
