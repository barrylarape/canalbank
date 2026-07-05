"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeftRight, CreditCard, Landmark, 
  Wallet, ArrowUpRight, ArrowRight, DollarSign,
  ShoppingCart, Coffee, Briefcase, Zap, Car, Heart, Play, Activity, ChevronRight,
  Check, Clock, X, RotateCcw, ShieldCheck, TrendingUp
} from "lucide-react";
import Link from "next/link";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { CashflowChart } from "@/components/dashboard/cashflow-chart";
import { PortfolioTrend } from "@/components/dashboard/portfolio-trend";
import { QuickOpenAccount } from "@/components/dashboard/quick-open-account";
import { QuickActionTile } from "@/components/dashboard/quick-action-tile";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { PortfolioSnapshot } from "@/components/dashboard/portfolio-snapshot";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";

function getAccountIcon(type: string) {
  switch (type) {
    case "checking": return <CreditCard className="w-5 h-5" />;
    case "savings": return <Landmark className="w-5 h-5" />;
    case "investment": return <TrendingUp className="w-5 h-5" />;
    case "credit": return <Wallet className="w-5 h-5" />;
    default: return <DollarSign className="w-5 h-5" />;
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "shopping": return <ShoppingCart className="w-5 h-5" />;
    case "food": return <Coffee className="w-5 h-5" />;
    case "income": return <Briefcase className="w-5 h-5" />;
    case "transfer": return <ArrowLeftRight className="w-5 h-5" />;
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
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest transition-all", style)}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function DashboardPage() {
  const [data, setData] = useState<{
    accounts: any[] | null;
    transactions: any[] | null;
    investments: any[] | null;
    user: any | null;
  }>({ accounts: null, transactions: null, investments: null, user: null });
  const [loading, setLoading] = useState(true);
  const [cashflowData, setCashflowData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        redirect("/login");
        return;
      }

      const [
        { data: accounts }, 
        { data: transactions },
        { data: investments }
      ] = await Promise.all([
        supabase.from("accounts").select("*").eq("user_id", user.id).eq("status", "active").order("created_at"),
        supabase.from("transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(100),
        supabase.from("investments").select("*").eq("user_id", user.id),
      ]);

      setData({ accounts, transactions, investments, user });

      // Calculate Cashflow Chart Data (Last 6 Months) on client
      const last6 = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return {
          month: d.toLocaleDateString("en-CH", { month: "short" }),
          monthIndex: d.getMonth(),
          year: d.getFullYear(),
          income: 0,
          expense: 0,
        };
      });

      transactions?.forEach(tx => {
        const txDate = new Date(tx.created_at);
        const m = txDate.getMonth();
        const y = txDate.getFullYear();
        if (tx.status !== 'completed') return;

        const monthData = last6.find(d => d.monthIndex === m && d.year === y);
        if (monthData) {
          if (tx.transaction_type === 'credit') monthData.income += tx.amount;
          else monthData.expense += tx.amount;
        }
      });

      setCashflowData(last6);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return null;

  // Core Balance Metrics
  const totalBalance = data.accounts?.reduce((sum, acc) => sum + (acc.account_type !== "credit" ? acc.balance : 0), 0) ?? 0;
  const availableBalance = data.accounts?.reduce((sum, acc) => sum + (acc.account_type !== "credit" ? acc.available_balance : 0), 0) ?? 0;
  const reserved = totalBalance - availableBalance;

  // Monthly Stats
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const monthlyIncome = data.transactions
    ?.filter(tx => new Date(tx.created_at) >= currentMonthStart && tx.transaction_type === "credit" && tx.status === "completed")
    .reduce((sum, tx) => sum + tx.amount, 0) ?? 0;
    
  const monthlySpending = data.transactions
    ?.filter(tx => new Date(tx.created_at) >= currentMonthStart && tx.transaction_type === "debit" && tx.status === "completed")
    .reduce((sum, tx) => sum + tx.amount, 0) ?? 0;

  // Portfolio Trend (Based on real transaction snapshots)
  const trendData = data.transactions
    ?.slice(0, 10)
    .reverse()
    .map(tx => ({ value: tx.balance_after })) ?? [];

  const totalInvestments = data.investments?.reduce((sum, inv) => sum + inv.current_value, 0) ?? 0;
  const rewards = Math.floor(monthlySpending * 0.1);

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 max-w-7xl mx-auto pb-20"
    >
      {/* Premium Glass Portfolio Hero */}
      <motion.section variants={item} className="premium-glass rounded-[3rem] p-10 lg:p-14 relative group">
        <div className="relative z-10">
          <header className="flex flex-col lg:flex-row lg:items-start justify-between gap-12">
            <div className="flex-1">
              <p className="text-[12px] font-medium text-white/40 uppercase tracking-[0.3em] mb-4">Institutional Portfolio</p>
              <h2 className="text-[56px] font-bold text-white tracking-tighter mb-8 font-mono">
                <AnimatedNumber value={totalBalance} />
              </h2>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-emerald-400 rounded-full text-[12px] font-medium border border-white/5">
                  <ArrowUpRight className="w-4 h-4" />
                  Live Market Feed Active
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md text-white/60 rounded-full text-[12px] font-medium border border-white/5">
                  <Activity className="w-4 h-4" />
                  Synced with Core Ledger
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/3 w-full">
              <PortfolioTrend data={trendData} />
              <div className="flex flex-wrap gap-3 mt-10">
                <Link href="/dashboard/transfers" className="flex-1 px-8 py-4 bg-accent-500 text-white rounded-2xl font-black text-[10px] hover:bg-accent-600 transition-all shadow-xl shadow-accent-950/20 active:scale-95 uppercase tracking-widest text-center">
                  Transfer
                </Link>
                <button className="flex-1 px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-2xl font-black text-[10px] hover:bg-white/20 transition-all active:scale-95 uppercase tracking-widest">
                  Exchange
                </button>
              </div>
            </div>
          </header>

          <div className="h-[1px] bg-white/10 w-full my-12" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            <div className="space-y-2">
              <p className="text-[12px] font-medium text-white/30 uppercase tracking-[0.25em]">Available Liquidity</p>
              <div className="text-[24px] font-bold text-white font-mono tracking-tighter">
                <AnimatedNumber value={availableBalance} />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[12px] font-medium text-white/30 uppercase tracking-[0.25em]">Pending Auth</p>
              <div className="text-[24px] font-bold text-white/50 font-mono italic tracking-tighter">
                <AnimatedNumber value={0} />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[12px] font-medium text-white/30 uppercase tracking-[0.25em]">Reserved Assets</p>
              <div className="text-[24px] font-bold text-white/40 font-mono tracking-tighter">
                <AnimatedNumber value={reserved} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 blur-[100px] rounded-full -ml-40 -mb-40 pointer-events-none" />
      </motion.section>

      {/* Main Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Accounts & Cashflow */}
        <div className="lg:col-span-2 space-y-12">
          
          <motion.section variants={item} className="space-y-8">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-[18px] font-semibold text-brand-900 tracking-tight">Vault Entities</h2>
              <Link href="/dashboard/accounts" className="text-[12px] font-medium text-slate-400 hover:text-brand-950 transition-colors flex items-center gap-1.5 group uppercase tracking-widest">
                Manage Portfolio <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {(!data.accounts || data.accounts.length === 0) ? (
              <div className="bg-white rounded-[3rem] p-16 border border-slate-200/60 shadow-[0_20px_60px_rgba(0,0,0,0.02)] text-center flex flex-col items-center group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 transition-colors duration-700 group-hover:bg-slate-100/50" />
                
                <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mb-8 border border-slate-100 shadow-xl shadow-slate-200/50 relative z-10 transition-transform group-hover:scale-110 duration-500">
                  <Landmark className="w-10 h-10 text-brand-950" />
                </div>
                
                <div className="relative z-10">
                  <p className="text-[11px] font-black text-brand-950 tracking-[0.3em] mb-4 uppercase">Initialize Portfolio</p>
                  <h3 className="text-2xl font-bold text-brand-900 mb-4 tracking-tight">Access Swiss Digital Capital</h3>
                  <p className="text-[15px] text-slate-500 mb-10 max-w-sm mx-auto leading-relaxed font-medium">
                    Establish your institutional footprint by opening your first private vault account. 
                    Manage liquidity, track assets, and deploy capital instantly.
                  </p>
                  
                  <div className="flex items-center justify-center gap-6">
                    <QuickOpenAccount />
                    <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-brand-950 transition-colors flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3" /> System Security Verified
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {data.accounts.slice(0, 4).map((account) => (
                  <Link key={account.id} href="/dashboard/accounts"
                    className="group bg-white rounded-[2.5rem] p-8 border border-slate-200/50 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-900 mb-8 group-hover:scale-110 transition-transform duration-500">
                      {getAccountIcon(account.account_type)}
                    </div>
                    <p className="text-[12px] font-medium text-slate-400 uppercase tracking-[0.2em] mb-2">{account.account_name}</p>
                    <div className="text-[24px] font-bold text-brand-950 font-mono tracking-tighter">
                      <AnimatedNumber value={account.balance} />
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-300 font-mono tracking-tighter uppercase">{account.account_number}</span>
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-950 group-hover:text-white transition-colors duration-300">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.section>

          <motion.div variants={item}>
            <CashflowChart data={cashflowData} />
          </motion.div>

          <motion.div variants={item}>
            <PortfolioSnapshot 
              totalBalance={totalBalance}
              income={monthlyIncome}
              spending={monthlySpending}
              investments={totalInvestments}
              rewards={rewards}
            />
          </motion.div>

          <motion.section variants={item} className="bg-white rounded-[3rem] border border-slate-200/50 shadow-[0_15px_50px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-brand-900 tracking-tight">Global Ledger Stream</h2>
              <Link href="/dashboard/accounts" className="text-[12px] font-medium text-slate-400 hover:text-brand-950 transition-colors uppercase tracking-widest">Full History</Link>
            </div>
            <div className="divide-y divide-slate-50 px-6">
              {(!data.transactions || data.transactions.length === 0) ? (
                <div className="py-24 text-center group">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110 duration-500">
                    <Activity className="w-8 h-8 text-slate-200" />
                  </div>
                  <p className="text-[11px] font-black text-brand-950 uppercase tracking-[0.3em] mb-3">No Ledger Activity</p>
                  <p className="text-[13px] text-slate-500 max-w-[240px] mx-auto leading-relaxed">
                    Your institutional transaction history will populate here once activity is detected.
                  </p>
                </div>
              ) : (
                data.transactions.slice(0, 8).map((tx) => (
                  <div key={tx.id} className="flex items-center gap-6 px-6 py-8 hover:bg-slate-50/80 rounded-[2.5rem] transition-all duration-300 group">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-sm border",
                      tx.transaction_type === "credit" 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                        : "bg-slate-50 text-slate-400 border-slate-200"
                    )}>
                      {getCategoryIcon(tx.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-semibold text-brand-950 truncate mb-1 tracking-tight">{tx.description}</p>
                      <p className="text-[12px] font-medium text-slate-400 uppercase tracking-[0.2em]">
                        {new Date(tx.created_at).toLocaleDateString("en-CH", { 
                          day: "numeric", 
                          month: "short", 
                          hour: "2-digit", 
                          minute: "2-digit" 
                        })}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 space-y-2">
                      <div className={cn(
                        "text-[18px] font-bold font-mono tracking-tighter", 
                        tx.transaction_type === "credit" ? "text-emerald-600" : "text-brand-950"
                      )}>
                        {tx.transaction_type === "credit" ? "+" : "-"}<AnimatedNumber value={tx.amount} />
                      </div>
                      <StatusBadge status={tx.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.section>
        </div>

        <div className="space-y-12">
          <motion.div variants={item}>
            <SpendingChart transactions={data.transactions ?? []} />
          </motion.div>

          <motion.div variants={item} className="bg-white rounded-[3rem] border border-slate-200/50 shadow-[0_15px_50px_rgba(0,0,0,0.02)] p-10">
            <h2 className="text-[18px] font-semibold text-brand-900 tracking-tight mb-8">Vault Access</h2>
            <div className="grid grid-cols-2 gap-5">
              <QuickActionTile label="Cards" iconType="cards" href="/dashboard/cards" isFrequent />
              <QuickActionTile label="Loans" iconType="loans" href="/dashboard/loans" />
              <QuickActionTile label="Markets" iconType="markets" href="/dashboard/investments" isFrequent />
              <QuickActionTile label="Security" iconType="security" href="/dashboard/security" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
