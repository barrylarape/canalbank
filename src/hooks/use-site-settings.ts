"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Institutional Hook: Site Settings Resolver
 * Fetches dynamic brand assets and platform configurations from the site_settings registry.
 */
export function useSiteSettings() {
  const [assets, setAssets] = useState<Record<string, string>>({});
  const [config, setConfig] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      const supabase = createClient();
      
      const [assetsRes, configRes] = await Promise.all([
        supabase.from("site_settings").select("value").eq("key", "brand_assets").single(),
        supabase.from("site_settings").select("value").eq("key", "platform_config").single()
      ]);

      if (assetsRes.data?.value) {
        setAssets(assetsRes.data.value as Record<string, string>);
      }
      if (configRes.data?.value) {
        setConfig(configRes.data.value);
      }
      setLoading(false);
    }

    loadSettings();
  }, []);

  const getAsset = (key: string, fallback: string) => {
    return assets[key] || fallback;
  };

  return { assets, config, loading, getAsset };
}
