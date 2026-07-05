import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CardControls } from "@/components/dashboard/card-controls";

export default async function CardsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: cards } = await supabase.from("cards").select("*").eq("user_id", user.id);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-brand-950">Card Management</h1>
      {(!cards || cards.length === 0) ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
          No cards found. Make sure demo data is seeded.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cards.map((card) => (
            <CardControls key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
