'use client';

import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { HardDrive, Server, Target, Terminal } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#06070B] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="liquid-glass px-3.5 py-1.5 rounded-full border border-[#FF4FD8]/40 inline-flex items-center gap-2 mb-4">
              <HardDrive className="w-4 h-4 text-[#FF4FD8]" />
              <span className="text-xs font-mono text-slate-300">Our Mission</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
              Storage infrastructure for the <span className="text-gradient-pink">next generation</span> of apps.
            </h1>
            <p className="text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
              ZentraGrid was created with one uncompromising purpose: to make file storage, streaming, and delivery as frictionless as calling a REST endpoint.
            </p>
          </div>

          <div className="space-y-8">
            <div className="liquid-glass p-8 rounded-3xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#FF4FD8]" />
                The Developer Storage Problem
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Traditional cloud object storage was built two decades ago for enterprise data archives. In modern workflows, developers spend days configuring IAM roles, bucket policies, complex signing algorithms, and CORS headers just to let an app upload an avatar or stream a video.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                ZentraGrid replaces that labyrinth with a clean HTTP API: create a project, pass your key, stream your bytes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="liquid-glass p-6 rounded-2xl border border-white/10">
                <Server className="w-6 h-6 text-[#67E8F9] mb-3" />
                <h4 className="text-sm font-bold text-white mb-2">Architected for Speed</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Distributed edge delivery points guarantee that media streaming begins within milliseconds anywhere in the world.
                </p>
              </div>

              <div className="liquid-glass p-6 rounded-2xl border border-white/10">
                <Terminal className="w-6 h-6 text-[#8B5CF6] mb-3" />
                <h4 className="text-sm font-bold text-white mb-2">Zero SDK Dependencies</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Use native <code className="text-[#FF9BE8]">fetch</code>, <code className="text-[#FF9BE8]">curl</code>, or any language library. No 50MB vendor SDKs in your bundle.
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
