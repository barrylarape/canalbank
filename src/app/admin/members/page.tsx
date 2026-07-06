"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  Search,
  UserPlus,
  ChevronRight,
  Filter,
  Users,
  Check,
  X,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: "customer" | "admin" | "supervisor" | "executive";
  kyc_status: "pending" | "approved" | "rejected";
  created_at: string;
  account_count?: number;
};

const KYC_FILTERS = ["all", "pending", "approved", "rejected"] as const;

function KycBadge({ status }: { status: string }) {
  const config: Record<string, { style: string; icon: any }> = {
    approved: { 
      style: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_2px_8px_rgba(16,185,129,0.08)]", 
      icon: Check 
    },
    pending: { 
      style: "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_2px_8px_rgba(245,158,11,0.08)]", 
      icon: Clock 
    },
    rejected: { 
      style: "bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_2px_8px_rgba(239,68,68,0.08)]", 
      icon: X 
    },
  };
  
  const { style, icon: Icon } = config[status] ?? config.pending;
  
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest transition-all", style)}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

export default function AdminMembersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [kycFilter, setKycFilter] = useState<(typeof KYC_FILTERS)[number]>("all");

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase
      .from("profiles")
      .select("*")
      .eq("role", "customer")
      .order("created_at", { ascending: false });

    if (kycFilter !== "all") {
      query = query.eq("kyc_status", kycFilter);
    }

    const { data } = await query;

    // Fetch account counts
    if (data && data.length > 0) {
      const { data: accounts } = await supabase
        .from("accounts")
        .select("user_id");

      const countMap: Record<string, number> = {};
      // Casting to any[] to avoid 'never' inference error during build
      (accounts as any[] | null)?.forEach((a) => {
        countMap[a.user_id] = (countMap[a.user_id] ?? 0) + 1;
      });

      setProfiles(
        (data as Profile[]).map((p) => ({ ...p, account_count: countMap[p.id] ?? 0 }))
      );
    } else {
      setProfiles([]);
    }
    setLoading(false);
  }, [kycFilter]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const filtered = profiles.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.full_name?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q)
    );
  });

  const counts = {
    all: profiles.length,
    pending: profiles.filter((p) => p.kyc_status === "pending").length,
    approved: profiles.filter((p) => p.kyc_status === "approved").length,
    rejected: profiles.filter((p) => p.kyc_status === "rejected").length,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Members</h1>
          <p className="text-slate-400 text-sm mt-1">
            {profiles.length} registered customer{profiles.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/members/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-accent-600 hover:bg-accent-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-accent-600/20"
        >
          <UserPlus className="w-4 h-4" />
          Register Member
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none flex-1"
          />
        </div>

        {/* KYC filter tabs */}
        <div className="flex items-center gap-1 bg-slate-900/50 border border-slate-700/50 rounded-lg p-1">
          <Filter className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
          {KYC_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setKycFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize",
                kycFilter === f
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              {f}{" "}
              <span className="opacity-60">{counts[f]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <div className="w-8 h-8 border-2 border-slate-600 border-t-accent-500 rounded-full animate-spin" />
              <span className="text-sm">Loading members...</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Users className="w-10 h-10 text-slate-600" />
            <p className="text-slate-400 text-sm">
              {search ? "No members match your search" : "No members yet"}
            </p>
            {!search && (
              <Link
                href="/admin/members/new"
                className="text-accent-400 text-sm hover:text-accent-300 transition-colors"
              >
                Register your first member →
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">
                    Contact
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    KYC
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">
                    Accounts
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">
                    Joined
                  </th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {filtered.map((p) => {
                  const initials = p.full_name
                    ? p.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : p.email?.[0]?.toUpperCase() ?? "?";
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-700/20 transition-colors group"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-300 flex-shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-200">
                              {p.full_name ?? "—"}
                            </p>
                            <p className="text-xs text-slate-500 md:hidden">
                              {p.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="text-sm text-slate-300">{p.email}</p>
                        <p className="text-xs text-slate-500">{p.phone ?? "—"}</p>
                      </td>
                      <td className="px-5 py-4">
                        <KycBadge status={p.kyc_status} />
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-sm text-slate-300">
                          {p.account_count ?? 0}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-sm text-slate-400">
                          {new Date(p.created_at).toLocaleDateString("en-CH", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/members/${p.id}`}
                          className="flex items-center gap-1 text-xs text-slate-500 hover:text-accent-400 transition-colors group-hover:text-slate-300"
                        >
                          View
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
