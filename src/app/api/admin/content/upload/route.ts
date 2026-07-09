import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Institutional Asset Uplink
 * Handles image uploads to Supabase Storage and updates the global site_settings registry.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify Admin permissions
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "supervisor", "executive"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden: Institutional role required" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const assetKey = formData.get("assetKey") as string;

    if (!file || !assetKey) {
      throw new Error("Missing file or asset key identification.");
    }

    const adminClient = createAdminClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${assetKey}-${crypto.randomUUID()}.${fileExt}`;
    const filePath = `brand/${fileName}`;

    // 1. Upload to Storage (bucket: site-assets)
    const { data: uploadData, error: uploadError } = await adminClient.storage
      .from("site-assets")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true
      });

    if (uploadError) throw uploadError;

    // 2. Resolve Public URL
    const { data: { publicUrl } } = adminClient.storage
      .from("site-assets")
      .getPublicUrl(filePath);

    // 3. Update Site Settings Registry
    const { data: currentSettings } = await adminClient
      .from("site_settings")
      .select("value")
      .eq("key", "brand_assets")
      .single();

    const newSettings = {
      ...(currentSettings?.value as Record<string, string> || {}),
      [assetKey]: publicUrl
    };

    const { error: settingsError } = await adminClient
      .from("site_settings")
      .upsert({
        key: "brand_assets",
        value: newSettings,
        updated_at: new Date().toISOString()
      });

    if (settingsError) throw settingsError;

    // 4. Log the modification in Audit Stream
    await adminClient.from("transactions").insert({
      user_id: user.id,
      account_id: "00000000-0000-0000-0000-000000000000",
      transaction_type: "debit",
      category: "system_audit",
      description: `[BRAND_MOD] Asset "${assetKey}" updated by ${user.email}. New URL: ${publicUrl}`,
      amount: 0,
      balance_after: 0,
      status: "completed",
      reference: `content-${crypto.randomUUID()}`
    });

    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error: any) {
    console.error("Content Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}