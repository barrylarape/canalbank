"use client";

import React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { 
  Landmark, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  Building2, 
  User, 
  Briefcase,
  ChevronRight,
  Zap,
  Target
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import placeholders from "@/app/lib/placeholder-images.json";
import { useSiteSettings } from "@/hooks/use-site-settings";

export default function LoansMarketingPage() {
  const { getAsset } = useSiteSettings();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navigation />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative pt-48 pb-32 bg-brand-950 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={getAsset("vault", placeholders.vault.url)}
              fill
              alt="Lending Solutions"
              className="object-cover opacity-20"
            />
          </div>
          <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8"
            >
              <Target className="w-3.5 h-3.5 text-accent-400" /> Strategic Capital
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85] mb-8"
            >
              Liquidity <br />
              <span className="text-accent-500">Unbound.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 font-medium leading-relaxed mb-12"
            >
              Unlock the value of your assets with our bespoke lending facilities. From property acquisitions to Lombard loans, we provide the leverage your ambition requires.
            </motion.p>
          </div>
        </section>

        {/* LENDING PILLARS */}
        <section className="py-40 bg-white">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { icon: Building2, title: "Real Estate", desc: "Premium financing for residential and commercial Swiss property acquisitions." },
                { icon: Landmark, title: "Lombard Loans", desc: "Instant liquidity backed by your investment portfolio without selling assets." },
                { icon: Briefcase, title: "Business Credit", desc: "Strategic capital for institutional expansion and working capital needs." },
                { icon: User, title: "Personal Luxury", desc: "Bespoke personal credit facilities for high-net-worth individual requirements." }
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 group hover:bg-brand-950 hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-8 shadow-sm text-brand-950 group-hover:bg-accent-500 group-hover:text-white transition-all duration-500">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black text-brand-950 uppercase tracking-tight mb-4 group-hover:text-white">{item.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed group-hover:text-slate-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* LENDING PROCESS (Glass) */}
        <section className="py-40 bg-slate-900 text-white relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <p className="text-accent-400 text-[11px] font-black uppercase tracking-[0.4em] mb-6">Financing Protocol</p>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] mb-12">Speed meets <br /> Precision.</h2>
                <div className="space-y-12">
                  {[
                    { step: "01", title: "Inquiry", desc: "Digital or personal consultation to establish your liquidity needs." },
                    { step: "02", title: "Valuation", desc: "Precision assessment of collateral or institutional credit-worthiness." },
                    { step: "03", title: "Execution", desc: "Capital disbursement directly to your digital vault within 24 hours." }
                  ].map((p, i) => (
                    <div key={p.step} className="flex gap-8 group">
                      <span className="text-4xl font-black text-white/10 group-hover:text-accent-500 transition-colors duration-500">{p.step}</span>
                      <div>
                        <h4 className="text-xl font-black uppercase tracking-widest mb-2">{p.title}</h4>
                        <p className="text-slate-400 font-medium leading-relaxed max-w-sm">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="premium-glass p-12 rounded-[3.5rem] shadow-2xl relative">
                <div className="absolute top-0 right-0 p-8">
                  <ShieldCheck className="w-12 h-12 text-accent-500" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tight mb-8">Loan Calculator</h3>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest opacity-60">
                      <span>Facility Amount</span>
                      <span>€500,000</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-500 w-[60%]" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest opacity-60">
                      <span>Term Duration</span>
                      <span>120 Months</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[40%]" />
                    </div>
                  </div>
                  <div className="pt-8 border-t border-white/10">
                    <p className="text-[11px] font-black uppercase tracking-widest opacity-40 mb-2">Estimated Rate</p>
                    <p className="text-5xl font-black font-mono tracking-tighter">1.75% <span className="text-sm opacity-40">APR</span></p>
                  </div>
                </div>
                <button className="w-full mt-12 py-5 bg-white text-brand-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-accent-500 hover:text-white transition-all">
                  Initiate Application
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="py-60 bg-white">
          <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl">
            <h2 className="text-5xl md:text-8xl font-black text-brand-950 uppercase tracking-tighter mb-12">Leverage <br /> Excellence.</h2>
            <p className="text-2xl text-slate-500 mb-16 font-medium leading-relaxed">
              Your institutional footprint starts with the right capital structure. Let&apos;s build it together.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link href="/open-account" className="bg-brand-950 text-white px-16 py-7 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-accent-600 transition-all shadow-2xl">
                Apply for Facility <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/support" className="text-[11px] font-black text-slate-400 hover:text-brand-950 uppercase tracking-[0.4em] transition-all">Consult a Lending Officer</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}