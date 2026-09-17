'use client';

import React, { useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { useToast } from '@/context/toast-context';
import { Mail, MessageSquare, Send, Check } from 'lucide-react';

export default function ContactPage() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.warning('Please complete all required fields.');
      return;
    }
    setSent(true);
    toast.success('Message Dispatched', 'A ZentraGrid storage architect will respond shortly.');
  };

  return (
    <div className="min-h-screen bg-[#06070B] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="liquid-glass px-3.5 py-1.5 rounded-full border border-[#FF4FD8]/40 inline-flex items-center gap-2 mb-4">
              <Mail className="w-4 h-4 text-[#FF4FD8]" />
              <span className="text-xs font-mono text-slate-300">Direct Support</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
              Get in touch with engineering.
            </h1>
            <p className="text-sm text-slate-400">
              Have questions about custom quotas, migration, or dedicated clusters?
            </p>
          </div>

          <div className="liquid-glass p-8 md:p-10 rounded-3xl border border-white/12 shadow-2xl bg-[#0B0D14]/90">
            {sent ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-[#FF4FD8]/20 border border-[#FF4FD8]/50 flex items-center justify-center mx-auto mb-4 text-[#FF4FD8]">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Message Received</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Thank you for reaching out. An engineer will follow up with you at <span className="text-white font-mono">{email}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF4FD8] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@company.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF4FD8] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Message / Project Details
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your storage scale, current provider, or questions..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF4FD8] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full liquid-glass py-3 rounded-xl border border-[#FF4FD8]/60 text-sm font-semibold text-white bg-gradient-to-r from-[#FF4FD8] to-[#FF2FB3] hover:opacity-95 shadow-[0_0_20px_rgba(255,79,216,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
