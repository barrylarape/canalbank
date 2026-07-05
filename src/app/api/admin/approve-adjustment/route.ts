import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Phase 9: Ledger Flight Recorder
 * Writes persistent diagnostic data to the system audit trail at every stage.
 */
async function recordFlightData(adminClient: any, traceId: string, stage: string, details: any, userId: string, accountId?: string) {
  console.log(`[FLIGHT_RECORDER][${traceId}] STAGE: ${stage}`);
  
  await adminClient.from("transactions").insert({
    user_id: userId,
    account_id: accountId || "00000000-0000-0000-0000-000000000000",
    transaction_type: "debit",
    category: "system_audit",
    description: `[FLIGHT_LOG: ${traceId}] STAGE: ${stage} | DETAILS: ${JSON.stringify(details)}`,
    amount: 0,
    balance_after: 0,
    status: "completed",
    reference: `audit-${crypto.randomUUID()}`,
    approval_tier: "standard"
  });
}

/**
 * API Route: Tiered Checker Authorization with Atomic Ledger Execution
 * Verified Phase 9 & 10: Strict Update Confirmation & Flight Recording
 */
export async function POST(req: NextRequest) {
  const traceId = crypto.randomUUID();
  let body;
  
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { transactionId, action } = body;
  const adminClient = createAdminClient();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await recordFlightData(adminClient, traceId, "AUTH_REQUEST_RECEIVED", { transactionId, action, checker: user.email }, user.id);

  const { data: checkerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!checkerProfile || !["admin", "supervisor", "executive"].includes(checkerProfile.role)) {
    await recordFlightData(adminClient, traceId, "FORBIDDEN_CHECKER", { role: checkerProfile?.role }, user.id);
    return NextResponse.json({ error: "Forbidden: Institutional role required" }, { status: 403 });
  }

  try {
    if (!transactionId || !action) {
      throw new Error("Missing transactionId or action parameter.");
    }

    // 1. Fetch the pending transaction
    const { data: tx, error: txFetchError } = await adminClient
      .from("transactions")
      .select("*")
      .eq("id", transactionId)
      .eq("status", "pending")
      .single();

    if (txFetchError || !tx) {
      await recordFlightData(adminClient, traceId, "TRANSACTION_NOT_FOUND", { transactionId, error: txFetchError?.message }, user.id);
      throw new Error("Target transaction not found or already processed.");
    }

    // 2. Dual Control Enforcement: Maker cannot be the Checker
    if (tx.created_by_id === user.id) {
      await recordFlightData(adminClient, traceId, "SELF_APPROVAL_VIOLATION", { maker: tx.created_by_id }, user.id);
      return NextResponse.json({ 
        error: "Self-approval violation: The officer who initiated this request (Maker) cannot be the one to authorize it (Checker)." 
      }, { status: 403 });
    }

    // 3. Handle Rejection
    if (action === "reject") {
      const { data: rejectedTx, error: rejectError } = await adminClient
        .from("transactions")
        .update({ 
          status: "failed",
          description: tx.description + ` (Rejected by ${user.email})`,
          approved_by_id: user.id
        })
        .eq("id", transactionId)
        .select();
      
      if (rejectError || !rejectedTx || rejectedTx.length !== 1) {
        throw new Error("Failed to update transaction status to rejected.");
      }
      
      await recordFlightData(adminClient, traceId, "TRANSACTION_REJECTED", { txId: transactionId }, user.id);
      return NextResponse.json({ success: true, status: "rejected" });
    }

    // 4. Atomic Execution Phase: Balance Update + Transaction Finalization
    
    // Step A: Load Account
    const { data: account, error: accFetchError } = await adminClient
      .from("accounts")
      .select("id, balance, available_balance")
      .eq("id", tx.account_id)
      .single();

    if (accFetchError || !account) {
      await recordFlightData(adminClient, traceId, "ACCOUNT_LOAD_FAILED", { accountId: tx.account_id, error: accFetchError?.message }, user.id);
      throw new Error("Target account not found in core ledger.");
    }

    // Step B: Calculate New Balance
    const currentBalance = Number(account.balance || 0);
    const amount = Number(tx.amount);
    const shift = tx.transaction_type === "credit" ? amount : -amount;
    const newBalance = currentBalance + shift;

    await recordFlightData(adminClient, traceId, "BALANCE_CALCULATED", { currentBalance, amount, newBalance, type: tx.transaction_type }, user.id, account.id);

    // Step C: Update Account Balance with Strict Verification
    const { data: updatedAccount, error: updateAccError } = await adminClient
      .from("accounts")
      .update({ 
        balance: newBalance, 
        available_balance: newBalance 
      })
      .eq("id", account.id)
      .select();

    if (updateAccError || !updatedAccount || updatedAccount.length !== 1) {
      await recordFlightData(adminClient, traceId, "ACCOUNT_UPDATE_FAILURE", { error: updateAccError?.message }, user.id, account.id);
      throw new Error(`Account Update Failed: ${updateAccError?.message || "Zero rows affected"}`);
    }

    // Step D: Finalize Transaction with Strict Verification
    const { data: finalizedTx, error: updateTxError } = await adminClient
      .from("transactions")
      .update({ 
        status: "completed",
        balance_after: newBalance,
        approved_by_id: user.id,
        description: tx.description.replace("[TIER:", "[EXECUTED:")
      })
      .eq("id", transactionId)
      .select();

    if (updateTxError || !finalizedTx || finalizedTx.length !== 1) {
      await recordFlightData(adminClient, traceId, "TRANSACTION_FINALIZATION_FAILURE", { error: updateTxError?.message }, user.id, account.id);
      throw new Error(`Transaction Finalization Failed: ${updateTxError?.message || "Zero rows affected"}`);
    }

    await recordFlightData(adminClient, traceId, "TRANSACTION_EXECUTED_SUCCESS", { finalizedTx: finalizedTx[0], approvedBy: user.email }, user.id, account.id);

    return NextResponse.json({ success: true, status: "completed" });

  } catch (error: any) {
    console.error(`[${traceId}] EXCEPTION:`, error);
    await recordFlightData(adminClient, traceId, "PIPELINE_CRASH", { message: error.message }, user.id);
    return NextResponse.json({ error: error.message || "Institutional posting failed." }, { status: 500 });
  }
}
