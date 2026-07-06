"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { TrendingUp, TrendingDown, Target, Wallet, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface PortfolioSnapshotProps {
  totalBalance: number;
  income: number;
  spending: number;
  investments: number;
  rewards: number;
}

export function PortfolioSnapshot({ totalBalance, income, spending, investments, rewards }: PortfolioSnapshotProps) {
  const metrics = [
    { label: "Net Worth", value: totalBalance, icon: Wallet, color: "text-brand-950" },
    { label: "Monthly Income", value: income, icon: TrendingUp, color: "text-emerald-600" },
    { label: "Monthly Spending", value: spending, icon: TrendingDown, color: "text-accent-500" },
    { label: "Investments", value: investments, icon: Target, color: "text-purple-600" },
    { label: "Rewards", value: rewards, icon: Award, color: "text-amber-500", isPoints: true },
  ];

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_15px_50px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        {metrics.map((m) => (
          <div key={m.label} className="p-7 lg:p-8 hover:bg-slate-50/50 transition-colors group flex flex-col justify-center min-w-0">
            {/* Metadata Label & Icon */}
            <div className="flex items-center gap-2 mb-4">
              <m.icon className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 transition-colors flex-shrink-0" />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] truncate">{m.label}</p>
            </div>

            {/* Institutional Information Hierarchy */}
            <div className="flex flex-col min-w-0">
              {!m.isPoints && (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">
                  CHF
                </span>
              )}
              <div className={cn("truncate leading-tight", m.color)}>
                {m.isPoints ? (
                  <div className="flex items-baseline gap-1 font-mono tracking-tighter">
                    <span className="text-[30px] font-bold leading-none">{m.value.toLocaleString()}</span>
                    <span className="text-[18px] font-medium opacity-40 leading-none">pts</span>
                  </div>
                ) : (
                  <AnimatedNumber value={m.value} size="xl" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
