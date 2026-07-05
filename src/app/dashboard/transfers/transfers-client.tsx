"use client";

import { useState, useEffect } from "react";
import { ArrowLeftRight, Send, Globe, Repeat, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

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

function formatCurrency(amount: number, currency = "CHF") {
  return new Intl.NumberFormat("de-CH", { style: "currency", currency }).format(amount);
}

export function TransfersClient({ accounts, userId }: TransfersClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [transferType, setTransferType] = useState("internal");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    from: "",
    to: "",
    amount: "",
    note: "",
    recipientName: "",
    iban: "",
    swift: "",
    currency: "CHF",
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

    const amount = parseFloat(form.amount);

    try {
      if (transferType === "internal") {
        if (!form.from || !form.to) {
          setError("Please select both accounts.");
          setLoading(false);
          return;
        }
        if (form.from === form.to) {
          setError("Cannot transfer to the same account.");
          setLoading(false);
          return;
        }

        const fromAccount = accounts.find((a) => a.id === form.from);
        const toAccount = accounts.find((a) => a.id === form.to);

        if (!fromAccount || !toAccount) {
          setError("Account not found.");
          setLoading(false);
          return;
        }
        if (fromAccount.available_balance < amount) {
          setError(
            `Insufficient funds. Available balance: ${formatCurrency(fromAccount.available_balance, fromAccount.currency)}`
          );
          setLoading(false);
          return;
        }

        const supabase = createClient();
        // Use UUID for institutional uniqueness
        const ref = crypto.randomUUID();
        const newFromBalance = fromAccount.balance - amount;
        const newToBalance = toAccount.balance + amount;

        const { error: debitErr } = await supabase.from("transactions").insert({
          account_id: fromAccount.id,
          user_id: userId,
          transaction_type: "debit",
          category: "transfer",
          description: `Transfer to ${toAccount.account_name}`,
          amount,
          balance_after: newFromBalance,
          reference: ref,
          status: "completed",
          counterparty_name: toAccount.account_name,
        });
        if (debitErr) throw new Error(debitErr.message);

        const { error: creditErr } = await supabase.from("transactions").insert({
          account_id: toAccount.id,
          user_id: userId,
          transaction_type: "credit",
          category: "transfer",
          description: `Transfer from ${fromAccount.account_name}`,
          amount,
          balance_after: newToBalance,
          reference: ref,
          status: "completed",
          counterparty_name: fromAccount.account_name,
        });
        if (creditErr) throw new Error(creditErr.message);

        await supabase
          .from("accounts")
          .update({
            balance: newFromBalance,
            available_balance: fromAccount.available_balance - amount,
          })
          .eq("id", fromAccount.id);

        await supabase
          .from("accounts")
          .update({
            balance: newToBalance,
            available_balance: toAccount.available_balance + amount,
          })
          .eq("id", toAccount.id);
      } else {
        if (!form.from || !form.recipientName || !form.iban) {
          setError("Please fill in all required fields.");
          setLoading(false);
          return;
        }

        const fromAccount = accounts.find((a) => a.id === form.from);
        if (!fromAccount) {
          setError("Account not found.");
          setLoading(false);
          return;
        }
        if (fromAccount.available_balance < amount) {
          setError(
            `Insufficient funds. Available balance: ${formatCurrency(fromAccount.available_balance, fromAccount.currency)}`
          );
          setLoading(false);
          return;
        }

        const supabase = createClient();
        const newBalance = fromAccount.balance - amount;
        const description =
          transferType === "international"
            ? `International wire to ${form.recipientName}`
            : `Domestic wire to ${form.recipientName}`;

        const { error: txErr } = await supabase.from("transactions").insert({
          account_id: fromAccount.id,
          user_id: userId,
          transaction_type: "debit",
          category: "transfer",
          description,
          amount,
          balance_after: newBalance,
          // Use IBAN as reference but fallback to UUID if needed for uniqueness
          reference: form.iban.replace(/\s/g, "").toUpperCase(),
          status: "pending",
          counterparty_name: form.recipientName,
        });
        if (txErr) throw new Error(txErr.message);

        await supabase
          .from("accounts")
          .update({ available_balance: fromAccount.available_balance - amount })
          .eq("id", fromAccount.id);
      }

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
    setForm({ from: "", to: "", amount: "", note: "", recipientName: "", iban: "", swift: "", currency: "CHF" });
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto pt-12 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-brand-950 mb-2">Transfer Submitted!</h2>
        <p className="text-slate-500 mb-8">
          Your transfer of <strong>
            {form.currency} {isMounted ? parseFloat(form.amount).toLocaleString("de-CH", { minimumFractionDigits: 2 }) : form.amount}
          </strong>{" "}
          has been submitted and is being processed.
        </p>
        <button
          onClick={resetForm}
          className="bg-brand-900 hover:bg-brand-800 text-white px-8 py-3 rounded-xl font-medium transition-colors"
        >
          Make Another Transfer
        </button>
      </div>
    );
  }

  const fromAccount = accounts.find((a) => a.id === form.from);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-brand-950">Transfer Money</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {TRANSFER_TYPES.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setTransferType(type.id)}
              className={cn(
                "p-4 rounded-2xl border-2 text-left transition-all",
                transferType === type.id
                  ? "border-brand-800 bg-brand-50"
                  : "border-slate-200 bg-white hover:border-brand-300"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
                  transferType === type.id
                    ? "bg-brand-900 text-white"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <p
                className={cn(
                  "font-semibold text-sm",
                  transferType === type.id ? "text-brand-950" : "text-slate-700"
                )}
              >
                {type.label}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{type.desc}</p>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              From Account
            </label>
            <select
              value={form.from}
              onChange={(e) => update("from", e.target.value)}
              required
              className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 bg-white"
            >
              <option value="">Select account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.account_name} ({isMounted ? formatCurrency(acc.available_balance, acc.currency) : acc.available_balance})
                </option>
              ))}
            </select>
            {fromAccount && (
              <p className="text-xs text-slate-400 mt-1">
                Available: {isMounted ? formatCurrency(fromAccount.available_balance, fromAccount.currency) : fromAccount.available_balance}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {transferType === "internal" ? "To Account" : "Currency"}
            </label>
            {transferType === "internal" ? (
              <select
                value={form.to}
                onChange={(e) => update("to", e.target.value)}
                required
                className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 bg-white"
              >
                <option value="">Select account</option>
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
                className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 bg-white"
              >
                <option value="CHF">🇨🇭 CHF — Swiss Franc</option>
                <option value="USD">🇺🇸 USD — US Dollar</option>
                <option value="EUR">🇪🇺 EUR — Euro</option>
                <option value="GBP">🇬🇧 GBP — British Pound</option>
              </select>
            )}
          </div>
        </div>

        {(transferType === "domestic" || transferType === "international") && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Recipient Name
              </label>
              <input
                type="text"
                value={form.recipientName}
                onChange={(e) => update("recipientName", e.target.value)}
                placeholder="John Doe"
                required
                className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                IBAN / Account Number
              </label>
              <input
                type="text"
                value={form.iban}
                onChange={(e) => update("iban", e.target.value)}
                placeholder="CH93 0076 2011 6238 5295 7"
                required
                className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
            {transferType === "international" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  SWIFT / BIC Code
                </label>
                <input
                  type="text"
                  value={form.swift}
                  onChange={(e) => update("swift", e.target.value)}
                  placeholder="UBSWCHZH80A"
                  required
                  className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>
            )}
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Amount ({transferType === "internal" ? (fromAccount?.currency ?? "CHF") : form.currency})
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">
              {transferType === "internal" ? (fromAccount?.currency ?? "CHF") : form.currency}
            </span>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => update("amount", e.target.value)}
              placeholder="0.00"
              required
              min="0.01"
              step="0.01"
              className="w-full pl-14 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Note / Reference (optional)
          </label>
          <input
            type="text"
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
            placeholder="Rent payment, Invoice #123..."
            className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
        </div>

        {accounts.length === 0 && (
          <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            No active accounts found. Please contact your relationship manager.
          </p>
        )}

        <button
          type="submit"
          disabled={loading || accounts.length === 0}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-900 hover:bg-brand-800 disabled:opacity-50 text-white rounded-xl font-medium text-sm transition-colors shadow-lg shadow-brand-900/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Processing...
            </>
          ) : (
            <>
              <ArrowLeftRight className="w-4 h-4" /> Transfer Funds
            </>
          )}
        </button>
      </form>
    </div>
  );
}
