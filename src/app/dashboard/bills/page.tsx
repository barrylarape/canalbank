import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BillsClient } from "./bills-client";

export default async function BillsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch active accounts for payment selection
  const { data: accounts } = await supabase
    .from("accounts")
    .select("id, account_name, account_number, balance, available_balance, currency, account_type")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at");

  // Fetch recent payments (utility, shopping, or other debits)
  const { data: history } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .eq("transaction_type", "debit")
    .order("created_at", { ascending: false })
    .limit(20);

  return <BillsClient accounts={accounts ?? []} history={history ?? []} />;
}
