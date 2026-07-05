"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  UserPlus,
  Loader2,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ACCOUNT_OPTIONS = [
  {
    value: "checking",
    label: "Everyday Checking",
    desc: "Daily transactions & debit card",
    icon: "💳",
  },
  {
    value: "savings",
    label: "High Yield Savings",
    desc: "3.25% APY interest rate",
    icon: "🏦",
  },
  {
    value: "investment",
    label: "Investment Portfolio",
    desc: "Stocks, ETFs, and funds",
    icon: "📈",
  },
];

export default function RegisterMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [seedDemo, setSeedDemo] = useState(true);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([
    "checking",
    "savings",
  ]);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "customer" as "customer" | "admin",
    kycStatus: "approved" as "pending" | "approved" | "rejected",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleAccount = (val: string) =>
    setSelectedAccounts((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.fullName || !form.email || !form.password) {
      return setError("Full name, email and password are required.");
    }
    if (form.password.length < 8) {
      return setError("Password must be at least 8 characters.");
    }

    setLoading(true);

    const res = await fetch("/api/admin/create-member", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
        kycStatus: form.kycStatus,
        seedDemo,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Failed to create member.");
    } else {
      setSuccess(
        `Member "${form.fullName}" created successfully!${
          seedDemo ? " Demo data has been seeded." : ""
        }`
      );
      setTimeout(() => router.push(`/admin/members/${data.userId}`), 1500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/members"
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Members
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-white">Register New Member</h1>
        <p className="text-slate-400 text-sm mt-1">
          Create a new customer account. The member can log in immediately using
          the credentials you set.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal Info */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white border-b border-slate-700/50 pb-3 mb-4">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                placeholder="Maria Schneider"
                className="w-full px-3.5 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-accent-500/50 focus:border-accent-500/50 text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+41 79 123 45 67"
                className="w-full px-3.5 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-accent-500/50 focus:border-accent-500/50 text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="maria@example.com"
              className="w-full px-3.5 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-accent-500/50 focus:border-accent-500/50 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full px-3.5 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-accent-500/50 focus:border-accent-500/50 text-sm pr-10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Role & KYC */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white border-b border-slate-700/50 pb-3 mb-4">
            Account Configuration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) =>
                  update("role", e.target.value)
                }
                className="w-full px-3.5 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent-500/50 text-sm transition-all"
              >
                <option value="customer">Customer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                KYC Status
              </label>
              <select
                value={form.kycStatus}
                onChange={(e) => update("kycStatus", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent-500/50 text-sm transition-all"
              >
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Demo Data */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white border-b border-slate-700/50 pb-3 mb-4">
            Demo Data
          </h2>

          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="mt-0.5">
              <div
                onClick={() => setSeedDemo(!seedDemo)}
                className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                  seedDemo
                    ? "bg-accent-600 border-accent-600"
                    : "border-slate-600 group-hover:border-slate-500"
                )}
              >
                {seedDemo && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">
                Seed demo banking data
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Pre-populate accounts, transactions, cards, loans, and investments
                so the member has a realistic starting experience.
              </p>
            </div>
            <Database className="w-4 h-4 text-slate-500 mt-0.5 ml-auto flex-shrink-0" />
          </label>
        </div>

        {/* Feedback */}
        {error && (
          <div className="flex items-start gap-2 p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            <Check className="w-4 h-4 flex-shrink-0" />
            {success}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !!success}
          className="w-full flex items-center justify-center gap-2 py-3 bg-accent-600 hover:bg-accent-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-lg shadow-accent-600/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating member...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Create Member Account
            </>
          )}
        </button>
      </form>
    </div>
  );
}
