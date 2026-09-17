'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import { HardDrive, ShieldCheck, Check, Sparkles } from 'lucide-react';

export default function SignupPage() {
  const { signInWithGoogle, loading, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [inProgress, setInProgress] = useState(false);

  const handleGoogleSignup = async () => {
    setInProgress(true);
    try {
      await signInWithGoogle();
      toast.success('Registration Initialized', 'Welcome to ZentraGrid storage infrastructure.');
    } catch (err: any) {
      toast.error('Signup Error', err?.message || 'Could not complete Google authentication.');
    } finally {
      setInProgress(false);
    }
  };

  if (user) {
    router.push('/dashboard');
  }

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
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <div className="liquid-glass p-8 rounded-3xl border border-white/12 shadow-2xl bg-[#0B0D14]/90 backdrop-blur-2xl">
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignup}
              disabled={inProgress || loading}
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
              <span>{inProgress ? 'Authorizing Account...' : 'Continue with Google'}</span>
            </button>

            <div className="mt-6 pt-4 border-t border-white/10 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FF4FD8]" />
                <span>Instant provisioning of default storage project</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FF4FD8]" />
                <span>Single-sign-on authenticated via Firebase Auth</span>
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
