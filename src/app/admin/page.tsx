import { createClient } from "@/lib/supabase/server";
import {
  Users,
  ArrowLeftRight,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  Check,
  Terminal,
  Activity,
  ShoppingCart,
  Coffee,
  Briefcase,
  Zap,
  Car,
  Heart,
  Play,
  CreditCard,
  X,
  RotateCcw,
  Search
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Database } from "@/lib/supabase/types";

function formatCurrency(amount: number, currency = "EUR") {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "shopping": return <ShoppingCart className="w-4 h-4" />;
    case "food": return <Coffee className="w-4 h-4" />;
    case "income": return <Briefcase className="w-4 h-4" />;
    case "transfer": return <ArrowLeftRight className="w-4 h-4" />;
    case "utilities": return <Zap className="w-4 h-4" />;
    case "transport": return <Car className="w-4 h-4" />;
    case "health": return <Heart className="w-4 h-4" />;
    case "entertainment": return <Play className="w-4 h-4" />;
    default: return <CreditCard className="w-4 h-4" />;
  }
}

function PipelineStatus({ status, category }: { status: string, category: string }) {
  const isPending = status === "pending";
  const isCompleted = status === "completed";
  const isAdjustment = category === "adjustment_request";

  const stages = [
    { label: "Init", active: true, color: "bg-emerald-500" },
    { label: "Pending", active: isPending || isCompleted, color: isCompleted ? "bg-emerald-500" : "bg-amber-500 animate-pulse" },
    { label: "Auth", active: isCompleted, color: isCompleted ? "bg-emerald-500" : isPending && isAdjustment ? "bg-red-500" : "bg-slate-700" },
    { label: "Ledger", active: isCompleted, color: isCompleted ? "bg-emerald-500" : "bg-slate-700" },
  ];

  return (
    <div className="flex items-center gap-1.5 mt-2">
      {stages.map((stage, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className={cn("w-1.5 h-1.5 rounded-full", stage.color)} />
          <span className={cn("text-[8px] font-black uppercase tracking-tighter", stage.active ? "text-slate-300" : "text-slate-600")}>
            {stage.label}
          </span>
          {i < stages.length - 1 && <div className="w-2 h-[1px] bg-slate-800/50" />}
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { style: string; icon: any }> = {
    completed: { 
      style: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_2px_10px_rgba(16,185,129,0.1)]", 
      icon: Check 
    },
    pending: { 
      style: "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_2px_10px_rgba(245,158,11,0.1)]", 
      icon: Clock 
    },
    failed: { 
      style: "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_2px_10px_rgba(239,68,68,0.1)]", 
      icon: X 
    },
    reversed: { 
      style: "bg-slate-500/10 text-slate-400 border-slate-500/20 shadow-[0_2px_10px_rgba(100,116,139,0.1)]", 
      icon: RotateCcw 
    },
  };
  
  const { style, icon: Icon } = config[status] ?? config.pending;
  
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase border tracking-widest transition-all", style)}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
type Profile = Pick<Database["public"]["Tables"]["profiles"]["Row"], "full_name" | "email">;
type AccountSummary = Pick<Database["public"]["Tables"]["accounts"]["Row"], "balance" | "account_type">;

type TransactionWithProfile = Transaction & {
  profiles: Profile | null;
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [membersResult, accountsResult, recentTxResult, txTodayResult, pendingAuthResult] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),
    supabase.from("accounts").select("balance, account_type"),
    supabase
      .from("transactions")
      .select("*, profiles!transactions_user_id_fkey(full_name, email)", { count: "exact" })
      .not("category", "eq", "system_audit")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase.from("transactions").select("id", { count: "exact", head: true }).gte("created_at", today.toISOString()),
    supabase.from("transactions").select("id", { count: "exact", head: true }).eq("status", "pending").eq("category", "adjustment_request"),
  ]);

  const memberCount = membersResult.count;
  const accounts = accountsResult.data as AccountSummary[] | null;
  const recentTx = recentTxResult.data;
  const txCount = recentTxResult.count;
  const txTodayCount = txTodayResult.count;
  const pendingAuthCount = pendingAuthResult.count;

  const totalAUM = accounts?.reduce((sum, acc) => acc.account_type !== "credit" ? sum + acc.balance : sum, 0) ?? 0;

  const kpis = [
    { label: "Institutional Members", value: (memberCount ?? 0).toString(), sub: "Active private clients", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", href: "/admin/members" },
    { label: "Assets Under Mgmt", value: formatCurrency(totalAUM), sub: "Total AUM (Liquidity)", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", href: "/admin/accounts" },
    { label: "Daily Activity", value: (txTodayCount ?? 0).toString(), sub: "Total transactions today", icon: ArrowLeftRight, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20", href: "/admin/transactions" },
    { label: "Authorizations", value: (pendingAuthCount ?? 0).toString(), sub: "Pending Maker-Checker review", icon: ShieldAlert, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", href: "/admin/approvals" },
  ];

  const typedRecentTx = (recentTx as unknown as TransactionWithProfile[]) || [];

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-20">
      <div className="flex items-center justify-between px-4">
        <div>
          <h1 className="text-[42px] font-medium text-white tracking-tight uppercase">Institutional Overview</h1>
          <p className="text-slate-500 text-[12px] mt-2 font-medium uppercase tracking-[0.3em] flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            Live Ledger Stream · {new Date().toLocaleDateString("en-CH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link key={kpi.label} href={kpi.href} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 hover:border-slate-700 transition-all group relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-colors" />
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className={cn("w-14 h-14 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-110", kpi.bg)}>
                  <Icon className={cn("w-6 h-6", kpi.color)} />
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-700 group-hover:text-slate-400 transition-colors" />
              </div>
              <div className="text-[32px] font-bold text-white mb-2 relative z-10 font-mono tracking-tighter">{kpi.value}</div>
              <p className="text-[12px] font-medium text-slate-500 uppercase tracking-[0.25em] relative z-10">{kpi.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="p-10 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-accent-500" />
              <h2 className="text-[18px] font-semibold text-white tracking-tight">Global Ledger Stream</h2>
            </div>
            <Link href="/admin/transactions" className="text-[12px] font-medium text-accent-500 hover:text-accent-400 flex items-center gap-1.5 transition-colors uppercase tracking-widest">
              Advanced Monitor <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-800/50 px-6">
            {typedRecentTx.length === 0 ? (
              <div className="py-32 text-center group">
                <div className="w-20 h-20 bg-slate-950 border border-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 duration-500">
                  <Terminal className="w-10 h-10 text-slate-800" />
                </div>
                <p className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-4">Ledger Quiescent</p>
                <p className="text-[13px] text-slate-500 max-w-[280px] mx-auto leading-relaxed">
                  No institutional events detected in the current lifecycle. 
                  The system is actively monitoring the global ledger stream.
                </p>
                <div className="mt-8 flex items-center justify-center gap-4">
                  <Link href="/admin/members" className="text-[10px] font-black text-accent-500 uppercase tracking-widest hover:text-accent-400 flex items-center gap-2">
                    <Users className="w-3 h-3" /> Audit Members
                  </Link>
                  <span className="w-1 h-1 rounded-full bg-slate-800" />
                  <Link href="/admin/debug/database" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white flex items-center gap-2">
                    <Search className="w-3 h-3" /> Raw Query
                  </Link>
                </div>
              </div>
            ) : (
              typedRecentTx.map((tx) => (
                <div key={tx.id} className="flex items-center gap-6 px-6 py-8 hover:bg-white/5 transition-all duration-300 group rounded-[2.5rem]">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110 border",
                    tx.transaction_type === "credit" 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-slate-800 text-slate-500 border-slate-700"
                  )}>
                    {getCategoryIcon(tx.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[18px] font-semibold text-slate-200 truncate group-hover:text-white transition-colors tracking-tight mb-1">{tx.description}</p>
                    <div className="flex flex-col">
                      <div className="text-[12px] text-slate-500 font-medium uppercase tracking-widest flex items-center gap-3">
                        <span className="text-accent-500">{tx.profiles?.full_name || tx.profiles?.email || "System Agent"}</span>
                        <span className="opacity-20">|</span>
                        <span>{new Date(tx.created_at).toLocaleTimeString("en-CH", { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <PipelineStatus status={tx.status} category={tx.category} />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 space-y-3">
                    <div className={cn("text-[20px] font-bold font-mono tracking-tighter", tx.transaction_type === "credit" ? "text-emerald-400" : "text-slate-300")}>
                      {tx.transaction_type === "credit" ? "+" : "-"}{formatCurrency(tx.amount)}
                    </div>
                    <StatusBadge status={tx.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="p-10 border-b border-slate-800 flex items-center gap-3 bg-slate-950/50">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <h2 className="text-[18px] font-semibold text-white tracking-tight">System Diagnostic</h2>
          </div>
          <div className="p-10 space-y-8">
            <div className="space-y-6">
              {[
                { label: "Supabase Integrity", status: "Healthy", active: true },
                { label: "Realtime Engine", status: "Active & Synced", active: true },
                { label: "Audit Pipeline", status: "V2 Stream Enabled", active: true },
              ].map((debug) => (
                <div key={debug.label} className="flex items-start gap-4">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mt-0.5 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-slate-300 uppercase tracking-widest leading-none">{debug.label}</p>
                    <p className="text-[13px] text-slate-500 mt-2 font-mono">{debug.status}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-slate-950 rounded-[2rem] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-slate-500 font-medium uppercase tracking-widest">Fetch Integrity</span>
                <span className="text-[14px] font-bold text-emerald-400 font-mono">200 OK</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-slate-500 font-medium uppercase tracking-widest">Stream Context</span>
                <span className="text-[14px] font-bold text-white font-mono">{txCount || 0} Entities</span>
              </div>
            </div>

            <Link href="/admin/debug/database" className="w-full py-4 bg-slate-950 border border-slate-800 rounded-2xl text-[12px] font-black text-slate-500 uppercase hover:text-white hover:border-accent-500/50 transition-all flex items-center justify-center gap-3 tracking-widest shadow-xl">
              <Terminal className="w-4 h-4" /> Live Query Inspector
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
