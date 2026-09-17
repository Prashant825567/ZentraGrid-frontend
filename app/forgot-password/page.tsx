'use client';

import React from 'react';
import Link from 'next/link';
import { HardDrive, ArrowLeft, Shield } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#06070B] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl liquid-glass flex items-center justify-center border border-[#FF4FD8]/40">
            <HardDrive className="w-5 h-5 text-[#FF4FD8]" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">
            Zentra<span className="text-[#FF4FD8]">Grid</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Passwordless Architecture
        </h2>
        <p className="mt-2 text-xs text-slate-400 max-w-sm mx-auto">
          ZentraGrid exclusively uses Google Identity & Firebase Authentication. There are no stored passwords to reset.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <div className="liquid-glass p-8 rounded-3xl border border-white/12 text-center bg-[#0B0D14]/90 backdrop-blur-2xl">
          <Shield className="w-10 h-10 text-[#67E8F9] mx-auto mb-4" />
          <h3 className="text-sm font-semibold text-white mb-2">Secure Federated Sign-In</h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-6">
            To access your ZentraGrid projects and storage volumes, simply continue with your verified Google account.
          </p>
          <Link
            href="/login"
            className="w-full liquid-glass py-3 px-4 rounded-xl border border-[#FF4FD8]/60 text-xs font-semibold text-white bg-gradient-to-r from-[#FF4FD8] to-[#FF2FB3] flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
