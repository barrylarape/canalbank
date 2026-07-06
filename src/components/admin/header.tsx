"use client";

import { Bell, Search, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { CommandPalette } from "@/components/ui/command-palette";

interface AdminHeaderProps {
  adminName: string | null;
}

export function AdminHeader({ adminName }: AdminHeaderProps) {
  const firstName = adminName?.split(" ")[0] ?? "Admin";
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  return (
    <header className="bg-slate-900 border-b border-slate-700/50 px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-30">
      <div className="pl-10 lg:pl-0 flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent-600/10 border border-accent-600/20">
          <ShieldCheck className="w-3 h-3 text-accent-400" />
          <span className="text-xs font-semibold text-accent-400 uppercase tracking-wider">
            Admin Console
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Modern Admin Search */}
        <button 
          onClick={() => setIsPaletteOpen(true)}
          className="hidden md:flex items-center justify-between gap-3 bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-2 w-64 hover:bg-slate-750 transition-all group"
        >
          <div className="flex items-center gap-3">
            <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
            <span className="text-xs font-medium text-slate-500 group-hover:text-slate-400">Search members...</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-md px-1 py-0.5 shadow-sm">
            <span className="text-[9px] font-bold text-slate-500">⌘</span>
            <span className="text-[9px] font-bold text-slate-500">K</span>
          </div>
        </button>

        <button className="relative w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700/50">
          <div className="w-7 h-7 rounded-full bg-accent-600/20 border border-accent-600/30 flex items-center justify-center text-accent-400 font-bold text-xs">
            {firstName[0]?.toUpperCase()}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-white leading-none">{firstName}</p>
            <p className="text-[10px] text-accent-400 mt-0.5">Admin</p>
          </div>
        </div>
      </div>
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </header>
  );
}
