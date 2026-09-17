'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { 
  FolderKanban, 
  ChevronDown, 
  Bell, 
  LogOut, 
  Menu, 
  Plus, 
  Check, 
  UserCircle2, 
  Radio
} from 'lucide-react';
import Link from 'next/link';

interface TopbarProps {
  onToggleMobileSidebar: () => void;
}

export default function DashboardTopbar({ onToggleMobileSidebar }: TopbarProps) {
  const { user, profile, logout, projects, currentProject, setCurrentProject } = useAuth();
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="h-16 liquid-glass border-b border-white/10 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 bg-[#06070B]/80 backdrop-blur-xl">
      {/* Left: Mobile trigger & Project Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white liquid-glass"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Project Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className="liquid-glass px-3 py-1.5 rounded-xl border border-white/12 hover:border-[#FF4FD8]/50 text-xs font-medium text-white flex items-center gap-2 transition-all shadow-sm"
          >
            <FolderKanban className="w-3.5 h-3.5 text-[#FF4FD8]" />
            <span className="font-semibold max-w-[140px] truncate">
              {currentProject ? currentProject.name : 'Select Project'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {projectDropdownOpen && (
            <div 
              className="absolute top-full left-0 mt-2 w-64 liquid-glass rounded-xl border border-white/15 shadow-2xl p-2 z-50 bg-[#0B0D14]/95 animate-fade-in"
              onMouseLeave={() => setProjectDropdownOpen(false)}
            >
              <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider">
                Projects
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1 my-1">
                {projects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      setCurrentProject(proj);
                      setProjectDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      currentProject?.id === proj.id
                        ? 'bg-[#FF4FD8]/20 text-white font-medium border border-[#FF4FD8]/30'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="truncate">{proj.name}</span>
                    {currentProject?.id === proj.id && (
                      <Check className="w-3 h-3 text-[#FF4FD8]" />
                    )}
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-white/10">
                <Link
                  href="/dashboard/projects"
                  onClick={() => setProjectDropdownOpen(false)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-[#FF9BE8] hover:bg-white/5 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create or Manage Projects</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Backend readiness ping */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-slate-400 liquid-glass-subtle px-2.5 py-1 rounded-lg border border-white/5">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>v1 API Active</span>
        </div>
      </div>

      {/* Right: Notifications & User profile */}
      <div className="flex items-center gap-3">
        {/* Notifications toggle */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl liquid-glass text-slate-300 hover:text-white border border-white/10 hover:border-[#FF4FD8]/40 transition-all relative"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF4FD8] rounded-full ring-2 ring-[#06070B]" />
          </button>

          {notificationsOpen && (
            <div 
              className="absolute top-full right-0 mt-2 w-80 liquid-glass rounded-xl border border-white/15 shadow-2xl p-3 z-50 bg-[#0B0D14]/95 text-xs animate-fade-in"
              onMouseLeave={() => setNotificationsOpen(false)}
            >
              <div className="font-semibold text-white mb-2 flex items-center justify-between">
                <span>Infrastructure Feed</span>
                <span className="text-[10px] font-mono text-emerald-400">All Live</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-white/[0.04] border border-white/5">
                  <div className="text-slate-200 font-medium">Storage cluster online</div>
                  <div className="text-slate-400 text-[11px]">Primary region us-east initialized with zero egress latency.</div>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.04] border border-white/5">
                  <div className="text-slate-200 font-medium">Rate limit capacity: 100%</div>
                  <div className="text-slate-400 text-[11px]">10,000 req/min available on your developer tier.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 pl-3 border-l border-white/10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF4FD8] to-[#8B5CF6] p-[1px] flex items-center justify-center shadow-[0_0_10px_rgba(255,79,216,0.2)]">
            <div className="w-full h-full rounded-[11px] bg-[#0B0D14] flex items-center justify-center text-xs font-bold text-white">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'A')}
            </div>
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-white max-w-[130px] truncate">
              {profile?.name || user?.displayName || 'Developer Architect'}
            </span>
            <span className="text-[10px] text-slate-400 max-w-[130px] truncate font-mono">
              {profile?.company || user?.email || 'ZentraGrid Owner'}
            </span>
          </div>

          <button
            onClick={logout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
