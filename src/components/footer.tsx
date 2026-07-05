import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-950 text-slate-300 pt-16 pb-8 border-t border-brand-900">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-brand-950 font-bold text-xl">
                C
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">
                Canal Bank
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-sm">
              The future of banking in Switzerland. Personal Banking, Business Banking, International Transfers, Investments, and Digital Banking—all in one secure platform.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-brand-900 flex items-center justify-center hover:bg-accent-600 hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-brand-900 flex items-center justify-center hover:bg-accent-600 hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-brand-900 flex items-center justify-center hover:bg-accent-600 hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-brand-900 flex items-center justify-center hover:bg-accent-600 hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Personal</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/personal/checking" className="hover:text-accent-500 transition-colors">Checking Accounts</Link></li>
              <li><Link href="/personal/savings" className="hover:text-accent-500 transition-colors">Savings Accounts</Link></li>
              <li><Link href="/personal/certificates" className="hover:text-accent-500 transition-colors">Certificates of Deposit</Link></li>
              <li><Link href="/personal/retirement" className="hover:text-accent-500 transition-colors">Retirement Planning</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Business</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/business/checking" className="hover:text-accent-500 transition-colors">Business Checking</Link></li>
              <li><Link href="/business/payroll" className="hover:text-accent-500 transition-colors">Payroll Services</Link></li>
              <li><Link href="/business/merchant" className="hover:text-accent-500 transition-colors">Merchant Services</Link></li>
              <li><Link href="/business/loans" className="hover:text-accent-500 transition-colors">Commercial Loans</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Help & Support</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/support/faq" className="hover:text-accent-500 transition-colors">FAQ</Link></li>
              <li><Link href="/support/contact" className="hover:text-accent-500 transition-colors">Contact Us</Link></li>
              <li><Link href="/support/locator" className="hover:text-accent-500 transition-colors">Branch Locator</Link></li>
              <li><Link href="/support/security" className="hover:text-accent-500 transition-colors">Security Center</Link></li>
            </ul>
          </div>
          
        </div>

        <div className="pt-8 border-t border-brand-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <ShieldCheck className="w-5 h-5 text-accent-500" />
            <span>Bank deposits are insured by the Swiss Deposit Insurance up to CHF 100,000.</span>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/legal/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-brand-500">
          &copy; {new Date().getFullYear()} Canal Bank. All rights reserved. Canal Bank is a fictitious entity for demonstration purposes.
        </div>
      </div>
    </footer>
  );
}
