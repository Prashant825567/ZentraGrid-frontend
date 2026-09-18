'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/auth-context';
import { usageApi } from '@/lib/api';
import { ProjectUsage } from '@/lib/types';
import { 
  BarChart3, 
  Database, 
  Zap, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Film,
  RefreshCw
} from 'lucide-react';

export default function UsagePage() {
  const { currentProject, getIdToken } = useAuth();
  const [usage, setUsage] = useState<ProjectUsage | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUsage = useCallback(async () => {
    const targetPid = currentProject?.project_id || currentProject?.id;
    if (!targetPid) return;
    setLoading(true);
    try {
      const token = await getIdToken();
      if (token) {
        const data = await usageApi.get(token, targetPid);
        setUsage(data);
      }
    } catch (err) {
      console.warn('Failed to load project usage:', err);
    } finally {
      setLoading(false);
    }
  }, [currentProject, getIdToken]);

  useEffect(() => {
    const targetPid = currentProject?.project_id || currentProject?.id;
    if (!targetPid) return;
    let isCancelled = false;

    (async () => {
      setLoading(true);
      try {
        const token = await getIdToken();
        if (token) {
          const data = await usageApi.get(token, targetPid);
          if (!isCancelled) {
            setUsage(data);
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn('Failed to load project usage:', err);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [currentProject, getIdToken]);

  const usedBytes = usage?.total_bytes ?? currentProject?.storage_used_bytes ?? currentProject?.storage_bytes ?? 0;
  const quotaBytes = usage?.quota_bytes ?? currentProject?.storage_quota_bytes ?? currentProject?.max_bytes ?? 10737418240; // 10 GB
  const quotaPercent = quotaBytes > 0 ? Math.min(100, Math.round((usedBytes / quotaBytes) * 100)) : 0;

  const bandwidthBytes = usage?.bandwidth_out_bytes ?? usage?.bandwidth_bytes ?? 0;
  const bandwidthCapBytes = usage?.bandwidth_quota_bytes ?? 536870912000; // 500 GB
  const bandwidthPercent = bandwidthCapBytes > 0 ? Math.min(100, Number(((bandwidthBytes / bandwidthCapBytes) * 100).toFixed(1))) : 0;

  const totalRequests = usage?.api_requests ?? ((usage?.uploads || 0) + (usage?.downloads || 0) + (usage?.streams || 0));
  const uploadsCount = usage?.uploads ?? 0;
  const downloadsCount = usage?.downloads ?? 0;
  const streamsCount = usage?.streams ?? 0;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-[#FF4FD8]" />
            <span>Usage &amp; Telemetry</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time byte consumption, network throughput, and API traffic for{' '}
            <span className="text-[#FF9BE8] font-semibold">{currentProject?.name || 'Default Workspace'}</span>.
          </p>
        </div>

        <button
          onClick={fetchUsage}
          disabled={loading}
          className="liquid-glass px-3.5 py-2 rounded-xl border border-white/10 hover:border-white/20 text-xs text-slate-300 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
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
              className="h-full bg-gradient-to-r from-[#FF4FD8] to-[#FF2FB3] rounded-full transition-all duration-300"
              style={{ width: `${quotaPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-2">
            <span>Remaining: {formatBytes(Math.max(0, quotaBytes - usedBytes))}</span>
            <span className={quotaPercent > 90 ? 'text-rose-400' : 'text-emerald-400'}>
              {quotaPercent > 90 ? 'Near Quota Limit' : 'Within Standard Quota'}
            </span>
          </div>
        </div>

        {/* Bandwidth Meter */}
        <div className="liquid-glass p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#67E8F9]" />
              <h3 className="text-sm font-bold text-white">Bandwidth &amp; Video Egress</h3>
            </div>
            <span className="text-xs font-mono text-[#67E8F9] font-bold">{bandwidthPercent}%</span>
          </div>

          <div className="text-3xl font-extrabold text-white font-mono">
            {formatBytes(bandwidthBytes)}{' '}
            <span className="text-xs text-slate-400 font-sans font-normal">
              of {formatBytes(bandwidthCapBytes)} billing cycle
            </span>
          </div>

          <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#67E8F9] to-[#8B5CF6] rounded-full transition-all duration-300"
              style={{ width: `${Math.max(bandwidthPercent, bandwidthBytes > 0 ? 1 : 0)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-2">
            <span>Available: {formatBytes(Math.max(0, bandwidthCapBytes - bandwidthBytes))}</span>
            <span className="text-[#67E8F9]">Standard Network Speed</span>
          </div>
        </div>
      </div>

      {/* HTTP Status & Traffic Analysis */}
      <div className="liquid-glass p-6 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#FF9BE8]" />
            <span>API Operations Breakdown (Live Project Telemetry)</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Total Requests: {totalRequests.toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="liquid-glass-subtle p-4 rounded-xl border border-white/8">
            <div className="text-emerald-400 font-semibold mb-1 flex items-center gap-1.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              File Ingestion (Uploads)
            </div>
            <div className="text-2xl font-bold text-white">{uploadsCount.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400 mt-1">POST /v1/files ingested</div>
          </div>

          <div className="liquid-glass-subtle p-4 rounded-xl border border-white/8">
            <div className="text-[#67E8F9] font-semibold mb-1 flex items-center gap-1.5">
              <ArrowDownRight className="w-3.5 h-3.5" />
              Downloads &amp; Access
            </div>
            <div className="text-2xl font-bold text-white">{downloadsCount.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400 mt-1">GET /v1/files/:id/download</div>
          </div>

          <div className="liquid-glass-subtle p-4 rounded-xl border border-white/8">
            <div className="text-[#FF4FD8] font-semibold mb-1 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" />
              Video Range Streams
            </div>
            <div className="text-2xl font-bold text-white">{streamsCount.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400 mt-1">HTTP 206 Partial Content</div>
          </div>
        </div>
      </div>
    </div>
  );
}
