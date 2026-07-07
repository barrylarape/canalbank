"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  ShieldCheck, 
  Loader2,
  ArrowUpRight,
  ArrowDownLeft,
  User,
  ShieldAlert,
  BadgeCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Database } from "@/lib/supabase/types";

type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type PendingTx = Transaction & {
  profiles: Pick<Profile, "full_name" | "email"> | null;
  maker: Pick<Profile, "full_name" | "email"> | null;
};

function PipelineInspector({ txStatus }: { txStatus: string }) {
  const stages = [
    { label: "Initiated", status: "completed" },
    { label: "Maker Verified", status: "completed" },
    { label: "Checker Pending", status: txStatus === "pending" ? "current" : "waiting" },
    { label: "Ledger Posting", status: "waiting" },
    { label: "Account Sync", status: "waiting" },
  ];

  return (
    <div className="flex items-center gap-2 mt-2 py-2 px-3 bg-slate-950/50 rounded-lg border border-slate-800/50 w-fit">
      {stages.map((stage, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            stage.status === "completed" ? "bg-emerald-500" : 
            stage.status === "current" ? "bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" : 
            "bg-slate-700"
          )} />
          <span className={cn(
            "text-[8px] font-bold uppercase tracking-tight whitespace-nowrap",
            stage.status === "completed" ? "text-slate-300" :
            stage.status === "current" ? "text-red-400" :
            "text-slate-600"
          )}>
            {stage.label}
          </span>
          {i < stages.length - 1 && <div className="w-3 h-[1px] bg-slate-800" />}
        </div>
      ))}
    </div>
  );
}

export default function ApprovalQueuePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [requests, setRequests] = useState<PendingTx[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        *,
        profiles:profiles!transactions_user_id_fkey(full_name, email),
        maker:profiles!transactions_created_by_id_fkey(full_name, email)
      `)
      .eq("status", "pending")
      .eq("category", "adjustment_request")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Fetch error:", error);
    }

    setRequests((data as unknown as PendingTx[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    fetchRequests();
  }, [fetchRequests]);

  const handleAction = async (txId: string, action: "approve" | "reject") => {
    setProcessing(txId);
    try {
      const res = await fetch("/api/admin/approve-adjustment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: txId, action }),
      });
      const data = await res.json();
      if (!res.ok) alert(data.error || "Action failed");
      fetchRequests();
    } catch {
      alert("Network error");
    } finally {
      setProcessing(null);
    }
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(val);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <ShieldAlert className="w-7 h-7 text-accent-500" />
            Governance & Authorizations
          </h1>
          <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-semibold flex items-center gap-2">
            Institutional Control · Maker-Checker Protocol (Dual Control)
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-950/50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-tight">Execution Pipeline</h2>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            {requests.length} Awaiting Authorization
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin text-accent-600" />
            <p className="text-sm font-medium tracking-tight">Accessing Secure Vault...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
            <BadgeCheck className="w-12 h-12 text-slate-800" />
            <p className="text-sm font-medium">All authorizations current. Queue empty.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-950/30 border-b border-slate-700/50">
                  <th className="text-left px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol & Pipeline</th>
                  <th className="text-left px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Maker (Initiator)</th>
                  <th className="text-left px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Customer (Beneficiary)</th>
                  <th className="text-left px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-bold uppercase w-fit tracking-tighter",
                          req.approval_tier === "executive" ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" :
                          req.approval_tier === "dual" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                          req.approval_tier === "supervisor" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                          "bg-slate-700 text-slate-400"
                        )}>
                          {req.approval_tier} Review
                        </span>
                        <PipelineInspector txStatus="pending" />
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{req.maker?.full_name || 'System'}</p>
                          <p className="text-[9px] text-slate-500 uppercase tracking-tighter">{new Date(req.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-xs font-bold text-accent-500">{req.profiles?.full_name}</p>
                        <p className="text-[9px] text-slate-500 truncate max-w-[150px]">
                          {req.description ? req.description.split('] ')[1] ?? req.description : ""}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {req.transaction_type === "credit" ? (
                          <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5 text-red-400" />
                        )}
                        <p className={cn(
                          "text-sm font-bold font-mono",
                          req.transaction_type === "credit" ? "text-emerald-400" : "text-red-400"
                        )}>
                          {isMounted ? formatCurrency(req.amount) : req.amount}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleAction(req.id, "reject")}
                          disabled={!!processing}
                          className="px-4 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-[10px] font-bold uppercase transition-all"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleAction(req.id, "approve")}
                          disabled={!!processing}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase transition-all shadow-lg shadow-emerald-900/40 flex items-center gap-2"
                        >
                          {processing === req.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
                          Authorize
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
