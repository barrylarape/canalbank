"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

interface CashflowData {
  month: string;
  income: number;
  expense: number;
}

interface CashflowChartProps {
  data: CashflowData[];
}

export function CashflowChart({ data }: CashflowChartProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[3rem] border border-slate-200/50 p-10 shadow-[0_15px_50px_rgba(0,0,0,0.02)]"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-[11px] font-black text-brand-900 uppercase tracking-[0.25em]">Cashflow Analysis</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Institutional Inflow vs Outflow</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-900" />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Inflow</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-200" />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Outflow</span>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={8}>
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            <Tooltip
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ background: "#0f172a", border: "none", borderRadius: "16px", padding: "12px" }}
              itemStyle={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase" }}
              labelStyle={{ color: "#64748b", fontSize: "9px", marginBottom: "4px", fontWeight: 900 }}
              formatter={(value: number) => [new Intl.NumberFormat("de-CH", { style: "currency", currency: "CHF", maximumFractionDigits: 0 }).format(value), ""]}
            />
            <Bar 
              dataKey="income" 
              fill="#0f172a" 
              radius={[4, 4, 0, 0]} 
              barSize={20}
              isAnimationActive={true}
              animationDuration={1500}
            />
            <Bar 
              dataKey="expense" 
              fill="#e2e8f0" 
              radius={[4, 4, 0, 0]} 
              barSize={20}
              isAnimationActive={true}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
