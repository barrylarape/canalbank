"use client";

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
      <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-5 divide-y md:divide-y-0 divide-slate-100 border-b border-slate-100 2xl:border-b-0">
        {metrics.map((m, idx) => (
          <div 
            key={m.label} 
            className={cn(
              "p-6 lg:p-7 hover:bg-slate-50/50 transition-colors group flex flex-col justify-center min-w-0 border-slate-100",
              // Precise border management for adaptive grid
              idx % 2 !== 0 ? "border-l" : "",
              idx >= 2 ? "md:border-t" : "",
              idx % 3 !== 0 ? "md:border-l" : "md:border-l-0",
              "2xl:border-t-0 2xl:border-l"
            )}
          >
            {/* Metadata Label & Icon */}
            <div className="flex items-center gap-2 mb-3">
              <m.icon className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 transition-colors flex-shrink-0" />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">{m.label}</p>
            </div>

            {/* Institutional Information Hierarchy */}
            <div className="flex flex-col">
              {!m.isPoints && (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 opacity-60">
                  CHF
                </span>
              )}
              <div className={cn("leading-tight", m.color)}>
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
