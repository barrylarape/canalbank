import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TrendingUp, TrendingDown, PieChart } from "lucide-react";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("de-CH", { style: "currency", currency: "CHF" }).format(amount);
}

const ASSET_TYPE_LABELS: Record<string, string> = {
  stock: "Stock", etf: "ETF", mutual_fund: "Mutual Fund", bond: "Bond", crypto: "Crypto"
};

export default async function InvestmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: investments } = await supabase.from("investments").select("*").eq("user_id", user.id);

  const totalValue = investments?.reduce((s, i) => s + i.current_value, 0) ?? 0;
  const totalGainLoss = investments?.reduce((s, i) => s + i.gain_loss, 0) ?? 0;
  const gainPct = totalValue > 0 ? ((totalGainLoss / (totalValue - totalGainLoss)) * 100).toFixed(2) : "0.00";
  const isPositive = totalGainLoss >= 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-brand-950">Investment Portfolio</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-2xl p-6 text-white col-span-1 md:col-span-2 shadow-lg">
          <p className="text-purple-200 text-sm font-medium mb-1">Total Portfolio Value</p>
          <p className="text-4xl font-bold mb-2">{formatCurrency(totalValue)}</p>
          <div className={`flex items-center gap-2 text-sm ${isPositive ? "text-emerald-300" : "text-red-300"}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{isPositive ? "+" : ""}{formatCurrency(totalGainLoss)} ({gainPct}%) all time</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 text-slate-500 mb-3">
            <PieChart className="w-4 h-4" />
            <span className="text-sm font-medium">Allocation</span>
          </div>
          {investments && <PortfolioChart investments={investments} />}
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-base font-bold text-brand-950">Holdings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Asset</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Shares</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Value</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gain/Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(investments ?? []).map((inv) => {
                const isGain = inv.gain_loss >= 0;
                return (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center font-bold text-purple-800 text-xs">
                          {inv.asset_symbol.slice(0, 3)}
                        </div>
                        <div>
                          <p className="font-semibold text-brand-950">{inv.asset_name}</p>
                          <p className="text-xs text-slate-400">{inv.asset_symbol} · {ASSET_TYPE_LABELS[inv.asset_type]}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-700">{inv.shares.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-slate-700">{formatCurrency(inv.current_price)}</td>
                    <td className="px-6 py-4 text-right font-semibold text-brand-950">{formatCurrency(inv.current_value)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-semibold flex items-center gap-1 justify-end ${isGain ? "text-emerald-600" : "text-red-600"}`}>
                        {isGain ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {isGain ? "+" : ""}{formatCurrency(inv.gain_loss)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
