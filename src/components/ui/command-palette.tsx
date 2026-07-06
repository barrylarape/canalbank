"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CreditCard, History, User, Landmark, TrendingUp, X, Command } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMANDS = [
  { id: "dashboard", label: "Dashboard", icon: Command, href: "/dashboard" },
  { id: "accounts", label: "View Accounts", icon: Landmark, href: "/dashboard/accounts" },
  { id: "transfers", label: "Send Money", icon: History, href: "/dashboard/transfers" },
  { id: "cards", label: "Card Settings", icon: CreditCard, href: "/dashboard/cards" },
  { id: "investments", label: "Market Portfolio", icon: TrendingUp, href: "/dashboard/investments" },
  { id: "profile", label: "Institutional Profile", icon: User, href: "/dashboard/security" },
];

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        isOpen ? onClose() : null; // Parent handles opening if triggered from elsewhere, but here we just listen
      }
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
    } else {
      setSearch("");
    }
  }, [isOpen]);

  const filtered = COMMANDS.filter(cmd => 
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 sm:pt-40">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-4 px-6 py-5 border-b border-slate-100">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search accounts, actions, members..."
                className="flex-1 bg-transparent border-none outline-none text-brand-950 text-base font-medium placeholder:text-slate-400"
              />
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results */}
            <div className="p-2 max-h-[400px] overflow-y-auto scrollbar-none">
              {filtered.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No matching commands found</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filtered.map((cmd) => (
                    <button
                      key={cmd.id}
                      onClick={() => handleSelect(cmd.href)}
                      className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-brand-50 transition-all text-left group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-brand-950 group-hover:shadow-sm transition-all">
                        <cmd.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-brand-950 uppercase tracking-tight">{cmd.label}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{cmd.href}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Open</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-0.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 shadow-sm">Enter</kbd>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-0.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 shadow-sm">Esc</kbd>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Close</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System Online</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
