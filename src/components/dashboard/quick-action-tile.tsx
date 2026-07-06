"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  CreditCard, 
  Landmark, 
  TrendingUp, 
  RefreshCw,
  Wallet,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  cards: CreditCard,
  loans: Landmark,
  markets: TrendingUp,
  security: RefreshCw,
  payments: Wallet,
  compliance: ShieldCheck
};

export type QuickActionIconType = keyof typeof iconMap;

interface QuickActionTileProps {
  label: string;
  iconType: QuickActionIconType;
  href: string;
  isFrequent?: boolean;
}

export function QuickActionTile({ label, iconType, href, isFrequent }: QuickActionTileProps) {
  const Icon = iconMap[iconType];

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative group h-full"
    >
      <Link href={href} className="block h-full">
        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-accent-500/20 blur-[40px] rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative h-full bg-white rounded-[2rem] border border-slate-200/60 p-8 flex flex-col items-center justify-center gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.02)] group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden text-center">
          {/* Subtle Background Pattern */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:bg-accent-50 transition-colors duration-500" />
          
          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-900 group-hover:bg-brand-950 group-hover:text-white transition-all duration-500 group-hover:scale-110 shadow-sm border border-slate-100">
            <Icon className="w-6 h-6" />
          </div>
          
          <div className="text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-brand-950 transition-colors">
              {label}
            </span>
            {isFrequent && (
              <div className="mt-2 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="w-1 h-1 rounded-full bg-accent-500" />
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Frequently Used</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
