"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  ImageIcon, 
  Upload, 
  Loader2, 
  Check, 
  AlertCircle, 
  RefreshCw,
  Layout,
  Smartphone,
  ShieldCheck,
  Landmark,
  Image as LucideImage,
  Globe,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import placeholders from "@/app/lib/placeholder-images.json";

const ASSET_CONFIG = [
  { id: "logo", label: "Institutional Logo", icon: Landmark, desc: "The primary brand hallmark used in navbars and sidebars." },
  { id: "hero", label: "Hero Banner", icon: Layout, desc: "The cinematic background image for the landing page entrance." },
  { id: "mobileApp", label: "Mobile Showcase", icon: Smartphone, desc: "Image used in the digital interface multi-device showcase." },
  { id: "vault", label: "Vault Facility", icon: ShieldCheck, desc: "Technical visualization of the private vault storage." },
  { id: "zurichCanal", label: "Swiss Heritage", icon: Globe, desc: "Heritage imagery showcasing Swiss stability and landscape." },
  { id: "businessBanking", label: "Business Banking", icon: LucideImage, desc: "Contextual imagery for institutional wealth management." },
  { id: "dashboardPreview", label: "Desktop Dashboard", icon: Layout, desc: "Showcase image of the web-based institutional monitor." },
];

export default function ContentManagementPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "brand_assets")
      .single();

    if (data) {
      setSettings(data.value as Record<string, string>);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleUpload = async (id: string, file: File) => {
    setUploading(id);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("assetKey", id);

    try {
      const res = await fetch("/api/admin/content/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setSuccess(`Asset "${id}" updated successfully.`);
      fetchSettings();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(null);
    }
  };

  const getAssetUrl = (id: string) => {
    if (settings[id]) return settings[id];
    if (id === "logo") return null; 
    return (placeholders as any)[id]?.url;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <ImageIcon className="w-7 h-7 text-accent-500" />
            Brand Asset Management
          </h1>
          <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-semibold">
            Institutional Content Control · Dynamic Image Hosting
          </p>
        </div>
        <button 
          onClick={fetchSettings}
          disabled={loading}
          className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
        </button>
      </div>

      {(error || success) && (
        <div className={cn(
          "p-4 rounded-xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300",
          error ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
        )}>
          {error ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <Check className="w-5 h-5 flex-shrink-0" />}
          <p className="text-sm font-medium">{error || success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {ASSET_CONFIG.map((asset) => {
          const url = getAssetUrl(asset.id);
          const isUploading = uploading === asset.id;
          const isCustom = !!settings[asset.id];

          return (
            <div key={asset.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden group hover:border-slate-700 transition-all flex flex-col shadow-xl">
              <div className="aspect-video relative bg-slate-950 flex items-center justify-center overflow-hidden">
                {url ? (
                  <Image 
                    src={url} 
                    fill 
                    alt={asset.label} 
                    className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700" 
                    unoptimized={isCustom}
                  />
                ) : (
                  <div className="text-center p-8">
                    <asset.icon className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                    <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">No Custom Asset</p>
                  </div>
                )}
                
                {isUploading && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
                    <Loader2 className="w-8 h-8 animate-spin text-accent-500" />
                    <p className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Synchronizing Vault...</p>
                  </div>
                )}

                <div className="absolute top-4 right-4 flex gap-2">
                  {url && (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900/80 border border-white/10 text-white/40 hover:text-white transition-all backdrop-blur-md">
                      <Eye className="w-3 h-3" />
                    </a>
                  )}
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[9px] font-black uppercase border tracking-widest backdrop-blur-md",
                    isCustom ? "bg-accent-500/20 text-accent-400 border-accent-500/30" : "bg-slate-800/80 text-slate-500 border-slate-700"
                  )}>
                    {isCustom ? "Custom" : "Default"}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-accent-500 transition-colors shadow-inner">
                    <asset.icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-white tracking-tight uppercase text-xs">{asset.label}</h3>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-6 flex-1">{asset.desc}</p>
                
                <label className="relative cursor-pointer">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    disabled={!!uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(asset.id, file);
                    }}
                  />
                  <div className="w-full py-3.5 bg-slate-950 border border-slate-700 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white hover:border-accent-500/50 transition-all active:scale-[0.98]">
                    <Upload className="w-3.5 h-3.5" /> Replace Asset
                  </div>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center flex-shrink-0 text-accent-500 border border-slate-800 shadow-xl">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-black text-white uppercase tracking-widest">Storage Policy Notice</p>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            All brand assets are stored in the institutional <span className="text-accent-400">site-assets</span> vault. Replacing an asset will immediately broadcast the change via the global realtime stream. Ensure images are high-resolution and optimized for web delivery.
          </p>
        </div>
      </div>
    </div>
  );
}
