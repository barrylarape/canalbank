"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Loader2, 
  Check, 
  AlertCircle,
  History,
  Paperclip,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Clock,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  User,
  CheckSquare,
  Square,
  PenTool
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Account {
  id: string;
  account_name: string;
  currency: string;
  balance: number;
}

interface AdjustBalanceProps {
  memberId: string;
  memberName: string;
  accounts: Account[];
}

const CREDIT_REASONS = [
  "Manual Deposit",
  "Cash Deposit",
  "Wire Adjustment",
  "Refund",
  "Interest",
  "Bonus",
  "Loan Disbursement",
  "Administrative"
];

const DEBIT_REASONS = [
  "Service Fee",
  "Administrative Charge",
  "Fraud Recovery",
  "Returned Deposit",
  "Chargeback",
  "Loan Repayment",
  "Manual Withdrawal",
  "Other"
];

export function AdjustBalance({ memberId, memberName, accounts }: AdjustBalanceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") as "credit" | "debit" | null;

  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    accountId: accounts[0]?.id || "",
    amount: "",
    type: typeParam || "credit",
    reason: (typeParam === "debit" ? DEBIT_REASONS[0] : CREDIT_REASONS[0]),
    description: "",
    valueDate: today,
    initiator: "",
    notifyEmail: true,
    notifyPush: true,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeParam && typeParam !== form.type) {
      setForm(f => ({ 
        ...f, 
        type: typeParam,
        reason: typeParam === "debit" ? DEBIT_REASONS[0] : CREDIT_REASONS[0]
      }));
    }
  }, [typeParam, form.type]);

  const selectedAccount = useMemo(() => 
    accounts.find(a => a.id === form.accountId), 
  [accounts, form.accountId]);

  const preview = useMemo(() => {
    if (!selectedAccount) return null;
    const amount = parseFloat(form.amount) || 0;
    const balanceBefore = selectedAccount.balance;
    const balanceAfter = form.type === "credit" 
      ? balanceBefore + amount 
      : balanceBefore - amount;
    
    return {
      before: balanceBefore,
      after: balanceAfter,
      currency: selectedAccount.currency
    };
  }, [selectedAccount, form.amount, form.type]);

  const formatValue = (val: number, currency = "CHF") => {
    if (!isMounted) return `${currency} ${val}`;
    return new Intl.NumberFormat("de-CH", { style: "currency", currency }).format(val);
  };

  const handleStartConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid transaction amount.");
      return;
    }

    if (!form.description || form.description.length < 5) {
      setError("A detailed narration is required for institutional audit logs.");
      return;
    }

    setConfirming(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/adjust-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: memberId,
          ...form,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request submission failed.");

      setSuccess(true);
      setConfirming(false);
      setForm((prev) => ({ ...prev, amount: "", description: "", initiator: "" }));
      setTimeout(() => {
        setSuccess(false);
        router.push(`?tab=operations`);
        router.refresh();
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Adjustment failed");
      setConfirming(false);
    } finally {
      setLoading(false);
    }
  };

  const isCredit = form.type === "credit";
  const activeReasons = isCredit ? CREDIT_REASONS : DEBIT_REASONS;

  if (accounts.length === 0) return null;

  if (confirming) {
    return (
      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="bg-slate-950 px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-accent-500" />
            <h2 className="text-sm font-bold text-white uppercase tracking-tight">Review {isCredit ? 'Credit' : 'Debit'} Adjustment</h2>
          </div>
          <span className="text-[9px] font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            MAKER REVIEW
          </span>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Beneficiary</p>
                <p className="text-sm font-bold text-white">{memberName}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Target Account</p>
                <p className="text-sm font-medium text-slate-300">{selectedAccount?.account_name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Initiated By</p>
                <p className="text-sm font-bold text-accent-500">{form.initiator || 'System Default'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Transaction Amount</p>
                <p className={cn(
                  "text-xl font-mono font-bold",
                  isCredit ? "text-emerald-400" : "text-red-400"
                )}>
                  {selectedAccount?.currency} {isMounted ? parseFloat(form.amount).toLocaleString() : form.amount}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Reason Code</p>
                <p className="text-sm font-medium text-slate-300">{form.reason}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Value Date</p>
                <p className="text-sm font-medium text-slate-300">{form.valueDate}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Narration</p>
            <p className="text-xs text-slate-400 leading-relaxed italic">&quot;{form.description}&quot;</p>
          </div>

          <div className="bg-slate-800/20 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="grid grid-cols-2 divide-x divide-slate-700/50">
              <div className="p-4 text-center">
                <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Balance Before</p>
                <p className="text-sm font-mono text-slate-400">{formatValue(preview?.before ?? 0, preview?.currency)}</p>
              </div>
              <div className={cn("p-4 text-center", isCredit ? "bg-emerald-500/5" : "bg-red-500/5")}>
                <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Balance After</p>
                <p className={cn("text-sm font-mono font-bold", isCredit ? "text-emerald-400" : "text-red-400")}>
                  {formatValue(preview?.after ?? 0, preview?.currency)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-500/80 leading-relaxed font-medium">
              NOTICE: This request is subject to <span className="text-white">MAKER-CHECKER</span> dual-control. A supervisor or checker must authorize this event before funds are posted to the core ledger.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setConfirming(false)}
              className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={cn(
                "flex-[2] py-3.5 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-lg flex items-center justify-center gap-2",
                isCredit ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/40" : "bg-red-600 hover:bg-red-700 shadow-red-900/40"
              )}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              Submit for Approval
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
      <div className={cn(
        "px-6 py-5 border-b border-slate-700/50 flex items-center justify-between transition-colors duration-300",
        isCredit ? "bg-emerald-500/5" : "bg-red-500/5"
      )}>
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <History className={cn("w-4 h-4", isCredit ? "text-emerald-500" : "text-red-500")} /> 
            Manual {isCredit ? "Credit" : "Debit"} Adjustment
          </h2>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-semibold">
            Institutional Control · Maker-Checker Protocol
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-700" />
          <span className="text-[10px] font-bold text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            AUDITED
          </span>
        </div>
      </div>

      <form onSubmit={handleStartConfirmation} className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Beneficiary
              </label>
              <div className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="w-8 h-8 rounded bg-accent-600/10 flex items-center justify-center text-accent-500">
                  <User className="w-4 h-4" />
                </div>
                <p className="text-sm font-bold text-white">{memberName}</p>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Initiator Name
              </label>
              <div className="relative">
                <PenTool className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  value={form.initiator}
                  onChange={(e) => setForm({ ...form, initiator: e.target.value })}
                  placeholder="Initiated by preferred name"
                  className="w-full bg-slate-950 border border-slate-700/50 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-200 focus:ring-2 focus:ring-accent-600/20 placeholder:text-slate-700 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Destination Account
              </label>
              <select
                value={form.accountId}
                onChange={(e) => setForm({ ...form, accountId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 focus:ring-2 focus:ring-accent-600/20 transition-all font-medium appearance-none"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.account_name} ({acc.currency})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Amount
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">
                    {selectedAccount?.currency}
                  </div>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full bg-slate-950 border border-slate-700/50 rounded-xl pl-16 pr-4 py-3 text-sm text-slate-200 focus:ring-2 focus:ring-accent-600/20 placeholder:text-slate-800 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Value Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={form.valueDate}
                    onChange={(e) => setForm({ ...form, valueDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700/50 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-200 focus:ring-2 focus:ring-accent-600/20 appearance-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Reason Code
              </label>
              <select
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 focus:ring-2 focus:ring-accent-600/20 transition-all font-medium appearance-none"
              >
                {activeReasons.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Reference
              </label>
              <div className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                AUTO-GENERATE
                <span className="text-[9px] text-amber-500/50 px-1.5 py-0.5 rounded border border-amber-500/20 bg-amber-500/5">PENDING</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Narration
              </label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter detailed audit justification..."
                className="w-full bg-slate-950 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 focus:ring-2 focus:ring-accent-600/20 placeholder:text-slate-800 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Supporting Documentation
            </label>
            <button
              type="button"
              className="w-full py-4 bg-slate-950 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-slate-700 transition-colors group"
            >
              <Paperclip className="w-5 h-5 text-slate-600 group-hover:text-slate-400" />
              <span className="text-[10px] font-bold text-slate-600 uppercase">Upload PDF Document</span>
            </button>
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Notification Channels
            </label>
            <div className="flex gap-4">
              <label className="flex-1 flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={form.notifyEmail} 
                  onChange={() => setForm(f => ({ ...f, notifyEmail: !f.notifyEmail }))} 
                />
                {form.notifyEmail ? <CheckSquare className="w-4 h-4 text-accent-500" /> : <Square className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />}
                <span className="text-[10px] font-bold text-slate-400 uppercase">Email Confirmation</span>
              </label>
              <label className="flex-1 flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={form.notifyPush} 
                  onChange={() => setForm(f => ({ ...f, notifyPush: !f.notifyPush }))} 
                />
                {form.notifyPush ? <CheckSquare className="w-4 h-4 text-accent-500" /> : <Square className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />}
                <span className="text-[10px] font-bold text-slate-400 uppercase">App Notification</span>
              </label>
            </div>
          </div>
        </div>

        {preview && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-inner">
            <div className="grid grid-cols-2 divide-x divide-slate-800">
              <div className="p-4 flex flex-col items-center">
                <span className="text-[9px] font-bold text-slate-600 uppercase mb-1">Balance Before</span>
                <p className="text-sm font-mono text-slate-400">
                  {formatValue(preview.before, preview.currency)}
                </p>
              </div>
              <div className={cn(
                "p-4 flex flex-col items-center transition-colors",
                isCredit ? "bg-emerald-500/5" : "bg-red-500/5"
              )}>
                <span className="text-[9px] font-bold text-slate-600 uppercase mb-1">Balance After</span>
                <div className="flex items-center gap-1.5">
                  <p className={cn(
                    "text-sm font-bold font-mono",
                    isCredit ? "text-emerald-400" : "text-red-400"
                  )}>
                    {formatValue(preview.after, preview.currency)}
                  </p>
                  {isCredit ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs leading-relaxed">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.push('?tab=operations')}
            className="flex-1 py-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-500 uppercase hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || success}
            className={cn(
              "flex-[2] py-4 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 shadow-xl",
              success
                ? "bg-emerald-600 text-white"
                : isCredit 
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30"
                  : "bg-red-600 hover:bg-red-700 text-white shadow-red-600/30"
            )}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : success ? (
              <>
                <Check className="w-5 h-5" /> Request Submitted
              </>
            ) : (
              <>
                Submit for Approval <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="px-6 py-4 bg-slate-800/20 border-t border-slate-700/50 flex items-center gap-3">
        <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
          Note: This operation initiates a pending ledger entry. Once submitted, the event must be authorized by a different officer (Checker) before funds are posted to the core ledger.
        </p>
      </div>
    </div>
  );
}
