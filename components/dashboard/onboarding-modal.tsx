'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import { Sparkles, Building, User, ArrowRight } from 'lucide-react';

export default function OnboardingModal() {
  const { requiresProfileCompletion, updateProfile } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!requiresProfileCompletion) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning('Please enter your full name');
      return;
    }

    try {
      setSubmitting(true);
      await updateProfile({ name: name.trim(), company: company.trim() || undefined });
      toast.success('Welcome to ZentraGrid!', 'Your developer account has been configured.');
    } catch (err: any) {
      toast.error('Failed to update profile', err?.message || 'Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <div className="w-full max-w-md liquid-glass p-8 rounded-2xl border border-[#FF4FD8]/40 shadow-2xl bg-[#0B0D14]/95 animate-fade-in relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF4FD8]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-2 text-xs font-mono text-[#FF9BE8] uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#FF4FD8]" />
          Welcome Architect
        </div>

        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
          Complete your developer profile
        </h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          ZentraGrid attaches all storage clusters, bucket policies, and API keys to your verified developer identity.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Full Name <span className="text-[#FF4FD8]">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Satoshi Nakamoto"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF4FD8] focus:ring-1 focus:ring-[#FF4FD8] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              Company / Team <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Acme Cloud Corp"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF4FD8] focus:ring-1 focus:ring-[#FF4FD8] transition-all"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full liquid-glass py-3 px-4 rounded-xl border border-[#FF4FD8]/60 text-sm font-semibold text-white bg-gradient-to-r from-[#FF4FD8] to-[#FF2FB3] hover:opacity-95 shadow-[0_0_20px_rgba(255,79,216,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <span>Configuring Profile...</span>
              ) : (
                <>
                  <span>Enter Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
