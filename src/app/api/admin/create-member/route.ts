import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
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

  // Parse request body
  const body = await req.json();
  const {
    fullName,
    email,
    phone,
    password,
    role = "customer",
    kycStatus = "approved",
    seedDemo = false,
  } = body as {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
    role: "customer" | "admin";
    kycStatus: "pending" | "approved" | "rejected";
    seedDemo: boolean;
  };

  if (!fullName || !email || !password) {
    return NextResponse.json(
      { error: "fullName, email and password are required." },
      { status: 400 }
    );
  }

  const adminClient = createAdminClient();

  // Create the user in Supabase Auth
  const { data: created, error: createError } =
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // skip email verification
      user_metadata: {
        full_name: fullName,
        phone: phone ?? null,
        role,
      },
    });

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 400 });
  }

  const newUserId = created.user.id;

  // Update profile: set phone, role, and kycStatus
  // (handle_new_user trigger creates the base row)
  await adminClient.from("profiles").upsert({
    id: newUserId,
    full_name: fullName,
    email,
    phone: phone ?? null,
    role,
    kyc_status: kycStatus,
  });

  // Optionally seed demo data
  if (seedDemo) {
    await adminClient.rpc("seed_demo_data", { p_user_id: newUserId });
  }

  return NextResponse.json({ userId: newUserId }, { status: 201 });
}
