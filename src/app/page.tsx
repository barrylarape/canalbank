"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Globe, Smartphone, CreditCard, TrendingUp, Landmark, ChevronRight } from "lucide-react";
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
    icon: <Shield className="w-8 h-8 text-accent-600" />,
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

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-1">
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
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
            <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 via-brand-950/60 to-transparent" />
          </div>

          <div className="container relative z-10 mx-auto px-6 md:px-12">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-block py-1 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold mb-6">
                  Switzerland&apos;s Premier Digital Institution
                </span>
                <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 leading-[1.1]">
                  Banking Built <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-accent-400">
                    Around Your Life.
                  </span>
                </h1>
                <p className="text-xl text-slate-200 mb-10 max-w-2xl leading-relaxed">
                  Experience a new era of finance. Personal Banking, International Transfers, and Wealth Management—all in one secure Swiss platform.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-5">
                  <Link
                    href="/open-account"
                    className="inline-flex justify-center items-center gap-2 bg-accent-600 hover:bg-accent-700 text-white px-8 py-4 rounded-full font-bold transition-all shadow-xl shadow-accent-600/30 hover:-translate-y-1"
                  >
                    Open Account <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold transition-all hover:-translate-y-1"
                  >
                    Secure Login
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-brand-900 mb-6">
                A Financial Platform for the Modern Era
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                We combine traditional Swiss reliability with cutting-edge technology to give you the most powerful banking experience in the world.
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
                  className="p-8 rounded-2xl bg-brand-50 border border-brand-100 hover:shadow-2xl hover:shadow-brand-900/10 transition-all group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-brand-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-brand-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-accent-600/10 blur-3xl rounded-full translate-x-1/2" />
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="bg-gradient-to-br from-brand-800 to-brand-950 rounded-[3rem] p-12 md:p-20 text-center border border-white/10 shadow-2xl">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
                Ready to upgrade your banking?
              </h2>
              <p className="text-xl text-brand-200 mb-12 max-w-2xl mx-auto">
                Join our exclusive community of members. Opening an account takes less than 8 minutes.
              </p>
              <Link
                href="/open-account"
                className="inline-flex justify-center items-center gap-2 bg-white text-brand-950 px-10 py-5 rounded-full font-bold text-lg hover:bg-brand-50 transition-all hover:scale-105"
              >
                Apply for Membership <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
