"use client";

import { Area, AreaChart, ResponsiveContainer, YAxis, Tooltip } from "recharts";

interface TrendData {
  value: number;
}

interface PortfolioTrendProps {
  data: TrendData[];
}

export function PortfolioTrend({ data }: PortfolioTrendProps) {
  // If no data, provide a flat line at zero or a minimal sensible base
  const chartData = data.length > 0 ? data : [{ value: 0 }, { value: 0 }];

  return (
    <div className="h-24 w-full opacity-50 group-hover:opacity-100 transition-opacity duration-700">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e53935" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#e53935" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-slate-900 border border-white/10 px-3 py-1.5 rounded-lg shadow-2xl">
                    <p className="text-[10px] font-mono font-bold text-white">
                      CHF {payload[0].value?.toLocaleString()}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#e53935"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#trendGradient)"
            animationDuration={2000}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
