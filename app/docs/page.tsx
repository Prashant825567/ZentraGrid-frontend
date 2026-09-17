'use client';

import React, { useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import CodeBlock from '@/components/ui/code-block';
import { 
  Terminal, 
  KeyRound, 
  Database, 
  Film, 
  ShieldAlert, 
  FolderKanban, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export default function DocsPage() {
  const [selectedSection, setSelectedSection] = useState<'overview' | 'auth' | 'projects' | 'upload' | 'retrieve' | 'streaming' | 'ratelimits'>('overview');
  const [lang, setLang] = useState<'curl' | 'js' | 'python'>('curl');

  return (
    <div className="min-h-screen bg-[#06070B] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
          {/* Docs Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-28 liquid-glass p-4 rounded-2xl border border-white/10 space-y-1">
              <div className="px-3 py-2 text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#FF4FD8]" />
                API Reference v1
              </div>

              {[
                { id: 'overview', name: 'Overview & Architecture', icon: Terminal },
                { id: 'auth', name: 'Authentication & Tokens', icon: KeyRound },
                { id: 'projects', name: 'Projects & Quotas', icon: FolderKanban },
                { id: 'upload', name: 'File Upload (POST /v1/files)', icon: Database },
                { id: 'retrieve', name: 'File Retrieval & Metadata', icon: Database },
                { id: 'streaming', name: 'Video Streaming (Range)', icon: Film },
                { id: 'ratelimits', name: 'Rate Limits & Error Formats', icon: ShieldAlert },
              ].map((item) => {
                const Icon = item.icon;
                const active = selectedSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedSection(item.id as any)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all ${
                      active
                        ? 'bg-[#FF4FD8]/20 text-white border border-[#FF4FD8]/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#FF4FD8]' : 'text-slate-500'}`} />
                    <span className="truncate">{item.name}</span>
                  </button>
                );
              })}

              <div className="pt-4 mt-4 border-t border-white/10 px-3">
                <div className="text-[11px] font-mono text-slate-400">
                  Base URL:
                  <div className="text-white text-[10px] mt-0.5 truncate bg-black/40 p-1.5 rounded border border-white/5">
                    https://api.zentragrid.com
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Docs Content */}
          <main className="lg:col-span-9 space-y-12">
            {/* Language Switcher Bar */}
            <div className="flex items-center justify-between liquid-glass p-3 rounded-xl border border-white/10">
              <span className="text-xs text-slate-400 font-mono">Select Code Example Format:</span>
              <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-white/10">
                {(['curl', 'js', 'python'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-3 py-1 rounded text-xs font-mono uppercase transition-colors ${
                      lang === l ? 'bg-[#FF4FD8] text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* SECTION 1: OVERVIEW */}
            {selectedSection === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                    ZentraGrid Developer Storage API
                  </h1>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    ZentraGrid is developer storage infrastructure designed to eliminate AWS S3 and GCP bucket configuration friction. By wrapping binary storage, global CDN distribution, and HTTP byte-range video streaming in a single deterministic REST API, you can integrate storage into your web, mobile, or backend microservices in minutes.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="liquid-glass p-5 rounded-2xl border border-white/10">
                    <h4 className="text-sm font-bold text-white mb-2">Dual Token Model</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      ZentraGrid strictly decouples dashboard user administration (Firebase ID Token) from backend data operations (Bearer ZTG_live_* keys).
                    </p>
                  </div>
                  <div className="liquid-glass p-5 rounded-2xl border border-white/10">
                    <h4 className="text-sm font-bold text-white mb-2">Native Media Streaming</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      All video files ingested through ZentraGrid support RFC 7233 range requests out of the box with HTTP 206 Partial Content.
                    </p>
                  </div>
                </div>

                <div className="liquid-glass p-6 rounded-2xl border border-white/10">
                  <h3 className="text-base font-bold text-white mb-3">Quickstart Ingestion</h3>
                  <CodeBlock
                    filename="quickstart.sh"
                    language="bash"
                    code={
                      lang === 'curl'
                        ? `curl -X POST "https://api.zentragrid.com/v1/files" \\
  -H "Authorization: Bearer ZTG_live_YOUR_KEY_HERE" \\
  -F "file=@./document.pdf"`
                        : lang === 'js'
                        ? `const formData = new FormData();
formData.append('file', fileBlob, 'document.pdf');

const response = await fetch('https://api.zentragrid.com/v1/files', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ZTG_live_YOUR_KEY_HERE'
  },
  body: formData
});
const data = await response.json();
console.log('Stored File ID:', data.id);`
                        : `import requests

url = "https://api.zentragrid.com/v1/files"
headers = {"Authorization": "Bearer ZTG_live_YOUR_KEY_HERE"}
files = {"file": open("document.pdf", "rb")}

response = requests.post(url, headers=headers, files=files)
print("Stored File ID:", response.json().get("id"))`
                    }
                  />
                </div>
              </div>
            )}

            {/* SECTION 2: AUTHENTICATION */}
            {selectedSection === 'auth' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                    Authentication &amp; Security Architecture
                  </h1>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Authentication in ZentraGrid is divided into two distinct domains to maintain bank-grade security:
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="liquid-glass p-5 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#FF9BE8] mb-1">
                      <span>DOMAIN A</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">Dashboard Management API</h3>
                    <p className="text-xs text-slate-400 mb-3">
                      Endpoints managing projects, billing, keys, and quotas require a short-lived Firebase ID Token.
                    </p>
                    <div className="font-mono text-xs bg-black/40 p-2.5 rounded-lg border border-white/8 text-slate-200">
                      Authorization: Bearer &lt;FIREBASE_ID_TOKEN&gt;
                    </div>
                  </div>

                  <div className="liquid-glass p-5 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#67E8F9] mb-1">
                      <span>DOMAIN B</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">Developer File Operations</h3>
                    <p className="text-xs text-slate-400 mb-3">
                      Endpoints uploading, querying, and streaming files require a scoped live key. Never commit this token to client-side code.
                    </p>
                    <div className="font-mono text-xs bg-black/40 p-2.5 rounded-lg border border-white/8 text-slate-200">
                      Authorization: Bearer ZTG_live_xxxxxxxxxxxxxxxxxxxxxxxx
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 3: PROJECTS */}
            {selectedSection === 'projects' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                    Projects &amp; Isolation
                  </h1>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Projects are isolated storage boundaries. Every key generated belongs to exactly one project, and file objects cannot cross project boundaries.
                  </p>
                </div>

                <div className="liquid-glass p-6 rounded-2xl border border-white/10">
                  <h3 className="text-base font-bold text-white mb-2">Create Project</h3>
                  <div className="text-xs font-mono text-[#FF4FD8] mb-4">POST /v1/projects</div>
                  <CodeBlock
                    filename="create-project"
                    language="json"
                    code={
                      lang === 'curl'
                        ? `curl -X POST "https://api.zentragrid.com/v1/projects" \\
  -H "Authorization: Bearer <FIREBASE_ID_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Production Aurora Cluster"}'`
                        : lang === 'js'
                        ? `const res = await fetch('https://api.zentragrid.com/v1/projects', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + firebaseIdToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'Production Aurora Cluster' })
});
const project = await res.json();`
                        : `import requests

res = requests.post(
    "https://api.zentragrid.com/v1/projects",
    headers={"Authorization": f"Bearer {firebase_id_token}"},
    json={"name": "Production Aurora Cluster"}
)
project = res.json()`
                    }
                  />
                </div>
              </div>
            )}

            {/* SECTION 4: UPLOAD */}
            {selectedSection === 'upload' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                    File Ingestion Endpoint
                  </h1>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Upload binary files using multipart/form-data. The backend calculates sha256 checksums, validates storage quotas, and immediately returns the file reference.
                  </p>
                </div>

                <div className="liquid-glass p-6 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                      POST
                    </span>
                    <span className="font-mono text-xs text-white">/v1/files</span>
                  </div>

                  <div className="text-xs text-slate-400 mb-4">
                    Required Header: <code className="text-[#FF4FD8]">Authorization: Bearer ZTG_live_...</code>
                  </div>

                  <CodeBlock
                    filename="upload-example"
                    language="bash"
                    code={
                      lang === 'curl'
                        ? `curl -X POST "https://api.zentragrid.com/v1/files" \\
  -H "Authorization: Bearer ZTG_live_9a8f2c3d4e1b" \\
  -F "file=@sample_video.mp4"`
                        : lang === 'js'
                        ? `const form = new FormData();
form.append('file', fileInput.files[0]);

const res = await fetch('https://api.zentragrid.com/v1/files', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ZTG_live_9a8f2c3d4e1b'
  },
  body: form
});
const fileData = await res.json();`
                        : `import requests

with open("sample_video.mp4", "rb") as f:
    res = requests.post(
        "https://api.zentragrid.com/v1/files",
        headers={"Authorization": "Bearer ZTG_live_9a8f2c3d4e1b"},
        files={"file": f}
    )
print(res.json())`
                    }
                  />

                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="text-xs font-semibold text-white mb-2">Response (201 Created)</div>
                    <pre className="p-3 rounded-xl bg-black/40 border border-white/8 text-[11px] font-mono text-slate-300">
{`{
  "id": "file_8923bc74d",
  "name": "sample_video.mp4",
  "size": 48293120,
  "mime_type": "video/mp4",
  "status": "active",
  "created_at": "2026-09-17T12:00:00Z"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 5: RETRIEVE */}
            {selectedSection === 'retrieve' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                    File Retrieval &amp; Download
                  </h1>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Retrieve file metadata or download the original file stream.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="liquid-glass p-6 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-xs font-bold">
                        GET
                      </span>
                      <span className="font-mono text-xs text-white">/v1/files/&#123;file_id&#125;</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-4">Returns file metadata object without reading entire payload.</p>
                  </div>

                  <div className="liquid-glass p-6 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-xs font-bold">
                        GET
                      </span>
                      <span className="font-mono text-xs text-white">/v1/files/&#123;file_id&#125;/download</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-4">Streams full binary payload with Content-Disposition attachment header.</p>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 6: STREAMING */}
            {selectedSection === 'streaming' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                    Video Range Streaming (RFC 7233)
                  </h1>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    ZentraGrid implements HTTP 206 Partial Content byte ranges. Video players can seek to arbitrary timestamps without buffering the preceding payload.
                  </p>
                </div>

                <div className="liquid-glass p-6 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-mono text-xs font-bold">
                      GET
                    </span>
                    <span className="font-mono text-xs text-white">/v1/files/&#123;file_id&#125;/stream</span>
                  </div>

                  <CodeBlock
                    filename="video-stream-request"
                    language="bash"
                    code={
                      lang === 'curl'
                        ? `curl -i -X GET "https://api.zentragrid.com/v1/files/file_8923bc74d/stream" \\
  -H "Authorization: Bearer ZTG_live_9a8f2c3d4e1b" \\
  -H "Range: bytes=0-1048575"`
                        : lang === 'js'
                        ? `// Standard HTML5 <video> tag works directly with range requests:
const video = document.createElement('video');
video.src = 'https://api.zentragrid.com/v1/files/file_8923bc74d/stream';
// Video element automatically sends 'Range: bytes=...' headers upon seek`
                        : `import requests

headers = {
    "Authorization": "Bearer ZTG_live_9a8f2c3d4e1b",
    "Range": "bytes=0-1048575"
}
res = requests.get("https://api.zentragrid.com/v1/files/file_8923bc74d/stream", headers=headers)
print("Status:", res.status_code) # 206 Partial Content
print("Content-Range:", res.headers.get("Content-Range"))`
                    }
                  />
                </div>
              </div>
            )}

            {/* SECTION 7: RATELIMITS & ERRORS */}
            {selectedSection === 'ratelimits' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                    Rate Limits &amp; Error Standard
                  </h1>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    All ZentraGrid API errors return standard RFC 7807 problem details with actionable error codes.
                  </p>
                </div>

                <div className="liquid-glass p-6 rounded-2xl border border-white/10">
                  <h4 className="text-sm font-bold text-white mb-2">Error Schema</h4>
                  <pre className="p-3 rounded-xl bg-black/40 border border-white/8 text-[11px] font-mono text-slate-300">
{`{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Quota limit reached (1000 requests/minute). Retry after 24s.",
    "status": 429
  }
}`}
                  </pre>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
