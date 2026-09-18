'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { UserCheck, Building, User, Loader2, LogOut, ShieldAlert } from 'lucide-react';

export function CompleteProfileModal() {
  const { user, owner, updateProfile, signOut } = useAuth();

  const [name, setName] = useState(owner?.name || user?.displayName || '');
  const [company, setCompany] = useState(owner?.company || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await updateProfile({
        name: name.trim(),
        company: company.trim() || undefined,
      });
    } catch (err: unknown) {
      console.error('Failed to complete profile:', err);
      setError(err instanceof Error ? err.message : 'Could not save profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0B0D14] border border-[#FF4FD8]/30 shadow-2xl shadow-[#FF4FD8]/10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF4FD8]/20 to-[#8B5CF6]/20 border border-[#FF4FD8]/40 flex items-center justify-center text-[#FF4FD8]">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Complete Profile</h2>
            <p className="text-xs text-slate-400">Initialize your ZentraGrid developer workspace</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/8 text-xs text-slate-300 leading-relaxed">
          Your workspace requires an identified developer owner before managing storage clusters and production API keys.
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Full Name</span>
              <span className="text-[#FF4FD8]">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Chen"
              disabled={submitting}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-[#FF4FD8] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>Company / Team Name</span>
              <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Acme Cloud Corp"
              disabled={submitting}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-[#FF4FD8] transition-colors"
            />
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => signOut()}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>

            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF4FD8] hover:bg-[#FF2FB3] text-black font-semibold text-xs shadow-lg shadow-[#FF4FD8]/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Complete Setup</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
