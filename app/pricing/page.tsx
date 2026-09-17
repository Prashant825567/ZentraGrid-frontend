'use client';

import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Link from 'next/link';
import { Check, HelpCircle, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#06070B] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="liquid-glass px-3.5 py-1.5 rounded-full border border-[#FF4FD8]/40 inline-flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#FF4FD8]" />
              <span className="text-xs font-mono text-slate-300">Predictable Billing</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
              Simple pricing. No hidden egress penalties.
            </h1>
            <p className="text-base text-slate-400 leading-relaxed">
              Storage infrastructure engineered to scale with your project. Clear monthly pricing without obscure per-request traps.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
            {/* Free */}
            <div className="liquid-glass p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Free</h3>
                <p className="text-xs text-slate-400 mt-1">For development and hobby builds</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="text-xs text-slate-400 font-mono"> / month</span>
                </div>
                <ul className="space-y-3.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#FF4FD8]" /> 5 GB storage volume
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#FF4FD8]" /> 25 GB monthly bandwidth
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#FF4FD8]" /> 2 active API keys
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#FF4FD8]" /> Community Discord support
                  </li>
                </ul>
              </div>
              <Link
                href="/signup"
                className="mt-8 block text-center liquid-glass py-3 rounded-xl border border-white/15 text-xs font-semibold text-white hover:border-[#FF4FD8]/40 transition-all"
              >
                Create Free Account
              </Link>
            </div>

            {/* Developer */}
            <div className="liquid-glass p-8 rounded-3xl border border-[#FF4FD8]/60 bg-[#FF4FD8]/[0.04] shadow-[0_0_35px_rgba(255,79,216,0.18)] flex flex-col justify-between relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF4FD8] to-[#FF2FB3] text-white px-3.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold shadow-lg">
                Most Popular
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Developer</h3>
                <p className="text-xs text-slate-400 mt-1">For production web and mobile apps</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-white">$29</span>
                  <span className="text-xs text-slate-400 font-mono"> / month</span>
                </div>
                <ul className="space-y-3.5 text-xs text-slate-200">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#FF4FD8]" /> 100 GB storage volume
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#FF4FD8]" /> 500 GB monthly bandwidth
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#FF4FD8]" /> Video range streaming (HTTP 206)
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#FF4FD8]" /> Unlimited project API keys
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#FF4FD8]" /> 99.9% uptime SLA guarantee
                  </li>
                </ul>
              </div>
              <Link
                href="/signup"
                className="mt-8 block text-center liquid-glass py-3 rounded-xl border border-[#FF4FD8]/70 text-xs font-semibold text-white bg-gradient-to-r from-[#FF4FD8] to-[#FF2FB3] hover:opacity-95 shadow-[0_0_20px_rgba(255,79,216,0.3)] transition-all"
              >
                Deploy Developer Tier
              </Link>
            </div>

            {/* Business */}
            <div className="liquid-glass p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Business</h3>
                <p className="text-xs text-slate-400 mt-1">For large volume scale and multi-tenant platforms</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-white">$149</span>
                  <span className="text-xs text-slate-400 font-mono"> / month</span>
                </div>
                <ul className="space-y-3.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#FF4FD8]" /> 1 TB storage volume
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#FF4FD8]" /> 5 TB monthly bandwidth
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#FF4FD8]" /> Dedicated high-priority edge nodes
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#FF4FD8]" /> 24/7 dedicated engineering support
                  </li>
                </ul>
              </div>
              <Link
                href="/contact"
                className="mt-8 block text-center liquid-glass py-3 rounded-xl border border-white/15 text-xs font-semibold text-white hover:border-[#FF4FD8]/40 transition-all"
              >
                Inquire for Business
              </Link>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto border-t border-white/10 pt-16">
            <h2 className="text-2xl font-bold text-white text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="liquid-glass p-5 rounded-2xl border border-white/10">
                <h4 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#FF4FD8]" />
                  What happens when I exceed my storage or bandwidth quota?
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We alert you proactively at 80% and 95% thresholds. Uploads are never abruptly terminated without warning, and overages are billed at standard nominal rates.
                </p>
              </div>

              <div className="liquid-glass p-5 rounded-2xl border border-white/10">
                <h4 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#FF4FD8]" />
                  How is video streaming billed?
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Video range streaming counts solely towards your monthly bandwidth allocation. There are no surcharges for range requests or seeking events.
                </p>
              </div>

              <div className="liquid-glass p-5 rounded-2xl border border-white/10">
                <h4 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#FF4FD8]" />
                  Can I create multiple projects under one account?
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Yes, every account owner can provision multiple isolated projects, each with its own keys and bucket quotas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
