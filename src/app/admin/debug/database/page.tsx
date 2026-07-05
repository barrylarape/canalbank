import { createClient } from "@/lib/supabase/server";
import { Terminal, Database as DbIcon, ShieldAlert, History, Users, Activity, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Phase 5 & 9: Live Query Inspector & Audit Visualization
 * Provides raw database state visibility for diagnostic verification.
 */
export default async function DatabaseDebugPage() {
  const supabase = await createClient();

  // Primary data fetch - Capturing full response for diagnostics
  const [
    transactionsRes,
    accountsRes,
    profilesRes,
    auditLogsRes
  ] = await Promise.all([
    // Raw ledger entries
    supabase.from("transactions")
      .select("*", { count: "exact" })
      .not("category", "eq", "system_audit")
      .order("created_at", { ascending: false })
      .limit(20),
    
    // Raw account balances
    supabase.from("accounts").select("*", { count: "exact" }).limit(20),
    
    // Raw member profiles
    supabase.from("profiles").select("*", { count: "exact" }).limit(20),
    
    // Phase 9: Persistent Server Audit Logs
    supabase.from("transactions")
      .select("*", { count: "exact" })
      .eq("category", "system_audit")
      .order("created_at", { ascending: false })
      .limit(30)
  ]);

  // DIAGNOSTIC LOGGING
  console.log("--- LIVE QUERY INSPECTOR DIAGNOSTICS ---");
  console.log("Transactions:", { 
    error: transactionsRes.error, 
    count: transactionsRes.count, 
    rows: transactionsRes.data?.length 
  });
  console.log("Accounts:", { 
    error: accountsRes.error, 
    count: accountsRes.count, 
    rows: accountsRes.data?.length 
  });
  console.log("Profiles:", { 
    error: profilesRes.error, 
    count: profilesRes.count, 
    rows: profilesRes.data?.length 
  });
  console.log("Audit Logs:", { 
    error: auditLogsRes.error, 
    count: auditLogsRes.count, 
    rows: auditLogsRes.data?.length 
  });

  const sections = [
    { 
      title: "System Audit Logs (Phase 9)", 
      icon: Activity, 
      data: auditLogsRes.data, 
      error: auditLogsRes.error,
      count: auditLogsRes.count,
      color: "text-purple-400" 
    },
    { 
      title: "Recent Transactions (Raw Ledger)", 
      icon: History, 
      data: transactionsRes.data, 
      error: transactionsRes.error,
      count: transactionsRes.count,
      color: "text-accent-500" 
    },
    { 
      title: "Account Entities", 
      icon: DbIcon, 
      data: accountsRes.data, 
      error: accountsRes.error,
      count: accountsRes.count,
      color: "text-blue-400" 
    },
    { 
      title: "Member Profiles", 
      icon: Users, 
      data: profilesRes.data, 
      error: profilesRes.error,
      count: profilesRes.count,
      color: "text-emerald-400" 
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Terminal className="w-7 h-7 text-accent-500" />
            Live Query Inspector
          </h1>
          <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-semibold">
            Institutional Diagnostic Tool · Raw Table State · Admin Only
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {sections.map((section) => (
          <div key={section.title} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50 flex items-center gap-3">
              <section.icon className={cn("w-5 h-5", section.color)} />
              <h2 className="text-sm font-bold text-white uppercase tracking-tight">{section.title}</h2>
              <div className="ml-auto flex items-center gap-4">
                <span className="text-[10px] font-mono text-slate-500">
                  COUNT: {section.count ?? 0}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  FETCHED: {section.data?.length || 0}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              {section.error ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-red-400 uppercase">Query Error Detected</p>
                    <p className="text-[11px] font-mono text-red-500/80 mt-1">{section.error.message}</p>
                    <p className="text-[10px] text-slate-500 mt-2">Check RLS policies or database permissions.</p>
                  </div>
                </div>
              ) : (
                <pre className="text-[10px] font-mono text-emerald-400/80 bg-slate-950 p-4 rounded-xl overflow-auto max-h-[400px] border border-slate-800 scrollbar-thin scrollbar-thumb-slate-800">
                  {JSON.stringify(section.data, null, 2)}
                </pre>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
