import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Phase 2 & 9: Institutional Lifecycle Tracing & Audit Logging
 */
async function traceAudit(adminClient: any, traceId: string, stage: string, details: any, userId: string, accountId?: string) {
  console.log(`[${traceId}] STAGE: ${stage} - ${JSON.stringify(details)}`);
  
  // Phase 9: Persistent Server Audit Log
  // Each log entry needs a unique reference to avoid constraint violations
  await adminClient.from("transactions").insert({
    user_id: userId,
    account_id: accountId || "00000000-0000-0000-0000-000000000000",
    transaction_type: "debit",
    category: "system_audit",
    description: `[TRACE: ${traceId}] ${stage}: ${JSON.stringify(details)}`,
    amount: 0,
    balance_after: 0,
    status: "completed",
    reference: `audit-${crypto.randomUUID()}`,
    approval_tier: "standard"
  });
}

export async function POST(req: NextRequest) {
  // Use UUID for institutional uniqueness to prevent 409 collisions
  const traceId = crypto.randomUUID();
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminClient = createAdminClient();
  const { data: adminProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  if (!adminProfile || (adminProfile.role !== "admin" && adminProfile.role !== "supervisor" && adminProfile.role !== "executive")) {
    await traceAudit(adminClient, traceId, "AUTH_FAILED", { user: user.email, reason: "Insufficient Permissions" }, user.id);
    return NextResponse.json({ error: "Forbidden: Institutional role required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { accountId, userId, amount, type, description, reason, valueDate, initiator } = body;

    await traceAudit(adminClient, traceId, "API_RECEIVED", { payload: body }, user.id, accountId);

    const account = await adminClient.from("accounts").select("balance").eq("id", accountId).single();
    if (!account.data) throw new Error("Target account not found");

    let approvalTier: "standard" | "supervisor" | "dual" | "executive" = "standard";
    const numAmount = parseFloat(amount);
    if (numAmount >= 250000) approvalTier = "executive";
    else if (numAmount >= 5000) approvalTier = "supervisor"; 

    const projectedBalance = type === "credit" ? (account.data.balance || 0) + numAmount : (account.data.balance || 0) - numAmount;
    const richDescription = `[TIER: ${approvalTier.toUpperCase()}] [VAL: ${valueDate}] [INITIATOR: ${initiator}] [MAKER: ${user.email}] ${reason}: ${description}`;

    // The primary transaction uses the traceId as its institutional reference
    const { error: txError } = await adminClient.from("transactions").insert({
      account_id: accountId,
      user_id: userId,
      transaction_type: type,
      category: "adjustment_request",
      description: richDescription,
      amount: numAmount,
      balance_after: projectedBalance,
      status: "pending",
      reference: traceId,
      counterparty_name: initiator || user.email,
      created_by_id: user.id, 
      approval_tier: approvalTier
    });

    if (txError) throw txError;

    await traceAudit(adminClient, traceId, "LEDGER_INSERT_SUCCESS", { tier: approvalTier, amount: numAmount }, user.id, accountId);

    return NextResponse.json({ success: true, traceId, tier: approvalTier });
  } catch (error: any) {
    await traceAudit(adminClient, traceId, "LIFECYCLE_CRASH", { error: error.message }, user.id);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
