import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(req: NextRequest) {
  // Verify the caller is an authenticated admin
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (callerProfile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const {
    userId,
    kycStatus,
    role,
    fullName,
    phone,
  } = body as {
    userId: string;
    kycStatus?: "pending" | "approved" | "rejected";
    role?: "customer" | "admin";
    fullName?: string;
    phone?: string;
  };

  if (!userId) {
    return NextResponse.json({ error: "userId is required." }, { status: 400 });
  }

  const adminClient = createAdminClient();

  const updates: Record<string, string | undefined> = {};
  if (kycStatus) updates.kyc_status = kycStatus;
  if (role) updates.role = role;
  if (fullName) updates.full_name = fullName;
  if (phone) updates.phone = phone;

  const { error } = await adminClient
    .from("profiles")
    .update(updates)
    .eq("id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
