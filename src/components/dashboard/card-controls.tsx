"use client";

import { useState } from "react";
import { Snowflake, Globe, ShoppingCart, DollarSign, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Database } from "@/lib/supabase/types";

type Card = Database["public"]["Tables"]["cards"]["Row"];

interface CardControlsProps {
  card: Card;
}

export function CardControls({ card: initialCard }: CardControlsProps) {
  const [card, setCard] = useState(initialCard);
  const [loading, setLoading] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const isFrozen = card.status === "frozen";

  const toggleFreeze = async () => {
    setLoading(true);
    const supabase = createClient();
    const newStatus = isFrozen ? "active" : "frozen";
    await supabase.from("cards").update({ status: newStatus }).eq("id", card.id);
    setCard(prev => ({ ...prev, status: newStatus }));
    setLoading(false);
  };

  const toggleControl = async (field: "online_purchases" | "international_purchases") => {
    const supabase = createClient();
    const newValue = !card[field];
    await supabase.from("cards").update({ [field]: newValue }).eq("id", card.id);
    setCard(prev => ({ ...prev, [field]: newValue }));
  };

  return (
    <div className="bg-white rounded-[3rem] border border-slate-200/50 shadow-[0_20px_60px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
      <div className="p-6">
        <motion.div 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="premium-glass rounded-[2rem] p-8 relative min-h-[260px] flex flex-col justify-between group cursor-pointer"
        >
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ transform: "translateZ(50px)" }}>
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white blur-[110px] -mr-36 -mt-36" />
            <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-emerald-400 blur-[90px] -ml-28 -mb-28" />
          </div>

          {isFrozen && (
            <div className="absolute inset-0 bg-brand-950/80 backdrop-blur-xl flex items-center justify-center z-20 rounded-[2rem] animate-in fade-in duration-500">
              <div className="text-center" style={{ transform: "translateZ(80px)" }}>
                <Snowflake className="w-16 h-16 text-blue-300 mx-auto mb-4 animate-pulse" />
                <p className="text-white font-black text-xl uppercase tracking-[0.3em]">Vault Locked</p>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Institutional Security Active</p>
              </div>
            </div>
          )}

          <div className="relative z-10 flex flex-col h-full justify-between" style={{ transform: "translateZ(60px)" }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Entity Series</p>
                <h3 className="text-white font-black text-xl tracking-tight uppercase group-hover:tracking-widest transition-all duration-700">{card.card_name}</h3>
              </div>
              <div className="flex gap-1.5 opacity-60">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20" />
                <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 -ml-5" />
              </div>
            </div>

            <div className="my-6">
              <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em] mb-2">Book Balance</p>
              <p className="text-3xl font-bold text-white font-mono tracking-tighter">€{(card.daily_limit ?? 0).toLocaleString()}.00</p>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <p className="text-white/20 text-[8px] font-bold uppercase tracking-widest">Available</p>
                  <p className="text-white/70 text-xs font-mono font-bold">€{(card.daily_limit ?? 0).toLocaleString()}</p>
                </div>
                <div className="w-[1px] h-4 bg-white/10" />
                <div>
                  <p className="text-white/20 text-[8px] font-bold uppercase tracking-widest">Type</p>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-tighter">{card.card_type} Infinite</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em] mb-1.5">Identifier</p>
                <p className="text-white/90 text-sm font-mono tracking-[0.35em] drop-shadow-lg">{card.card_number_masked}</p>
              </div>
              <div className="text-right">
                <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em] mb-1.5">Valid Thru</p>
                <p className="text-white text-xs font-mono font-bold tracking-widest">{String(card.expiry_month).padStart(2, "0")}/{card.expiry_year}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-8 pb-8 space-y-6">
        <button 
          onClick={toggleFreeze} 
          disabled={loading}
          className={cn(
            "w-full flex items-center justify-between px-6 py-5 rounded-[1.5rem] border-2 font-black transition-all duration-500 text-[10px] uppercase tracking-[0.25em] group",
            isFrozen
              ? "border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100"
              : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-brand-950"
          )}
        >
          <div className="flex items-center gap-4">
            <Snowflake className={cn("w-5 h-5 transition-all duration-500", isFrozen ? "animate-pulse" : "opacity-30 group-hover:rotate-180")} />
            <span>{isFrozen ? "Disengage Vault Lock" : "Engage Security Lock"}</span>
          </div>
          <div className={cn(
            "w-12 h-6 rounded-full transition-all duration-700 flex items-center px-1 shadow-inner",
            isFrozen ? "bg-blue-500" : "bg-slate-200"
          )}>
            <div className={cn(
              "w-4 h-4 rounded-full bg-white shadow-lg transition-transform duration-700 ease-out",
              isFrozen ? "translate-x-6" : "translate-x-0"
            )} />
          </div>
        </button>

        <div className="grid grid-cols-1 gap-3">
          {[
            { field: "online_purchases" as const, label: "Digital Channel Access", icon: ShoppingCart },
            { field: "international_purchases" as const, label: "Global Liquidity Access", icon: Globe },
          ].map(({ field, label, icon: Icon }) => (
            <div key={field} className="flex items-center justify-between px-6 py-5 rounded-[1.5rem] bg-slate-50/50 border border-slate-100 group hover:bg-white hover:border-slate-200 hover:shadow-xl hover:shadow-black/5 transition-all duration-500">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center transition-all group-hover:scale-110 shadow-sm">
                  <Icon className="w-4 h-4 text-slate-300 group-hover:text-brand-950 transition-colors" />
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-brand-950">{label}</span>
              </div>
              <button 
                onClick={() => toggleControl(field)}
                className={cn(
                  "w-10 h-5 rounded-full transition-all duration-700 flex items-center px-1 shadow-inner",
                  card[field] ? "bg-emerald-500" : "bg-slate-200"
                )}
              >
                <div className={cn(
                  "w-3 h-3 rounded-full bg-white shadow-md transition-transform duration-700 ease-out",
                  card[field] ? "translate-x-5" : "translate-x-0"
                )} />
              </button>
            </div>
          ))}

          <div className="flex items-center justify-between px-6 py-5 rounded-[1.5rem] bg-slate-50/50 border border-slate-100 group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-slate-300" />
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Daily Disbursement Limit</span>
                <p className="text-sm font-mono font-black text-brand-950 tracking-tighter">€{(card.daily_limit ?? 0).toLocaleString()}.00</p>
              </div>
            </div>
            <button className="text-[9px] font-black text-brand-600 hover:text-brand-950 uppercase tracking-[0.2em] transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">Increase</button>
          </div>
        </div>

        <button className="w-full py-4 text-slate-300 hover:text-brand-950 transition-all text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
          <RefreshCw className="w-4 h-4 opacity-20" />
          Re-Issue Physical Entity
        </button>
      </div>
    </div>
  );
}