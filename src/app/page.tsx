
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
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
  Zap,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Watch,
  BarChart3,
  ArrowLeftRight,
  Clock as ClockIcon,
  Crown,
  Gem,
  Hexagon,
  Mountain,
  Lock
} from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import Image from "next/image";
import placeholders from "@/app/lib/placeholder-images.json";
import { cn } from "@/lib/utils";

/**
 * StatCounter Component
 */
function StatCounter({ value, suffix = "", decimals = 0, prefix = "" }: { value: number, suffix?: string, decimals?: number, prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const frameRate = 1000 / 60;
      const totalFrames = Math.round(duration / frameRate);
      const increment = end / totalFrames;
      
      let currentFrame = 0;
      const timer = setInterval(() => {
        currentFrame++;
        if (currentFrame === totalFrames) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(prev => prev + increment);
        }
      }, frameRate);
      
      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return (
    <span ref={ref} className="font-mono">
      {prefix}
      {count.toLocaleString(undefined, { 
        minimumFractionDigits: decimals, 
        maximumFractionDigits: decimals 
      })}
      {suffix}
    </span>
  );
}

/**
 * ShowcaseGlassCard Component
 */
function ShowcaseGlassCard({ tier, color, label, icon: Icon, perks }: { tier: string, color: string, label: string, icon: any, perks: string[] }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const themes: Record<string, any> = {
    platinum: {
      bg: "bg-gradient-to-br from-slate-100/90 to-slate-300/90",
      accent: "text-slate-600",
      border: "border-white/40",
      glow: "bg-white/30",
      text: "text-slate-800",
      sub: "text-slate-500",
      chip: "bg-slate-400/20"
    },
    infinite: {
      bg: "bg-gradient-to-br from-brand-900/95 to-brand-950/95",
      accent: "text-accent-500",
      border: "border-white/10",
      glow: "bg-accent-500/10",
      text: "text-white",
      sub: "text-slate-400",
      chip: "bg-accent-500/20"
    },
    black: {
      bg: "bg-gradient-to-br from-black to-slate-900",
      accent: "text-emerald-500",
      border: "border-white/5",
      glow: "bg-emerald-500/5",
      text: "text-white",
      sub: "text-slate-500",
      chip: "bg-slate-800/40"
    }
  };

  const t = themes[tier.toLowerCase()] || themes.infinite;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="group perspective-1000"
    >
      <div className="flex flex-col gap-12">
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className={cn(
            "relative w-full aspect-[1.58/1] rounded-[2rem] p-8 shadow-2xl transition-all duration-300 border backdrop-blur-md overflow-hidden cursor-pointer",
            t.bg, t.border
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />
          <div className="relative z-10 flex flex-col h-full justify-between" style={{ transform: "translateZ(60px)" }}>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={cn("w-4 h-4", t.accent)} />
                  <p className={cn("text-[10px] font-black uppercase tracking-[0.3em]", t.sub)}>{tier} Entity</p>
                </div>
                <h3 className={cn("font-black text-2xl tracking-tighter uppercase", t.text)}>Canal</h3>
              </div>
              <div className={cn("w-12 h-10 rounded-lg flex items-center justify-center", t.chip)}>
                <div className="w-8 h-6 rounded bg-black/20 border border-white/10" />
              </div>
            </div>
            <div>
              <p className={cn("text-lg font-mono tracking-[0.25em] mb-1", t.text)}>**** **** **** 8080</p>
              <div className="flex items-center justify-between">
                <p className={cn("text-[9px] font-bold uppercase tracking-[0.2em]", t.sub)}>Institutional Identifier</p>
                <div className="flex gap-1">
                  <div className="w-6 h-6 rounded-full bg-white/10" />
                  <div className="w-6 h-6 rounded-full bg-white/5 -ml-3" />
                </div>
              </div>
            </div>
          </div>
          <div className={cn("absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none", t.glow)} />
        </motion.div>
        <div className="px-4 space-y-6">
          <div>
            <h4 className="text-xl font-black text-brand-950 uppercase tracking-tight mb-2">{label}</h4>
            <div className="flex flex-wrap gap-2">
              {perks.map((perk, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  {perk}
                </span>
              ))}
            </div>
          </div>
          <button className="w-full py-4 bg-brand-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-accent-600 transition-all shadow-xl shadow-brand-950/20 active:scale-95">
            Initialize Tier
          </button>
        </div>
      </div>
    </motion.div>
  );
}

const stats = [
  { label: "Assets Managed", value: 120, prefix: "€", suffix: "B+", decimals: 0, icon: Landmark },
  { label: "Countries Served", value: 150, suffix: "+", decimals: 0, icon: Globe },
  { label: "Platform Availability", value: 99.99, suffix: "%", decimals: 2, icon: Activity },
  { label: "Average Onboarding", value: 8, suffix: " min", decimals: 0, icon: ClockIcon },
  { label: "Institutional Clients", value: 250, suffix: "K+", decimals: 0, icon: Users },
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

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
};

function FloatingArtifacts() {
  return (
    <div className="hidden xl:block absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
        transition={{ opacity: { delay: 1, duration: 1 }, x: { delay: 1, duration: 1 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute top-[20%] right-[5%] w-72 p-6 rounded-3xl premium-glass backdrop-blur-2xl border border-white/10 shadow-2xl z-20"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full uppercase tracking-widest">Completed</span>
        </div>
        <p className="text-2xl font-bold text-white font-mono tracking-tighter">+€15,000.00</p>
        <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mt-1">International Wire</p>
        <div className="h-[1px] bg-white/5 w-full my-4" />
        <div className="flex items-center gap-2">
          <span className="text-lg">🇨🇭</span>
          <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Zurich Institutional Hub</span>
        </div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: [0, -6, 0] }}
        transition={{ opacity: { delay: 1.5, duration: 1 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute bottom-[20%] right-[15%] w-64 p-6 rounded-3xl premium-glass backdrop-blur-2xl border border-white/10 shadow-2xl z-20"
      >
        <div className="flex items-center justify-between mb-6">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Live Currency Feed</p>
          <RefreshCw className="w-3 h-3 text-accent-500 animate-spin" />
        </div>
        <div className="space-y-4">
          {[
            { pair: "EUR / USD", rate: "1.0842", trend: "+0.04%" },
            { pair: "EUR / GBP", rate: "0.8541", trend: "-0.12%" },
          ].map((fx) => (
            <div key={fx.pair} className="flex items-center justify-between">
              <span className="text-[11px] font-black text-white uppercase tracking-widest">{fx.pair}</span>
              <div className="text-right">
                <p className="text-sm font-bold text-white font-mono">{fx.rate}</p>
                <p className={cn("text-[9px] font-bold", fx.trend.startsWith('+') ? "text-emerald-400" : "text-accent-500")}>{fx.trend}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function ShowcaseArtifact({ icon: Icon, label, className }: { icon: any, label: string, className?: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.05 }}
      className={cn("absolute z-30 py-3 px-6 rounded-2xl premium-glass backdrop-blur-3xl border border-white/10 shadow-2xl flex items-center gap-4 transition-all duration-500", className)}
    >
      <div className="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center text-accent-400">
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-[11px] font-black text-white uppercase tracking-widest whitespace-nowrap">{label}</span>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navigation />
      
      <main className="flex-1">
        {/* STORY 1: THE ENTRANCE (Dark Hero) */}
        <section className="relative min-h-screen flex items-center pt-32 pb-40 overflow-hidden bg-brand-950">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={placeholders.hero.url}
              width={placeholders.hero.width}
              height={placeholders.hero.height}
              alt={placeholders.hero.alt}
              className="object-cover w-full h-full brightness-[0.25]"
              priority
              data-ai-hint={placeholders.hero.hint}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-950/95 via-brand-950/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(255,91,97,0.12)_0%,_transparent_60%)] z-10" />
          </motion.div>

          <FloatingArtifacts />

          <div className="container relative z-20 mx-auto px-6 md:px-12">
            <div className="max-w-7xl">
              <motion.div variants={containerVariants} initial="hidden" animate="show">
                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.3em] mb-12 shadow-2xl">
                  <Zap className="w-3.5 h-3.5 text-accent-400" /> Switzerland&apos;s Premier Digital Institution
                </motion.div>
                <motion.h1 variants={itemVariants} className="text-7xl md:text-[140px] xl:text-[180px] font-black text-white tracking-tighter mb-20 leading-[0.78] uppercase select-none">
                  Banking <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 via-accent-500 to-accent-400">Without <br /></span>
                  Borders.
                </motion.h1>
                <motion.div variants={itemVariants} className="max-w-2xl mb-16">
                  <p className="text-2xl md:text-3xl text-slate-300 leading-relaxed font-medium tracking-tight">
                    Institutional private banking reimagined for global professionals. Manage liquidity, deploy capital, and protect your legacy.
                  </p>
                </motion.div>
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-8">
                  <Link href="/open-account" className="inline-flex justify-center items-center gap-4 bg-accent-500 hover:bg-accent-600 text-white px-12 py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] transition-all shadow-2xl shadow-accent-500/20 hover:-translate-y-2 active:scale-95">
                    Establish Vault <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link href="/login" className="inline-flex justify-center items-center gap-4 bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white border border-white/10 px-12 py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] transition-all hover:-translate-y-2 active:scale-95">
                    Secure Login
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[100px] fill-white">
              <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
            </svg>
          </div>
        </section>

        {/* STORY 2: HERITAGE & ORIGIN (White) */}
        <section className="py-40 bg-white relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
                <p className="text-accent-500 text-[11px] font-black uppercase tracking-[0.4em] mb-6">Swiss Heritage</p>
                <h2 className="text-5xl md:text-7xl font-black text-brand-950 tracking-tighter uppercase leading-[0.9] mb-10">The Standard <br /> of Stability.</h2>
                <p className="text-xl text-slate-500 leading-relaxed font-medium mb-12">
                  Founded in Zurich, Canal Bank synthesizes three centuries of Swiss financial stability with a digital architecture designed for the speed of modern life. We are regulated by FINMA and anchored in the values of privacy, precision, and performance.
                </p>
                <div className="flex items-center gap-8">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-brand-950">1892</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Founding Legacy</span>
                  </div>
                  <div className="w-[1px] h-12 bg-slate-100" />
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-brand-950">100%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Swiss Capital</span>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                <Image src={placeholders.zurichCanal.url} fill alt="Zurich Heritage" className="object-cover" data-ai-hint="luxury zurich landscape" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 to-transparent" />
                <div className="absolute bottom-10 left-10 p-6 premium-glass backdrop-blur-xl rounded-2xl border border-white/20 max-w-[240px]">
                  <Mountain className="w-6 h-6 text-accent-400 mb-3" />
                  <p className="text-xs font-bold text-white uppercase tracking-widest leading-relaxed">Secured in the heart of the Alps.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* STORY 3: UNCOMPROMISING SECURITY (White -> Dark Transition) */}
        <section className="py-40 bg-white relative overflow-hidden border-t border-slate-50">
          <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
              <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center mx-auto mb-10 text-brand-950">
                <Lock className="w-10 h-10" />
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-brand-950 tracking-tighter uppercase mb-8">Precision <br /> Security.</h2>
              <p className="text-xl text-slate-500 leading-relaxed font-medium mb-12">
                Your wealth deserves an ironclad perimeter. We deploy military-grade 256-bit encryption, multi-factor biometric authentication, and strict Swiss privacy laws to ensure your digital vault remains inaccessible to all but you.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {[
                  { title: "Vault Lock", desc: "Instantly freeze all entities via app." },
                  { title: "Trace ID", desc: "Real-time ledger transparency." },
                  { title: "Quantum-Safe", desc: "Next-gen encryption standards." }
                ].map((item, i) => (
                  <div key={i} className="p-8 rounded-3xl bg-brand-50 border border-brand-100">
                    <h4 className="text-sm font-black text-brand-950 uppercase tracking-widest mb-3">{item.title}</h4>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* STORY 4: GLOBAL REACH (Gradient Stats) */}
        <section className="relative py-40 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950 text-white overflow-hidden">
          <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] fill-white rotate-180">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,2,1200,34.74V0Z"></path>
            </svg>
          </div>

          <div className="container mx-auto px-6 md:px-12 relative z-20">
            <div className="text-center max-w-3xl mx-auto mb-32">
              <p className="text-accent-400 text-[11px] font-black uppercase tracking-[0.4em] mb-6">Global Connectivity</p>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase">The Scale <br /> of Impact.</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-8">
              {stats.map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.8 }} className="text-center group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 group-hover:bg-accent-500 transition-all duration-500 group-hover:scale-110">
                    <stat.icon className="w-6 h-6 text-accent-400 group-hover:text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold font-mono tracking-tighter mb-4 text-white">
                    <StatCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} />
                  </div>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* STORY 5: WEALTH & MARKETS (White) */}
        <section className="py-40 bg-white relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <motion.div initial={{ opacity: 0, order: 1 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl lg:order-2">
                <Image src={placeholders.businessBanking.url} fill alt="Wealth Management" className="object-cover" data-ai-hint="private banking office" />
                <div className="absolute inset-0 bg-brand-950/20" />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="lg:order-1">
                <p className="text-accent-500 text-[11px] font-black uppercase tracking-[0.4em] mb-6">Capital Deployment</p>
                <h2 className="text-5xl md:text-7xl font-black text-brand-950 tracking-tighter uppercase leading-[0.9] mb-10">High-Alpha <br /> Wealth.</h2>
                <p className="text-xl text-slate-500 leading-relaxed font-medium mb-12">
                  Access global equity markets, fixed-income vehicles, and automated portfolio balancing. Our wealth engine provides the tools for both aggressive growth and long-term preservation of capital.
                </p>
                <div className="space-y-4">
                  {[
                    "Institutional Liquidity Access",
                    "Multi-Currency Treasury Tools",
                    "Bespoke Investment Vehicles",
                    "Real-time Exposure Analytics"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-black text-brand-950 uppercase tracking-widest">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* STORY 6: PHYSICAL IDENTITY (Glass Cards) */}
        <section className="py-40 bg-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[80px] fill-white rotate-180">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
            </svg>
          </div>

          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-32">
              <p className="text-accent-500 text-[11px] font-black uppercase tracking-[0.4em] mb-6">Identity Entities</p>
              <h2 className="text-5xl md:text-7xl font-black text-brand-950 tracking-tighter mb-8 uppercase">The Standard <br /> of Presence.</h2>
              <p className="text-slate-500 text-xl font-medium leading-relaxed">
                Beyond digital. Our physical entities represent a commitment to craft, privacy, and institutional presence in your pocket.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
              <ShowcaseGlassCard tier="Platinum" label="Elite Access" icon={Hexagon} perks={["Lounge Key", "Travel Credit", "2.5% Yield"]} />
              <ShowcaseGlassCard tier="Infinite" label="Global Standard" icon={Crown} perks={["Concierge", "FX Engine", "4.0% Yield"]} />
              <ShowcaseGlassCard tier="Black" label="Bespoke Private" icon={Gem} perks={["Private Jet", "Vault Box", "5.5% Yield"]} />
            </div>
          </div>
        </section>

        {/* STORY 7: THE DIGITAL INTERFACE (Dark Showcase) */}
        <section className="relative py-40 bg-brand-950 overflow-hidden border-t border-white/5">
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-slate-50 to-transparent z-10" />
          
          <div className="container mx-auto px-6 md:px-12 relative z-20">
            <div className="text-center max-w-4xl mx-auto mb-32">
              <p className="text-accent-500 text-[11px] font-black uppercase tracking-[0.4em] mb-6">Digital Control</p>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 uppercase">Synchronized <br /> Intelligence.</h2>
              <p className="text-slate-400 text-xl font-medium leading-relaxed">
                Desktop power. Mobile agility. Wearable precision. Experience the most advanced institutional interface across every device you own.
              </p>
            </div>
            <div className="relative h-[600px] md:h-[900px] w-full max-w-7xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="relative z-10 w-full max-w-5xl mx-auto rounded-[3rem] border border-white/5 shadow-[0_60px_150px_rgba(0,0,0,0.7)] overflow-hidden">
                <div className="aspect-[16/10] bg-brand-900 relative">
                  <Image src={placeholders.dashboardPreview.url} fill alt="Canal Bank Desktop" className="object-cover opacity-90" data-ai-hint="premium banking dashboard" />
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 100, y: 100 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.4 }} className="absolute -right-4 -bottom-10 md:right-20 md:bottom-20 z-40 w-[240px] md:w-[320px] aspect-[9/19.5] rounded-[3rem] bg-brand-950 border-[10px] border-slate-900 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/10">
                <Image src={placeholders.mobileApp.url} fill alt="Canal Bank Phone" className="object-cover" data-ai-hint="luxury mobile banking app" />
              </motion.div>
              <ShowcaseArtifact icon={BarChart3} label="Portfolio Analytics" className="top-10 right-20 hidden md:flex" />
              <ShowcaseArtifact icon={ArrowLeftRight} label="Instant FX Engine" className="bottom-1/3 left-20 hidden md:flex" />
            </div>
          </div>
        </section>

        {/* STORY 8: INSTITUTIONAL SENTIMENT (White) */}
        <section className="py-40 bg-white relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
            <p className="text-accent-500 text-[11px] font-black uppercase tracking-[0.4em] mb-6">Social Proof</p>
            <h2 className="text-5xl md:text-7xl font-black text-brand-950 tracking-tighter uppercase mb-32">A Circle of Trust.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {testimonials.map((t, i) => (
                <motion.div key={t.author} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className="relative p-12 bg-brand-50 rounded-[3.5rem] border border-brand-100 text-left hover:bg-white hover:shadow-2xl transition-all">
                  <Star className="w-6 h-6 text-accent-500 fill-accent-500 mb-10" />
                  <p className="text-xl text-brand-900 font-medium leading-relaxed mb-12 italic">&quot;{t.quote}&quot;</p>
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-brand-950 flex items-center justify-center text-white font-black text-sm">{t.avatar}</div>
                    <div>
                      <p className="text-base font-black text-brand-950 uppercase tracking-tight">{t.author}</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* STORY 9: THE INVITATION (Black Glass) */}
        <section className="py-60 bg-white relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 relative z-20">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="black-glass rounded-[5rem] p-24 md:p-40 text-center relative overflow-hidden">
              <div className="relative z-10 max-w-5xl mx-auto">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="w-24 h-24 rounded-[2.5rem] bg-white flex items-center justify-center mx-auto mb-20">
                  <ShieldCheck className="w-12 h-12 text-brand-950" />
                </motion.div>
                <h2 className="text-5xl md:text-[110px] font-black text-white tracking-tighter mb-16 uppercase leading-[0.82]">
                  Experience <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 via-accent-500 to-accent-400">Swiss Banking</span> <br />
                  Without Compromise.
                </h2>
                <p className="text-2xl text-slate-400 mb-24 font-medium leading-relaxed max-w-2xl mx-auto">
                  Access the premier digital institution for global professionals. Your private vault is ready for initialization.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                  <Link href="/open-account" className="inline-flex justify-center items-center gap-4 bg-white text-brand-950 px-20 py-8 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:bg-brand-50 transition-all hover:scale-105 shadow-2xl">
                    Apply for Membership <ChevronRight className="w-5 h-5" />
                  </Link>
                  <Link href="/support/contact" className="text-[11px] font-black text-white/40 hover:text-white uppercase tracking-[0.4em] transition-all">Consult an Advisor</Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
