'use client';

import React, { useState } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string;
  itemName?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  requireTypingName?: boolean;
  isDestructive?: boolean;
}

function ConfirmDialogContent({
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  requireTypingName = false,
  isDestructive = true,
}: Omit<ConfirmDialogProps, 'isOpen'>) {
  const [typedName, setTypedName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTypedMatch = !requireTypingName || (itemName && typedName.trim() === itemName.trim());

  const handleConfirm = async () => {
    if (!isTypedMatch || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (err: unknown) {
      console.error('Confirmation action failed:', err);
      setError(err instanceof Error ? err.message : 'Action failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md p-6 sm:p-7 rounded-3xl bg-[#0B0D14] border border-white/15 shadow-2xl space-y-5">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              isDestructive
                ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{description}</p>
          </div>
        </div>

        {itemName && (
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/8 text-xs font-mono text-slate-300 break-all">
            Target: <strong className="text-white">{itemName}</strong>
          </div>
        )}

        {requireTypingName && itemName && (
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Type <span className="font-mono text-white select-all">{itemName}</span> to confirm:
            </label>
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder={itemName}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
            />
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl border border-white/10 text-xs font-medium text-slate-300 hover:bg-white/[0.05] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isTypedMatch || isSubmitting}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              isDestructive
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                : 'bg-[#FF4FD8] hover:bg-[#FF2FB3] text-black shadow-[#FF4FD8]/25'
            }`}
          >
            {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConfirmDialog({ isOpen, ...rest }: ConfirmDialogProps) {
  if (!isOpen) return null;
  return <ConfirmDialogContent key={rest.itemName || 'confirm-dialog'} {...rest} />;
}
