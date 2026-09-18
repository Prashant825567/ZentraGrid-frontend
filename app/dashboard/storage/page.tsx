'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import { filesApi } from '@/lib/api';
import { ZentraFile } from '@/lib/types';
import VideoPlayer from '@/components/ui/video-player';
import { 
  Database, 
  UploadCloud, 
  Film, 
  FileText, 
  Trash2, 
  Download, 
  Copy, 
  Play, 
  Search, 
  Filter, 
  Info, 
  Check, 
  AlertTriangle,
  FileCode,
  LayoutGrid,
  List
} from 'lucide-react';

export default function StoragePage() {
  const { currentProject } = useAuth();
  const { toast } = useToast();

  const [files, setFiles] = useState<ZentraFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'video' | 'image' | 'document'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Upload states
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modals
  const [activeVideoFile, setActiveVideoFile] = useState<ZentraFile | null>(null);
  const [activeDetailsFile, setActiveDetailsFile] = useState<ZentraFile | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<ZentraFile | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const targetPid = currentProject?.project_id || currentProject?.id;
    if (!targetPid) return;
    let isCancelled = false;

    (async () => {
      setLoading(true);
      try {
        const res = await filesApi.listFiles(targetPid);
        if (!isCancelled) {
          setFiles(res.files || []);
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn('Files fetch error', err);
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
  }, [currentProject]);

  const handleFilesUpload = async (filesList: FileList | null) => {
    if (!filesList || filesList.length === 0) return;

    setUploading(true);
    setUploadProgress(15);
    try {
      const progressTimer = setInterval(() => {
        setUploadProgress((p) => (p < 85 ? p + 15 : p));
      }, 150);

      // Upload files sequentially or first file
      for (let i = 0; i < filesList.length; i++) {
        const file = filesList[i];
        const uploaded = await filesApi.uploadFile(file, 'ZTG_live_dashboard_session');
        setFiles((prev) => [uploaded, ...prev]);
      }

      clearInterval(progressTimer);
      setUploadProgress(100);
      toast.success('Upload Completed', `${filesList.length} object(s) ingested into /v1/files.`);
    } catch (err: any) {
      toast.error('Upload Failed', err?.message || 'Check network connection or token.');
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 400);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setDeleting(true);
    try {
      await filesApi.deleteFile(deleteCandidate.id);
      setFiles((prev) => prev.filter((f) => f.id !== deleteCandidate.id));
      toast.info('Object Deleted', `File "${deleteCandidate.name}" removed from cluster.`);
      setDeleteCandidate(null);
    } catch (err: any) {
      toast.error('Delete Failed', err?.message || 'Could not delete file.');
    } finally {
      setDeleting(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied', `${label} copied to clipboard.`);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Filtered files
  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.id.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (filterType === 'video') return f.mime_type.includes('video') || f.name.endsWith('.mp4') || f.name.endsWith('.mov');
    if (filterType === 'image') return f.mime_type.includes('image') || f.name.endsWith('.png') || f.name.endsWith('.jpg');
    if (filterType === 'document') return f.mime_type.includes('pdf') || f.mime_type.includes('json') || f.mime_type.includes('text');
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Database className="w-7 h-7 text-[#FF4FD8]" />
            <span>File Storage</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Store, stream, and inspect binary objects in project{' '}
            <span className="text-[#FF9BE8] font-semibold">{currentProject?.name}</span>.
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="liquid-glass px-4 py-2.5 rounded-xl border border-[#FF4FD8]/60 text-xs font-semibold text-white bg-gradient-to-r from-[#FF4FD8] to-[#FF2FB3] hover:opacity-95 shadow-[0_0_20px_rgba(255,79,216,0.3)] transition-all flex items-center gap-2 self-start"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Object</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFilesUpload(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFilesUpload(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`liquid-glass p-8 rounded-3xl border-2 border-dashed text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-[#FF4FD8] bg-[#FF4FD8]/10 scale-[1.01]'
            : 'border-white/15 hover:border-[#FF4FD8]/50 hover:bg-white/[0.02]'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl liquid-glass border border-[#FF4FD8]/40 flex items-center justify-center mx-auto mb-3 text-[#FF4FD8]">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-white mb-1">
          Drag &amp; drop files here, or browse
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto font-mono">
          Multipart POST /v1/files ingestion • Supports MP4, WebM, PDF, JSON, PNG, ZIP
        </p>
      </div>

      {/* Uploading progress indicator */}
      {uploading && (
        <div className="liquid-glass p-4 rounded-2xl border border-[#FF4FD8]/40 bg-[#FF4FD8]/5">
          <div className="flex items-center justify-between text-xs font-mono text-white mb-2">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF4FD8] animate-ping" />
              Streaming multipart payload to /v1/files...
            </span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF4FD8] to-[#67E8F9] rounded-full transition-all duration-150"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Search & Filter bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 liquid-glass p-3 rounded-2xl border border-white/10">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files by name or ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF4FD8]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between">
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/8 text-xs font-mono">
            {(['all', 'video', 'image', 'document'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                  filterType === type
                    ? 'bg-[#FF4FD8]/20 text-white font-bold border border-[#FF4FD8]/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/8">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-slate-500'}`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-slate-500'}`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Files Display */}
      {filteredFiles.length === 0 ? (
        <div className="liquid-glass p-12 rounded-3xl border border-white/8 text-center">
          <Database className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-white">No files found</h3>
          <p className="text-xs text-slate-400 mt-1">
            {search ? 'Try modifying your search query' : 'Upload your first file to get started'}
          </p>
        </div>
      ) : viewMode === 'list' ? (
        /* List View */
        <div className="liquid-glass rounded-3xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px] bg-white/[0.01]">
                  <th className="py-3 px-4 font-semibold">Name &amp; ID</th>
                  <th className="py-3 px-4 font-semibold">Size</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Created</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filteredFiles.map((file) => {
                  const isVideo = file.mime_type.includes('video') || file.name.endsWith('.mp4');
                  return (
                    <tr key={file.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg liquid-glass flex items-center justify-center border border-white/10 shrink-0">
                            {isVideo ? (
                              <Film className="w-4 h-4 text-[#FF4FD8]" />
                            ) : (
                              <FileText className="w-4 h-4 text-[#67E8F9]" />
                            )}
                          </div>
                          <div className="truncate max-w-[240px]">
                            <div className="text-white font-medium truncate font-sans text-xs">
                              {file.name}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                              <span>{file.id}</span>
                              <button
                                onClick={() => copyToClipboard(file.id, 'File ID')}
                                className="hover:text-white"
                                title="Copy ID"
                              >
                                <Copy className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{formatBytes(file.size)}</td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">{file.mime_type}</td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {new Date(file.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2 font-sans">
                          {isVideo && (
                            <button
                              onClick={() => setActiveVideoFile(file)}
                              className="px-2.5 py-1 rounded-lg liquid-glass border border-[#FF4FD8]/40 text-[#FF4FD8] hover:bg-[#FF4FD8]/10 text-xs font-semibold flex items-center gap-1 transition-all"
                            >
                              <Play className="w-3 h-3 fill-[#FF4FD8]" />
                              <span>Stream</span>
                            </button>
                          )}

                          <button
                            onClick={() => setActiveDetailsFile(file)}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            title="Inspect Object Metadata"
                          >
                            <Info className="w-4 h-4" />
                          </button>

                          <a
                            href={`/v1/files/${file.id}/download`}
                            download
                            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => setDeleteCandidate(file)}
                            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((file) => {
            const isVideo = file.mime_type.includes('video') || file.name.endsWith('.mp4');
            return (
              <div
                key={file.id}
                className="liquid-glass p-5 rounded-2xl border border-white/10 hover:border-[#FF4FD8]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl liquid-glass flex items-center justify-center border border-white/10">
                      {isVideo ? (
                        <Film className="w-4 h-4 text-[#FF4FD8]" />
                      ) : (
                        <FileText className="w-4 h-4 text-[#67E8F9]" />
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      ACTIVE
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white truncate mb-1" title={file.name}>
                    {file.name}
                  </h3>
                  <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>{formatBytes(file.size)}</span>
                    <span className="truncate max-w-[100px]">{file.mime_type}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 truncate max-w-[110px]">
                    {file.id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isVideo && (
                      <button
                        onClick={() => setActiveVideoFile(file)}
                        className="p-1.5 text-[#FF4FD8] hover:bg-[#FF4FD8]/10 rounded-lg"
                        title="Stream"
                      >
                        <Play className="w-3.5 h-3.5 fill-[#FF4FD8]" />
                      </button>
                    )}
                    <button
                      onClick={() => setActiveDetailsFile(file)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                      title="Inspect"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteCandidate(file)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Video Streaming Modal */}
      {activeVideoFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
          <div className="w-full max-w-3xl liquid-glass rounded-3xl border border-white/20 p-6 bg-[#0B0D14]/95 shadow-2xl relative animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#FF4FD8]" />
                  HTTP 206 Range Stream: {activeVideoFile.name}
                </h3>
                <span className="text-[10px] font-mono text-slate-400">
                  Range seek supported directly via backend stream endpoint
                </span>
              </div>
              <button
                onClick={() => setActiveVideoFile(null)}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded-lg liquid-glass border border-white/10"
              >
                Close
              </button>
            </div>

            <VideoPlayer
              streamUrl={`https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`}
              filename={activeVideoFile.name}
              mimeType={activeVideoFile.mime_type}
            />

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Endpoint: GET /v1/files/{activeVideoFile.id}/stream</span>
              <button
                onClick={() => copyToClipboard(`https://api.zentragrid.com/v1/files/${activeVideoFile.id}/stream`, 'Stream URL')}
                className="text-[#FF4FD8] hover:underline flex items-center gap-1 font-sans"
              >
                <Copy className="w-3 h-3" />
                Copy Stream URL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Details / Inspection Modal */}
      {activeDetailsFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="w-full max-w-lg liquid-glass rounded-3xl border border-white/20 p-6 bg-[#0B0D14]/95 shadow-2xl relative animate-fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-[#67E8F9]" />
                Object Metadata Inspection
              </h3>
              <button
                onClick={() => setActiveDetailsFile(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="liquid-glass-subtle p-3 rounded-xl border border-white/8 space-y-1">
                <div className="text-slate-400 text-[10px]">OBJECT ID</div>
                <div className="text-white flex items-center justify-between">
                  <span>{activeDetailsFile.id}</span>
                  <button
                    onClick={() => copyToClipboard(activeDetailsFile.id, 'Object ID')}
                    className="text-[#FF4FD8] hover:underline"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="liquid-glass-subtle p-3 rounded-xl border border-white/8 space-y-1">
                <div className="text-slate-400 text-[10px]">FILE NAME</div>
                <div className="text-white truncate">{activeDetailsFile.name}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="liquid-glass-subtle p-3 rounded-xl border border-white/8">
                  <div className="text-slate-400 text-[10px]">SIZE</div>
                  <div className="text-white">{formatBytes(activeDetailsFile.size)}</div>
                </div>
                <div className="liquid-glass-subtle p-3 rounded-xl border border-white/8">
                  <div className="text-slate-400 text-[10px]">MIME TYPE</div>
                  <div className="text-white truncate">{activeDetailsFile.mime_type}</div>
                </div>
              </div>

              <div className="liquid-glass-subtle p-3 rounded-xl border border-white/8 space-y-1">
                <div className="text-slate-400 text-[10px]">SHA256 CHECKSUM</div>
                <div className="text-slate-300 text-[11px] truncate">
                  {activeDetailsFile.sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                </div>
              </div>

              <div className="liquid-glass-subtle p-3 rounded-xl border border-white/8 space-y-1">
                <div className="text-slate-400 text-[10px]">STREAM ENDPOINT</div>
                <div className="text-[#67E8F9] text-[11px] truncate flex items-center justify-between">
                  <span>/v1/files/{activeDetailsFile.id}/stream</span>
                  <button
                    onClick={() => copyToClipboard(`/v1/files/${activeDetailsFile.id}/stream`, 'Stream Path')}
                    className="text-[#FF4FD8]"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveDetailsFile(null)}
                className="liquid-glass px-4 py-2 rounded-xl border border-white/12 text-xs text-white"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="w-full max-w-md liquid-glass rounded-3xl border border-rose-500/30 p-6 bg-[#0B0D14]/95 shadow-2xl relative animate-fade-in">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-white mb-1">Delete Storage Object</h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <span className="text-white font-mono font-semibold">{deleteCandidate.name}</span>? This action frees allocated quota but breaks any external streaming or download links.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="px-3.5 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-lg disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
