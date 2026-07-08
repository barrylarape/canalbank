"use client";

import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Globe, 
  Smartphone, 
  CreditCard, 
  TrendingUp, 
  Landmark, 
  ChevronRight,
  ShieldCheck,
  Star,
  Users,
  Activity,
  Zap
} from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import Image from "next/image";
import placeholders from "@/app/lib/placeholder-images.json";

const features = [
  {
    icon: <Globe className="w-8 h-8 text-accent-600" />,
    title: "International Banking",
    description: "Multi-currency accounts, instant FX conversion, and zero-fee international transfers across 50+ countries.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-accent-600" />,
    title: "Swiss Security",
    description: "Military-grade encryption and strict Swiss privacy laws protecting your assets for generations.",
  },
  {
    icon: <Smartphone className="w-8 h-8 text-accent-600" />,
    title: "Digital First",
    description: "Manage your complete financial life from anywhere with our award-winning mobile platform.",
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-accent-600" />,
    title: "Wealth Management",
    description: "Access global markets, ETFs, and automated portfolio management tailored to your goals.",
  },
  {
    icon: <CreditCard className="w-8 h-8 text-accent-600" />,
    title: "Premium Cards",
    description: "Exclusive metal cards with luxury travel benefits, concierge service, and high limits.",
  },
  {
    icon: <Landmark className="w-8 h-8 text-accent-600" />,
    title: "Business Solutions",
    description: "Corporate accounts, payroll, and advanced treasury tools for modern Swiss enterprises.",
  },
];

const stats = [
  { label: "Assets Under Management", value: "€14.2B", icon: Landmark },
  { label: "Institutional Members", value: "12,500+", icon: Users },
  { label: "Countries Served", value: "48", icon: Globe },
  { label: "Uptime Reliability", value: "99.99%", icon: Activity },
];

