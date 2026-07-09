import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Institutional Governance API
 * Handles global platform configurations and updates the site_settings registry.
 */
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify Institutional Role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "supervisor", "executive"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden: Institutional role required" }, { status: 403 });
  }

  try {
    const config = await req.json();

    if (!config) {
      throw new Error("Missing configuration payload.");
    }

    const adminClient = createAdminClient();

    // Update Site Settings Registry for platform_config
    const { error: settingsError } = await adminClient
      .from("site_settings")
      .upsert({
        key: "platform_config",
        value: config,
        updated_at: new Date().toISOString()
      }, { onConflict: "key" });

    if (settingsError) throw settingsError;

    // Log the modification in Audit Stream
    await adminClient.from("transactions").insert({
      user_id: user.id,
      account_id: "00000000-0000-0000-0000-000000000000",
      transaction_type: "debit",
      category: "system_audit",
      description: `[PLATFORM_MOD] System configuration updated by ${user.email}.`,
      amount: 0,
      balance_after: 0,
      status: "completed",
      reference: `settings-${crypto.randomUUID()}`
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("System Settings Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * GET Handler: Resolve Public Configuration
 */
export async function GET() {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("site_settings")
    .select("value")
    .eq("key", "platform_config")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data?.value || {});
}
