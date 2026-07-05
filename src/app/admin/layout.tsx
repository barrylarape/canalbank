import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";
import { RealtimeProvider } from "@/components/realtime-provider";
import { RealtimeInspector } from "@/components/admin/realtime-inspector";
import { PageTransition } from "@/components/ui/page-transition";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirected=true");
  }

  const { data } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const profile = data as { role: string; full_name: string | null } | null;

  // Double-check role server-side
  if (profile?.role !== "admin" && profile?.role !== "supervisor" && profile?.role !== "executive") {
    redirect("/dashboard");
  }

  const adminName = profile?.full_name ?? user.email ?? null;

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <AdminSidebar adminName={adminName} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader adminName={adminName} />
        <RealtimeProvider>
          <main className="flex-1 p-6 lg:p-8 overflow-auto">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <RealtimeInspector />
        </RealtimeProvider>
      </div>
    </div>
  );
}
