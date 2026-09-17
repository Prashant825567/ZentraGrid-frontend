'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import CodeBlock from '@/components/ui/code-block';
import { 
  ArrowRight, 
  Terminal, 
  Database, 
  Radio, 
  Film, 
  KeyRound, 
  BarChart3, 
  ShieldCheck, 
  Check, 
  Sparkles,
  Layers,
  Cpu,
  Zap,
  Activity,
  Server,
  Cloud,
  FileCode,
  HardDrive
} from 'lucide-react';

// Dynamic import of 3D scenes for client-only rendering
const HeroScene = dynamic(() => import('@/components/3d/hero-scene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] md:h-[580px] rounded-2xl liquid-glass border border-white/10 flex items-center justify-center text-xs font-mono text-slate-400">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#FF4FD8] animate-ping" />
        Loading 3D Storage Infrastructure...
      </div>
    </div>
  )
});

const CtaGrid = dynamic(() => import('@/components/3d/cta-grid'), {
  ssr: false
});

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'stream' | 'keys'>('upload');

  const sampleCodes = {
    upload: `POST /v1/files
Authorization: Bearer ZTG_live_9a8f2c3d4e1b
Content-Type: multipart/form-data

// Response:
{
  "id": "file_abc123",
  "name": "video.mp4",
  "size": 48293120,
  "mime_type": "video/mp4",
  "status": "active"
}`,
    stream: `GET /v1/files/file_abc123/stream
Range: bytes=0-1048575
Authorization: Bearer ZTG_live_9a8f2c3d4e1b

// Response: HTTP 206 Partial Content
// Content-Range: bytes 0-1048575/48293120
// Accept-Ranges: bytes
// Stream piped directly to HTML5 video element`,
    keys: `POST /v1/projects/prj_prod_aurora/keys
Authorization: Bearer <FIREBASE_ID_TOKEN>
Content-Type: application/json

{
  "name": "Primary Ingest Gateway"
}

// Response: Plaintext secret returned once
{
  "key": {
    "id": "key_9a8f2",
    "key_hint": "ZTG_live_9a8f...4e1b"
  },
  "plaintext_key": "ZTG_live_9a8f2c3d4e1b7781a9c..."
}`
  };

  return (
    <div className="min-h-screen bg-[#06070B] text-slate-100 flex flex-col selection:bg-[#FF4FD8]/30">
      <Navbar />

      <main className="flex-1">
        {/* ==================================================
            HERO SECTION
        ================================================== */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          {/* Subtle ambient lighting */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-radial-glow pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Typography & CTAs */}
              <div className="lg:col-span-6 flex flex-col items-start">
                {/* Badge */}
                <div className="liquid-glass px-3.5 py-1.5 rounded-full border border-[#FF4FD8]/40 mb-6 flex items-center gap-2 shadow-[0_0_15px_rgba(255,79,216,0.15)]">
                  <span className="w-2 h-2 rounded-full bg-[#FF4FD8] animate-pulse" />
                  <span className="text-xs font-mono font-medium text-slate-200">
                    Developer Storage Infrastructure
                  </span>
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
                  <span className="text-gradient-pink">Storage infrastructure</span>{' '}
                  for modern applications.
                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-xl font-normal">
                  Upload, store, stream, and serve your application’s files through a simple developer-first API.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                  <Link
                    href="/signup"
                    id="hero-get-started-btn"
                    className="liquid-glass px-6 py-3.5 rounded-xl border border-[#FF4FD8]/60 text-sm font-semibold text-white bg-gradient-to-r from-[#FF4FD8] to-[#FF2FB3] hover:opacity-95 shadow-[0_0_30px_rgba(255,79,216,0.35)] transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </Link>

                  <Link
                    href="/docs"
                    id="hero-view-docs-btn"
                    className="liquid-glass px-6 py-3.5 rounded-xl border border-white/15 text-sm font-semibold text-slate-200 hover:text-white hover:border-[#FF4FD8]/40 hover:bg-white/[0.06] transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <Terminal className="w-4 h-4 text-[#FF4FD8]" />
                    <span>View Documentation</span>
                  </Link>
                </div>

                {/* Micro tech proof */}
                <div className="mt-8 flex items-center gap-6 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#67E8F9]" />
                    Range Video Streaming
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#FF4FD8]" />
                    ZTG_live_* Keys
                  </span>
                </div>
              </div>

              {/* Right Column: LIVE 3D INFRASTRUCTURE SCENE */}
              <div className="lg:col-span-6 relative">
                <HeroScene />

                {/* Overlapping Liquid Glass Hero UI Panel */}
                <div 
                  id="hero-liquid-glass-panel"
                  className="absolute -bottom-6 -left-4 sm:left-6 right-4 sm:right-6 liquid-glass p-4 sm:p-5 rounded-2xl border border-white/15 shadow-2xl backdrop-blur-2xl bg-[#0B0D14]/90 z-20"
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#FF4FD8]" />
                      <span className="font-semibold text-white">Cluster Telemetry</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#FF9BE8] uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      Example Demo Data
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                    <div className="liquid-glass-subtle p-2.5 rounded-xl border border-white/8">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Storage Nodes</div>
                      <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        4 active
                      </div>
                    </div>

                    <div className="liquid-glass-subtle p-2.5 rounded-xl border border-white/8">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Data Flow</div>
                      <div className="text-sm font-bold text-[#67E8F9] mt-0.5 flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-[#67E8F9]" />
                        Operational
                      </div>
                    </div>

                    <div className="liquid-glass-subtle p-2.5 rounded-xl border border-white/8">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">API Requests</div>
                      <div className="text-sm font-bold text-white mt-0.5 font-mono">
                        12.4K <span className="text-[10px] text-slate-500 font-normal">demo</span>
                      </div>
                    </div>

                    <div className="liquid-glass-subtle p-2.5 rounded-xl border border-white/8">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Delivery</div>
                      <div className="text-sm font-bold text-[#FF4FD8] mt-0.5 flex items-center gap-1.5">
                        <Radio className="w-3 h-3 text-[#FF4FD8]" />
                        Ready
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            CAPABILITY STRIP
        ================================================== */}
        <section className="py-12 border-y border-white/10 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: 'Simple API', desc: 'REST /v1 Contract', icon: Terminal },
                { name: 'File Storage', desc: 'Encrypted Blobs', icon: Database },
                { name: 'Media Delivery', desc: 'Fast Edge CDN', icon: Cloud },
                { name: 'Video Streaming', desc: 'HTTP Range 206', icon: Film },
                { name: 'API Authentication', desc: 'Dual-tier Token Model', icon: KeyRound },
                { name: 'Usage Monitoring', desc: 'Telemetry & Quotas', icon: BarChart3 },
              ].map((cap, i) => {
                const Icon = cap.icon;
                return (
                  <div
                    key={cap.name}
                    className="liquid-glass p-4 rounded-xl border border-white/10 hover:border-[#FF4FD8]/40 transition-all text-center flex flex-col items-center justify-center group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#FF4FD8] mb-2 group-hover:scale-110 group-hover:bg-[#FF4FD8]/20 transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-white">{cap.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 mt-0.5">{cap.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================================================
            FEATURES
        ================================================== */}
        <section className="py-24 relative" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="text-xs font-mono text-[#FF9BE8] uppercase tracking-wider mb-2">
                Capabilities Matrix
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Everything your application needs for file storage.
              </h2>
              <p className="text-slate-400 text-sm mt-3">
                Architected with low-latency blob routing, range stream capabilities, and cryptographic isolation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Developer API',
                  desc: 'Clean, predictable REST endpoints for uploading, querying, and managing file objects programmatically.',
                  icon: Terminal,
                  tag: 'POST /v1/files'
                },
                {
                  title: 'File Storage',
                  desc: 'Durable, multi-region distributed storage with automatic content hashing, mime typing, and size auditing.',
                  icon: Database,
                  tag: 'Multi-Region'
                },
                {
                  title: 'Media Delivery',
                  desc: 'Global edge delivery that routes assets with optimal caching headers and zero egress congestion.',
                  icon: Cloud,
                  tag: 'Edge Cached'
                },
                {
                  title: 'Video Streaming',
                  desc: 'Native byte-range streaming engine supporting instant seeks, partial 206 responses, and adaptive clients.',
                  icon: Film,
                  tag: 'HTTP 206'
                },
                {
                  title: 'API Authentication',
                  desc: 'Distinct security layers: Firebase ID tokens for account owners, and ZTG_live_* keys for backend app processes.',
                  icon: KeyRound,
                  tag: 'Dual Tokens'
                },
                {
                  title: 'Usage Monitoring',
                  desc: 'Real-time telemetry measuring byte volume, bandwidth consumption, and API call frequency against quotas.',
                  icon: BarChart3,
                  tag: 'Real-time'
                },
              ].map((feat) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="liquid-glass p-6 rounded-2xl border border-white/10 hover:border-[#FF4FD8]/40 transition-all liquid-glass-interactive group relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl liquid-glass flex items-center justify-center border border-[#FF4FD8]/40 text-[#FF4FD8] group-hover:shadow-[0_0_15px_rgba(255,79,216,0.3)] transition-all">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                        {feat.tag}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================================================
            API SHOWCASE
        ================================================== */}
        <section className="py-20 bg-[#0B0D14]/60 border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5">
                <div className="text-xs font-mono text-[#FF9BE8] uppercase tracking-wider mb-2">
                  Developer Experience
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                  Your storage layer, exposed through an API.
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Simple HTTP requests give your server or workers the ability to ingest, query, and stream assets without SDK bloat.
                </p>

                {/* Tabs */}
                <div className="flex items-center gap-2 p-1.5 liquid-glass rounded-xl border border-white/10 mb-6">
                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'upload' 
                        ? 'bg-[#FF4FD8]/20 text-white border border-[#FF4FD8]/40' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    onClick={() => setActiveTab('stream')}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'stream' 
                        ? 'bg-[#FF4FD8]/20 text-white border border-[#FF4FD8]/40' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Range Stream
                  </button>
                  <button
                    onClick={() => setActiveTab('keys')}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'keys' 
                        ? 'bg-[#FF4FD8]/20 text-white border border-[#FF4FD8]/40' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Generate Key
                  </button>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Verified API contract directly matching production backend specifications.</span>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[11px] font-mono text-slate-400">
                    Live Payload Sample
                  </span>
                  <span className="text-[10px] font-mono text-[#FF9BE8] uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    Example Code
                  </span>
                </div>
                <CodeBlock 
                  code={sampleCodes[activeTab]} 
                  language={activeTab === 'upload' ? 'http' : 'json'} 
                  filename={activeTab === 'upload' ? 'multipart-upload.sh' : activeTab === 'stream' ? 'video-stream.sh' : 'api-key-gen.sh'}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            HOW IT WORKS
        ================================================== */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="text-xs font-mono text-[#FF9BE8] uppercase tracking-wider mb-2">
                Four Quick Steps
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Integrate storage into your workflow in minutes.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {[
                { step: '01', title: 'Create a project', desc: 'Provision isolated workspaces and set resource quotas via the dashboard console.' },
                { step: '02', title: 'Generate an API key', desc: 'Obtain plaintext ZTG_live_* credentials once to authorize your backend application services.' },
                { step: '03', title: 'Upload your files', desc: 'POST multipart form data directly to /v1/files with realtime progress feedback.' },
                { step: '04', title: 'Serve through your app', desc: 'Deliver direct downloads or pipe byte-range video streams directly to your end-users.' },
              ].map((s, idx) => (
                <div
                  key={s.step}
                  className="liquid-glass p-6 rounded-2xl border border-white/10 hover:border-[#FF4FD8]/40 transition-all flex flex-col justify-between relative group"
                >
                  <div>
                    <div className="font-mono text-2xl font-bold text-[#FF4FD8] mb-3">
                      {s.step}
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2">{s.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center text-[11px] text-slate-500 font-mono">
                    Step {idx + 1} of 4
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================
            DASHBOARD PREVIEW
        ================================================== */}
        <section className="py-20 bg-[#0B0D14]/40 border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="text-xs font-mono text-[#FF9BE8] uppercase tracking-wider mb-2">
                Unified Management
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Inspect every byte, key, and stream in one place.
              </h2>
            </div>

            {/* Dashboard Mock Preview Card */}
            <div className="liquid-glass rounded-2xl border border-white/15 p-6 md:p-8 shadow-2xl bg-[#06070B]/80 max-w-5xl mx-auto">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">
                    console.zentragrid.com/dashboard
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded border border-white/10">
                  Example dashboard data
                </span>
              </div>

              {/* Demo Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="liquid-glass-subtle p-4 rounded-xl border border-white/8">
                  <div className="text-xs text-slate-400 font-mono">Storage Used</div>
                  <div className="text-2xl font-bold text-white mt-1">18.4 GB</div>
                  <div className="text-[10px] text-emerald-400 mt-1">18.4% of 100 GB quota</div>
                </div>

                <div className="liquid-glass-subtle p-4 rounded-xl border border-white/8">
                  <div className="text-xs text-slate-400 font-mono">Bandwidth</div>
                  <div className="text-2xl font-bold text-[#67E8F9] mt-1">42.8 GB</div>
                  <div className="text-[10px] text-slate-400 mt-1">Current period billing</div>
                </div>

                <div className="liquid-glass-subtle p-4 rounded-xl border border-white/8">
                  <div className="text-xs text-slate-400 font-mono">API Requests</div>
                  <div className="text-2xl font-bold text-[#FF4FD8] mt-1">128,492</div>
                  <div className="text-[10px] text-slate-400 mt-1">99.98% 2xx status</div>
                </div>

                <div className="liquid-glass-subtle p-4 rounded-xl border border-white/8">
                  <div className="text-xs text-slate-400 font-mono">Files</div>
                  <div className="text-2xl font-bold text-white mt-1">12,840</div>
                  <div className="text-[10px] text-[#FF9BE8] mt-1">Across 2 projects</div>
                </div>
              </div>

              {/* Mini Table Preview */}
              <div className="liquid-glass-subtle rounded-xl border border-white/8 p-4">
                <div className="text-xs font-semibold text-slate-200 mb-3 flex items-center justify-between">
                  <span>Recent Active Objects</span>
                  <Link href="/dashboard/storage" className="text-[11px] text-[#FF4FD8] hover:underline">
                    View All Files →
                  </Link>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]">
                    <span className="text-slate-200 truncate">h264_stream_sample_1080p.mp4</span>
                    <span className="text-slate-400">48.2 MB</span>
                    <span className="text-emerald-400 text-[10px]">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]">
                    <span className="text-slate-200 truncate">design_tokens_bundle.tar.gz</span>
                    <span className="text-slate-400">14.2 MB</span>
                    <span className="text-emerald-400 text-[10px]">ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            SECURITY SECTION
        ================================================== */}
        <section className="py-24" id="security">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="text-xs font-mono text-[#FF9BE8] uppercase tracking-wider mb-2">
                Defense In Depth
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Built with developer control in mind.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { title: 'API Key Authentication', desc: 'Secure high-entropy tokens with revocation capability on demand.', icon: KeyRound },
                { title: 'Project Isolation', desc: 'Every storage volume belongs exclusively to its scoped workspace.', icon: Layers },
                { title: 'Access Control', desc: 'Strict separation between dashboard owner identity and developer live secrets.', icon: ShieldCheck },
                { title: 'Rate Limiting', desc: 'Protects backend upstream clusters from burst spikes and rogue abuse.', icon: Zap },
                { title: 'Usage Monitoring', desc: 'Granular audits of total byte ingress, bandwidth, and HTTP status codes.', icon: BarChart3 },
              ].map((sec) => {
                const Icon = sec.icon;
                return (
                  <div
                    key={sec.title}
                    className="liquid-glass p-5 rounded-xl border border-white/10 hover:border-[#FF4FD8]/40 transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FF4FD8]/10 flex items-center justify-center text-[#FF4FD8] mb-3">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-bold text-white mb-1.5">{sec.title}</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{sec.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================================================
            PRICING
        ================================================== */}
        <section className="py-20 bg-[#0B0D14]/50 border-y border-white/10" id="pricing">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="text-xs font-mono text-[#FF9BE8] uppercase tracking-wider mb-2">
                Transparent Plans
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Predictable storage for developers.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free */}
              <div className="liquid-glass p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Free</h3>
                  <p className="text-xs text-slate-400 mt-1">For hobby and sandbox prototypes</p>
                  <div className="mt-6 mb-6">
                    <span className="text-3xl font-extrabold text-white">$0</span>
                    <span className="text-xs text-slate-400 font-mono"> / month</span>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF4FD8]" /> 5 GB storage volume
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF4FD8]" /> 25 GB monthly bandwidth
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF4FD8]" /> 2 API keys per project
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF4FD8]" /> Community Discord support
                    </li>
                  </ul>
                </div>
                <Link
                  href="/signup"
                  className="mt-8 block text-center liquid-glass py-2.5 rounded-xl border border-white/15 text-xs font-semibold text-white hover:border-[#FF4FD8]/40 transition-all"
                >
                  Start Free
                </Link>
              </div>

              {/* Developer */}
              <div className="liquid-glass p-8 rounded-2xl border border-[#FF4FD8]/60 bg-[#FF4FD8]/[0.03] shadow-[0_0_30px_rgba(255,79,216,0.15)] flex flex-col justify-between relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF4FD8] to-[#FF2FB3] text-white px-3 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold">
                  Recommended
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Developer</h3>
                  <p className="text-xs text-slate-400 mt-1">For production web and mobile apps</p>
                  <div className="mt-6 mb-6">
                    <span className="text-3xl font-extrabold text-white">$29</span>
                    <span className="text-xs text-slate-400 font-mono"> / month</span>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-200">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF4FD8]" /> 100 GB storage volume
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF4FD8]" /> 500 GB monthly bandwidth
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF4FD8]" /> Video range streaming (HTTP 206)
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF4FD8]" /> Unlimited API keys
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF4FD8]" /> Standard email support
                    </li>
                  </ul>
                </div>
                <Link
                  href="/signup"
                  className="mt-8 block text-center liquid-glass py-2.5 rounded-xl border border-[#FF4FD8]/60 text-xs font-semibold text-white bg-gradient-to-r from-[#FF4FD8] to-[#FF2FB3] hover:opacity-95 shadow-[0_0_20px_rgba(255,79,216,0.3)] transition-all"
                >
                  Deploy Developer
                </Link>
              </div>

              {/* Business */}
              <div className="liquid-glass p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Business</h3>
                  <p className="text-xs text-slate-400 mt-1">For scale operations and multi-tenant platforms</p>
                  <div className="mt-6 mb-6">
                    <span className="text-3xl font-extrabold text-white">$149</span>
                    <span className="text-xs text-slate-400 font-mono"> / month</span>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF4FD8]" /> 1 TB storage volume
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF4FD8]" /> 5 TB monthly bandwidth
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF4FD8]" /> Dedicated high-priority edge nodes
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF4FD8]" /> Custom SLA & 24/7 incident response
                    </li>
                  </ul>
                </div>
                <Link
                  href="/contact"
                  className="mt-8 block text-center liquid-glass py-2.5 rounded-xl border border-white/15 text-xs font-semibold text-white hover:border-[#FF4FD8]/40 transition-all"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            FINAL CTA
        ================================================== */}
        <section className="relative py-28 overflow-hidden">
          <CtaGrid />

          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <div className="liquid-glass p-10 md:p-14 rounded-3xl border border-[#FF4FD8]/40 shadow-2xl bg-[#06070B]/85 backdrop-blur-2xl">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                Build your storage layer with <span className="text-gradient-pink">ZentraGrid</span>.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
                Connect your application to a developer-focused storage API.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="liquid-glass px-7 py-3.5 rounded-xl border border-[#FF4FD8]/70 text-sm font-semibold text-white bg-gradient-to-r from-[#FF4FD8] to-[#FF2FB3] hover:opacity-95 shadow-[0_0_25px_rgba(255,79,216,0.35)] transition-all flex items-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/docs"
                  className="liquid-glass px-7 py-3.5 rounded-xl border border-white/15 text-sm font-semibold text-slate-200 hover:text-white hover:border-[#FF4FD8]/40 transition-all"
                >
                  Explore Documentation
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
