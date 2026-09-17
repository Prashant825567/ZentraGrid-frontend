'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import { HardDrive, Check, Sparkles, AlertCircle, KeyRound, ArrowRight, Server } from 'lucide-react';

export default function SignupPage() {
  const { 
    signInWithGoogle, 
    signInWithDemo, 
    loginWithToken,
    loading, 
    user 
  } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [inProgress, setInProgress] = useState(false);
  const [tokenInProgress, setTokenInProgress] = useState(false);
  const [demoInProgress, setDemoInProgress] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bearerToken, setBearerToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://zentragrid.onrender.com';

  const handleGoogleSignup = async () => {
    setErrorMsg(null);
    setInProgress(true);
    try {
      await signInWithGoogle();
      toast.success('Registration Initialized', 'Welcome to ZentraGrid storage infrastructure.');
    } catch (err: any) {
      console.warn(err);
      setErrorMsg(err?.message || 'Could not complete Google authentication.');
    } finally {
      setInProgress(false);
    }
  };

  const handleTokenSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bearerToken.trim()) {
      setErrorMsg('Please enter a valid Firebase ID token');
      return;
    }

    setErrorMsg(null);
    setTokenInProgress(true);
    try {
      await loginWithToken(bearerToken.trim());
      toast.success('Owner Created', 'Welcome to ZentraGrid backend infrastructure.');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Token verification failed on backend.');
      toast.error('Signup Notice', err?.message || 'The backend rejected this token.');
    } finally {
      setTokenInProgress(false);
    }
  };

  const handleDemoSignup = async () => {
    setErrorMsg(null);
    setDemoInProgress(true);
    try {
      await signInWithDemo();
      toast.success('Developer Sandbox Active', 'Provisioned default workspace.');
    } catch (err: any) {
      console.warn('Sandbox signup error', err);
    } finally {
      setDemoInProgress(false);
    }
  };

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-[#06070B] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial-glow pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-6 group">
          <div className="w-10 h-10 rounded-xl liquid-glass flex items-center justify-center border border-[#FF4FD8]/40 shadow-[0_0_15px_rgba(255,79,216,0.3)]">
            <HardDrive className="w-5 h-5 text-[#FF4FD8]" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">
            Zentra<span className="text-[#FF4FD8]">Grid</span>
          </span>
        </Link>
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Create your developer account
        </h2>
        <p className="mt-2 text-center text-xs text-slate-400">
          Get started with 5 GB free storage volume and instantaneous API keys.
        </p>

        {/* Live Backend Indicator */}
        <div className="mt-3 flex items-center justify-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Server className="w-3 h-3 text-[#FF4FD8]" />
            <span className="font-mono text-[10px] text-slate-400 truncate max-w-[220px]">
              {apiBase}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <div className="liquid-glass p-8 rounded-3xl border border-white/12 shadow-2xl bg-[#0B0D14]/90 backdrop-blur-2xl">
          {errorMsg && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleGoogleSignup}
              disabled={inProgress || demoInProgress || tokenInProgress || loading}
              className="w-full liquid-glass py-3 px-4 rounded-xl border border-white/20 text-xs font-semibold text-white hover:border-[#FF4FD8]/60 hover:bg-white/[0.08] transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
                />
              </svg>
              <span>{inProgress ? 'Authorizing Account...' : 'Continue with Google'}</span>
            </button>

            {/* Direct Token Signup toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowTokenInput(!showTokenInput)}
                className="w-full py-2 px-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 text-xs flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2">
                  <KeyRound className="w-3.5 h-3.5 text-[#FF4FD8]" />
                  Sign Up with Firebase ID Token
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {showTokenInput ? 'Hide' : 'POST /v1/auth/google'}
                </span>
              </button>

              {showTokenInput && (
                <form onSubmit={handleTokenSignup} className="mt-3 p-3 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
                  <p className="text-[11px] text-slate-400">
                    Registers new owner on backend route <code className="text-[#FF9BE8]">POST /v1/auth/google</code> with <code className="text-slate-300">Authorization: Bearer &lt;token&gt;</code>.
                  </p>
                  <textarea
                    rows={2}
                    value={bearerToken}
                    onChange={(e) => setBearerToken(e.target.value)}
                    placeholder="Paste Firebase ID token (eyJhbGciOiJSUzI1NiIs...)"
                    className="w-full text-xs font-mono p-2.5 rounded-lg bg-black/60 border border-white/15 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#FF4FD8]"
                  />
                  <button
                    type="submit"
                    disabled={tokenInProgress || !bearerToken.trim()}
                    className="w-full py-2 px-3 rounded-lg bg-[#FF4FD8] hover:bg-[#FF2FB3] text-black text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <span>{tokenInProgress ? 'Registering on Backend...' : 'Create Owner via Token'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

            {/* Instant Developer Sandbox Button */}
            <button
              onClick={handleDemoSignup}
              disabled={inProgress || demoInProgress || tokenInProgress || loading}
              id="signup-demo-btn"
              className="w-full liquid-glass py-2.5 px-4 rounded-xl border border-[#FF4FD8]/40 text-xs font-semibold text-white bg-gradient-to-r from-[#FF4FD8]/15 to-[#FF2FB3]/15 hover:from-[#FF4FD8]/25 hover:to-[#FF2FB3]/25 hover:border-[#FF4FD8] transition-all flex items-center justify-center gap-2.5 shadow-[0_0_15px_rgba(255,79,216,0.15)] disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-[#FF4FD8]" />
              <span>{demoInProgress ? 'Provisioning Sandbox...' : 'Instant Developer Sandbox Access'}</span>
            </button>

            <div className="mt-6 pt-4 border-t border-white/10 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FF4FD8]" />
                <span>Instant provisioning of default storage project</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FF4FD8]" />
                <span>Zero client API keys needed — all configured in your backend</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FF4FD8]" />
                <span>Zero credit card required for developer tier</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-[#FF4FD8] font-semibold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
