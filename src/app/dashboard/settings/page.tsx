"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  Bell, 
  Globe, 
  Eye, 
  ShieldCheck, 
  Smartphone, 
  Mail, 
  MessageSquare,
  Clock,
  ChevronRight,
  Check,
  AlertCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function VaultSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [notifications, setNotifications] = useState({
    security: true,
    transactions: true,
    marketing: false,
    email: true,
    push: true,
    sms: false
  });

  const [regional, setRegional] = useState({
    timezone: "Europe/Zurich (CET)",
    currency: "EUR (€)",
    language: "English (UK)"
  });

  const handleSave = () => {
    setLoading(true);
    // Simulate API call to save institutional preferences
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1200);
  };

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div>
        <h1 className="text-3xl font-black text-brand-950 uppercase tracking-tight">Vault Settings</h1>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Configure your institutional preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Notification Protocols */}
        <section className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_15px_50px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-brand-900 shadow-sm">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-brand-950 uppercase tracking-widest">Notification Protocols</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Manage how the bank communicates with you</p>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: "security", label: "Security & Access Alerts", desc: "Immediate notification of logins and vault unlocks.", icon: ShieldCheck },
                { id: "transactions", label: "Ledger Activity", desc: "Confirmations for all fund movements and settlements.", icon: Smartphone },
                { id: "marketing", label: "Institutional Insights", desc: "Weekly market updates and executive summaries.", icon: Eye },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-2xl group hover:border-brand-200 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-brand-950 transition-colors">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-black text-brand-950 uppercase tracking-tight">{item.label}</p>
                      <p className="text-[10px] text-slate-500 leading-tight font-medium max-w-[180px]">{item.desc}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleNotif(item.id as any)}
                    className={cn(
                      "w-10 h-5 rounded-full transition-all duration-500 flex items-center px-1 shadow-inner",
                      notifications[item.id as keyof typeof notifications] ? "bg-brand-900" : "bg-slate-200"
                    )}
                  >
                    <div className={cn(
                      "w-3 h-3 rounded-full bg-white shadow-md transition-transform duration-500",
                      notifications[item.id as keyof typeof notifications] ? "translate-x-5" : "translate-x-0"
                    )} />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-6">Delivery Channels</p>
              <div className="flex flex-wrap gap-4">
                {[
                  { id: "email", label: "Email Dispatch", icon: Mail },
                  { id: "push", label: "App Push", icon: Smartphone },
                  { id: "sms", label: "SMS Gateway", icon: MessageSquare },
                ].map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => toggleNotif(channel.id as any)}
                    className={cn(
                      "flex items-center gap-3 px-5 py-3 rounded-xl border transition-all active:scale-95",
                      notifications[channel.id as keyof typeof notifications]
                        ? "bg-brand-900 border-brand-900 text-white shadow-lg shadow-brand-900/10"
                        : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                    )}
                  >
                    <channel.icon className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{channel.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Regional Intelligence */}
        <section className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_15px_50px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-brand-900 shadow-sm">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-brand-950 uppercase tracking-widest">Regional & Display</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Synchronize your digital environment</p>
            </div>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Institutional Timezone</label>
              <select 
                value={regional.timezone}
                onChange={(e) => setRegional({...regional, timezone: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-900/5 transition-all appearance-none"
              >
                <option>Europe/Zurich (CET)</option>
                <option>America/New_York (EST)</option>
                <option>Asia/Singapore (SGT)</option>
                <option>UTC (Coordinated Universal Time)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Primary Currency</label>
              <select 
                value={regional.currency}
                onChange={(e) => setRegional({...regional, currency: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-900/5 transition-all appearance-none"
              >
                <option>EUR (€) - Euro</option>
                <option>CHF (CHF) - Swiss Franc</option>
                <option>USD ($) - US Dollar</option>
                <option>GBP (£) - British Pound</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Display Language</label>
              <select 
                value={regional.language}
                onChange={(e) => setRegional({...regional, language: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-900/5 transition-all appearance-none"
              >
                <option>English (UK)</option>
                <option>Deutsch (CH)</option>
                <option>Français (CH)</option>
                <option>Italiano (CH)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Global Security Summary */}
        <div className="bg-brand-950 rounded-[3rem] p-10 text-white relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center border border-white/10">
                <Clock className="w-8 h-8 text-accent-400" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">System Integrity</h3>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Version 1.0.4 · Production Build</p>
              </div>
            </div>
            <div className="flex items-center gap-8 px-8 py-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
              <div className="text-center">
                <p className="text-white/30 text-[8px] font-bold uppercase tracking-widest mb-1">Status</p>
                <p className="text-xs font-black text-emerald-400 uppercase">Operational</p>
              </div>
              <div className="w-[1px] h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-white/30 text-[8px] font-bold uppercase tracking-widest mb-1">Last Sync</p>
                <p className="text-xs font-black text-white uppercase">Just Now</p>
              </div>
            </div>
          </div>
          {/* Visual decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
          <div className="flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-brand-900" />
            End-to-end encrypted preference storage
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-10 py-5 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
              Reset to Defaults
            </button>
            <button 
              onClick={handleSave}
              disabled={loading}
              className={cn(
                "flex-1 sm:flex-none px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95",
                success 
                  ? "bg-emerald-600 text-white shadow-emerald-950/20" 
                  : "bg-brand-900 text-white shadow-brand-950/20 hover:bg-brand-800"
              )}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : success ? (
                <Check className="w-4 h-4" />
              ) : (
                <Settings className="w-4 h-4" />
              )}
              {loading ? "Committing..." : success ? "Preferences Saved" : "Commit Vault Settings"}
            </button>
          </div>
        </div>

        {success && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-50 py-3 rounded-xl border border-emerald-100"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Institutional Preferences Synchronized Successfully
          </motion.div>
        )}
      </div>
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
