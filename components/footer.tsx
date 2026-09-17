import React from 'react';
import Link from 'next/link';
import { HardDrive, Terminal, Shield, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-white/10 bg-[#06070B]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-lg liquid-glass flex items-center justify-center border border-[#FF4FD8]/40">
                <HardDrive className="w-4 h-4 text-[#FF4FD8]" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                Zentra<span className="text-[#FF4FD8]">Grid</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-6">
              Storage infrastructure for modern applications. Upload, store, stream, and serve your application’s files through a simple developer-first API.
            </p>
            <div className="flex items-center gap-3">
              <div className="liquid-glass px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>API Status: All Systems Operational</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 mb-4 font-semibold">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-white transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 mb-4 font-semibold">
              Developers
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/docs" className="hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/docs/api-reference" className="hover:text-white transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/docs/examples" className="hover:text-white transition-colors">
                  Examples
                </Link>
              </li>
              <li>
                <Link href="/docs/getting-started" className="hover:text-white transition-colors">
                  Getting Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 mb-4 font-semibold">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-white transition-colors">
                  Status
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 ZentraGrid. Storage infrastructure for modern applications.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-400">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-400">Terms</Link>
            <Link href="/acceptable-use" className="hover:text-slate-400">Acceptable Use</Link>
            <Link href="/cookies" className="hover:text-slate-400">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
