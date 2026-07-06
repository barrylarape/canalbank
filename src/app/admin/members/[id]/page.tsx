import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  CreditCard,
  Landmark,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  History,
  FileText,
  Activity,
  Zap,
  ArrowLeftRight,
  ShieldAlert,
  Snowflake,
  AlertCircle,
  Clock,
  UserCheck,
  Check,
  X
} from "lucide-react";
import { MemberActions } from "./member-actions";
import { AdjustBalance } from "./adjust-balance";
import { cn } from "@/lib/utils";

function formatCurrency(amount: number, currency = "CHF") {
  return new Intl.NumberFormat("de-CH", { style: "currency", currency }).format(amount);
}

function KycBadge({ status }: { status: string }) {
  const config: Record<string, { style: string; icon: any }> = {
    approved: { 
      style: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_2px_8px_rgba(16,185,129,0.08)]", 
      icon: Check 
    },
    pending: { 
      style: "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_2px_8px_rgba(245,158,11,0.08)]", 
      icon: Clock 
    },
    rejected: { 
      style: "bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_2px_8px_rgba(239,68,68,0.08)]", 
      icon: X 
    },
  };
  
  const { style, icon: Icon } = config[status] ?? config.pending;
  
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest transition-all", style)}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-700/30 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-slate-500" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-slate-200">{value ?? "—"}</p>
      </div>
    </div>
  );
}

