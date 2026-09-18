'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { HardDrive, ArrowRight, Shield, Layers, KeyRound, Zap, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { signIn, signInWithSandbox, loading, user, requiresProfileCompletion, owner } = useAuth();
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
      console.error('Sign in failed:', err);
      const msg = err instanceof Error ? err.message : 'Google authentication could not be completed.';
      setErrorMsg(msg);
    } finally {
      setSigningIn(false);
    }
  };

  const isInvalidKey = errorMsg?.toLowerCase().includes('api-key-not-valid') || errorMsg?.toLowerCase().includes('api_key_invalid');

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
          DEVELOPER CONSOLE
        </span>
      </div>

      {/* Main card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md my-auto relative z-10">
        <div className="p-8 sm:p-10 rounded-3xl border border-white/12 shadow-2xl bg-[#0B0D14]/90 backdrop-blur-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4FD8]/10 border border-[#FF4FD8]/20 text-[11px] font-mono text-[#FF9BE8] mb-4">
              <Zap className="w-3 h-3" />
              <span>Developer Storage Infrastructure</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Storage for your app&apos;s user content
            </h1>
            <p className="mt-3 text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              Sign in with your Google developer account to access your storage clusters, manage API keys, and monitor usage.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs leading-relaxed space-y-3">
              <div className="font-semibold text-rose-200 flex items-center gap-2">
                <span>⚠️ Authentication Notice</span>
              </div>
              <p className="font-mono text-[11px] break-all text-rose-400 bg-black/40 p-2 rounded-lg border border-rose-500/20">
                {errorMsg}
              </p>

              {isInvalidKey && (
                <div className="pt-2 border-t border-rose-500/20 space-y-2 text-[11px] text-slate-300">
                  <p className="font-medium text-white">Google Identity Toolkit ne yeh API key accept nahi ki. Iske 2 mukhya kaaran ho sakte hain:</p>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-300">
                    <li>
                      <strong>Authentication Start nahi hua:</strong> Firebase Console &rarr; <strong>Build &rarr; Authentication</strong> par jakar <strong>&quot;Get started&quot;</strong> par click karein aur Google Sign-in ko Enable karein.
                    </li>
                    <li>
                      <strong>API Key Mismatch / Restriction:</strong> Firebase Project Settings &rarr; General tab mein <strong>Web API Key</strong> check karein ya Google Cloud Console mein key restrictions check karein.
                    </li>
                  </ol>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => signInWithSandbox('Dev Founder', 'ZentraGrid Labs')}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#FF4FD8] to-[#8B5CF6] text-black font-bold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      <Zap className="w-3.5 h-3.5 text-black" />
                      <span>Test with Developer Preview Sandbox (Bypass)</span>
                    </button>
                    <p className="text-[10px] text-center text-slate-400 mt-1.5">
                      (Aap bina Firebase API key fix kiye abhi dashboard inspect kar sakte hain)
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            {/* Google Sign-in Button */}
            <button
              onClick={handleSignIn}
              disabled={signingIn || loading}
              id="google-login-btn"
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
              <span>{signingIn ? 'Connecting with Google...' : 'Continue with Google'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 ml-auto" />
            </button>

            {/* Architecture highlights */}
            <div className="mt-8 pt-6 border-t border-white/8 space-y-3">
              <div className="flex items-start gap-2.5 text-slate-300 text-xs">
                <KeyRound className="w-4 h-4 text-[#FF4FD8] shrink-0 mt-0.5" />
                <span>Immediate API key generation with 20 active keys per project</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-300 text-xs">
                <Layers className="w-4 h-4 text-[#67E8F9] shrink-0 mt-0.5" />
                <span>Automatic default project setup with live quota tracking</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-300 text-xs">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Cryptographically verified Firebase ID token authentication</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto w-full text-center text-xs text-slate-500 z-10">
        Don&apos;t have an account? <Link href="/signup" className="text-white hover:underline">Sign up</Link>
      </div>
    </div>
  );
}
