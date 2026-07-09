"use client";

import React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Globe, 
  ShieldCheck, 
  ArrowUpRight, 
  ChevronRight,
  Gem,
  Hexagon,
  Mountain,
  PieChart,
  Target
} from "lucide-react";
import Image from "next/image";
import placeholders from "@/app/lib/placeholder-images.json";
import { useSiteSettings } from "@/hooks/use-site-settings";

export default function InvestmentsMarketingPage() {
  const { getAsset } = useSiteSettings();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navigation />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative pt-48 pb-32 bg-brand-950 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={getAsset("zurichCanal", placeholders.zurichCanal.url)}
              fill
              alt="Global Markets"
              className="object-cover opacity-20"
            />
          </div>
          <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8"
            >
              <TrendingUp className="w-3.5 h-3.5 text-accent-400" /> High-Alpha Wealth
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85] mb-8"
            >
              Wealth <br />
              <span className="text-accent-500">Unveiled.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 font-medium leading-relaxed mb-12"
            >
              Access the world&apos;s most sophisticated equity, debt, and alternative markets. 
              Our wealth engine synthesizes global data into executable institutional strategies.
            </motion.p>
          </div>
        </section>

        {/* MARKET SNAPSHOT */}
        <section className="py-24 bg-white border-b border-slate-100">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {[
                { label: "Global Equities", value: "+14.2%", trend: "up", icon: Globe },
                { label: "Fixed Income", value: "+4.8%", trend: "up", icon: Activity },
                { label: "Alternative Assets", value: "+22.5%", trend: "up", icon: Gem }
              ].map((item, i) => (
                <motion.div 
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:bg-brand-950 transition-all duration-500"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-brand-950 group-hover:bg-accent-500 group-hover:text-white transition-all">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-2xl font-black text-brand-950 group-hover:text-white transition-colors">{item.value}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-6 h-6 text-emerald-500" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* THE ENGINE */}
        <section className="py-40 bg-white">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="relative aspect-[16/10] rounded-[3rem] overflow-hidden shadow-2xl">
                <Image 
                  src={getAsset("dashboardPreview", placeholders.dashboardPreview.url)} 
                  fill 
                  alt="Wealth Dashboard" 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-brand-950/20" />
              </div>
              <div>
                <p className="text-accent-500 text-[11px] font-black uppercase tracking-[0.4em] mb-6">Asset Intelligence</p>
                <h2 className="text-5xl md:text-7xl font-black text-brand-950 tracking-tighter uppercase leading-[0.9] mb-10">Bespoke <br /> Allocation.</h2>
                <div className="space-y-10">
                  {[
                    { icon: PieChart, title: "Portfolio Synthesis", desc: "Automated diversification across global sectors based on your individual risk profile." },
                    { icon: BarChart3, title: "Real-time Exposure", desc: "Institutional-level visibility into your market sensitivity and concentration." },
                    { icon: ShieldCheck, title: "Capital Protection", desc: "Risk-mitigation protocols anchored in Swiss financial stability standards." }
                  ].map((item, i) => (
                    <div key={item.title} className="flex gap-6 group">
                      <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center flex-shrink-0 text-brand-950 group-hover:bg-accent-500 group-hover:text-white transition-all">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-brand-950 uppercase tracking-widest mb-2">{item.title}</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GLOBAL ACCESS */}
        <section className="py-40 bg-brand-950 relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="max-w-4xl mx-auto mb-32">
              <p className="text-accent-500 text-[11px] font-black uppercase tracking-[0.4em] mb-6">Execution Reach</p>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-12">The World&apos;s <br /> Exchanges.</h2>
              <p className="text-xl text-slate-400 font-medium leading-relaxed">
                Connect directly to SIX, NYSE, NASDAQ, and major European hubs with a single institutional account. 
                Move between assets with the speed of light and the precision of Swiss engineering.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-white/40">
              {["New York", "London", "Zurich", "Tokyo"].map((city) => (
                <div key={city} className="flex flex-col items-center gap-4">
                  <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">{city}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-500/5 blur-[150px] rounded-full pointer-events-none" />
        </section>

        {/* CTA */}
        <section className="py-60 bg-white">
          <div className="container mx-auto px-6 md:px-12 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center mx-auto mb-12 text-brand-950">
                <Target className="w-10 h-10" />
              </div>
              <h2 className="text-5xl md:text-8xl font-black text-brand-950 uppercase tracking-tighter mb-12">Preserve <br /> Your Alpha.</h2>
              <p className="text-2xl text-slate-500 mb-20 leading-relaxed font-medium">
                Wealth management is not just about growth; it is about the standard of execution. 
                Experience institutional investing.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <Link href="/open-account" className="bg-brand-950 text-white px-20 py-8 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:bg-accent-600 transition-all shadow-2xl">
                  Initiate Consultation <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
