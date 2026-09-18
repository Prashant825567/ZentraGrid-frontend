'use client';

import React, { useState } from 'react';
import { type ApiKeyCreated } from '@/lib/api';
import { KeyRound, Copy, Check, AlertTriangle, ShieldCheck, X } from 'lucide-react';

interface ApiKeyCreatedModalProps {
  data: ApiKeyCreated | null;
  onClose: () => void;
}

export function ApiKeyCreatedModal({ data, onClose }: ApiKeyCreatedModalProps) {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const { key, api_key } = data;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(api_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-[#0B0D14] border border-white/15 shadow-2xl space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-[#FF4FD8]/15 border border-[#FF4FD8]/30 flex items-center justify-center text-[#FF4FD8] shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Secret API Key Generated
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {key.name ? (
                <>
                  Created for <strong className="text-white">{key.name}</strong>
                </>
              ) : (
                'Your backend API key is ready for immediate production use.'
              )}
            </p>
          </div>
        </div>

        {/* High security warning banner */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Save this key immediately.</strong> For security reasons, we do not store the
            plaintext key and will never show it again. If lost, you will need to generate a new key.
          </div>
        </div>

        {/* Plaintext Secret Key Field */}
        <div className="space-y-2">
          <label className="block text-xs font-mono text-slate-400">
            Plaintext Secret Key:
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              readOnly
              value={api_key}
              className="w-full pl-3.5 pr-24 py-3 rounded-xl bg-white/[0.04] border border-[#FF4FD8]/40 text-emerald-400 font-mono text-xs select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="absolute right-2 px-3 py-1.5 rounded-lg bg-[#FF4FD8] hover:bg-[#FF2FB3] text-black font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#FF4FD8]/25"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Metadata Details */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/8 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px]">Key Hint</span>
            <span className="text-slate-300">{key.key_hint}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Key ID</span>
            <span className="text-slate-300 truncate block">{key.key_id}</span>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
          >
            I have stored my key safely
          </button>
        </div>
      </div>
    </div>
  );
}
