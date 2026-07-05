"use client";

import Link from "next/link";
import { Lock, Mail, Phone } from "lucide-react";

export default function OpenAccountPage() {
  return (
    <div className="min-h-screen bg-brand-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-700/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-brand-950 font-bold text-2xl shadow-lg">
            C
          </div>
          <div className="text-left">
            <p className="text-xl font-bold text-white">Canal Bank</p>
            <p className="text-xs text-slate-400">Private Banking</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-accent-600/10 border-2 border-accent-600/30 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-accent-400" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-3">
            Membership by Invitation
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Canal Bank accounts are opened exclusively through our relationship
            managers. To become a member, please reach out to us directly and
            our team will guide you through the onboarding process.
          </p>

          <div className="space-y-3 mb-8">
            <a
              href="mailto:banking@canalbank.ch"
              className="flex items-center gap-3 px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-accent-600/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-accent-400" />
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-400">Email us</p>
                <p className="text-sm font-medium text-white group-hover:text-accent-300 transition-colors">
                  banking@canalbank.ch
                </p>
              </div>
            </a>

            <a
              href="tel:+41800000001"
              className="flex items-center gap-3 px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-brand-700/30 flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-brand-300" />
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-400">Call us</p>
                <p className="text-sm font-medium text-white group-hover:text-brand-200 transition-colors">
                  +41 800 000 001
                </p>
              </div>
            </a>
          </div>

          <Link
            href="/login"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Already a member?{" "}
            <span className="text-accent-400 font-medium">Sign in →</span>
          </Link>
        </div>

        <p className="text-slate-600 text-xs mt-6">
          Canal Bank SA · Zürich · FINMA regulated
        </p>
      </div>
    </div>
  );
}
