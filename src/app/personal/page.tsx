"use client";

import React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Zap, 
  Globe, 
  ArrowRight,
  Clock,
  Gem,
  Lock,
  Landmark
} from "lucide-react";
import Image from "next/image";
import placeholders from "@/app/lib/placeholder-images.json";
import { useSiteSettings } from "@/hooks/use-site-settings";

export default function PersonalBankingPage() {
  const { getAsset } = useSiteSettings();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navigation />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative pt-48 pb-32 bg-brand-950 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={getAsset("hero", placeholders.hero.url)}
              fill
              alt="Personal Banking"
              className="object-cover opacity-20"
            />
          </div>
          <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8"
            >
              <Gem className="w-3.5 h-3.5 text-accent-400" /> Private Individual Tiers
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85] mb-8"
            >
              Your Life. <br />
              <span className="text-accent-500">Your Legacy.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 font-medium leading-relaxed mb-12"
            >
              Experience a standard of banking that adapts to your global movement. 
              From everyday liquidity to generational wealth preservation, your private vault is engineered for excellence.
            </motion.p>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-40 bg-white">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
              {[
                {
                  icon: CreditCard,
                  title: "Private Vaults",
                  desc: "Dedicated accounts for your everyday liquidity, protected by Swiss privacy standards."
                },
                {
                  icon: Smartphone,
                  title: "Digital Agility",
                  desc: "Control your entire financial perimeter from our award-winning mobile interface."
                },
                {
                  icon: Globe,
                  title: "Global Reach",
                  desc: "Move capital across borders with institutional-grade exchange rates and zero friction."
                }
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center group"
                >
                  <div className="w-20 h-20 bg-brand-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transition-all group-hover:scale-110 group-hover:bg-accent-500 group-hover:text-white duration-500">
                    <item.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-black text-brand-950 uppercase tracking-tight mb-4">{item.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ACCOUNT TIERS */}
        <section className="py-40 bg-slate-50 border-y border-slate-100 relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <p className="text-accent-500 text-[11px] font-black uppercase tracking-[0.4em] mb-6">Tier Selection</p>
              <h2 className="text-5xl md:text-7xl font-black text-brand-950 tracking-tighter uppercase mb-8">Personal <br /> Jurisdictions.</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 max-w-5xl mx-auto">
              {[
                {
                  tier: "Platinum",
                  label: "Individual Excellence",
                  perks: ["Metal Physical Entity", "Priority Concierge", "2.5% Savings Yield", "Global ATM Access"],
                  color: "bg-slate-200"
                },
                {
                  tier: "Infinite",
                  label: "Global Private",
                  perks: ["Personal Wealth Manager", "Exclusive Lounge Access", "4.0% Savings Yield", "FX Treasury Access"],
                  color: "bg-brand-950 text-white"
                }
              ].map((item, i) => (
                <motion.div 
                  key={item.tier}
                  initial={{ opacity: 0, x: i === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={cn("p-12 rounded-[3.5rem] shadow-2xl flex flex-col justify-between", item.color)}
                >
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] mb-4 opacity-40">{item.tier} Tier</p>
                    <h3 className="text-3xl font-black uppercase tracking-tight mb-10">{item.label}</h3>
                    <ul className="space-y-6 mb-16">
                      {item.perks.map(perk => (
                        <li key={perk} className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest">
                          <ShieldCheck className="w-5 h-5 text-accent-500" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className={cn(
                    "w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95 shadow-xl",
                    i === 1 ? "bg-white text-brand-950" : "bg-brand-950 text-white"
                  )}>
                    Apply for {item.tier}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-60 bg-white">
          <div className="container mx-auto px-6 md:px-12 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-brand-950 rounded-[4rem] p-24 md:p-40 relative overflow-hidden"
            >
              <div className="relative z-10 max-w-4xl mx-auto">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-12">
                  <Lock className="w-10 h-10 text-brand-950" />
                </div>
                <h2 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter mb-12 leading-[0.85]">
                  Start Your <br /> Journey.
                </h2>
                <p className="text-xl text-slate-400 mb-16 leading-relaxed">
                  Join an elite circle of members who demand precision from their digital institution.
                </p>
                <Link href="/open-account" className="inline-flex items-center gap-4 bg-accent-500 text-white px-16 py-7 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-accent-600 transition-all shadow-2xl">
                  Establish Account <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-500/10 blur-[120px] rounded-full -mr-64 -mt-64" />
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
