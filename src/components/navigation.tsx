"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Personal", href: "/personal" },
  { name: "Business", href: "/business" },
  { name: "Loans", href: "/loans" },
  { name: "Investments", href: "/investments" },
  { name: "Credit Cards", href: "/credit-cards" },
  { name: "Support", href: "/support" },
  { name: "About Us", href: "/about" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-brand-900 flex items-center justify-center text-white font-bold text-xl group-hover:bg-brand-800 transition-colors">
            C
          </div>
          <span className={cn("font-bold text-xl tracking-tight transition-colors", isScrolled ? "text-brand-900" : "text-white")}>
            Canal Bank
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium hover:text-accent-500 transition-colors",
                isScrolled ? "text-slate-600" : "text-white/90"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/login"
            className={cn(
              "text-sm font-medium transition-colors hover:text-accent-500",
              isScrolled ? "text-brand-900" : "text-white"
            )}
          >
            Login
          </Link>
          <Link
            href="/open-account"
            className="text-sm font-medium bg-accent-600 hover:bg-accent-700 text-white px-5 py-2.5 rounded-full transition-all shadow-lg shadow-accent-600/20 hover:shadow-accent-600/40 flex items-center gap-1"
          >
            Open Account <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-brand-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={cn("w-6 h-6", isScrolled ? "text-brand-900" : "text-white")} />
          ) : (
            <Menu className={cn("w-6 h-6", isScrolled ? "text-brand-900" : "text-white")} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl py-4 px-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-slate-600 font-medium py-2 border-b border-slate-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col gap-3 mt-4">
            <Link
              href="/login"
              className="w-full text-center py-3 text-brand-900 font-medium border border-brand-200 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/open-account"
              className="w-full text-center py-3 bg-accent-600 text-white font-medium rounded-lg shadow-md shadow-accent-600/20"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Open Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
