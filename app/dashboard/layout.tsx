'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { CompleteProfileModal } from '@/components/complete-profile-modal';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HardDrive,
  FolderKanban,
  Settings,
  LogOut,
  Menu,
  X,
  UserCircle2,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, owner, loading, signOut, requiresProfileCompletion, isSandbox } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Route guard
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && requiresProfileCompletion) {
      router.push('/complete-profile');
    }
  }, [user, loading, requiresProfileCompletion, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06070B] text-slate-100 flex flex-col p-6 sm:p-10">
        <div className="max-w-7xl mx-auto w-full animate-pulse space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10" />
              <div className="h-6 w-32 bg-white/10 rounded-lg" />
            </div>
            <div className="w-24 h-9 bg-white/10 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="h-32 rounded-2xl bg-white/5 border border-white/10" />
            <div className="h-32 rounded-2xl bg-white/5 border border-white/10" />
            <div className="h-32 rounded-2xl bg-white/5 border border-white/10" />
          </div>
          <div className="h-72 rounded-3xl bg-white/5 border border-white/10 mt-6" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navItems = [
    { name: 'Projects', href: '/dashboard', icon: FolderKanban, active: pathname === '/dashboard' || pathname.startsWith('/dashboard/projects') },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, active: pathname === '/dashboard/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#06070B] text-slate-100 flex flex-col selection:bg-[#FF4FD8]/30 selection:text-white">
      {/* Complete Profile Modal when required */}
      {requiresProfileCompletion && <CompleteProfileModal />}

      {/* Top navigation header */}
      <header className="h-16 border-b border-white/10 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 bg-[#06070B]/90 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF4FD8] to-[#FF2FB3] flex items-center justify-center text-black shadow-md shadow-[#FF4FD8]/25">
              <HardDrive className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold tracking-tight text-white group-hover:text-slate-200 transition-colors">
                ZENTRAGRID
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/[0.05] border border-white/10 text-slate-400">
                CONSOLE
              </span>
            </div>
          </Link>

          {/* Desktop navigation tabs */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    item.active
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side: Owner info + Sign out */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="w-6 h-6 rounded-full bg-[#FF4FD8]/20 border border-[#FF4FD8]/40 flex items-center justify-center text-[10px] font-bold text-[#FF9BE8]">
              {owner?.name ? owner.name.charAt(0).toUpperCase() : 'O'}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-medium text-white max-w-[130px] truncate">
                {owner?.name || user.email || 'Owner'}
              </span>
              {owner?.company && (
                <span className="text-[10px] text-slate-400 max-w-[130px] truncate leading-none">
                  {owner.company}
                </span>
              )}
            </div>
            <span className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FF4FD8]/15 text-[#FF9BE8] border border-[#FF4FD8]/25 uppercase">
              {owner?.plan || 'Free'}
            </span>
          </div>

          <button
            onClick={() => signOut()}
            className="p-2 rounded-xl border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0B0D14] p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  item.active ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Main viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
