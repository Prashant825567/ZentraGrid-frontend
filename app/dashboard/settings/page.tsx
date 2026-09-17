'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import { 
  Settings, 
  User, 
  Building, 
  Mail, 
  ShieldCheck, 
  Save, 
  LogOut,
  Radio
} from 'lucide-react';

export default function SettingsPage() {
  const { user, profile, updateProfile, logout } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState(profile?.name || user?.displayName || '');
  const [company, setCompany] = useState(profile?.company || '');
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning('Name cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      await updateProfile({ name: name.trim(), company: company.trim() || undefined });
      toast.success('Profile Updated', 'Your developer identity has been synchronized via PATCH /v1/auth/me.');
    } catch (err: any) {
      toast.error('Update Failed', err?.message || 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-[#FF4FD8]" />
          <span>Account Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your verified owner identity and account security parameters.
        </p>
      </div>

      {/* Profile Card */}
      <div className="liquid-glass p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF4FD8] to-[#8B5CF6] p-[1px] flex items-center justify-center shadow-lg">
              <div className="w-full h-full rounded-[15px] bg-[#0B0D14] flex items-center justify-center font-bold text-white text-base">
                {name ? name.charAt(0).toUpperCase() : 'A'}
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{name || 'Developer Architect'}</h3>
              <p className="text-xs text-slate-400 font-mono">{user?.email || 'owner@zentragrid.dev'}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
              OWNER VERIFIED
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Satoshi Nakamoto"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF4FD8]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              Company or Team Name
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Acme Storage Systems"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF4FD8]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              Primary Email (Authenticated via Google)
            </label>
            <input
              type="email"
              disabled
              value={user?.email || 'owner@zentragrid.dev'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-sm text-slate-400 cursor-not-allowed font-mono"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="liquid-glass px-5 py-2.5 rounded-xl border border-[#FF4FD8]/60 text-xs font-semibold text-white bg-gradient-to-r from-[#FF4FD8] to-[#FF2FB3] hover:opacity-95 shadow-[0_0_20px_rgba(255,79,216,0.3)] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Synchronizing...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Security & Danger Zone */}
      <div className="liquid-glass p-6 rounded-3xl border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#67E8F9]" />
          Identity &amp; Session Management
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Your account is governed by Firebase Single Sign-On. Signing out clears your local session tokens.
        </p>

        <div className="pt-2">
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl liquid-glass border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Console</span>
          </button>
        </div>
      </div>
    </div>
  );
}
