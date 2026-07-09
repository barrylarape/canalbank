"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Settings, 
  ShieldAlert, 
  Loader2, 
  Check, 
  AlertCircle, 
  RefreshCw,
  Lock,
  Globe,
  Mail,
  Phone,
  HardDrive,
  UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformConfig {
  maintenanceMode: boolean;
  membershipMode: "open" | "invitation";
  supportEmail: string;
  supportPhone: string;
  licenseNumber: string;
}

const DEFAULT_CONFIG: PlatformConfig = {
  maintenanceMode: false,
  membershipMode: "invitation",
  supportEmail: "banking@canalbank.ch",
  supportPhone: "+41 800 000 001",
  licenseNumber: "CHE-123.456.789",
};

export default function SystemSettingsPage() {
  const [config, setConfig] = useState<PlatformConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "platform_config")
      .single();

    if (data?.value) {
      setConfig(data.value as PlatformConfig);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update settings");

      setSuccess("Institutional configurations updated successfully.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const update = (field: keyof PlatformConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-accent-500 mb-4" />
        <p className="text-sm font-bold uppercase tracking-widest">Accessing System Ledger...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Settings className="w-7 h-7 text-accent-500" />
            System Configuration
          </h1>
          <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-semibold">
            Institutional Control · Platform Lifecycle & Governance
          </p>
        </div>
        <button 
          onClick={fetchSettings}
          className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {(error || success) && (
        <div className={cn(
          "p-4 rounded-xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-2",
          error ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
        )}>
          {error ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <Check className="w-5 h-5 flex-shrink-0" />}
          <p className="text-sm font-medium">{error || success}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Platform Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="px-8 py-5 border-b border-slate-800 bg-slate-950/50 flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <h2 className="text-sm font-bold text-white uppercase tracking-tight">Platform Lifecycle</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <div className="space-y-1">
                <p className="text-sm font-bold text-white uppercase tracking-tight">Maintenance Mode</p>
                <p className="text-[11px] text-slate-500 font-medium leading-tight max-w-sm">
                  Temporarily suspend all client-side operations for scheduled institutional maintenance.
                </p>
              </div>
              <button
                type="button"
                onClick={() => update("maintenanceMode", !config.maintenanceMode)}
                className={cn(
                  "w-12 h-6 rounded-full transition-all duration-300 flex items-center px-1",
                  config.maintenanceMode ? "bg-accent-600" : "bg-slate-700"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full bg-white shadow-lg transition-transform duration-300",
                  config.maintenanceMode ? "translate-x-6" : "translate-x-0"
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <div className="space-y-1">
                <p className="text-sm font-bold text-white uppercase tracking-tight">Membership Onboarding</p>
                <p className="text-[11px] text-slate-500 font-medium leading-tight max-w-sm">
                  Control the acquisition funnel for new institutional members.
                </p>
              </div>
              <select
                value={config.membershipMode}
                onChange={(e) => update("membershipMode", e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs font-bold text-white uppercase tracking-widest outline-none focus:ring-1 focus:ring-accent-500"
              >
                <option value="invitation">Invitation Only</option>
                <option value="open">Open Registry</option>
              </select>
            </div>
          </div>
        </div>

        {/* Institutional Contact */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="px-8 py-5 border-b border-slate-800 bg-slate-950/50 flex items-center gap-3">
            <Globe className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-tight">Regulatory Metadata</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Mail className="w-3 h-3" /> Support Dispatch
              </label>
              <input
                type="email"
                value={config.supportEmail}
                onChange={(e) => update("supportEmail", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:ring-1 focus:ring-accent-500 transition-all font-medium"
                placeholder="banking@canalbank.ch"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Phone className="w-3 h-3" /> Direct Contact
              </label>
              <input
                type="text"
                value={config.supportPhone}
                onChange={(e) => update("supportPhone", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:ring-1 focus:ring-accent-500 transition-all font-medium"
                placeholder="+41 800 000 001"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <HardDrive className="w-3 h-3" /> FINMA License ID
              </label>
              <input
                type="text"
                value={config.licenseNumber}
                onChange={(e) => update("licenseNumber", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono text-accent-400 font-bold placeholder:text-slate-700 focus:ring-1 focus:ring-accent-500 transition-all uppercase"
                placeholder="CHE-XXX.XXX.XXX"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
            <Lock className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Audited Session</span>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-10 py-4 bg-accent-600 hover:bg-accent-700 disabled:opacity-50 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-accent-950/40 flex items-center gap-2 active:scale-95"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Commit Configuration
          </button>
        </div>
      </form>

      <div className="p-6 bg-slate-900/50 border border-slate-800/50 rounded-[2rem] flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center flex-shrink-0 text-slate-500">
          <UserPlus className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-black text-white uppercase tracking-widest">Master Control Notice</p>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Modifying system configurations impacts the entire institutional infrastructure. These changes are broadcasted via the global realtime stream and logged against your officer identity.
          </p>
        </div>
      </div>
    </div>
  );
}
