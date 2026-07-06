"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type SubscriptionConfig = {
  table: string;
  schema?: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  filter?: string;
};

export function useRealtimeSubscription<T extends Record<string, any>>(
  config: SubscriptionConfig,
  onCallback: (payload: RealtimePostgresChangesPayload<T>) => void,
  dependencies: any[] = []
) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    const supabase = createClient();
    
    // Create a unique channel name based on config
    const channelName = `realtime:${config.schema || "public"}:${config.table}${
      config.filter ? `:${config.filter}` : ""
    }`;

    const newChannel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: config.event || "*",
          schema: config.schema || "public",
          table: config.table,
          filter: config.filter,
        },
        (payload) => {
          onCallback(payload as RealtimePostgresChangesPayload<T>);
        }
      )
      .subscribe();

    setChannel(newChannel);

    return () => {
      supabase.removeChannel(newChannel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return channel;
}
