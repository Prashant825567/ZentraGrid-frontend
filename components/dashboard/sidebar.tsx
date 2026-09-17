'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HardDrive, 
  LayoutDashboard, 
  FolderKanban, 
  Database, 
  KeyRound, 
  BarChart3, 
  CreditCard, 
  BookOpen, 
  Settings,
  X
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
  { name: 'Storage', href: '/dashboard/storage', icon: Database },
  { name: 'API Keys', href: '/dashboard/api-keys', icon: KeyRound },
  { name: 'Usage', href: '/dashboard/usage', icon: BarChart3 },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Documentation', href: '/docs', icon: BookOpen },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardSidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const content = (
    <div className="flex flex-col h-full liquid-glass border-r border-white/10 bg-[#06070B]/90 backdrop-blur-2xl p-4">
      {/* Brand */}
      <div className="flex items-center justify-between px-2 py-3 mb-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg liquid-glass flex items-center justify-center border border-[#FF4FD8]/40 shadow-[0_0_10px_rgba(255,79,216,0.3)]">
            <HardDrive className="w-4 h-4 text-[#FF4FD8]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1">
              Zentra<span className="text-[#FF4FD8]">Grid</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">CONSOLE</span>
          </div>
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-slate-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.href === '/dashboard' 
            ? pathname === '/dashboard' 
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#FF4FD8]/20 to-transparent text-white border border-[#FF4FD8]/40 shadow-[0_0_15px_rgba(255,79,216,0.15)] font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF4FD8]' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* System Status card */}
      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="liquid-glass-subtle p-3 rounded-xl border border-white/8 text-[11px]">
          <div className="flex items-center justify-between text-slate-300 font-medium mb-1">
            <span>Cluster Status</span>
            <span className="flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              HEALTHY
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Region: us-east-multi
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile} 
          />
          <div className="relative w-72 max-w-[80vw] h-full z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