export default async function MemberDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; mode?: string; type?: string }>;
}) {
  const { id } = await params;
  const { tab = "overview", mode } = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Type-safe retrieval to resolve build-time 'never' inference
  const { data: adminProfileRaw } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const adminProfile = adminProfileRaw as { role: string } | null;

  if (!adminProfile || adminProfile.role === "customer") {
    redirect("/dashboard");
  }

  const [
    { data: profile },
    { data: accounts },
    { data: transactions },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).single(),
    supabase.from("accounts").select("*").eq("user_id", id).order("created_at"),
    supabase.from("transactions").select("*").eq("user_id", id).order("created_at", { ascending: false }).limit(20),
  ]);

  if (!profile) notFound();

  // Type assertion for accounts to resolve 'never' property access error
  const typedAccounts = (accounts || []) as any[];
  const totalBalance = typedAccounts.reduce((s, a) => a.account_type !== "credit" ? s + a.balance : s, 0) ?? 0;

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "accounts", label: "Accounts", icon: Building2 },
    { id: "transactions", label: "Ledger", icon: History },
    { id: "cards", label: "Cards", icon: CreditCard },
    { id: "compliance", label: "Compliance", icon: ShieldCheck },
    { id: "operations", label: "Operations", icon: Zap },
    { id: "audit", label: "Audit Log", icon: FileText },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Link href="/admin/members" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
        <ArrowLeft className="w-4 h-4" /> Member Registry
      </Link>

      {/* Hero Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-accent-600/10 border border-accent-600/20 flex items-center justify-center text-2xl font-bold text-accent-500 flex-shrink-0">
          {(profile as any).full_name?.[0] || (profile as any).email?.[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">{(profile as any).full_name ?? "—"}</h1>
            <KycBadge status={(profile as any).kyc_status} />
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border border-slate-700 text-slate-400 bg-slate-800">
              {(profile as any).role}
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium">{(profile as any).email}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white font-mono">{formatCurrency(totalBalance)}</div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aggregate Net Worth</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl overflow-x-auto no-scrollbar">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`?tab=${t.id}`}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex-shrink-0",
              tab === t.id ? "bg-accent-600 text-white shadow-lg shadow-accent-600/20" : "text-slate-500 hover:text-slate-300 hover:bg-slate-900"
            )}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {tab === "overview" && (
          <>
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Institutional Profile</h2>
                <InfoRow icon={User} label="Full Name" value={(profile as any).full_name} />
                <InfoRow icon={Mail} label="Email Address" value={(profile as any).email} />
                <InfoRow icon={Phone} label="Verified Phone" value={(profile as any).phone} />
                <InfoRow icon={Calendar} label="Onboarding Date" value={new Date((profile as any).created_at).toLocaleDateString()} />
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white">Consolidated Accounts</h2>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{typedAccounts.length || 0} Entities</span>
                </div>
                <div className="divide-y divide-slate-800/50">
                  {typedAccounts.map(a => (
                    <div key={a.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                      <div>
                        <p className="text-sm font-bold text-slate-200">{a.account_name}</p>
                        <p className="text-[10px] font-mono text-slate-500">{a.account_number}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white font-mono">{formatCurrency(a.balance, a.currency)}</p>
                        <span className="text-[9px] font-bold uppercase text-slate-500 tracking-tighter">{a.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {tab === "operations" && (
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Central Operations Panel */}
              <div className="lg:col-span-2 space-y-8">
                {mode === "adjust" ? (
                  <AdjustBalance 
                    memberId={(profile as any).id} 
                    memberName={(profile as any).full_name || (profile as any).email || 'Member'}
                    accounts={typedAccounts} 
                  />
                ) : (
                  <div className="space-y-8">
                    {/* Money Movement */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                      <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/50">
                        <h2 className="text-sm font-bold text-white flex items-center gap-2">
                          <ArrowLeftRight className="w-4 h-4 text-accent-500" /> Banking Operations: Money Movement
                        </h2>
                      </div>
                      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link href={`?tab=operations&mode=adjust&type=credit`} className="group p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-500/50 transition-all flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                            <ArrowDownLeft className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-bold text-white uppercase tracking-tight">Credit Account</p>
                            <p className="text-[10px] text-slate-500">Post manual credit adjustment</p>
                          </div>
                        </Link>
                        <Link href={`?tab=operations&mode=adjust&type=debit`} className="group p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-red-500/50 transition-all flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                            <ArrowUpRight className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-bold text-white uppercase tracking-tight">Debit Account</p>
                            <p className="text-[10px] text-slate-500">Post manual debit adjustment</p>
                          </div>
                        </Link>
                        <button className="group p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-accent-500/50 transition-all flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center text-accent-400 group-hover:scale-110 transition-transform">
                            <ArrowLeftRight className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-bold text-white uppercase tracking-tight">Internal Transfer</p>
                            <p className="text-[10px] text-slate-500">Force move funds between accounts</p>
                          </div>
                        </button>
                        <button className="group p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-amber-500/50 transition-all flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                            <Activity className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-bold text-white uppercase tracking-tight">Reverse Transaction</p>
                            <p className="text-[10px] text-slate-500">Initiate reversal protocol</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Account Controls */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                      <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/50">
                        <h2 className="text-sm font-bold text-white flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-blue-500" /> Banking Operations: Account Controls
                        </h2>
                      </div>
                      <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-950 border border-slate-800 rounded-xl hover:bg-blue-500/5 hover:border-blue-500/30 transition-all group">
                          <Snowflake className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold text-slate-300 uppercase">Freeze</span>
                        </button>
                        <button className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-950 border border-slate-800 rounded-xl hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all group">
                          <Zap className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold text-slate-300 uppercase">Unfreeze</span>
                        </button>
                        <button className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-950 border border-slate-800 rounded-xl hover:bg-red-500/5 hover:border-red-500/30 transition-all group">
                          <ShieldAlert className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold text-slate-300 uppercase">Suspend</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar: Compliance & Institutional Status */}
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Compliance</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <button className="w-full py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-bold text-red-400 uppercase hover:bg-red-500/20 transition-all flex items-center justify-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5" /> Flag Customer (Risk Alert)
                    </button>
                    <button className="w-full py-3 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-500 uppercase hover:text-white transition-all flex items-center justify-center gap-2">
                      <UserCheck className="w-3.5 h-3.5" /> Enhanced KYC Review
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Institutional Protocol</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-4 h-4 text-accent-500 flex-shrink-0" />
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        All financial events are logged under <span className="text-white">Dual Control</span>. A secondary checker must authorize ledger movements.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-slate-600 flex-shrink-0" />
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        Last Institutional Access:<br />
                        <span className="text-slate-500 font-mono">2024-05-24 14:22:10 UTC</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "transactions" && (
          <div className="lg:col-span-3">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800">
                <h2 className="text-sm font-bold text-white">System Ledger</h2>
              </div>
              <div className="divide-y divide-slate-800/50">
                {(transactions as any[])?.map(tx => (
                  <div key={tx.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                      tx.transaction_type === "credit" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                    )}>
                      {tx.transaction_type === "credit" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-200 truncate">{tx.description}</p>
                      <p className="text-[10px] text-slate-500">{new Date(tx.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn("text-sm font-bold font-mono", tx.transaction_type === "credit" ? "text-emerald-400" : "text-white")}>
                        {tx.transaction_type === "credit" ? "+" : "-"}{formatCurrency(tx.amount)}
                      </p>
                      <span className="text-[9px] font-bold uppercase text-slate-500">{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "compliance" && (
          <div className="lg:col-span-3">
            <MemberActions
              memberId={(profile as any).id}
              currentKyc={(profile as any).kyc_status as "pending" | "approved" | "rejected"}
              currentRole={(profile as any).role as "customer" | "admin" | "supervisor" | "executive"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
