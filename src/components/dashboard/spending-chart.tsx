"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { Database } from "@/lib/supabase/types";
import { motion } from "framer-motion";
import { Activity, BarChart3, HelpCircle, ChevronRight } from "lucide-react";

type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

const CATEGORY_COLORS: Record<string, string> = {
  food: "#f59e0b",
  shopping: "#8b5cf6",
  utilities: "#06b6d4",
  transport: "#3b82f6",
  health: "#10b981",
  entertainment: "#ec4899",
  income: "#22c55e",
  transfer: "#64748b",
  general: "#94a3b8",
};

interface SpendingChartProps {
  transactions: Transaction[];
}

export function SpendingChart({ transactions }: SpendingChartProps) {
  const debits = transactions.filter((t) => t.transaction_type === "debit");
  const grouped = debits.reduce<Record<string, number>>((acc, tx) => {
    acc[tx.category] = (acc[tx.category] ?? 0) + tx.amount;
    return acc;
  }, {});

  const data = Object.entries(grouped).map(([name, value]) => ({ name, value: Math.round(value) }));

  if (data.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-[3rem] border border-slate-200/50 p-10 shadow-[0_15px_50px_rgba(0,0,0,0.02)] text-center relative overflow-hidden group"
      >
        <div className="relative z-10 flex flex-col items-center py-10">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-8 border border-slate-100 shadow-sm transition-transform group-hover:scale-110 duration-500">
            <BarChart3 className="w-10 h-10 text-slate-200" />
          </div>
          
          <h2 className="text-[11px] font-black text-brand-900 uppercase tracking-[0.25em] mb-3">Asset Intelligence</h2>
          <p className="text-[13px] text-slate-500 max-w-[220px] mx-auto leading-relaxed mb-8">
            Your spending insights and asset allocation will appear here after your first institutional transaction.
          </p>
          
          <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-2xl text-[10px] font-black text-brand-950 uppercase tracking-widest border border-slate-200/50 transition-all">
            Learn More <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        
        {/* Visual Background Decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
          <div className="w-64 h-64 border-[20px] border-brand-900 rounded-full" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-white rounded-[3rem] border border-slate-200/50 shadow-[0_15px_50px_rgba(0,0,0,0.02)] p-10"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[11px] font-black text-brand-900 uppercase tracking-[0.25em]">Asset Allocation</h2>
        <HelpCircle className="w-4 h-4 text-slate-300 cursor-help hover:text-slate-400 transition-colors" />
      </div>
      
      <div className="h-56 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={data} 
              cx="50%" 
              cy="50%" 
              innerRadius={55} 
              outerRadius={80} 
              paddingAngle={6} 
              dataKey="value"
              stroke="none"
              isAnimationActive={true}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] ?? "#64748b"} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`CHF ${value.toLocaleString()}`, ""]}
              contentStyle={{ background: "#0f172a", border: "none", borderRadius: "16px", color: "#fff", fontSize: "11px", padding: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Visual Center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Total</span>
          <span className="text-xs font-black text-brand-950 uppercase tracking-tight">Diverse</span>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 justify-center">
        {data.slice(0, 4).map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[entry.name] }} />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{entry.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
