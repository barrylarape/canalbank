"use client";

import { useState, useEffect } from "react";
import { 
  Receipt, 
  Wallet, 
  ArrowRight, 
  Clock, 
  Plus, 
  CheckCircle2, 
  ChevronRight, 
  Building2, 
  CreditCard,
  Search,
  History,
  Zap,
  Coffee,
  ShieldCheck,
  AlertCircle,
  Loader2,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Account = {
  id: string;
  account_name: string;
  account_number: string;
  balance: number;
  available_balance: number;
  currency: string;
  account_type: string;
};

interface BillsClientProps {
  accounts: Account[];
  history: any[];
}

function formatCurrency(amount: number, currency = "EUR") {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency }).format(amount);
}

export function BillsClient({ accounts, history }: BillsClientProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "settle" | "history">("dashboard");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTraceId, setLastTraceId] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const [form, setForm] = useState({
    fromAccountId: accounts[0]?.id || "",
    beneficiary: "",
    reference: "",
    amount: "",
    category: "utilities"
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSettle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/settle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Settlement failed.");

      setLastTraceId(data.traceId);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setError(null);
    setForm({ ...form, beneficiary: "", reference: "", amount: "" });
    setActiveTab("dashboard");
  };

  const selectedAccount = accounts.find(a => a.id === form.fromAccountId);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-brand-950 uppercase tracking-tight">Institutional Payments</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Manage Settlements & Recurring Deliveries</p>
        </div>
        <div className="flex bg-white border border-slate-200 p-1 rounded-2xl">
          {(["dashboard", "settle", "history"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === tab ? "bg-brand-900 text-white shadow-lg" : "text-slate-400 hover:text-brand-950"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/50 shadow-sm relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.25em] mb-2">Awaiting Settlement</p>
                  <p className="text-2xl font-bold text-brand-950 font-mono tracking-tighter">€0.00</p>
                  <p className="text-[10px] text-emerald-600 mt-1 uppercase font-bold tracking-widest flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> All current
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:bg-brand-50 transition-colors" />
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/50 shadow-sm">
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.25em] mb-2">Scheduled Payments</p>
                <p className="text-2xl font-bold text-brand-950 font-mono tracking-tighter">0</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Active Standing Orders</p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/50 shadow-sm">
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.25em] mb-2">Settled This Month</p>
                <p className="text-2xl font-bold text-brand-950 font-mono tracking-tighter">€0.00</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Global Disbursement</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white rounded-[3rem] border border-slate-200/50 shadow-sm overflow-hidden flex flex-col">
                <div className="p-10 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-[11px] font-black text-brand-900 uppercase tracking-[0.25em]">Direct Settlement</h2>
                  <Zap className="w-4 h-4 text-accent-500" />
                </div>
                <div className="p-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-brand-50 rounded-[2rem] flex items-center justify-center mb-8 text-brand-950">
                    <Receipt className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-900 mb-4 uppercase tracking-tight">Settle Invoice</h3>
                  <p className="text-sm text-slate-500 mb-8 max-w-xs leading-relaxed">
                    Instantly clear pending institutional obligations or utility invoices via our secure gateway.
                  </p>
                  <button 
                    onClick={() => setActiveTab("settle")}
                    className="w-full py-4 bg-brand-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-950/20 hover:bg-brand-800 transition-all active:scale-95"
                  >
                    Initiate Settlement
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-[3rem] border border-slate-200/50 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-[11px] font-black text-brand-900 uppercase tracking-[0.25em]">Recent Disbursements</h2>
                  <button onClick={() => setActiveTab("history")} className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-brand-950 transition-colors">View All</button>
                </div>
                <div className="divide-y divide-slate-50">
                  {history.length === 0 ? (
                    <div className="py-20 text-center">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No recent activity</p>
                    </div>
                  ) : (
                    history.slice(0, 5).map((tx) => (
                      <div key={tx.id} className="px-10 py-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                            <Receipt className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-brand-950 truncate max-w-[140px] uppercase tracking-tight">{tx.description?.split(' - ')[0] || "Payment"}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(tx.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold font-mono text-brand-950">-{formatCurrency(tx.amount)}</p>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Settled</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "settle" && (
          <motion.div
            key="settle"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-[3rem] border border-slate-200/50 shadow-2xl p-10 space-y-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-brand-950 flex items-center justify-center text-white">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-brand-950 uppercase tracking-tight">Institutional Settlement</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Secure Ledger Disbursement</p>
                </div>
              </div>

              <form onSubmit={handleSettle} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Source Vault Entity</label>
                  <select
                    value={form.fromAccountId}
                    onChange={(e) => setForm({ ...form, fromAccountId: e.target.value })}
                    required
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-900/5 transition-all appearance-none"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.account_name} ({isMounted ? formatCurrency(acc.available_balance, acc.currency) : acc.available_balance})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Beneficiary Entity</label>
                    <input
                      type="text"
                      value={form.beneficiary}
                      onChange={(e) => setForm({ ...form, beneficiary: e.target.value })}
                      placeholder="e.g. Zurich Energy AG"
                      required
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-900/5 placeholder:text-slate-300 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Reference Identifier</label>
                    <input
                      type="text"
                      value={form.reference}
                      onChange={(e) => setForm({ ...form, reference: e.target.value })}
                      placeholder="INV-XXXXXX"
                      required
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-mono font-bold text-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-900/5 placeholder:text-slate-300 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Settlement Amount</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-lg">{selectedAccount?.currency || 'EUR'}</span>
                    <input
                      type="number"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      placeholder="0.00"
                      required
                      min="0.01"
                      step="0.01"
                      className="w-full pl-20 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-2xl font-mono font-bold text-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-900/5 placeholder:text-slate-200 transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-xs font-bold uppercase tracking-widest">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-brand-900 hover:bg-brand-800 disabled:opacity-50 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl shadow-brand-900/30 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                  {loading ? "Authorizing Settlement..." : "Confirm Institutional Payment"}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {activeTab === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-[3rem] border border-slate-200/50 shadow-sm overflow-hidden"
          >
            <div className="p-10 border-b border-slate-100">
              <h2 className="text-[11px] font-black text-brand-900 uppercase tracking-[0.25em]">Global Settlement Ledger</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {history.length === 0 ? (
                <div className="py-32 text-center">
                  <History className="w-12 h-12 text-slate-100 mx-auto mb-6" />
                  <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No disbursements found</p>
                </div>
              ) : (
                history.map((tx) => (
                  <div key={tx.id} className="px-10 py-8 flex items-center gap-8 hover:bg-slate-50/50 transition-all group">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                      <Receipt className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-bold text-brand-950 truncate mb-1 tracking-tight uppercase">{tx.description || "Institutional Settlement"}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{new Date(tx.created_at).toLocaleString()}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-mono text-slate-400 tracking-tighter uppercase opacity-60">REF: {tx.reference.slice(0, 12)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold font-mono text-brand-950 tracking-tighter">-{formatCurrency(tx.amount)}</p>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-black uppercase tracking-widest mt-2">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Committed
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {success && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-950/80 backdrop-blur-md"
              onClick={resetForm}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] overflow-hidden"
            >
              <div className="bg-brand-900 p-12 text-center relative overflow-hidden">
                <div className="relative z-10">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                    className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-8"
                  >
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </motion.div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Authorized</h2>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Institutional Settlement Success</p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -mr-32 -mt-32" />
              </div>

              <div className="p-10 space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount Settle</span>
                    <span className="text-xl font-mono font-bold text-brand-950">
                      EUR {parseFloat(form.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Beneficiary</span>
                    <span className="text-xs font-bold text-brand-950 uppercase">{form.beneficiary}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Trace ID</span>
                    <span className="text-[10px] font-mono font-bold text-brand-900">{lastTraceId.slice(0, 18)}...</span>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl flex items-start gap-4">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-black text-brand-950 uppercase tracking-widest">Ledger Integrity Verified</p>
                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed mt-1">
                      The institutional settlement has been finalized and committed to the core ledger. Funds have been disbursed to the identified beneficiary.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={resetForm}
                    className="flex-1 py-4 bg-brand-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-brand-950/20 active:scale-95 transition-all"
                  >
                    Done
                  </button>
                  <button className="p-4 bg-slate-50 text-brand-900 rounded-2xl hover:bg-slate-100 transition-colors">
                    <FileText className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
