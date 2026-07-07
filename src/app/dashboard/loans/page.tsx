import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Calendar, DollarSign, TrendingDown, CreditCard, ChevronRight, Landmark, ShieldCheck } from "lucide-react";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(amount);
}

const LOAN_ICONS: Record<string, string> = {
  mortgage: "🏠", vehicle: "🚗", personal: "👤", business: "💼", education: "🎓"
};

export default async function LoansPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: loans } = await supabase.from("loans").select("*").eq("user_id", user.id).eq("status", "active");

  const totalLoanBalance = loans?.reduce((s, l) => s + l.balance, 0) ?? 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-950">Institutional Credit</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Manage Loans & Financing</p>
        </div>
        <button className="px-6 py-3 bg-brand-900 hover:bg-brand-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-brand-900/20">
          Apply for Credit
        </button>
      </div>

      <div className="premium-glass rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Total Outstanding Liability</p>
          <p className="text-5xl font-bold font-mono tracking-tighter">{formatCurrency(totalLoanBalance)}</p>
          <div className="flex items-center gap-4 mt-6">
            <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {loans?.length ?? 0} Active Facilities
            </p>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -mr-32 -mt-32" />
      </div>

      <div className="space-y-6">
        {(!loans || loans.length === 0) ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-200/60 shadow-[0_20px_60px_rgba(0,0,0,0.02)] group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 transition-colors duration-700 group-hover:bg-slate-100/50" />
            
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 border border-slate-100 shadow-lg transition-transform group-hover:scale-110 duration-500">
              <Landmark className="w-10 h-10 text-slate-200" />
            </div>
            
            <h3 className="text-[11px] font-black text-brand-950 tracking-[0.3em] mb-4 uppercase">No Active Facilities</h3>
            <p className="text-[15px] text-slate-500 mb-10 max-w-sm mx-auto leading-relaxed font-medium">
              You currently have no active loan facilities with Canal Bank. 
              Institutional credit provides flexible liquidity for your personal and business needs.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-10 py-4 bg-brand-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-800 transition-all shadow-xl shadow-brand-900/20 active:scale-95">
                Explore Financing Options
              </button>
              <button className="px-10 py-4 bg-white text-slate-500 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                Calculate Rates <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          loans.map((loan) => {
            const paidPct = ((loan.principal - loan.balance) / loan.principal) * 100;
            const daysUntilPayment = Math.ceil((new Date(loan.next_payment_date).getTime() - Date.now()) / 86400000);
            return (
              <div key={loan.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-black/5 transition-all duration-500">
                <div className="p-10">
                  <div className="flex items-start justify-between mb-10">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl shadow-sm">
                        {LOAN_ICONS[loan.loan_type]}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-brand-950 tracking-tight">{loan.loan_name}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">
                          {loan.loan_type} Entity · {(loan.interest_rate * 100).toFixed(2)}% APR
                        </p>
                      </div>
                    </div>
                    <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                      Active Facility
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                    {[
                      { icon: TrendingDown, label: "Principal Owed", value: formatCurrency(loan.balance), color: "text-brand-950" },
                      { icon: DollarSign, label: "Monthly Repay", value: formatCurrency(loan.monthly_payment), color: "text-brand-950" },
                      { icon: CreditCard, label: "Original Principal", value: formatCurrency(loan.principal), color: "text-slate-400" },
                      { icon: Calendar, label: "Payment Date", value: daysUntilPayment > 0 ? `In ${daysUntilPayment} Days` : "Due Today", color: daysUntilPayment <= 5 ? "text-accent-500" : "text-brand-950" },
                    ].map(({ icon: Icon, label, value, color }) => (
                      <div key={label} className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-slate-300" />
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{label}</p>
                        </div>
                        <p className={`text-base font-bold font-mono tracking-tighter ${color}`}>{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mb-10 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-3">
                      <span className="text-emerald-600">{paidPct.toFixed(1)}% Amortized</span>
                      <span className="text-slate-400">{formatCurrency(loan.principal - loan.balance)} / {formatCurrency(loan.principal)} Paid</span>
                    </div>
                    <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${paidPct}%` }} />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button className="flex-1 py-4 bg-brand-900 hover:bg-brand-800 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-brand-900/10 active:scale-[0.98]">
                      Post Payment
                    </button>
                    <button className="flex-1 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-[0.98]">
                      View Amortization Schedule
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
