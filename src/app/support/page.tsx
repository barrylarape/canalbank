"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Navigation 
} from "@/components/navigation";
import { 
  Footer 
} from "@/components/footer";
import { 
  Mail, 
  Phone, 
  MapPin, 
  ChevronDown, 
  Search, 
  ShieldCheck, 
  Clock, 
  MessageSquare, 
  Zap, 
  LifeBuoy,
  Lock,
  ArrowRight,
  CreditCard,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/hooks/use-site-settings";

const faqs = [
  {
    category: "Digital Onboarding",
    questions: [
      {
        q: "How do I become a Canal Bank member?",
        a: "Membership is currently by invitation. You can initiate a consultation by reaching out to our concierge desk. Once pre-approved, a relationship manager will guide you through the secure onboarding process."
      },
      {
        q: "What documentation is required for Swiss residency?",
        a: "We require valid identification (Passport or Identity Card) and official proof of residency. For non-resident accounts, additional wealth origin documentation may be requested under Swiss FINMA regulations."
      }
    ]
  },
  {
    category: "Security & Vaults",
    questions: [
      {
        q: "How secure is the digital interface?",
        a: "Canal Bank utilizes 256-bit military-grade encryption, multi-factor biometric authentication, and strict hardware-level security modules to protect your digital vault access."
      },
      {
        q: "What is a 'Vault Lock'?",
        a: "A Vault Lock is an institutional-level security feature that allows you to instantly suspend all outgoing fund movements and card activity across all your accounts via a single command in the app."
      }
    ]
  },
  {
    category: "International Wires",
    questions: [
      {
        q: "What are the limits for international transfers?",
        a: "Standard limits are established based on your membership tier. However, these can be adjusted in real-time through your relationship manager for high-value institutional capital movements."
      },
      {
        q: "How long do SEPA and SWIFT transfers take?",
        a: "SEPA transfers are typically processed within the same business day. SWIFT international wires generally arrive within 1-3 business days, depending on the recipient's jurisdiction."
      }
    ]
  }
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-base font-bold text-brand-950 uppercase tracking-tight group-hover:text-accent-500 transition-colors">{q}</span>
        <div className={cn(
          "w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center transition-all duration-300",
          isOpen ? "bg-accent-500 text-white rotate-180" : "text-slate-400"
        )}>
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-8 text-sm text-slate-500 leading-relaxed font-medium">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SupportPage() {
  const { assets, config } = useSiteSettings();
  const [search, setSearch] = useState("");

  const supportPhone = config.supportPhone || "+41 800 000 001";
  const supportEmail = config.supportEmail || "support@canalbank.ch";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navigation />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-48 pb-32 bg-brand-950 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,91,97,0.1)_0%,_transparent_60%)]" />
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="max-w-3xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8"
              >
                <LifeBuoy className="w-3.5 h-3.5 text-accent-400" /> Concierge & Support
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-8"
              >
                The Concierge <br /> Desk.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-slate-400 font-medium leading-relaxed mb-12 max-w-2xl"
              >
                At Canal Bank, institutional support is not an automated protocol. 
                Experience elite Swiss service through our dedicated concierge desk, 
                available 24/7 for your family and business wealth needs.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative max-w-xl"
              >
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search institutional resources..."
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-500/50 transition-all font-medium"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS / EMERGENCY */}
        <section className="-mt-16 relative z-20 pb-32">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: CreditCard, 
                  title: "Lost or Stolen Card", 
                  desc: "Instantly freeze your card entity via the dashboard or call our emergency hotline.",
                  action: "Freeze via Dashboard",
                  color: "bg-red-500",
                  link: "/login"
                },
                { 
                  icon: ShieldCheck, 
                  title: "Security Center", 
                  desc: "Manage your 2FA, biometric data, and hardware security keys for maximum protection.",
                  action: "Vault Settings",
                  color: "bg-emerald-500",
                  link: "/login"
                },
                { 
                  icon: MessageSquare, 
                  title: "Consult an Advisor", 
                  desc: "Schedule a private consultation with a relationship manager for bespoke wealth needs.",
                  action: "Initiate Request",
                  color: "bg-accent-500",
                  link: `mailto:${supportEmail}`
                }
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-[2.5rem] p-10 shadow-[0_30px_80px_rgba(0,0,0,0.08)] border border-slate-100 group hover:shadow-[0_40px_100px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-500"
                >
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500", item.color)}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-brand-950 uppercase tracking-tight mb-4">{item.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">{item.desc}</p>
                  <a 
                    href={item.link} 
                    className="inline-flex items-center gap-2 text-[10px] font-black text-brand-950 uppercase tracking-widest hover:text-accent-500 transition-colors"
                  >
                    {item.action} <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* DIRECT CONTACT CHANNELS */}
        <section className="py-32 bg-slate-50 relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <p className="text-accent-500 text-[10px] font-black uppercase tracking-[0.4em] mb-6">Direct Engagement</p>
                <h2 className="text-5xl md:text-7xl font-black text-brand-950 tracking-tighter uppercase leading-[0.9] mb-10">Bespoke <br /> Support.</h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-950">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Hotline</p>
                      <p className="text-lg font-bold text-brand-950 tracking-tight">{supportPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-950">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Electronic Dispatch</p>
                      <p className="text-lg font-bold text-brand-950 tracking-tight">{supportEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-950">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Institutional Hub</p>
                      <p className="text-lg font-bold text-brand-950 tracking-tight">Bahnhofstrasse 1, 8001 Zürich</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-brand-950 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Availability Notice</h3>
                  <p className="text-slate-400 text-base leading-relaxed mb-8">
                    Our digital systems are monitored 24/7. Physical branch consultations and phone support follow Zurich Standard Time (CET/CEST).
                  </p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Monday — Friday</span>
                      <span className="text-xs font-black text-white uppercase">08:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Saturday</span>
                      <span className="text-xs font-black text-white uppercase">09:00 - 13:00</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sunday</span>
                      <span className="text-xs font-black text-accent-500 uppercase tracking-widest">Concierge Only</span>
                    </div>
                  </div>
                </div>
                {/* Visual texture */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-40 bg-white">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <div className="text-center mb-24">
              <p className="text-accent-500 text-[10px] font-black uppercase tracking-[0.4em] mb-6">Institutional Knowledge</p>
              <h2 className="text-5xl md:text-7xl font-black text-brand-950 tracking-tighter uppercase mb-8">Common <br /> Inquiries.</h2>
            </div>

            <div className="space-y-16">
              {faqs.map((group) => (
                <div key={group.category}>
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 border-l-2 border-accent-500 pl-6">{group.category}</h4>
                  <div className="divide-y divide-slate-100">
                    {group.questions.map((item, i) => (
                      <FaqItem key={i} q={item.q} a={item.a} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="py-40 border-t border-slate-50">
          <div className="container mx-auto px-6 md:px-12 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black text-brand-950 uppercase tracking-tighter mb-8">Can&apos;t find what <br /> you need?</h2>
              <p className="text-lg text-slate-500 font-medium mb-12">
                Our support team is ready to assist you with any technical or institutional query.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a href={`mailto:${supportEmail}`} className="w-full sm:w-auto px-12 py-6 bg-brand-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] hover:bg-accent-600 transition-all shadow-2xl active:scale-95 text-center">
                  Email Support Desk
                </a>
                <a href={`tel:${supportPhone.replace(/\s/g, '')}`} className="w-full sm:w-auto px-12 py-6 bg-white border border-slate-200 text-brand-950 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] hover:bg-slate-50 transition-all active:scale-95 text-center">
                  Call Concierge
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
