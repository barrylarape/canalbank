import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { 
  Download, ArrowRightLeft, CreditCard, Building, 
  ShoppingCart, Coffee, Briefcase, Zap, Car, Heart, Play,
  Check, Clock, X, RotateCcw, Plus, Landmark, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function formatCurrency(amount: number, currency = "CHF") {
  return new Intl.NumberFormat("de-CH", { style: "currency", currency }).format(amount);
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "shopping": return <ShoppingCart className="w-5 h-5" />;
    case "food": return <Coffee className="w-5 h-5" />;
    case "income": return <Briefcase className="w-5 h-5" />;
    case "transfer": return <ArrowRightLeft className="w-5 h-5" />;
    case "utilities": return <Zap className="w-5 h-5" />;
    case "transport": return <Car className="w-5 h-5" />;
    case "health": return <Heart className="w-5 h-5" />;
    case "entertainment": return <Play className="w-5 h-5" />;
    default: return <CreditCard className="w-5 h-5" />;
  }
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { style: string; icon: any }> = {
    completed: { 
      style: "bg-emerald-50 text-emerald-700 border-emerald-100 shadow-[0_1px_4px_rgba(16,185,129,0.05)]", 
      icon: Check 
    },
    pending: { 
      style: "bg-amber-50 text-amber-700 border-amber-100 shadow-[0_1px_4px_rgba(245,158,11,0.05)]", 
      icon: Clock 
    },
    failed: { 
      style: "bg-red-50 text-red-700 border-red-100 shadow-[0_1px_4px_rgba(239,68,68,0.05)]", 
      icon: X 
    },
    reversed: { 
      style: "bg-slate-50 text-slate-500 border-slate-100 shadow-[0_1px_4px_rgba(100,116,139,0.05)]", 
      icon: RotateCcw 
    },
  };
  
  const { style, icon: Icon } = config[status] ?? config.pending;
  
  return (
    <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase border tracking-widest transition-all", style)}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

export default async function AccountsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: accounts }, { data: transactions }] = await Promise.all([
    supabase.from("accounts").select("*").eq("user_id", user.id).order("created_at"),
    supabase.from("transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
  ]);

  const totalBalance = accounts?.reduce((s, a) => a.account_type !== 'credit' ? s + a.balance : s, 0) ?? 0;

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-brand-950 uppercase tracking-tight">Institutional Portfolio</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Manage Everyday Liquidity & Savings</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/transfers" className="flex items-center gap-2 px-6 py-3 bg-brand-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-800 transition-all shadow-xl shadow-brand-950/20">
            <ArrowRightLeft className="w-4 h-4" /> Transfer
          </Link>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {[
          { label: "Total Net Worth", value: formatCurrency(totalBalance), sub: "All accounts" },
          { label: "Active Entities", value: accounts?.length ?? 0, sub: "Vault accounts" },
          { label: "Ledger Activity", value: transactions?.length ?? 0, sub: "Last 50 entries" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-[2.5rem] border border-slate-200/50 shadow-sm">
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.25em] mb-2">{stat.label}</p>
            <p className="text-2xl font-bold text-brand-950 font-mono tracking-tighter">{stat.value}</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {(!accounts || accounts.length === 0) ? (
          <div className="col-span-full py-24 text-center bg-white border border-slate-200/60 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.02)] group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-slate-50 rounded-full -ml-32 -mt-32 transition-colors duration-700 group-hover:bg-slate-100/50" />
            
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 border border-slate-100 shadow-lg transition-transform group-hover:scale-110 duration-500">
              <Landmark className="w-10 h-10 text-slate-200" />
            </div>
            
            <h3 className="text-[11px] font-black text-brand-950 tracking-[0.3em] mb-4 uppercase">Portfolio Empty</h3>
            <p className="text-[15px] text-slate-500 mb-10 max-w-sm mx-auto leading-relaxed font-medium">
              You haven't established any vault accounts yet. Initialize your first digital institution to start managing your capital.
            </p>
            
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-brand-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-800 transition-all shadow-xl shadow-brand-950/20 active:scale-95">
              <Plus className="w-4 h-4" /> Open Private Vault Account
            </Link>
          </div>
        ) : (
          accounts.map((account) => (
            <div key={account.id} className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-black/5 transition-all duration-500">
              <div className={cn(
                "p-10 text-white relative overflow-hidden",
                account.account_type === 'savings' ? "bg-emerald-800" : 
                account.account_type === 'investment' ? "bg-purple-800" : "bg-brand-900"
              )}>
                <div className="relative z-10 flex justify-between items-start mb-10">
                  <div>
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">{account.account_type}</p>
                    <h3 className="text-xl font-black mt-1 uppercase tracking-tight">{account.account_name}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                    {account.account_type === 'checking' ? <CreditCard className="w-6 h-6" /> : <Building className="w-6 h-6" />}
                  </div>
                </div>
                <div className="relative z-10">
                  <p className="text-4xl font-bold font-mono tracking-tighter">{formatCurrency(account.balance, account.currency)}</p>
                  <p className="text-white/40 text-[10px] font-bold mt-2 uppercase tracking-widest">Available: {formatCurrency(account.available_balance, account.currency)}</p>
                </div>
                {/* Visual texture */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full -mr-32 -mt-32" />
              </div>
              
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="font-mono text-[10px] font-bold text-slate-400 tracking-[0.1em] uppercase">
                  {account.account_number}
                </div>
                <div className="flex gap-4">
                  <button className="text-[10px] font-black text-brand-950 hover:text-accent-500 transition-colors uppercase tracking-widest">Details</button>
                  <button className="text-[10px] font-black text-brand-950 hover:text-accent-500 transition-colors uppercase tracking-widest">Statement</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white rounded-[3rem] border border-slate-200/50 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-[11px] font-black text-brand-900 uppercase tracking-[0.25em]">Transaction History</h2>
          <button className="text-[10px] font-black text-brand-600 hover:text-brand-950 transition-colors uppercase tracking-widest">View All</button>
        </div>
        <div className="divide-y divide-slate-50 px-6">
          {(!transactions || transactions.length === 0) ? (
            <div className="py-24 text-center group">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110 duration-500">
                <ArrowRightLeft className="w-8 h-8 text-slate-200" />
              </div>
              <p className="text-[11px] font-black text-brand-950 uppercase tracking-[0.3em] mb-3">No Institutional Events</p>
              <p className="text-[13px] text-slate-500 max-w-[260px] mx-auto leading-relaxed">
                Your portfolio ledger is currently empty. Start moving capital to track your history.
              </p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-6 px-6 py-8 hover:bg-slate-50/80 rounded-[2.5rem] transition-all duration-500 group">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-sm border",
                  tx.transaction_type === "credit" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-200"
                )}>
                  {getCategoryIcon(tx.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-brand-950 truncate mb-1 tracking-tight">{tx.description}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    {new Date(tx.created_at).toLocaleDateString("en-CH", { 
                      day: "numeric", 
                      month: "short", 
                      hour: "2-digit", 
                      minute: "2-digit" 
                    })}
                    {" · "}
                    <span className="font-mono opacity-60">REF: {tx.reference.slice(0, 8)}</span>
                  </p>
                </div>
                <div className="text-right flex-shrink-0 space-y-2">
                  <p className={cn("text-xl font-bold font-mono tracking-tighter", tx.transaction_type === "credit" ? "text-emerald-600" : "text-brand-950")}>
                    {tx.transaction_type === "credit" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </p>
                  <StatusBadge status={tx.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
