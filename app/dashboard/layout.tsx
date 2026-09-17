'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import DashboardSidebar from '@/components/dashboard/sidebar';
import DashboardTopbar from '@/components/dashboard/topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Auth Guard
  useEffect(() => {
    if (!loading && !user) {
      // In development / demo mode, if Firebase isn't configured, AuthContext creates a mock developer user
      // so user is typically present. If null, redirect to login.
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06070B] flex items-center justify-center">
        <div className="liquid-glass p-8 rounded-2xl border border-white/10 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#FF4FD8] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-slate-300">Initializing ZentraGrid Console...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06070B] text-slate-100 flex">
      {/* Sidebar */}
      <DashboardSidebar 
        mobileOpen={mobileSidebarOpen} 
        onCloseMobile={() => setMobileSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar 
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
