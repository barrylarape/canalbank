"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CreditCard, ArrowLeftRight, Building2,
  TrendingUp, Landmark, Settings, LogOut, Menu, X, Wallet,
  ShieldCheck, ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteSettings } from "@/hooks/use-site-settings";
import Image from "next/image";

const navGroups = [
  {
    label: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ]
  },
  {
    label: "BANKING",
    items: [
      { label: "Vault Accounts", href: "/dashboard/accounts", icon: Building2 },
      { label: "Transfers", href: "/dashboard/transfers", icon: ArrowLeftRight },
      { label: "Payments", href: "/dashboard/bills", icon: Wallet },
      { label: "Cards", href: "/dashboard/cards", icon: CreditCard },
    ]
  },
  {
    label: "WEALTH",
    items: [
      { label: "Investments", href: "/dashboard/investments", icon: TrendingUp },
      { label: "Loans", href: "/dashboard/loans", icon: Landmark },
    ]
  },
  {
    label: "MANAGEMENT",
    items: [
      { label: "Security", href: "/dashboard/security", icon: ShieldCheck },
      { label: "Vault Settings", href: "/dashboard/settings", icon: Settings },
    ]
  }
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { assets } = useSiteSettings();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-brand-950">
      {/* Logo Section */}
      <div className={cn("p-8 border-b border-white/5 flex items-center", collapsed ? "justify-center px-4" : "gap-4")}>
        <motion.div 
          layout
          className={cn(
            "w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-brand-950 font-black text-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] overflow-hidden",
            !assets.logo && "bg-white"
          )}
        >
          {assets.logo ? (
            <Image src={assets.logo} width={40} height={40} alt="Canal Bank Logo" className="object-contain" />
          ) : (
            "C"
          )}
        </motion.div>
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="min-w-0"
          >
            <p className="text-white font-black text-sm uppercase tracking-[0.2em] leading-none">Canal</p>
            <p className="text-slate-500 text-[10px] mt-1 font-bold uppercase tracking-widest">Digital Institution</p>
          </motion.div>
        )}
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 py-10 space-y-12 overflow-y-auto scrollbar-none">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-6">
            {!collapsed && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-6 text-[11px] font-black text-white/20 uppercase tracking-[0.3em]"
              >
                {group.label}
              </motion.p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center rounded-2xl transition-all duration-300 group relative",
                      collapsed ? "justify-center p-4" : "gap-4 px-6 py-3.5",
                      active
                        ? "bg-accent-500/10 text-accent-400 border border-accent-500/20"
                        : "text-slate-500 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className={cn("flex-shrink-0 transition-transform group-hover:scale-110", collapsed ? "w-6 h-6" : "w-4 h-4", active ? "text-accent-500" : "text-slate-600")} />
                    {!collapsed && <span className={cn("text-[12px] font-medium uppercase tracking-widest", active ? "text-accent-400" : "text-slate-500")}>{item.label}</span>}
                    {active && !collapsed && (
                      <motion.div 
                        layoutId="active-nav-indicator"
                        className="absolute left-0 w-1 h-5 bg-accent-500 rounded-r-full" 
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Section */}
      <div className={cn("p-6 border-t border-white/5")}>
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center rounded-2xl text-slate-500 hover:bg-accent-600/10 hover:text-accent-500 transition-all duration-300",
            collapsed ? "justify-center p-4" : "gap-4 px-6 py-3.5"
          )}
        >
          <LogOut className={cn("flex-shrink-0", collapsed ? "w-6 h-6" : "w-4 h-4")} />
          {!collapsed && <span className="text-[12px] font-medium uppercase tracking-widest">Secure Exit</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        className="lg:hidden fixed top-6 left-6 z-50 w-12 h-12 bg-brand-950 rounded-2xl flex items-center justify-center text-white shadow-2xl border border-white/10"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-brand-950/80 backdrop-blur-md z-40" 
            onClick={() => setMobileOpen(false)} 
          />
        )}
      </AnimatePresence>

      <motion.div 
        animate={{ x: mobileOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "lg:hidden fixed left-0 top-0 h-full bg-brand-950 z-40 w-80 shadow-[20px_0_60px_rgba(0,0,0,0.5)] border-r border-white/5"
        )}
      >
        <SidebarContent />
      </motion.div>

      <motion.div 
        animate={{ width: collapsed ? 112 : 320 }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        className={cn(
          "hidden lg:flex flex-col bg-brand-950 relative flex-shrink-0 border-r border-white/5"
        )}
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-4 top-24 w-8 h-8 bg-brand-950 border border-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/5 transition-all z-10 shadow-xl"
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
            <ChevronLeft className="w-4 h-4" />
          </motion.div>
        </button>
      </motion.div>
    </>
  );
}
