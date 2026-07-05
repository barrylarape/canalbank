import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { type, name } = await req.json();

    // Institutional Admin Client to bypass RLS and generate secure IBAN
    const adminClient = createAdminClient();

    // Generate Professional Swiss IBAN format: CHxx BBBB BCCC CCCC C (Exactly 21 characters)
    // BBBB B = 80808 (Canal Bank Clearing)
    const clearing = "80808";
    const checkDigits = Math.floor(10 + Math.random() * 89).toString();
    const accountPart = Math.floor(10000000 + Math.random() * 89999999).toString(); // 8 digits
    
    // Construct format: CHxx BBBB BCCC CCCC C
    const iban = `CH${checkDigits} ${clearing.slice(0, 4)} ${clearing[4]}${accountPart.slice(0, 3)} ${accountPart.slice(3, 7)} ${accountPart[7]}`;

    const { data: account, error: accError } = await adminClient
      .from("accounts")
      .insert({
        user_id: user.id,
        account_type: type || "checking",
        account_name: name || "Everyday Checking",
        account_number: iban,
        balance: 0.00, // Removed Welcome Bonus - Starting at 0
        available_balance: 0.00,
        currency: "CHF",
        status: "active",
        interest_rate: type === "savings" ? 0.0325 : null
      })
      .select()
      .single();

    if (accError) {
      console.error("Account creation database error:", accError);
      return NextResponse.json({ error: accError.message }, { status: 400 });
    }

    return NextResponse.json(account);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
