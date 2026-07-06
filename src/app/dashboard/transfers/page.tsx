import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TransfersClient } from "./transfers-client";

export default async function TransfersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: accounts } = await supabase
    .from("accounts")
    .select("id, account_name, account_number, balance, available_balance, currency, account_type")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at");

  return <TransfersClient accounts={accounts ?? []} userId={user.id} />;
}
