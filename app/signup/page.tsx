'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { HardDrive, ArrowRight, Shield, Layers, KeyRound, Zap, Loader2 } from 'lucide-react';

export default function SignupPage() {
  const { signIn, loading, user, requiresProfileCompletion, owner } = useAuth();
  const router = useRouter();
  const [signingIn, setSigningIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      if (requiresProfileCompletion || (owner && !owner.profile_completed)) {
        router.push('/complete-profile');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, owner, loading, requiresProfileCompletion, router]);

  const handleSignIn = async () => {
    setErrorMsg(null);
    setSigningIn(true);
    try {
      await signIn();
    } catch (err: unknown) {
      console.error('Sign up failed:', err);
      const msg = err instanceof Error ? err.message : 'Google authentication could not be completed.';
      setErrorMsg(msg);
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06070B] text-slate-100 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-[#FF4FD8]/30 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-[#FF4FD8]/15 to-[#67E8F9]/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF4FD8] to-[#FF2FB3] flex items-center justify-center text-black shadow-lg shadow-[#FF4FD8]/25">
            <HardDrive className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="font-mono text-base font-bold tracking-tight text-white group-hover:text-slate-200 transition-colors">
            ZENTRAGRID
          </span>
        </Link>
        <span className="text-xs font-mono text-slate-500 border border-white/10 px-2.5 py-1 rounded-full bg-white/[0.02]">
          NEW FOUNDER ACCOUNT
        </span>
      </div>

      {/* Main card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md my-auto relative z-10">
        <div className="p-8 sm:p-10 rounded-3xl border border-white/12 shadow-2xl bg-[#0B0D14]/90 backdrop-blur-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4FD8]/10 border border-[#FF4FD8]/20 text-[11px] font-mono text-[#FF9BE8] mb-4">
              <Zap className="w-3 h-3" />
              <span>Free Founder Tier</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Create your storage workspace
            </h1>
            <p className="mt-3 text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              Authenticate via Google. You&apos;ll receive an instant API key and default storage project ready for uploads.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs leading-relaxed">
              <p>{errorMsg}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Google Signup Button */}
            <button
              onClick={handleSignIn}
              disabled={signingIn || loading}
              id="google-signup-btn"
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-black text-xs font-bold transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-white/10 active:scale-[0.99] disabled:opacity-50"
            >
              {signingIn ? (
                <Loader2 className="w-4 h-4 animate-spin text-black" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.7 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.6c-.3 1.5-1.1 2.8-2.4 3.7v3.1h3.9c2.3-2.1 3.6-5.2 3.6-9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.2 0 6-1.1 8-3l-3.9-3.1c-1.1.7-2.5 1.2-4.1 1.2-3.2 0-5.9-2.2-6.8-5.1H1.2v3.2C3.2 21.1 7.3 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.2 14c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3V6.2H1.2C.4 7.8 0 9.8 0 12s.4 4.2 1.2 5.8l4-3.8z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C18 1.2 15.2 0 12 0 7.3 0 3.2 2.9 1.2 6.2l4 3.1c.9-2.9 3.6-4.5 6.8-4.5z"
                  />
                </svg>
              )}
              <span>{signingIn ? 'Authorizing Account...' : 'Continue with Google'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 ml-auto" />
            </button>

            <div className="mt-8 pt-6 border-t border-white/8 space-y-3">
              <div className="flex items-start gap-2.5 text-slate-300 text-xs">
                <KeyRound className="w-4 h-4 text-[#FF4FD8] shrink-0 mt-0.5" />
                <span>Zero client secrets — API keys are hashed and managed per-project</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-300 text-xs">
                <Layers className="w-4 h-4 text-[#67E8F9] shrink-0 mt-0.5" />
                <span>Default project created automatically on first signup</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-300 text-xs">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>No duplicate accounts — matches your Google email and Firebase UID</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto w-full text-center text-xs text-slate-500 z-10">
        Already have an account? <Link href="/login" className="text-white hover:underline">Sign in</Link>
      </div>
    </div>
  );
}
