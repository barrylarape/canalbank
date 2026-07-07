"use client";

import { Bell, Search, ChevronDown, User, Settings, LogOut, HelpCircle } from "lucide-react";
import type { Database } from "@/lib/supabase/types";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CommandPalette } from "@/components/ui/command-palette";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface DashboardHeaderProps {
  profile: Profile | null;
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [greeting, setGreeting] = useState("Welcome");
  const [dateTime, setDateTime] = useState({ dayName: "", fullDate: "" });
  
  const firstName = profile?.full_name?.split(" ")[0] ?? "Member";
  const initials = profile?.full_name
    ? profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : profile?.email?.[0].toUpperCase() ?? "?";

  useEffect(() => {
    const today = new Date();
    const hour = today.getHours();
    
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    setDateTime({
      dayName: today.toLocaleDateString("en-CH", { weekday: "long" }),
      fullDate: today.toLocaleDateString("en-CH", { day: "numeric", month: "long" })
    });
  }, []);

  return (
    <header className="bg-white/70 backdrop-blur-md px-8 lg:px-12 py-8 flex items-center justify-between gap-6 sticky top-0 z-30 border-b border-slate-200/50">
      {/* Premium Institutional Greeting */}
      <div className="pl-12 lg:pl-0 flex items-center gap-8">
        <div>
          <h1 className="text-xl font-black text-brand-950 tracking-tight uppercase">
            {greeting}, {firstName}
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mt-1 min-h-[1rem]">
            {dateTime.dayName && `${dateTime.dayName} · ${dateTime.fullDate}`}
          </p>
        </div>

        {/* Live Portfolio Status */}
        <div className="hidden xl:flex items-center gap-4 pl-8 border-l border-slate-200">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">System Engine</span>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <span className="text-[10px] font-black text-brand-950 uppercase tracking-tighter">Portfolio Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Modern Search Trigger */}
        <button 
          onClick={() => setIsPaletteOpen(true)}
          className="hidden md:flex items-center justify-between gap-4 bg-slate-100/50 hover:bg-slate-100 rounded-2xl px-5 py-3 w-72 border border-slate-200/50 transition-all group"
        >
          <div className="flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-brand-950 transition-colors" />
            <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-500 transition-colors uppercase tracking-widest">Search Vault...</span>
          </div>
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-0.5 shadow-sm">
            <span className="text-[9px] font-black text-slate-400">⌘</span>
            <span className="text-[9px] font-black text-slate-400">K</span>
          </div>
        </button>

        {/* Action Group */}
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-slate-400 hover:text-brand-950 hover:bg-slate-50 transition-all border border-slate-100 group shadow-sm"
          >
            <HelpCircle className="w-5 h-5" />
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-slate-400 hover:text-brand-950 hover:bg-slate-50 transition-all border border-slate-100 group shadow-sm"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-accent-500 rounded-full ring-2 ring-white" />
          </motion.button>
        </div>

        <div className="w-[1px] h-8 bg-slate-200 hidden md:block" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl hover:bg-brand-50 transition-all border border-transparent hover:border-slate-100"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-950 flex items-center justify-center text-white font-black text-[11px] shadow-lg shadow-brand-950/20">
              {initials}
            </div>
            <motion.div
              animate={{ rotate: showDropdown ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowDropdown(false)}
                />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-4 w-72 bg-white border border-slate-200 rounded-[2.5rem] shadow-[0_30px_90px_rgba(0,0,0,0.12)] z-50 py-3 overflow-hidden"
                >
                  <div className="px-8 py-6 border-b border-slate-50 bg-brand-50/20">
                    <p className="text-base font-black text-brand-950 truncate tracking-tight">{profile?.full_name || "Private Member"}</p>
                    <p className="text-[10px] font-black text-slate-400 truncate mt-1 tracking-[0.2em] uppercase">{profile?.role || "Member"}</p>
                  </div>
                  
                  <div className="p-3 space-y-1">
                    <button 
                      onClick={() => { router.push("/dashboard/security"); setShowDropdown(false); }}
                      className="w-full flex items-center gap-4 px-5 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-brand-50 hover:text-brand-950 rounded-[1.5rem] transition-all group"
                    >
                      <User className="w-4 h-4 text-slate-300 group-hover:text-brand-950 transition-colors" /> 
                      <span>Security & Profile</span>
                    </button>
                    <button 
                      onClick={() => { router.push("/dashboard/settings"); setShowDropdown(false); }}
                      className="w-full flex items-center gap-4 px-5 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-brand-50 hover:text-brand-950 rounded-[1.5rem] transition-all group"
                    >
                      <Settings className="w-4 h-4 text-slate-300 group-hover:text-brand-950 transition-colors" /> 
                      <span>Vault Settings</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-50 mt-1 p-3">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-4 px-5 py-4 text-[11px] font-black uppercase tracking-widest text-accent-500 hover:bg-accent-50 rounded-[1.5rem] transition-all group"
                    >
                      <LogOut className="w-4 h-4 text-accent-400" /> 
                      <span>Secure Exit</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </header>
  );
}
