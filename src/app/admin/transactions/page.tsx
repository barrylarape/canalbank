"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Loader2,
  RotateCcw,
  Edit3,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Database } from "@/lib/supabase/types";

type Transaction = Database["public"]["Tables"]["transactions"]["Row"] & {
  profiles?: { full_name?: string | null; email?: string | null } | null;
};

const PAGE_SIZE = 25;

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { style: string; icon: any }> = {
    completed: { 
      style: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_2px_8px_rgba(16,185,129,0.08)]", 
      icon: Check 
    },
    pending: { 
      style: "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_2px_8px_rgba(245,158,11,0.08)]", 
      icon: Clock 
    },
    failed: { 
      style: "bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_2px_8px_rgba(239,68,68,0.08)]", 
      icon: X 
    },
    reversed: { 
      style: "bg-slate-500/10 text-slate-400 border border-slate-500/20 shadow-[0_2px_8px_rgba(100,116,139,0.08)]", 
      icon: RotateCcw 
    },
  };
  
  const { style, icon: Icon } = config[status] ?? config.pending;
  
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase border tracking-widest transition-all", style)}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [editForm, setEditForm] = useState({ description: "", status: "", amount: "" });
  const [saving, setSaving] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    
    let query = supabase
      .from("transactions")
      .select("*, profiles!transactions_user_id_fkey(full_name, email)", { count: "exact" })
      .not("category", "eq", "system_audit")
      .order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (statusFilter !== "all") query = query.eq("status", statusFilter);
    if (typeFilter !== "all") query = query.eq("transaction_type", typeFilter);

    const { data, count, error } = await query;
    
    if (error) console.error("Query Error:", error);

    setTotalCount(count ?? 0);
    setTransactions((data as Transaction[]) ?? []);
    setLoading(false);
  }, [page, statusFilter, typeFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setEditForm({
      description: tx.description ?? "",
      status: tx.status,
      amount: tx.amount.toString()
    });
  };

  const handleSave = async () => {
    if (!editingTx) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/update-transaction", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: editingTx.id,
          status: editForm.status,
          description: editForm.description,
          amount: parseFloat(editForm.amount)
        }),
      });
      if (res.ok) {
        setEditingTx(null);
        fetchTransactions();
      } else {
        const data = await res.json();
        alert(data.error || "Update failed");
      }
    } catch {
      alert("Network error");
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(val);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Ledger Monitor</h1>
          <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-semibold flex items-center gap-2">
            {totalCount.toLocaleString()} Institutional Ledger Events
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 bg-slate-950/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <select 
              value={statusFilter} 
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:ring-1 focus:ring-accent-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="reversed">Reversed</option>
            </select>
            <select 
              value={typeFilter} 
              onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:ring-1 focus:ring-accent-500"
            >
              <option value="all">All Types</option>
              <option value="credit">Credit (+)</option>
              <option value="debit">Debit (-)</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Page {page + 1}</span>
            <button 
              disabled={(page + 1) * PAGE_SIZE >= totalCount}
              onClick={() => setPage(p => p + 1)}
              className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-accent-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-950/30 border-b border-slate-700/50">
                  <th className="text-left px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Value Date</th>
                  <th className="text-left px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trace ID</th>
                  <th className="text-left px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Beneficiary</th>
                  <th className="text-left px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Narration</th>
                  <th className="text-left px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                  <th className="text-left px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-5 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-700/20 transition-colors group">
                    <td className="px-5 py-4 text-[10px] text-slate-400 font-mono">
                      {new Date(tx.created_at).toLocaleDateString("en-CH")}
                    </td>
                    <td className="px-5 py-4 text-[10px] font-mono text-accent-500 font-bold uppercase">{tx.reference}</td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-bold text-slate-200">{tx.profiles?.full_name ?? "—"}</p>
                      <p className="text-[9px] text-slate-500">{tx.profiles?.email}</p>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-300 truncate max-w-[200px]">{tx.description}</td>
                    <td className="px-5 py-4 text-xs font-bold font-mono text-slate-200">
                      {tx.transaction_type === "credit" ? "+" : "-"}{formatCurrency(tx.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button 
                        onClick={() => handleEdit(tx)}
                        className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-500 hover:text-accent-400 hover:border-accent-500/50 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingTx && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-accent-500" />
                <h2 className="text-sm font-bold text-white uppercase tracking-tight">Institutional Ledger Edit</h2>
              </div>
              <button onClick={() => setEditingTx(null)} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trace ID</label>
                <div className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-accent-400 font-bold uppercase">
                  {editingTx.reference}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ledger Status</label>
                  <select 
                    value={editForm.status}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:ring-1 focus:ring-accent-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="reversed">Reversed</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount (EUR)</label>
                  <input 
                    type="number"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 font-mono focus:ring-1 focus:ring-accent-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Narration / Justification</label>
                <textarea 
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:ring-1 focus:ring-accent-500 resize-none"
                />
              </div>

              <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                <p className="text-[9px] text-amber-500/80 font-medium leading-relaxed">
                  CAUTION: Direct ledger manipulation bypasses Maker-Checker protocol. All edits are logged under your identity for regulatory audit.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3">
              <button 
                onClick={() => setEditingTx(null)}
                className="px-4 py-2 text-xs font-bold text-slate-500 uppercase hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-accent-600 hover:bg-accent-700 text-white text-xs font-bold uppercase rounded-lg shadow-lg shadow-accent-900/40 flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
