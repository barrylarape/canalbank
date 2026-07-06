"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Wifi, 
  WifiOff, 
  Activity, 
  Clock, 
  Database, 
  ChevronDown, 
  ChevronUp,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Phase 7 – Realtime Inspector
 * Floating diagnostic widget for administrative visibility into the Supabase Realtime lifecycle.
 */
export function RealtimeInspector() {
  const [status, setStatus] = useState<string>("JOINING");
  const [lastEvent, setLastEvent] = useState<{
    type: string;
    time: string;
    ref: string;
  } | null>(null);
  const [eventCount, setEventCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    
    // Subscribe specifically to the transactions table for diagnostics
    const channel = supabase
      .channel("diagnostic-ledger-channel")
      .on(
        "postgres_changes",
        { 
          event: "*", 
          schema: "public", 
          table: "transactions" 
        },
        (payload) => {
          console.log("DIAGNOSTIC: Realtime transaction event", payload);
          setLastEvent({
            type: payload.eventType,
            time: new Date().toLocaleTimeString(),
            ref: (payload.new as any)?.reference || "N/A"
          });
          setEventCount(c => c + 1);
        }
      )
      .subscribe((subStatus) => {
        console.log(`DIAGNOSTIC: Realtime subscription status: ${subStatus}`);
        setStatus(subStatus.toUpperCase());
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-[100] transition-all duration-300",
      isMinimized ? "w-12 h-12" : "w-72"
    )}>
      {isMinimized ? (
        <button 
          onClick={() => setIsMinimized(false)}
          className={cn(
            "w-12 h-12 rounded-full border border-slate-700 shadow-2xl flex items-center justify-center transition-all",
            status === "SUBSCRIBED" ? "bg-emerald-600 shadow-emerald-900/40" : "bg-red-600 shadow-red-900/40"
          )}
        >
          <Wifi className="w-5 h-5 text-white animate-pulse" />
        </button>
      ) : (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col border-opacity-50 backdrop-blur-sm">
          <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent-500" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Realtime Inspector</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setIsMinimized(true)} className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-500">
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setIsVisible(false)} className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Status</span>
                <span className={cn(
                  "text-[10px] font-bold font-mono px-2 py-0.5 rounded",
                  status === "SUBSCRIBED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                )}>
                  {status === "SUBSCRIBED" ? "🟢 CONNECTED" : `🔴 ${status}`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Channel</span>
                <span className="text-[10px] font-bold text-white font-mono">transactions</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Subscribed</span>
                <span className="text-[10px] font-bold text-white font-mono">{status === "SUBSCRIBED" ? "TRUE" : "FALSE"}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Events Recv</span>
                <span className="text-[10px] font-bold text-accent-500 font-mono">{eventCount}</span>
              </div>
              {lastEvent ? (
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-500 uppercase">Last Event</span>
                    <span className="text-[9px] font-bold text-emerald-400">{lastEvent.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-500 uppercase">Timestamp</span>
                    <span className="text-[9px] text-slate-400">{lastEvent.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-500 uppercase">Ref</span>
                    <span className="text-[9px] text-slate-400 truncate w-24 text-right">{lastEvent.ref}</span>
                  </div>
                </div>
              ) : (
                <div className="text-[9px] text-slate-600 text-center py-2 bg-slate-950/50 rounded-lg italic font-medium">
                  Waiting for events...
                </div>
              )}
            </div>
          </div>
          
          <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[8px] text-slate-600 uppercase">Phase 7 Diag</span>
            <div className="flex items-center gap-1">
              <div className={cn("w-1 h-1 rounded-full", status === "SUBSCRIBED" ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
              <span className="text-[8px] text-slate-500 font-mono">LIVE_STREAM</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
