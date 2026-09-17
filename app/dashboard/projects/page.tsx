'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import { projectsApi } from '@/lib/api';
import { ZentraProject } from '@/lib/types';
import { 
  FolderKanban, 
  Plus, 
  HardDrive, 
  Check, 
  Database, 
  Activity, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function ProjectsPage() {
  const { projects, currentProject, setCurrentProject, reloadProjects } = useAuth();
  const { toast } = useToast();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [creating, setCreating] = useState(false);

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      toast.warning('Please provide a valid project name.');
      return;
    }

    setCreating(true);
    try {
      const created = await projectsApi.createProject(projectName.trim());
      await reloadProjects();
      setCurrentProject(created);
      setCreateModalOpen(false);
      setProjectName('');
      toast.success('Project Provisioned', `Project "${created.name}" is now ready for keys and storage.`);
    } catch (err: any) {
      toast.error('Failed to create project', err?.message || 'Check your authentication token.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FolderKanban className="w-7 h-7 text-[#FF4FD8]" />
            <span>Projects &amp; Workspaces</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Every project has its own isolated storage volume, quotas, and scoped API keys.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="liquid-glass px-4 py-2.5 rounded-xl border border-[#FF4FD8]/60 text-xs font-semibold text-white bg-gradient-to-r from-[#FF4FD8] to-[#FF2FB3] hover:opacity-95 shadow-[0_0_20px_rgba(255,79,216,0.3)] transition-all flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          const isSelected = currentProject?.id === proj.id;
          const used = proj.storage_used_bytes || 0;
          const quota = proj.storage_quota_bytes || 100 * 1024 * 1024 * 1024;
          const percent = Math.min(100, Math.round((used / quota) * 100));

          return (
            <div
              key={proj.id}
              className={`liquid-glass p-6 rounded-2xl border transition-all flex flex-col justify-between relative group ${
                isSelected
                  ? 'border-[#FF4FD8]/60 bg-[#FF4FD8]/[0.03] shadow-[0_0_25px_rgba(255,79,216,0.15)]'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    {proj.id}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {(proj.status || 'active').toUpperCase()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2">{proj.name}</h3>

                {/* Storage Meter */}
                <div className="mt-4 mb-6">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1.5">
                    <span>Storage: {formatBytes(used)}</span>
                    <span className="text-white font-bold">{percent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF4FD8] to-[#67E8F9] rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1 text-right">
                    Quota: {formatBytes(quota)}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(proj.created_at).toLocaleDateString()}
                </span>

                {isSelected ? (
                  <span className="text-xs font-semibold text-[#FF4FD8] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Active Scope
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setCurrentProject(proj);
                      toast.info('Workspace Switched', `Active scope set to "${proj.name}".`);
                    }}
                    className="liquid-glass px-3 py-1.5 rounded-lg border border-white/12 hover:border-[#FF4FD8]/40 text-xs text-slate-200 hover:text-white transition-all flex items-center gap-1"
                  >
                    <span>Switch Here</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Project Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="w-full max-w-md liquid-glass p-8 rounded-3xl border border-white/20 bg-[#0B0D14]/95 shadow-2xl relative animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-1">Create New Project</h3>
            <p className="text-xs text-slate-400 mb-6">
              Projects provide dedicated isolated quotas and custom API key domains.
            </p>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Project Name <span className="text-[#FF4FD8]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Mobile App Staging"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF4FD8] transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="liquid-glass px-4 py-2 rounded-xl border border-[#FF4FD8]/60 text-xs font-semibold text-white bg-gradient-to-r from-[#FF4FD8] to-[#FF2FB3] hover:opacity-95 shadow-[0_0_20px_rgba(255,79,216,0.3)] disabled:opacity-50"
                >
                  {creating ? 'Provisioning...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
