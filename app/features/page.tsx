'use client';

import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Link from 'next/link';
import { 
  Terminal, 
  Database, 
  Cloud, 
  Film, 
  KeyRound, 
  BarChart3, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Zap, 
  CheckCircle2,
  HardDrive
} from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#06070B] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="liquid-glass px-3.5 py-1.5 rounded-full border border-[#FF4FD8]/40 inline-flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#FF4FD8]" />
              <span className="text-xs font-mono text-slate-300">Technical Specifications</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
              Features engineered for <span className="text-gradient-pink">developers</span>.
            </h1>
            <p className="text-base text-slate-400 leading-relaxed">
              ZentraGrid strips away the bloat of traditional object storage to provide a high-performance RESTful file ingestion, streaming, and telemetry pipeline.
            </p>
          </div>

          {/* Deep Feature Sections */}
          <div className="space-y-16">
            {/* Feature 1: Developer File API */}
            <div className="liquid-glass p-8 md:p-12 rounded-3xl border border-white/12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6">
                <div className="w-10 h-10 rounded-xl liquid-glass flex items-center justify-center border border-[#FF4FD8]/40 text-[#FF4FD8] mb-4">
                  <Terminal className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  RESTful Ingestion with Real-Time Progress
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Stream files directly into ZentraGrid via standard <code className="text-[#FF9BE8] font-mono">multipart/form-data</code> POST requests. Receive immediate cryptographic hash verification, content-type inference, and byte auditing.
                </p>
                <div className="space-y-2 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#67E8F9]" />
                    <span>Chunked streaming with zero buffer lag</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#67E8F9]" />
                    <span>Instant deduplication and metadata extraction</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-6 liquid-glass-subtle p-6 rounded-2xl border border-white/8 font-mono text-xs">
                <div className="text-slate-400 mb-2">{'// Ingestion Contract'}</div>
                <div className="text-[#FF4FD8] font-semibold">POST /v1/files</div>
                <div className="text-slate-300">Authorization: Bearer ZTG_live_9a8f2c3d4e1b</div>
                <div className="text-slate-300">Content-Type: multipart/form-data</div>
                <div className="mt-4 pt-4 border-t border-white/10 text-emerald-400">
                  HTTP/1.1 201 Created
                  <br />
                  &#123; &quot;id&quot;: &quot;file_abc123&quot;, &quot;status&quot;: &quot;active&quot; &#125;
                </div>
              </div>
            </div>

            {/* Feature 2: Range Streaming Engine */}
            <div className="liquid-glass p-8 md:p-12 rounded-3xl border border-white/12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 order-2 lg:order-1 liquid-glass-subtle p-6 rounded-2xl border border-white/8 font-mono text-xs">
                <div className="text-slate-400 mb-2">{'// Streaming Range Request'}</div>
                <div className="text-[#67E8F9] font-semibold">GET /v1/files/file_abc123/stream</div>
                <div className="text-slate-300">Range: bytes=1048576-2097151</div>
                <div className="mt-4 pt-4 border-t border-white/10 text-[#67E8F9]">
                  HTTP/1.1 206 Partial Content
                  <br />
                  Content-Range: bytes 1048576-2097151/48293120
                </div>
              </div>
              <div className="lg:col-span-6 order-1 lg:order-2">
                <div className="w-10 h-10 rounded-xl liquid-glass flex items-center justify-center border border-[#8B5CF6]/40 text-[#8B5CF6] mb-4">
                  <Film className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  Low-Latency HTTP 206 Range Streaming
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Deliver buttery smooth video seeking directly in modern web browsers and mobile apps. Every uploaded media file is automatically indexed for byte-level random access with negligible time-to-first-frame.
                </p>
                <div className="space-y-2 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF4FD8]" />
                    <span>Universal HTML5 video & audio compatibility</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF4FD8]" />
                    <span>Eliminates costly transcoding re-renders</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Security & Key Management */}
            <div className="liquid-glass p-8 md:p-12 rounded-3xl border border-white/12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6">
                <div className="w-10 h-10 rounded-xl liquid-glass flex items-center justify-center border border-[#FF2FB3]/40 text-[#FF2FB3] mb-4">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  Cryptographic Scoped API Keys
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Never share account master passwords. Issue isolated project keys with one-time plaintext generation, instant revocation, and automated rate limiting against upstream abuse.
                </p>
                <div className="space-y-2 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF9BE8]" />
                    <span>Project level tenant segregation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF9BE8]" />
                    <span>Single-click key revocation</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-6 liquid-glass-subtle p-6 rounded-2xl border border-white/8">
                <div className="flex items-center justify-between text-xs font-mono text-slate-300 pb-2 border-b border-white/10 mb-3">
                  <span>Key Identifier</span>
                  <span>Status</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded bg-white/[0.04]">
                    <span className="text-slate-200">ZTG_live_9a8f...4e1b</span>
                    <span className="text-emerald-400 text-[10px]">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-white/[0.04]">
                    <span className="text-slate-400 line-through">ZTG_live_3c4d...990a</span>
                    <span className="text-rose-400 text-[10px]">REVOKED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 text-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 liquid-glass px-8 py-3.5 rounded-xl border border-[#FF4FD8]/60 text-sm font-semibold text-white bg-gradient-to-r from-[#FF4FD8] to-[#FF2FB3] shadow-[0_0_25px_rgba(255,79,216,0.3)]"
            >
              <span>Start Storing with ZentraGrid</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
