
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
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Watch,
  BarChart3,
  ArrowLeftRight,
  ShieldAlert,
  Clock as ClockIcon,
  Crown,
  Gem,
  Hexagon
} from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import Image from "next/image";
import placeholders from "@/app/lib/placeholder-images.json";
import { cn } from "@/lib/utils";

/**
 * StatCounter Component
 * Handles the animated counting effect when the element is scrolled into view.
 */
function StatCounter({ value, suffix = "", decimals = 0, prefix = "" }: { value: number, suffix?: string, decimals?: number, prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = value;
      const duration = 2000; // 2 seconds
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
 * GlassCard Component
 * High-fidelity 3D card entity for the landing page showcase.
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
          {/* Light Sweep Effect */}
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

          {/* Dynamic Glow */}
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

const features = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-accent-500" />,
    title: "Swiss Security",
    description: "Military-grade encryption and strict Swiss privacy laws protecting your assets for generations.",
    cta: "Security Protocol",
    href: "/support/security"
  },
  {
    icon: <Globe className="w-8 h-8 text-accent-500" />,
    title: "International Banking",
    description: "Multi-currency accounts, instant FX conversion, and zero-fee international transfers across 150+ countries.",
    cta: "Explore FX Engine",
    href: "/personal/international"
  },
  {
    icon: <Smartphone className="w-8 h-8 text-accent-500" />,
    title: "Digital First",
    description: "Manage your complete financial life from anywhere with our award-winning mobile platform.",
    cta: "Download App",
    href: "/support/mobile"
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-accent-500" />,
    title: "Wealth Management",
    description: "Access global markets, ETFs, and automated portfolio management tailored to your goals.",
    cta: "Establish Yield",
    href: "/investments"
  },
  {
    icon: <CreditCard className="w-8 h-8 text-accent-500" />,
    title: "Premium Cards",
    description: "Exclusive metal cards with luxury travel benefits, concierge service, and high limits.",
    cta: "Card Tier Registry",
    href: "/personal/cards"
  },
  {
    icon: <Landmark className="w-8 h-8 text-accent-500" />,
    title: "Business Solutions",
    description: "Corporate accounts, payroll, and advanced treasury tools for modern Swiss enterprises.",
    cta: "Corporate Onboarding",
    href: "/business"
  },
];

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
      {/* Transaction Artifact */}
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        animate={{ 
          opacity: 1, 
          x: 0,
          y: [0, -8, 0]
        }}
        transition={{ 
          opacity: { delay: 1, duration: 1 },
          x: { delay: 1, duration: 1 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }}
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

      {/* Live FX Artifact */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ 
          opacity: 1, 
          y: [0, -6, 0]
        }}
        transition={{ 
          opacity: { delay: 1.5, duration: 1 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
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

      {/* Portfolio Artifact */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        animate={{ 
          opacity: 1, 
          x: 0, 
          y: [0, -10, 0]
        }}
        transition={{ 
          opacity: { delay: 1.2, duration: 1 },
          x: { delay: 1.2, duration: 1 },
          y: { duration: 7, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute top-[45%] right-[25%] w-56 p-6 rounded-3xl premium-glass backdrop-blur-2xl border border-white/10 shadow-2xl z-20"
      >
        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Portfolio Yield</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-white tracking-tighter">+18.4%</span>
          <ArrowUpRight className="w-5 h-5 text-emerald-400" />
        </div>
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-1">Institutional High-Alpha</p>
        <div className="mt-4 flex gap-1 items-end h-8">
          {[0.3, 0.5, 0.2, 0.8, 0.4, 0.9, 0.6, 0.7].map((h, i) => (
            <div key={i} className="flex-1 bg-accent-500/30 rounded-full" style={{ height: `${h * 100}%` }} />
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
        {/* 1. HERO (Dark Glass) */}
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
            
            {/* Background Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 250 250\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')]" />
          </motion.div>

          <FloatingArtifacts />

          <div className="container relative z-20 mx-auto px-6 md:px-12">
            <div className="max-w-7xl">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.3em] mb-12 shadow-2xl">
                  <Zap className="w-3.5 h-3.5 text-accent-400" /> Switzerland&apos;s Premier Digital Institution
                </motion.div>
                
                <motion.h1 variants={itemVariants} className="text-7xl md:text-[140px] xl:text-[180px] font-black text-white tracking-tighter mb-20 leading-[0.78] uppercase select-none">
                  Banking <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 via-accent-500 to-accent-400">
                    Without <br />
                  </span>
                  Borders.
                </motion.h1>

                <motion.div variants={itemVariants} className="max-w-2xl mb-16">
                  <p className="text-2xl md:text-3xl text-slate-300 leading-relaxed font-medium tracking-tight">
                    Institutional private banking reimagined for global citizens. 
                    Manage liquidity, deploy capital, and protect your legacy.
                  </p>
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-8">
                  <Link
                    href="/open-account"
                    className="inline-flex justify-center items-center gap-4 bg-accent-500 hover:bg-accent-600 text-white px-12 py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] transition-all shadow-2xl shadow-accent-500/20 hover:-translate-y-2 active:scale-95"
                  >
                    Establish Vault <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex justify-center items-center gap-4 bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white border border-white/10 px-12 py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] transition-all hover:-translate-y-2 active:scale-95"
                  >
                    Secure Login
                  </Link>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-24 flex items-center gap-16 opacity-30">
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-black text-white uppercase tracking-[0.4em]">Tier-1 Registry</span>
                    <p className="text-sm font-bold text-white uppercase tracking-widest">FINMA Authorized</p>
                  </div>
                  <div className="w-[1px] h-12 bg-white/20" />
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-black text-white uppercase tracking-[0.4em]">Global Custody</span>
                    <p className="text-sm font-bold text-white uppercase tracking-widest">Swiss Jurisdiction</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/20 animate-bounce z-20">
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Explore Institutional Depth</span>
            <ChevronRight className="w-5 h-5 rotate-90" />
          </div>
        </section>

        {/* 2. FEATURES (White) */}
        <section className="py-40 bg-white relative z-10 overflow-hidden">
          {/* Subtle Background Mesh for Features */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent-500/5 blur-[120px] rounded-full -mr-96 -mt-96" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-500/5 blur-[100px] rounded-full -ml-48 -mb-48" />
          </div>

          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-32">
              <div className="max-w-3xl">
                <p className="text-accent-500 text-[11px] font-black uppercase tracking-[0.4em] mb-6">Core Competencies</p>
                <h2 className="text-5xl md:text-7xl font-black text-brand-950 tracking-tighter leading-none uppercase">
                  Digital Sophistication. <br />Swiss Integrity.
                </h2>
              </div>
              <p className="text-xl text-slate-500 max-w-md leading-relaxed font-medium">
                We synthesize three centuries of Swiss financial stability with a digital architecture designed for the speed of modern life.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                  className="relative p-12 rounded-[3rem] bg-brand-50/50 border border-brand-100 hover:border-accent-500/50 hover:bg-white hover:shadow-[0_40px_100px_rgba(255,91,97,0.1)] transition-all duration-700 group overflow-hidden"
                >
                  <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-1000 pointer-events-none">
                    {React.cloneElement(feature.icon as React.ReactElement, { className: "w-64 h-64" })}
                  </div>

                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-12 group-hover:scale-110 group-hover:bg-brand-950 group-hover:shadow-xl group-hover:shadow-brand-950/20 transition-all duration-700">
                      <div className="group-hover:text-white group-hover:rotate-12 transition-all duration-700">
                        {feature.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-black text-brand-900 mb-6 uppercase tracking-tight group-hover:text-accent-600 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-lg text-slate-500 leading-relaxed font-medium mb-12">
                      {feature.description}
                    </p>

                    <Link 
                      href={feature.href} 
                      className="inline-flex items-center gap-2 text-[11px] font-black text-brand-950 uppercase tracking-[0.2em] group/cta"
                    >
                      <span className="border-b-2 border-accent-500/30 group-hover/cta:border-accent-500 transition-all pb-1">
                        {feature.cta}
                      </span>
                      <ChevronRight className="w-4 h-4 text-accent-500 group-hover/cta:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. DASHBOARD SHOWCASE (Dark) */}
        <section className="py-40 bg-brand-950 relative overflow-hidden">
          {/* Intense Gradient Mesh for Showcase */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-accent-500)_0%,_transparent_70%)]" />
            <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-brand-400/10 blur-[150px] rounded-full" />
          </div>
          
          {/* Subtle Grain Overlay for Dark Section */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 250 250\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')]" />

          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-32">
              <p className="text-accent-500 text-[11px] font-black uppercase tracking-[0.4em] mb-6">Omnichannel Control</p>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 uppercase">A Synchronized Vault.</h2>
              <p className="text-slate-400 text-xl font-medium leading-relaxed">
                Desktop power. Mobile agility. Wearable precision. Experience the most advanced institutional interface across every device you own.
              </p>
            </div>

            <div className="relative h-[600px] md:h-[900px] w-full max-w-7xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-5xl mx-auto rounded-[3rem] border border-white/5 shadow-[0_60px_150px_rgba(0,0,0,0.7)] overflow-hidden"
              >
                <div className="aspect-[16/10] bg-brand-900 relative">
                  <Image
                    src={placeholders.dashboardPreview.url}
                    fill
                    alt="Canal Bank Desktop Showcase"
                    className="object-cover opacity-90 transition-transform duration-[20s] hover:scale-105"
                    data-ai-hint="premium banking dashboard"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-transparent to-transparent" />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 100, y: 100, rotate: 10 }}
                whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -right-4 -bottom-10 md:right-20 md:bottom-20 z-40 w-[240px] md:w-[320px] aspect-[9/19.5] rounded-[3rem] bg-brand-950 border-[10px] border-slate-900 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/10"
              >
                <Image
                  src={placeholders.mobileApp.url}
                  fill
                  alt="Canal Bank Phone Showcase"
                  className="object-cover"
                  data-ai-hint="luxury mobile banking app"
                />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-7 bg-slate-900 rounded-b-2xl z-50" />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -100, scale: 0.8 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                className="absolute -left-4 top-40 md:left-10 md:top-60 z-30 w-32 md:w-48 aspect-square rounded-[2rem] premium-glass border border-white/20 shadow-2xl flex flex-col items-center justify-center p-6 text-center"
              >
                <Watch className="w-8 h-8 text-accent-500 mb-4" />
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Alert</p>
                <p className="text-[12px] font-bold text-white uppercase tracking-tighter leading-tight">Transfer Verified</p>
                <p className="text-[14px] font-mono font-bold text-emerald-400 mt-2">€25,000</p>
              </motion.div>

              <ShowcaseArtifact 
                icon={BarChart3} 
                label="Portfolio Analytics" 
                className="top-10 right-20 hidden md:flex" 
              />
              <ShowcaseArtifact 
                icon={ArrowLeftRight} 
                label="Instant FX Engine" 
                className="bottom-1/3 left-20 hidden md:flex" 
              />
              <ShowcaseArtifact 
                icon={TrendingUp} 
                label="High-Alpha Markets" 
                className="top-1/4 right-[40%] hidden lg:flex" 
              />
            </div>
          </div>
        </section>

        {/* 4. STATISTICS (Gradient with Live Counting) */}
        <section className="py-32 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950 text-white relative border-y border-white/5 overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-8">
              {stats.map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="text-center group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 group-hover:bg-accent-500 transition-all duration-500 group-hover:scale-110 shadow-xl group-hover:shadow-accent-500/20">
                    <stat.icon className="w-6 h-6 text-accent-400 group-hover:text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold font-mono tracking-tighter mb-4 text-white group-hover:text-accent-300 transition-colors">
                    <StatCounter 
                      value={stat.value} 
                      prefix={stat.prefix} 
                      suffix={stat.suffix} 
                      decimals={stat.decimals} 
                    />
                  </div>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] leading-relaxed max-w-[120px] mx-auto group-hover:text-white/60 transition-colors">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,91,97,0.05)_0%,_transparent_70%)] pointer-events-none" />
        </section>

        {/* 5. GLASS BANKING CARDS (Light) */}
        <section className="py-40 bg-slate-50/50 relative overflow-hidden">
          {/* Glass Card Section Mesh */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-brand-400/5 blur-[100px] rounded-full" />
            <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-accent-400/5 blur-[100px] rounded-full" />
          </div>

          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-32">
              <p className="text-accent-500 text-[11px] font-black uppercase tracking-[0.4em] mb-6">Physical Entities</p>
              <h2 className="text-5xl md:text-7xl font-black text-brand-950 tracking-tighter mb-8 uppercase">The Standard of Identity.</h2>
              <p className="text-slate-500 text-xl font-medium leading-relaxed">
                Beyond digital. Our physical entities represent a commitment to craft, privacy, and institutional presence in your pocket.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
              <ShowcaseGlassCard 
                tier="Platinum" 
                label="Elite Access" 
                icon={Hexagon}
                perks={["Lounge Key", "Travel Credit", "2.5% Yield"]}
              />
              <ShowcaseGlassCard 
                tier="Infinite" 
                label="Global Standard" 
                icon={Crown}
                perks={["Concierge", "FX Engine", "4.0% Yield"]}
              />
              <ShowcaseGlassCard 
                tier="Black" 
                label="Bespoke Private" 
                icon={Gem}
                perks={["Private Jet", "Vault Box", "5.5% Yield"]}
              />
            </div>
          </div>
        </section>

        {/* 6. TESTIMONIALS (White) */}
        <section className="py-40 bg-white relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="text-center mb-32">
              <p className="text-accent-500 text-[11px] font-black uppercase tracking-[0.4em] mb-6">Institutional Sentiment</p>
              <h2 className="text-5xl md:text-7xl font-black text-brand-950 tracking-tighter uppercase leading-none">A Circle of Trust.</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {testimonials.map((t, i) => (
                <motion.div 
                  key={t.author}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.8, ease: "easeOut" }}
                  className="relative p-12 bg-brand-50 rounded-[3.5rem] border border-brand-100 hover:bg-white hover:shadow-[0_40px_100px_rgba(0,0,0,0.06)] transition-all duration-700"
                >
                  <Star className="w-6 h-6 text-accent-500 fill-accent-500 mb-10" />
                  <p className="text-xl text-brand-900 font-medium leading-relaxed mb-12 italic">
                    &quot;{t.quote}&quot;
                  </p>
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-brand-950 flex items-center justify-center text-white font-black text-sm">
                      {t.avatar}
                    </div>
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

        {/* 7. PREMIUM MEMBERSHIP (Black Glass) */}
        <section className="py-60 bg-white relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="black-glass rounded-[5rem] p-24 md:p-40 text-center relative overflow-hidden"
            >
              {/* Intense Light Beams for CTA */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent-500/10 blur-[160px] rounded-full -mr-96 -mt-96" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-400/5 blur-[140px] rounded-full -ml-64 -mb-64" />
                <div className="absolute top-1/2 left-1/4 w-[2px] h-[200px] bg-white/10 blur-[40px] rotate-45" />
              </div>

              <div className="relative z-10 max-w-5xl mx-auto">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-24 h-24 rounded-[2.5rem] bg-white flex items-center justify-center mx-auto mb-20 shadow-[0_20px_50px_rgba(255,255,255,0.05)]"
                >
                  <ShieldCheck className="w-12 h-12 text-brand-950" />
                </motion.div>
                <h2 className="text-5xl md:text-[110px] font-black text-white tracking-tighter mb-16 uppercase leading-[0.82] select-none">
                  Experience <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 via-accent-500 to-accent-400">Swiss Banking</span> <br />
                  Without Compromise.
                </h2>
                <p className="text-2xl text-slate-400 mb-24 font-medium leading-relaxed max-w-2xl mx-auto">
                  Access the premier digital institution for global professionals. Your private vault is ready for initialization.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                  <Link
                    href="/open-account"
                    className="inline-flex justify-center items-center gap-4 bg-white text-brand-950 px-20 py-8 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:bg-brand-50 transition-all hover:scale-105 active:scale-95 shadow-2xl"
                  >
                    Apply for Membership <ChevronRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/support/contact"
                    className="text-[11px] font-black text-white/40 hover:text-white uppercase tracking-[0.4em] transition-all border-b border-transparent hover:border-white/20 pb-1"
                  >
                    Consult an Advisor
                  </Link>
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
