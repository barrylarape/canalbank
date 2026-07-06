'use server';

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

/**
 * Institutional Authentication Action
 * Resolves dual identifiers (Email or IBAN) and establishes a secure session.
 */
export async function loginAction(identifier: string, password: string) {
  if (!identifier || !password) {
    return { error: "Missing institutional credentials." };
  }

  let resolvedEmail = identifier.trim();

  // Resolution Engine: Detect Swiss IBAN format (CH...)
  if (!identifier.includes("@") && identifier.trim().toUpperCase().startsWith("CH")) {
    try {
      const adminClient = createAdminClient();
      const cleanInput = identifier.replace(/\s/g, "").toUpperCase();
      
      // Access the core accounts ledger to map IBAN to Member ID
      const { data: accounts, error: lookupError } = await adminClient
        .from("accounts")
        .select("user_id, account_number");

      if (lookupError) throw lookupError;

      // Match against normalized account numbers
      const foundAccount = accounts?.find(
        (a) => a.account_number.replace(/\s/g, "").toUpperCase() === cleanInput
      );

      if (foundAccount) {
        // Resolve private email for the identified member
        const { data: profile } = await adminClient
          .from("profiles")
          .select("email")
          .eq("id", foundAccount.user_id)
          .single();
        
        if (profile?.email) {
          resolvedEmail = profile.email;
        }
      }
    } catch (e) {
      // Fail silently to resolution fallback (original identifier) to prevent enumeration
      console.error("Resolution error:", e);
    }
  }

  const supabase = await createClient();
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: resolvedEmail,
    password,
  });

  if (authError) {
    return { error: "Access Denied: Invalid identifier or password." };
  }

  // Determine redirection path based on institutional role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .single();

  const path = (profile as any)?.role === "admin" ? "/admin" : "/dashboard";
  
  // Handover to Next.js router
  redirect(path);
}
