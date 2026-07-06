"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { Database } from "@/lib/supabase/types";

type Investment = Database["public"]["Tables"]["investments"]["Row"];

const COLORS = ["#6d28d9", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];

interface PortfolioChartProps {
  investments: Investment[];
}

export function PortfolioChart({ investments }: PortfolioChartProps) {
  const data = investments.map((inv) => ({
    name: inv.asset_symbol,
    value: Math.round(inv.current_value),
  }));

  return (
    <div className="h-36">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={3} dataKey="value">
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v: number) => [`CHF ${v.toLocaleString()}`, ""]}
            contentStyle={{ background: "#1e293b", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
