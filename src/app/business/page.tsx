"use client";

import React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { 
  Building2, 
  BarChart3, 
  ArrowLeftRight, 
  Globe, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight,
  Zap,
  TrendingUp,
  Activity
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import placeholders from "@/app/lib/placeholder-images.json";
import { useSiteSettings } from "@/hooks/use-site-settings";

export default function BusinessBankingPage() {
  const { getAsset } = useSiteSettings();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navigation />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative pt-48 pb-32 bg-brand-950 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={getAsset("businessBanking", placeholders.businessBanking.url)}
              fill
              alt="Business Banking"
              className="object-cover opacity-20"
            />
          </div>
          <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8"
            >
              <Briefcase className="w-3.5 h-3.5 text-accent-400" /> Institutional Liquidity
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85] mb-8"
            >
              Capital <br />
              <span className="text-accent-500">In Motion.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 font-medium leading-relaxed mb-12"
            >
              The digital architecture for global enterprises. Manage multi-currency payroll, treasury operations, and institutional wealth through a single, secure gateway.
            </motion.p>
          </div>
        </section>

        {/* METRICS */}
        <section className="py-24 bg-slate-50 border-b border-slate-100">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { label: "Daily Volume", value: "€500M+" },
                { label: "Settlement Speed", value: "INSTANT" },
                { label: "Currencies", value: "45+" },
                { label: "Network Up-time", value: "99.99%" }
              ].map((stat, i) => (
                <div key={stat.label}>
                  <p className="text-3xl md:text-4xl font-black text-brand-950 font-mono tracking-tighter mb-2">{stat.value}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CORE SERVICES */}
        <section className="py-40 bg-white">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <p className="text-accent-500 text-[11px] font-black uppercase tracking-[0.4em] mb-6">Institutional Power</p>
                <h2 className="text-5xl md:text-7xl font-black text-brand-950 tracking-tighter uppercase leading-[0.9] mb-10">Treasury <br /> Reimagined.</h2>
                <div className="space-y-8">
                  {[
                    { icon: ArrowLeftRight, title: "Multi-Currency Engine", desc: "Manage balances in 40+ currencies with real-time institutional exchange rates." },
                    { icon: Activity, title: "Velocity Transfers", desc: "High-speed SWIFT and SEPA execution for critical business operations." },
                    { icon: BarChart3, title: "Advanced Analytics", desc: "Granular reporting and visibility into your corporate cashflow lifecycle." }
                  ].map((item, i) => (
                    <div key={item.title} className="flex gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center flex-shrink-0 text-brand-950">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-brand-950 uppercase tracking-widest mb-2">{item.title}</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                <Image 
                  src={getAsset("dashboardPreview", placeholders.dashboardPreview.url)} 
                  fill 
                  alt="Business Dashboard" 
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-40 bg-brand-950 relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-[100px] font-black text-white uppercase tracking-tighter mb-12 leading-[0.82]">
                Scale Your <br /> Enterprise.
              </h2>
              <p className="text-2xl text-slate-400 mb-20 font-medium leading-relaxed max-w-2xl mx-auto">
                Join the world&apos;s most ambitious businesses. Initialize your institutional vault today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                <Link href="/open-account" className="bg-white text-brand-950 px-16 py-7 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-brand-50 transition-all shadow-2xl">
                  Business Onboarding <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/support" className="text-[11px] font-black text-white/40 hover:text-white uppercase tracking-[0.4em] transition-all">Consult an Institutional Advisor</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}