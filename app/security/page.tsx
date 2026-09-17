'use client';

import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { 
  KeyRound, 
  Layers, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Lock, 
  FileCheck2, 
  ServerCrash,
  Cpu
} from 'lucide-react';

export default function SecurityPage() {
  const securityPillars = [
    {
      title: 'API Key Authentication',
      desc: 'All programmatic interactions require high-entropy ZTG_live_* keys. Plaintext secrets are revealed exactly once during generation and never stored unhashed.',
      icon: KeyRound,
      color: '#FF4FD8'
    },
    {
      title: 'Project Isolation',
      desc: 'Every storage volume belongs exclusively to its scoped workspace. Cross-project file lookups, key authorizations, or data leaks are structurally prevented at the router level.',
      icon: Layers,
      color: '#8B5CF6'
    },
    {
      title: 'Access Control',
      desc: 'Strict role separation between the account owner (authenticated via Firebase identity token) and background service workers operating with developer keys.',
      icon: ShieldCheck,
      color: '#67E8F9'
    },
    {
      title: 'Rate Limiting & Abuse Prevention',
      desc: 'Adaptive token-bucket rate limiting safeguards upstream storage clusters from runaway loops, malicious scrapers, and accidental DDoS spikes.',
      icon: Zap,
      color: '#FF2FB3'
    },
    {
      title: 'Usage Monitoring & Auditing',
      desc: 'Continuous real-time telemetry tracks byte volume, HTTP status distribution, and request origin IPs to detect anomalies before they cause service disruption.',
      icon: BarChart3,
      color: '#FF9BE8'
    },
  ];

  return (
    <div className="min-h-screen bg-[#06070B] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="liquid-glass px-3.5 py-1.5 rounded-full border border-[#FF4FD8]/40 inline-flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-[#FF4FD8]" />
              <span className="text-xs font-mono text-slate-300">Architecture Security</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
              Built with developer control in mind.
            </h1>
            <p className="text-base text-slate-400 leading-relaxed">
              We design infrastructure that gives developers complete clarity, deterministic isolation, and robust key management over their application storage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {securityPillars.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="liquid-glass p-8 rounded-2xl border border-white/10 hover:border-[#FF4FD8]/40 transition-all group"
                >
                  <div 
                    className="w-12 h-12 rounded-xl liquid-glass flex items-center justify-center mb-5 border border-white/10 group-hover:shadow-[0_0_20px_rgba(255,79,216,0.3)] transition-all"
                    style={{ color: p.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}

            {/* In-Transit & At-Rest Encryption Card */}
            <div className="liquid-glass p-8 rounded-2xl border border-white/10 hover:border-[#FF4FD8]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl liquid-glass flex items-center justify-center mb-5 border border-white/10 text-emerald-400">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Transport Encryption</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                All traffic is strictly enforced over TLS 1.3. Payloads in transit and resting blob objects are encapsulated with cryptographic standards.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
