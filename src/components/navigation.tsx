"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/hooks/use-site-settings";
import Image from "next/image";

const navLinks = [
  { name: "Personal", href: "/personal" },
  { name: "Business", href: "/business" },
  { name: "Loans", href: "/loans" },
  { name: "Investments", href: "/investments" },
  { name: "Support", href: "/support" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { assets } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-6 md:px-12",
        isScrolled
          ? "py-4"
          : "py-8"
      )}
    >
      <div className={cn(
        "container mx-auto rounded-[2rem] px-8 flex items-center justify-between transition-all duration-500",
        isScrolled 
          ? "bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] py-4 border border-slate-200/50" 
          : "bg-transparent py-2"
      )}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl transition-all duration-500 overflow-hidden",
            isScrolled ? "bg-brand-950 text-white" : "bg-white text-brand-950 shadow-xl shadow-brand-950/20"
          )}>
            {assets.logo ? (
              <Image src={assets.logo} width={40} height={40} alt="Canal Bank Logo" className="object-contain" />
            ) : (
              "C"
            )}
          </div>
          <span className={cn(
            "font-black text-xl tracking-tighter uppercase transition-colors", 
            isScrolled ? "text-brand-950" : "text-white"
          )}>
            Canal Bank
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-accent-500",
                isScrolled ? "text-slate-500" : "text-white/60 hover:text-white"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden lg:flex items-center gap-6">
          <Link
            href="/login"
            className={cn(
              "text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2",
              isScrolled ? "text-brand-950" : "text-white hover:text-accent-400"
            )}
          >
            <Lock className="w-3 h-3" /> Secure Login
          </Link>
          <Link
            href="/open-account"
            className={cn(
              "text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3.5 rounded-xl transition-all shadow-xl flex items-center gap-2 active:scale-95",
              isScrolled 
                ? "bg-brand-950 text-white shadow-brand-950/20 hover:bg-brand-800" 
                : "bg-accent-600 text-white shadow-accent-600/20 hover:bg-accent-500"
            )}
          >
            Open Account <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={cn(
            "lg:hidden p-2 rounded-xl transition-colors",
            isScrolled ? "bg-brand-50 text-brand-950" : "bg-white/10 text-white"
          )}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden absolute top-full left-6 right-6 mt-4 bg-white border border-slate-200 shadow-2xl rounded-[2.5rem] py-10 px-8 flex flex-col gap-6 overflow-hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[12px] font-black text-slate-500 uppercase tracking-[0.3em] py-4 border-b border-slate-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col gap-4 mt-8">
            <Link
              href="/login"
              className="w-full text-center py-5 text-brand-950 font-black text-[10px] uppercase tracking-[0.3em] border-2 border-brand-950 rounded-2xl"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Secure Login
            </Link>
            <Link
              href="/open-account"
              className="w-full text-center py-5 bg-accent-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-accent-600/20"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Open Account
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}