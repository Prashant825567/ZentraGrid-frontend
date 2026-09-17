'use client';

import React, { useState } from 'react';
import { useToast } from '@/context/toast-context';
import { 
  CreditCard, 
  Check, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

export default function BillingPage() {
  const { toast } = useToast();
  const [currentTier, setCurrentTier] = useState<'free' | 'developer' | 'business'>('developer');

  const handlePlanChange = (tier: 'free' | 'developer' | 'business') => {
    setCurrentTier(tier);
    toast.success('Subscription Updated', `Your account is now on the ${tier.toUpperCase()} tier.`);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <CreditCard className="w-7 h-7 text-[#FF4FD8]" />
          <span>Billing &amp; Subscriptions</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your developer storage tier, monthly quotas, and invoice receipts.
        </p>
      </div>

      {/* Current Active Plan summary */}
      <div className="liquid-glass p-6 md:p-8 rounded-3xl border border-[#FF4FD8]/40 bg-[#FF4FD8]/[0.03] shadow-[0_0_30px_rgba(255,79,216,0.1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-mono text-[#FF9BE8] uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded border border-white/10">
            Active Subscription
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-2 capitalize">
            {currentTier} Developer Tier
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-md">
            100 GB storage volume, 500 GB bandwidth, RFC 7233 video streaming, and priority API routing.
          </p>
        </div>

        <div className="text-left md:text-right">
          <div className="text-3xl font-extrabold text-white">
            {currentTier === 'free' ? '$0' : currentTier === 'developer' ? '$29' : '$149'}
            <span className="text-xs font-mono text-slate-400 font-normal"> / month</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            Next renewal: October 17, 2026
          </div>
        </div>
      </div>

      {/* Plans Switcher */}
      <div>
        <h3 className="text-base font-bold text-white mb-4">Available Storage Tiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free */}
          <div className="liquid-glass p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div>
              <h4 className="text-base font-bold text-white">Free Sandbox</h4>
              <p className="text-xs text-slate-400 mt-1">For hobby &amp; prototype builds</p>
              <div className="my-4 text-2xl font-bold text-white">$0</div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#FF4FD8]" /> 5 GB storage volume
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#FF4FD8]" /> 25 GB bandwidth
                </li>
              </ul>
            </div>
            <button
              onClick={() => handlePlanChange('free')}
              disabled={currentTier === 'free'}
              className="mt-6 w-full liquid-glass py-2 rounded-xl border border-white/15 text-xs text-white disabled:opacity-50"
            >
              {currentTier === 'free' ? 'Current Tier' : 'Downgrade to Free'}
            </button>
          </div>

          {/* Developer */}
          <div className="liquid-glass p-6 rounded-2xl border border-[#FF4FD8]/60 bg-[#FF4FD8]/[0.04] shadow-[0_0_20px_rgba(255,79,216,0.15)] flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-[#FF9BE8] uppercase font-bold">Recommended</div>
              <h4 className="text-base font-bold text-white mt-1">Developer Pro</h4>
              <p className="text-xs text-slate-400 mt-1">For production web &amp; mobile apps</p>
              <div className="my-4 text-2xl font-bold text-white">$29 / mo</div>
              <ul className="space-y-2 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#FF4FD8]" /> 100 GB storage volume
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#FF4FD8]" /> 500 GB bandwidth
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#FF4FD8]" /> Video range streaming
                </li>
              </ul>
            </div>
            <button
              onClick={() => handlePlanChange('developer')}
              disabled={currentTier === 'developer'}
              className="mt-6 w-full liquid-glass py-2 rounded-xl border border-[#FF4FD8]/60 text-xs font-semibold text-white bg-gradient-to-r from-[#FF4FD8] to-[#FF2FB3] disabled:opacity-50"
            >
              {currentTier === 'developer' ? 'Current Tier' : 'Select Developer'}
            </button>
          </div>

          {/* Business */}
          <div className="liquid-glass p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div>
              <h4 className="text-base font-bold text-white">Business Scale</h4>
              <p className="text-xs text-slate-400 mt-1">For multi-tenant applications</p>
              <div className="my-4 text-2xl font-bold text-white">$149 / mo</div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#FF4FD8]" /> 1 TB storage volume
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#FF4FD8]" /> 5 TB bandwidth
                </li>
              </ul>
            </div>
            <button
              onClick={() => handlePlanChange('business')}
              disabled={currentTier === 'business'}
              className="mt-6 w-full liquid-glass py-2 rounded-xl border border-white/15 text-xs text-white disabled:opacity-50"
            >
              {currentTier === 'business' ? 'Current Tier' : 'Upgrade to Business'}
            </button>
          </div>
        </div>
      </div>

      {/* Invoice History */}
      <div className="liquid-glass rounded-3xl border border-white/10 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white">Invoice History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                <th className="pb-3">Invoice ID</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-3 text-white">INV-2026-09-01</td>
                <td className="py-3 text-slate-400">Sep 01, 2026</td>
                <td className="py-3 text-slate-200">$29.00 USD</td>
                <td className="py-3">
                  <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">
                    PAID
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button 
                    onClick={() => toast.info('Invoice Download', 'Invoice PDF INV-2026-09-01 downloaded.')}
                    className="p-1 hover:text-[#FF4FD8] text-slate-400"
                  >
                    <Download className="w-3.5 h-3.5 ml-auto" />
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 text-white">INV-2026-08-01</td>
                <td className="py-3 text-slate-400">Aug 01, 2026</td>
                <td className="py-3 text-slate-200">$29.00 USD</td>
                <td className="py-3">
                  <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">
                    PAID
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button 
                    onClick={() => toast.info('Invoice Download', 'Invoice PDF INV-2026-08-01 downloaded.')}
                    className="p-1 hover:text-[#FF4FD8] text-slate-400"
                  >
                    <Download className="w-3.5 h-3.5 ml-auto" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
