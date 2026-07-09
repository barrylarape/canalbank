"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Institutional Hook: Site Settings Resolver
 * Fetches dynamic brand assets and configurations from the site_settings registry.
 */
export function useSiteSettings() {
  const [assets, setAssets] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "brand_assets")
        .single();

      if (data?.value) {
        setAssets(data.value as Record<string, string>);
      }
      setLoading(false);
    }

    loadSettings();
  }, []);

  const getAsset = (key: string, fallback: string) => {
    return assets[key] || fallback;
  };

  return { assets, loading, getAsset };
}