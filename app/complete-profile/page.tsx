'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { HardDrive, ArrowRight, User, Building, Sparkles, Loader2, ShieldCheck } from 'lucide-react';

export default function CompleteProfilePage() {
  const { user, owner, updateProfile, reloadProjects, requiresProfileCompletion, loading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(() => owner?.name || user?.displayName || '');
  const [company, setCompany] = useState(() => owner?.company || '');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If user already has a complete profile, go straight to dashboard
  useEffect(() => {
    if (!loading) {
      if (!user && !owner) {
        router.push('/login');
      } else if (owner && owner.profile_completed && owner.name && !requiresProfileCompletion) {
        router.push('/dashboard');
      }
    }
  }, [user, owner, loading, requiresProfileCompletion, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMsg('Please enter your name to complete your profile.');
      return;
    }

    setSubmitting(true);
    try {
      // Calls PATCH /v1/auth/me which auto-creates the default project in backend
      await updateProfile({
        name: trimmedName,
        company: company.trim() || undefined,
      });

      // Reload project list to fetch the newly created default project
      await reloadProjects();

      router.push('/dashboard');
    } catch (err: unknown) {
      console.error('Profile completion error:', err);
      const msg = err instanceof Error ? err.message : 'Could not complete profile. Please try again.';
      setErrorMsg(msg);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06070B] text-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF4FD8]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06070B] text-slate-100 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-[#FF4FD8]/30 selection:text-white">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-[#FF4FD8]/15 to-[#67E8F9]/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF4FD8] to-[#FF2FB3] flex items-center justify-center text-black shadow-lg shadow-[#FF4FD8]/25">
            <HardDrive className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="font-mono text-base font-bold tracking-tight text-white">
            ZENTRAGRID
          </span>
        </div>
        <span className="text-xs font-mono text-slate-500 border border-white/10 px-2.5 py-1 rounded-full bg-white/[0.02]">
          STEP 2 OF 2 &bull; ONBOARDING
        </span>
      </div>

      {/* Main Form Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg my-auto relative z-10">
        <div className="p-8 sm:p-10 rounded-3xl border border-white/12 shadow-2xl bg-[#0B0D14]/90 backdrop-blur-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#67E8F9]/10 border border-[#67E8F9]/20 text-[11px] font-mono text-[#67E8F9] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Welcome to ZentraGrid</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Complete your founder profile
            </h1>
            <p className="mt-3 text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              {owner?.email || user?.email ? (
                <>
                  Signed in as <span className="text-slate-200 font-mono">{owner?.email || user?.email}</span>.
                  Setting up your profile automatically provisions your default storage cluster.
                </>
              ) : (
                'Tell us your name and workspace so we can provision your storage infrastructure.'
              )}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs leading-relaxed">
              <p>{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name field */}
            <div>
              <label htmlFor="founder-name" className="block text-xs font-medium text-slate-300 mb-2">
                Your Full Name <span className="text-[#FF4FD8]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="founder-name"
                  type="text"
                  required
                  maxLength={120}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Prashant Rajput"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4FD8]/40 focus:border-[#FF4FD8] transition-all"
                />
              </div>
            </div>

            {/* Company / Workspace field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="company-name" className="block text-xs font-medium text-slate-300">
                  Company / Organization <span className="text-slate-500 text-[11px]">(Optional)</span>
                </label>
                <span className="text-[11px] text-slate-500">Used as default project name</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Building className="w-4 h-4" />
                </div>
                <input
                  id="company-name"
                  type="text"
                  maxLength={160}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. ZentraGrid Labs"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#67E8F9]/40 focus:border-[#67E8F9] transition-all"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={submitting}
              id="complete-profile-btn"
              className="w-full mt-6 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#FF4FD8] to-[#FF2FB3] hover:opacity-95 text-black font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF4FD8]/25 active:scale-[0.99] disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Provisioning Workspace & Default Project...</span>
                </>
              ) : (
                <>
                  <span>Save & Enter Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/8 flex items-center justify-center gap-2 text-slate-400 text-xs text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Identity verified via Firebase OAuth</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto w-full text-center text-xs text-slate-500 z-10">
        Need help? Contact ZentraGrid Infrastructure Support
      </div>
    </div>
  );
}
