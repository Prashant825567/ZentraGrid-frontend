'use client';

import React from 'react';
import { useAuth } from '@/context/auth-context';
import { 
  BarChart3, 
  Database, 
  Zap, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function UsagePage() {
  const { currentProject } = useAuth();

  const quotaBytes = currentProject?.storage_quota_bytes || 100 * 1024 * 1024 * 1024;
  const usedBytes = currentProject?.storage_used_bytes || 18.4 * 1024 * 1024 * 1024;
  const quotaPercent = Math.min(100, Math.round((usedBytes / quotaBytes) * 100));

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-[#FF4FD8]" />
          <span>Usage &amp; Telemetry</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Real-time byte consumption, network throughput, and API traffic distribution.
        </p>
      </div>

      {/* Main Meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Storage Meter */}
        <div className="liquid-glass p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#FF4FD8]" />
              <h3 className="text-sm font-bold text-white">Storage Volume Allocation</h3>
            </div>
            <span className="text-xs font-mono text-[#FF4FD8] font-bold">{quotaPercent}%</span>
          </div>

          <div className="text-3xl font-extrabold text-white font-mono">
            {formatBytes(usedBytes)}{' '}
            <span className="text-xs text-slate-400 font-sans font-normal">
              of {formatBytes(quotaBytes)} limit
            </span>
          </div>

          <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF4FD8] to-[#FF2FB3] rounded-full transition-all"
              style={{ width: `${quotaPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-2">
            <span>Remaining: {formatBytes(quotaBytes - usedBytes)}</span>
            <span className="text-emerald-400">Within Standard Quota</span>
          </div>
        </div>

        {/* Bandwidth Meter */}
        <div className="liquid-glass p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#67E8F9]" />
              <h3 className="text-sm font-bold text-white">Bandwidth &amp; Video Egress</h3>
            </div>
            <span className="text-xs font-mono text-[#67E8F9] font-bold">8.5%</span>
          </div>

          <div className="text-3xl font-extrabold text-white font-mono">
            42.8 GB{' '}
            <span className="text-xs text-slate-400 font-sans font-normal">
              of 500 GB billing cycle
            </span>
          </div>

          <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#67E8F9] to-[#8B5CF6] rounded-full transition-all"
              style={{ width: '8.5%' }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-2">
            <span>Cycle resets in 13 days</span>
            <span className="text-[#67E8F9]">457.2 GB Available</span>
          </div>
        </div>
      </div>

      {/* HTTP Status & Traffic Analysis */}
      <div className="liquid-glass p-6 rounded-3xl border border-white/10 space-y-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#FF9BE8]" />
          HTTP Status Breakdown (Last 30 Days)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="liquid-glass-subtle p-4 rounded-xl border border-white/8">
            <div className="text-emerald-400 font-semibold mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              2xx Success
            </div>
            <div className="text-2xl font-bold text-white">128,470</div>
            <div className="text-[10px] text-slate-400 mt-1">99.98% of total operations</div>
          </div>

          <div className="liquid-glass-subtle p-4 rounded-xl border border-white/8">
            <div className="text-amber-400 font-semibold mb-1 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              4xx Client / Auth
            </div>
            <div className="text-2xl font-bold text-white">18</div>
            <div className="text-[10px] text-slate-400 mt-1">Invalid keys or missing ranges</div>
          </div>

          <div className="liquid-glass-subtle p-4 rounded-xl border border-white/8">
            <div className="text-rose-400 font-semibold mb-1 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              5xx Server Fault
            </div>
            <div className="text-2xl font-bold text-white">4</div>
            <div className="text-[10px] text-slate-400 mt-1">Transient cluster retry resolved</div>
          </div>
        </div>
      </div>
    </div>
  );
}
