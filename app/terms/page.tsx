'use client';

import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#06070B] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-white mb-6">Terms of Service</h1>
        <div className="liquid-glass p-8 rounded-3xl border border-white/10 space-y-6 text-xs text-slate-300 leading-relaxed">
          <p>Effective Date: September 17, 2026</p>
          <h3 className="text-sm font-bold text-white">1. Developer Storage Infrastructure</h3>
          <p>
            ZentraGrid provides file storage, streaming, and RESTful API services for applications. By creating an account or obtaining an API key, you agree to comply with our acceptable use policies.
          </p>
          <h3 className="text-sm font-bold text-white">2. Acceptable Content</h3>
          <p>
            Users are strictly prohibited from using ZentraGrid to store or distribute malware, illegal content, or violating third-party intellectual property rights.
          </p>
          <h3 className="text-sm font-bold text-white">3. API Usage &amp; Rate Limits</h3>
          <p>
            API requests are subject to tier-based quotas. Excessive automated traffic designed to overwhelm storage clusters may result in temporary throttling or token revocation.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
