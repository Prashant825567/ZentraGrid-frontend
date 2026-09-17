'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import { HardDrive, ArrowRight, Sparkles, Shield, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { signInWithGoogle, loading, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [inProgress, setInProgress] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setInProgress(true);
    try {
      await signInWithGoogle();
      toast.success('Authenticated', 'Welcome back to ZentraGrid console.');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Authentication was cancelled or failed.');
      toast.error('Authentication Error', err?.message || 'Failed to sign in with Google');
    } finally {
      setInProgress(false);
    }
  };

  // If already logged in, offer quick dashboard jump
  if (user) {
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#06070B] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial glow */}
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
          Sign in to your console
        </h2>
        <p className="mt-2 text-center text-xs text-slate-400">
          Manage storage buckets, stream nodes, and production API keys.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <div className="liquid-glass p-8 rounded-3xl border border-white/12 shadow-2xl bg-[#0B0D14]/90 backdrop-blur-2xl">
          {errorMsg && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Continue with Google button */}
            <button
              onClick={handleGoogleLogin}
              disabled={inProgress || loading}
              id="google-signin-btn"
              className="w-full liquid-glass py-3.5 px-4 rounded-xl border border-white/20 text-xs font-semibold text-white hover:border-[#FF4FD8]/60 hover:bg-white/[0.08] transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
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
              <span>{inProgress ? 'Connecting to Firebase...' : 'Continue with Google'}</span>
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
                <span className="bg-[#0B0D14] px-2 text-slate-500">Security Notice</span>
              </div>
            </div>

            <div className="liquid-glass-subtle p-3.5 rounded-xl border border-white/8 text-[11px] text-slate-400 space-y-1.5 leading-relaxed">
              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Shield className="w-3.5 h-3.5 text-[#67E8F9]" />
                Zero password storage
              </div>
              <p>
                Owner sessions are verified via cryptographically signed Firebase ID tokens. Developer live keys are strictly managed inside your project boundary.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#FF4FD8] font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-[11px] text-slate-500">
          By continuing, you agree to ZentraGrid&apos;s{' '}
          <Link href="/terms" className="underline hover:text-slate-400">Terms of Service</Link> and{' '}
          <Link href="/privacy" className="underline hover:text-slate-400">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
}