const testimonials = [
  {
    quote: "Canal Bank has completely redefined my expectations of a digital institution. The speed of international transfers is unmatched.",
    author: "Marc-André Girard",
    role: "Tech Founder",
    avatar: "MG"
  },
  {
    quote: "The combination of traditional Swiss stability and a modern interface makes this the only platform I trust with my family's wealth.",
    author: "Elena Rossi",
    role: "Private Investor",
    avatar: "ER"
  },
  {
    quote: "Institutional banking that actually moves at the speed of business. Their treasury tools are essential for our global operations.",
    author: "Dr. Klaus Weber",
    role: "CEO, Weber Logistics",
    avatar: "KW"
  }
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navigation />
      
      <main className="flex-1">
        {/* 1. HERO (Dark Glass) */}
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-brand-950">
          <div className="absolute inset-0 z-0">
            <Image
              src={placeholders.hero.url}
              width={placeholders.hero.width}
              height={placeholders.hero.height}
              alt={placeholders.hero.alt}
              className="object-cover w-full h-full brightness-50"
              priority
              data-ai-hint={placeholders.hero.hint}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-950/95 via-brand-950/70 to-transparent" />
          </div>

          <div className="container relative z-10 mx-auto px-6 md:px-12">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                  <Zap className="w-3 h-3 text-accent-400" /> Switzerland&apos;s Premier Digital Institution
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-10 leading-[0.9]">
                  Banking Built <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-accent-400">
                    Around Your Life.
                  </span>
                </h1>
                <p className="text-xl text-slate-300 mb-12 max-w-2xl leading-relaxed font-medium">
                  Experience a new era of finance. Private Banking, International Transfers, and Wealth Management—all in one secure Swiss platform.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6">
                  <Link
                    href="/open-account"
                    className="inline-flex justify-center items-center gap-3 bg-accent-600 hover:bg-accent-700 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl shadow-accent-600/30 hover:-translate-y-1 active:scale-95"
                  >
                    Open Account <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex justify-center items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:-translate-y-1 active:scale-95"
                  >
                    Secure Login
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
          
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/30 animate-bounce">
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Explore Vault</span>
            <ChevronRight className="w-4 h-4 rotate-90" />
          </div>
        </section>

        {/* 2. FEATURES (White) */}
        <section className="py-32 bg-white relative z-10">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
              <div className="max-w-2xl">
                <p className="text-accent-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Core Competencies</p>
                <h2 className="text-4xl md:text-6xl font-black text-brand-950 tracking-tighter leading-none">
                  A Financial Platform <br />for the Modern Era
                </h2>
              </div>
              <p className="text-lg text-slate-500 max-w-sm leading-relaxed font-medium">
                We combine traditional Swiss reliability with cutting-edge technology to give you the most powerful banking experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-10 rounded-[2.5rem] bg-brand-50 border border-brand-100 hover:shadow-2xl hover:shadow-brand-900/5 transition-all group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-brand-950 transition-all duration-500">
                    <div className="group-hover:text-white transition-colors">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-brand-900 mb-4 uppercase tracking-tight">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. DASHBOARD PREVIEW (Dark) */}
        <section className="py-32 bg-brand-950 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-brand-800)_0%,_transparent_70%)]" />
          </div>
          
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <p className="text-accent-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Command Center</p>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6 uppercase">Total Control, Reimagined.</h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                Manage your global liquidity through our award-winning digital interface. Real-time updates, military-grade security, and intuitive controls.
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative mx-auto max-w-5xl rounded-[3rem] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden"
            >
              <div className="aspect-[16/10] bg-brand-900">
                <Image
                  src={placeholders.dashboardPreview.url}
                  fill
                  alt={placeholders.dashboardPreview.alt}
                  className="object-cover opacity-80"
                  data-ai-hint={placeholders.dashboardPreview.hint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform group">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 4. STATISTICS (Gradient) */}
        <section className="py-24 bg-gradient-to-br from-brand-900 to-brand-950 text-white relative">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
              {stats.map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-600 transition-colors">
                    <stat.icon className="w-5 h-5 text-accent-400 group-hover:text-white" />
                  </div>
                  <p className="text-4xl md:text-5xl font-bold font-mono tracking-tighter mb-2">{stat.value}</p>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. TESTIMONIALS (White) */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-24">
              <p className="text-accent-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Member Insights</p>
              <h2 className="text-4xl md:text-5xl font-black text-brand-950 tracking-tighter uppercase">The Institutional Standard</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {testimonials.map((t, i) => (
                <motion.div 
                  key={t.author}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="relative p-10 bg-slate-50 rounded-[3rem] border border-slate-100"
                >
                  <Star className="w-5 h-5 text-accent-500 fill-accent-500 mb-8" />
                  <p className="text-lg text-brand-900 font-medium leading-relaxed mb-10 italic">
                    &quot;{t.quote}&quot;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-950 flex items-center justify-center text-white font-black text-xs">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-black text-brand-950 uppercase tracking-tight">{t.author}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. PREMIUM MEMBERSHIP (Black Glass) */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-6 md:px-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="black-glass rounded-[4rem] p-16 md:p-24 text-center relative"
            >
              <div className="relative z-10 max-w-3xl mx-auto">
                <div className="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center mx-auto mb-12 shadow-2xl">
                  <ShieldCheck className="w-10 h-10 text-brand-950" />
                </div>
                <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-8 uppercase leading-none">
                  Establish Your <br />Vault Today
                </h2>
                <p className="text-xl text-slate-400 mb-12 font-medium leading-relaxed">
                  Join an exclusive circle of global members. Opening your digital institution takes less than 8 minutes.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link
                    href="/open-account"
                    className="inline-flex justify-center items-center gap-3 bg-white text-brand-950 px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-50 transition-all hover:scale-105 active:scale-95"
                  >
                    Apply for Membership <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/support/contact"
                    className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-[0.3em] transition-colors"
                  >
                    Consult an Advisor
                  </Link>
                </div>
              </div>
              
              {/* Abstract decorative elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-accent-600/10 blur-[100px] rounded-full -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full -ml-32 -mb-32" />
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}