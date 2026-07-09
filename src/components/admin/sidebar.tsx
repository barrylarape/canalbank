"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  Building2,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ExternalLink,
  AlertTriangle,
  Lock,
  Zap,
  TrendingUp,
  History,
  RotateCcw,
  Landmark,
  Terminal,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navGroups = [
  {
    label: "CORE BANKING",
    items: [
      { label: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
      { label: "Authorizations", href: "/admin/approvals", icon: ShieldCheck },
      { label: "Member Registry", href: "/admin/members", icon: Users },
      { label: "Ledger Monitor", href: "/admin/transactions", icon: History },
      { label: "Vault Accounts", href: "/admin/accounts", icon: Building2 },
    ]
  },
  {
    label: "OPERATIONS",
    items: [
      { label: "Manual Adjustment", href: "/admin/members?action=adjust", icon: TrendingUp },
      { label: "Internal Transfer", href: "/admin/members?action=transfer", icon: ArrowLeftRight },
      { label: "Interest Engine", href: "/admin/operations/interest", icon: Zap },
      { label: "Fee Management", href: "/admin/operations/fees", icon: Landmark },
      { label: "Reversal Protocol", href: "/admin/operations/reverse", icon: RotateCcw },
    ]
  },
  {
    label: "GOVERNANCE",
    items: [
      { label: "Content Management", href: "/admin/content", icon: ImageIcon },
      { label: "Risk & Compliance", href: "/admin/risk", icon: AlertTriangle },
      { label: "Query Inspector", href: "/admin/debug/database", icon: Terminal },
      { label: "Audit Logs", href: "/admin/audit", icon: Lock },
      { label: "System Settings", href: "/admin/settings", icon: Settings },
    ]
  }
];

interface AdminSidebarProps {
  adminName: string | null;
}

export function AdminSidebar({ adminName }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const isActive = (item: { href: string; exact?: boolean }) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-950">
      <div className={cn("p-8 border-b border-slate-800 flex items-center", collapsed ? "justify-center px-4" : "gap-4")}>
        <div className="w-10 h-10 rounded-xl bg-accent-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(229,57,53,0.2)]">
          C
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-bold text-sm leading-none tracking-tight">Canal Bank</p>
            <div className="text-accent-500 text-[9px] mt-1 font-bold uppercase tracking-[0.2em] flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" />
              Institutional
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 p-4 py-8 space-y-12 overflow-y-auto scrollbar-none">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-6">
            {!collapsed && (
              <p className="px-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">{group.label}</p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-2xl transition-all duration-300 group relative",
                      collapsed ? "justify-center p-4" : "gap-4 px-6 py-3.5",
                      active 
                        ? "bg-accent-500/10 text-accent-500 border border-accent-500/20" 
                        : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
                    )}
                  >
                    <Icon className={cn("flex-shrink-0 transition-transform group-hover:scale-110", collapsed ? "w-6 h-6" : "w-4 h-4", active ? "text-accent-500" : "text-slate-600")} />
                    {!collapsed && <span className={cn("text-[12px] font-medium uppercase tracking-widest", active ? "text-accent-400" : "text-slate-500")}>{item.label}</span>}
                    {active && !collapsed && <div className="absolute left-0 w-1 h-5 bg-accent-500 rounded-r-full" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-900 space-y-1">
        <Link href="/dashboard" className={cn("w-full flex items-center rounded-2xl text-slate-500 hover:bg-white/5 hover:text-slate-200 transition-all", collapsed ? "justify-center p-3" : "gap-3 px-6 py-3.5")}>
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="text-[12px] font-medium uppercase tracking-widest">Client Interface</span>}
        </Link>
        <button onClick={handleLogout} className={cn("w-full flex items-center rounded-2xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all", collapsed ? "justify-center p-3" : "gap-3 px-6 py-3.5")}>
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="text-[12px] font-medium uppercase tracking-widest">Secure Exit</span>}
        </button>
      </div>

      {!collapsed && (
        <div className="p-4 bg-slate-900/50">
          <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-accent-600/20 flex items-center justify-center text-accent-400 font-bold text-xs border border-accent-600/30">
              {adminName?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-white truncate leading-none tracking-tight">{adminName || "Administrator"}</p>
              <p className="text-[8px] text-accent-500 font-bold uppercase mt-1 tracking-widest">Master Control</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <button className="lg:hidden fixed top-6 left-6 z-50 w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-white" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      {mobileOpen && <div className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40" onClick={() => setMobileOpen(false)} />}
      <div className={cn("lg:hidden fixed left-0 top-0 h-full bg-slate-950 z-40 w-80 transition-transform duration-500", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
        <SidebarContent />
      </div>
      <div className={cn("hidden lg:flex flex-col bg-slate-950 transition-all duration-300 relative border-r border-slate-900", collapsed ? "w-28" : "w-80")}>
        <SidebarContent />
        <button onClick={() => setCollapsed(!collapsed)} className="absolute -right-4 top-24 w-8 h-8 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all z-10">
          <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>
    </>
  );
}