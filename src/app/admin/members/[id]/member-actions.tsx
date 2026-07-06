"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Clock, ShieldCheck, Loader2, Check, ShieldAlert } from "lucide-react";

interface MemberActionsProps {
  memberId: string;
  currentKyc: "pending" | "approved" | "rejected";
  currentRole: "customer" | "admin" | "supervisor" | "executive";
}

export function MemberActions({
  memberId,
  currentKyc,
  currentRole,
}: MemberActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const update = async (payload: Record<string, string>, label: string) => {
    setLoading(label);
    setSuccess(null);
    const res = await fetch("/api/admin/update-member", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: memberId, ...payload }),
    });
    setLoading(null);
    if (res.ok) {
      setSuccess(label);
      setTimeout(() => {
        setSuccess(null);
        router.refresh();
      }, 1200);
    }
  };

  const kycActions: {
    label: string;
    status: "pending" | "approved" | "rejected";
    icon: React.ElementType;
    style: string;
    disabled: boolean;
  }[] = [
    {
      label: "Approve KYC",
      status: "approved",
      icon: CheckCircle2,
      style: "text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/20",
      disabled: currentKyc === "approved",
    },
    {
      label: "Set Pending",
      status: "pending",
      icon: Clock,
      style: "text-amber-400 hover:bg-amber-500/10 border-amber-500/20",
      disabled: currentKyc === "pending",
    },
    {
      label: "Reject KYC",
      status: "rejected",
      icon: XCircle,
      style: "text-red-400 hover:bg-red-500/10 border-red-500/20",
      disabled: currentKyc === "rejected",
    },
  ];

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5" /> Institutional Access
      </h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Compliance Status</p>
          {kycActions.map((action) => {
            const Icon = action.icon;
            const isLoading = loading === action.label;
            const isDone = success === action.label;
            return (
              <button
                key={action.label}
                onClick={() => update({ kycStatus: action.status }, action.label)}
                disabled={action.disabled || !!loading}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${action.style} border-current/20 border-opacity-20`}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isDone ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
                {action.label}
              </button>
            );
          })}
        </div>

        <div className="border-t border-slate-700/50 pt-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Institutional Role</p>
          <div className="grid grid-cols-1 gap-2">
            {[
              { r: "customer", label: "Standard Client", icon: Clock },
              { r: "admin", label: "Banking Admin", icon: ShieldCheck },
              { r: "supervisor", label: "Financial Supervisor", icon: ShieldAlert },
              { r: "executive", label: "Managing Executive", icon: ShieldCheck },
            ].map((role) => (
              <button
                key={role.r}
                onClick={() => update({ role: role.r }, `set-${role.r}`)}
                disabled={currentRole === role.r || !!loading}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-[11px] font-bold uppercase transition-all ${
                  currentRole === role.r 
                    ? "bg-accent-600/10 border-accent-600/30 text-accent-400" 
                    : "border-slate-700/50 text-slate-500 hover:bg-slate-700/30 hover:text-white"
                }`}
              >
                {loading === `set-${role.r}` ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : success === `set-${role.r}` ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <role.icon className="w-3 h-3" />
                )}
                {role.label}
                {currentRole === role.r && <span className="ml-auto text-[8px] opacity-60">ACTIVE</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}