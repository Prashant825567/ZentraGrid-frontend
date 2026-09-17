'use client';

import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#06070B] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-white mb-6">Privacy Policy</h1>
        <div className="liquid-glass p-8 rounded-3xl border border-white/10 space-y-6 text-xs text-slate-300 leading-relaxed">
          <p>Effective Date: September 17, 2026</p>
          <h3 className="text-sm font-bold text-white">1. Information Collection</h3>
          <p>
            We collect account identifiers authenticated via Google Single Sign-On (such as name and email), as well as operational metadata regarding storage volume, bandwidth, and API request logs.
          </p>
          <h3 className="text-sm font-bold text-white">2. Blob Privacy &amp; Encryption</h3>
          <p>
            Your uploaded files belong exclusively to your scoped project. We do not sell or inspect user payload binaries except as necessary to deliver range streaming and verify integrity hashes.
          </p>
          <h3 className="text-sm font-bold text-white">3. Security Standards</h3>
          <p>
            All data in transit is encrypted using TLS 1.3, and backend credentials are cryptographic high-entropy hashes.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
