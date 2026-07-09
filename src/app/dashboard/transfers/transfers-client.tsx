"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeftRight, 
  Send, 
  Globe, 
  Repeat, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  X,
  ChevronRight,
  ShieldCheck,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const TRANSFER_TYPES = [
  { id: "internal", label: "Between My Accounts", icon: Repeat, desc: "Free & Instant" },
  { id: "domestic", label: "Domestic Wire", icon: Send, desc: "Same day" },
  { id: "international", label: "International Wire", icon: Globe, desc: "1-3 business days" },
];

type Account = {
  id: string;
  account_name: string;
  account_number: string;
  balance: number;
  available_balance: number;
  currency: string;
  account_type: string;
};

interface TransfersClientProps {
  accounts: Account[];
  userId: string;
}

function formatCurrency(amount: number, currency = "EUR") {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency }).format(amount);
}

export function TransfersClient({ accounts, userId }: TransfersClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [transferType, setTransferType] = useState("internal");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lastTraceId, setLastTraceId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    from: "",
    to: "",
    amount: "",
    note: "",
    recipientName: "",
    iban: "",
    swift: "",
    currency: "EUR",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/transfers/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: transferType,
          fromAccountId: form.from,
          toAccountId: form.to,
          amount: form.amount,
          recipientName: form.recipientName,
          iban: form.iban,
          note: form.note,
          swift: form.swift,
          currency: form.currency
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Transfer failed.");

      setLastTraceId(data.traceId);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transfer failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setError(null);
    setForm({ from: "", to: "", amount: "", note: "", recipientName: "", iban: "", swift: "", currency: "EUR" });
  };

  const fromAccount = accounts.find((a) => a.id === form.from);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-brand-950 uppercase tracking-tight">Funds Transfer</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Move capital across the global ledger</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {TRANSFER_TYPES.map((type) => {
          const Icon = type.icon;
          const active = transferType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => setTransferType(type.id)}
              className={cn(
                "p-6 rounded-[2rem] border-2 text-left transition-all duration-500 group relative overflow-hidden",
                active
                  ? "border-brand-900 bg-brand-50"
                  : "border-slate-100 bg-white hover:border-brand-200"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500",
                  active
                    ? "bg-brand-900 text-white shadow-lg shadow-brand-900/20"
                    : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <p className={cn("font-black text-xs uppercase tracking-widest", active ? "text-brand-950" : "text-slate-400")}>
                {type.label}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                {type.desc}
              </p>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-start gap-4 p-5 bg-red-50 border border-red-100 rounded-[1.5rem] text-red-600 text-xs font-bold uppercase tracking-widest"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="mt-0.5 leading-relaxed">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_20px_50px_rgba(0,0,0,0.02)] p-8 space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
              Source Account
            </label>
            <select
              value={form.from}
              onChange={(e) => update("from", e.target.value)}
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-900/5 transition-all appearance-none"
            >
              <option value="">Select funding entity</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.account_name} ({isMounted ? formatCurrency(acc.available_balance, acc.currency) : acc.available_balance})
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
              {transferType === "internal" ? "Destination Account" : "Target Currency"}
            </label>
            {transferType === "internal" ? (
              <select
                value={form.to}
                onChange={(e) => update("to", e.target.value)}
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-900/5 transition-all appearance-none"
              >
                <option value="">Select recipient entity</option>
                {accounts
                  .filter((acc) => acc.id !== form.from)
                  .map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.account_name}
                    </option>
                  ))}
              </select>
            ) : (
              <select
                value={form.currency}
                onChange={(e) => update("currency", e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-900/5 transition-all appearance-none"
              >
                <option value="EUR">🇪🇺 EUR — Euro</option>
                <option value="USD">🇺🇸 USD — US Dollar</option>
                <option value="GBP">🇬🇧 GBP — British Pound</option>
                <option value="CHF">🇨🇭 CHF — Swiss Franc</option>
              </select>
            )}
          </div>
        </div>

        {(transferType === "domestic" || transferType === "international") && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-6 overflow-hidden"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                Beneficiary Name
              </label>
              <input
                type="text"
                value={form.recipientName}
                onChange={(e) => update("recipientName", e.target.value)}
                placeholder="Institutional or Personal Name"
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-900/5 placeholder:text-slate-300 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                IBAN / Account Identifier
              </label>
              <input
                type="text"
                value={form.iban}
                onChange={(e) => update("iban", e.target.value)}
                placeholder="CH93 0000 0000 0000 0000 0"
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-mono font-bold text-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-900/5 placeholder:text-slate-300 transition-all"
              />
            </div>
            {transferType === "international" && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                  SWIFT / BIC Code
                </label>
                <input
                  type="text"
                  value={form.swift}
                  onChange={(e) => update("swift", e.target.value)}
                  placeholder="CANACHZH..."
                  required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-mono font-bold text-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-900/5 placeholder:text-slate-300 transition-all"
                />
              </div>
            )}
          </motion.div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
            Transaction Amount
          </label>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-lg">
              {transferType === "internal" ? (fromAccount?.currency ?? "EUR") : form.currency}
            </span>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => update("amount", e.target.value)}
              placeholder="0.00"
              required
              min="0.01"
              step="0.01"
              className="w-full pl-20 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-2xl font-mono font-bold text-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-900/5 placeholder:text-slate-200 transition-all"
            />
          </div>
          {fromAccount && (
            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-2 ml-1">
              Available to move: {isMounted ? formatCurrency(fromAccount.available_balance, fromAccount.currency) : fromAccount.available_balance}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
            Narration / Reference (Optional)
          </label>
          <input
            type="text"
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
            placeholder="Institutional Reference"
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-900/5 placeholder:text-slate-300 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading || accounts.length === 0}
          className="w-full py-5 bg-brand-900 hover:bg-brand-800 disabled:opacity-50 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl shadow-brand-900/30 flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Authorizing...
            </>
          ) : (
            <>
              Initialize Transfer <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

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
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                  </motion.div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Authorized</h2>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Institutional Execution Success</p>
                </div>
                {/* Visual texture */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -mr-32 -mt-32" />
              </div>

              <div className="p-10 space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount Disbursed</span>
                    <span className="text-xl font-mono font-bold text-brand-950">
                      {form.currency} {parseFloat(form.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recipient</span>
                    <span className="text-xs font-bold text-brand-950 uppercase">{transferType === 'internal' ? 'Primary Account' : form.recipientName}</span>
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
                      This transaction has been successfully committed to the Canal Bank global ledger and signed with institutional encryption.
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
