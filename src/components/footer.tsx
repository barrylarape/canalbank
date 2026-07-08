import Link from "next/link";
import { 
  ShieldCheck, 
  ArrowRight, 
  Smartphone, 
  Globe, 
  Lock, 
  Award, 
  CheckCircle2, 
  Landmark,
  Shield,
  Zap
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-950 text-slate-400 pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* TOP: Newsletter & App Portal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
          <div className="space-y-8">
            <div>
              <h3 className="text-white font-black text-2xl uppercase tracking-tighter mb-4">The Institutional Dispatch</h3>
              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-md">
                Receive weekly high-alpha market insights and institutional updates directly to your vault.
              </p>
            </div>
            <form className="flex max-w-md gap-2">
              <input 
                type="email" 
                placeholder="member@vault.ch" 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-accent-500/50 transition-all font-medium"
              />
              <button className="bg-white text-brand-950 px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5 flex items-center gap-2">
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 lg:justify-end">
            <button className="flex items-center gap-4 px-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all group text-left">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Download on the</p>
                <p className="text-lg font-bold text-white leading-tight">App Store</p>
              </div>
            </button>
            <button className="flex items-center gap-4 px-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all group text-left">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Get it on</p>
                <p className="text-lg font-bold text-white leading-tight">Google Play</p>
              </div>
            </button>
          </div>
        </div>

        <div className="h-[1px] bg-white/5 w-full mb-24" />

        {/* MIDDLE: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-24">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-950 font-black text-xl shadow-lg shadow-white/10">
                C
              </div>
              <span className="font-black text-2xl tracking-tighter text-white uppercase">
                Canal
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-8 max-w-xs text-slate-500 font-medium">
              Switzerland&apos;s premier digital institution, engineered for the global elite. Preserving wealth through precision architecture.
            </p>
            <div className="flex items-center gap-4">
              {['FB', 'TW', 'IG', 'LI'].map(social => (
                <a key={social} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent-500 hover:text-white transition-all text-xs font-black text-slate-500">
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-black text-[11px] uppercase tracking-[0.3em] mb-8">Personal</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <li><Link href="#" className="hover:text-accent-400 transition-colors">Checking Vaults</Link></li>
              <li><Link href="#" className="hover:text-accent-400 transition-colors">Savings Tiers</Link></li>
              <li><Link href="#" className="hover:text-accent-400 transition-colors">Metal Entities</Link></li>
              <li><Link href="#" className="hover:text-accent-400 transition-colors">Digital Wallet</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-[11px] uppercase tracking-[0.3em] mb-8">Institutional</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <li><Link href="#" className="hover:text-accent-400 transition-colors">Wealth Management</Link></li>
              <li><Link href="#" className="hover:text-accent-400 transition-colors">Asset Allocation</Link></li>
              <li><Link href="#" className="hover:text-accent-400 transition-colors">Treasury Tools</Link></li>
              <li><Link href="#" className="hover:text-accent-400 transition-colors">Market Pulse</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-[11px] uppercase tracking-[0.3em] mb-8">Governance</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <li><Link href="#" className="hover:text-accent-400 transition-colors">Privacy Charter</Link></li>
              <li><Link href="#" className="hover:text-accent-400 transition-colors">Regulatory Portal</Link></li>
              <li><Link href="#" className="hover:text-accent-400 transition-colors">Security Center</Link></li>
              <li><Link href="#" className="hover:text-accent-400 transition-colors">Compliance</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-[11px] uppercase tracking-[0.3em] mb-8">Support</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <li><Link href="#" className="hover:text-accent-400 transition-colors">24/7 Concierge</Link></li>
              <li><Link href="#" className="hover:text-accent-400 transition-colors">Institutional FAQ</Link></li>
              <li><Link href="#" className="hover:text-accent-400 transition-colors">Branch Locator</Link></li>
              <li><Link href="#" className="hover:text-accent-400 transition-colors">Direct Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM: Trust & Regulatory */}
        <div className="pt-16 border-t border-white/5 flex flex-col gap-12">
          
          {/* Trust Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <Shield className="w-6 h-6 text-emerald-500" />
              <div>
                <p className="text-[10px] font-black text-white uppercase tracking-widest">FINMA Regulated</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Swiss Financial Authority</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <Lock className="w-6 h-6 text-accent-500" />
              <div>
                <p className="text-[10px] font-black text-white uppercase tracking-widest">PCI DSS Level 1</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Maximum Payment Security</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <Award className="w-6 h-6 text-amber-500" />
              <div>
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Elite Tech 2024</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">WealthTech Excellence Award</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <Globe className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Global Partner</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">SIX Group Institutional Hub</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Deposits insured by esisuisse up to CHF 100,000 per client.</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-[11px] font-bold uppercase tracking-widest">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition-colors">Cookie Charter</Link>
              <Link href="#" className="hover:text-white transition-colors">Vulnerability Policy</Link>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
               <div className="h-6 w-24 bg-white/20 rounded-md" />
               <div className="h-6 w-16 bg-white/20 rounded-md" />
               <div className="h-6 w-32 bg-white/20 rounded-md" />
            </div>
            <p className="text-[10px] font-bold text-slate-700 uppercase tracking-[0.3em]">
              &copy; {new Date().getFullYear()} Canal Bank SA · Zürich · CHE-123.456.789 · All institutional rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
