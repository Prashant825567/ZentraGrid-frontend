'use client';

import React, { useState } from 'react';
import CodeBlock from '@/components/ui/code-block';
import { Terminal, Code2, Zap } from 'lucide-react';

interface ProjectIntegrationSnippetsProps {
  keyHint?: string;
}

export function ProjectIntegrationSnippets({ keyHint }: ProjectIntegrationSnippetsProps) {
  const [activeTab, setActiveTab] = useState<'curl' | 'node' | 'python'>('curl');

  const apiKeyPlaceholder = keyHint ? `${keyHint}` : 'ZTG_live_secret_key_here';
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://zentragrid.onrender.com';

  const snippets = {
    curl: {
      upload: `# 1. Upload media / asset to ZentraGrid
curl -X POST "${apiBase}/v1/files" \\
  -H "Authorization: Bearer ${apiKeyPlaceholder}" \\
  -F "file=@/path/to/video.mp4"

# 2. Stream video file with HTTP Range support
curl -X GET "${apiBase}/v1/files/{file_id}/stream" \\
  -H "Authorization: Bearer ${apiKeyPlaceholder}" \\
  -H "Range: bytes=0-1048576" --output chunk.mp4

# 3. Direct download binary
curl -X GET "${apiBase}/v1/files/{file_id}/download" \\
  -H "Authorization: Bearer ${apiKeyPlaceholder}" \\
  --output downloaded_file.mp4`,
      filename: 'Terminal / cURL',
      language: 'bash',
    },
    node: {
      upload: `import fs from 'node:fs';

const API_BASE = '${apiBase}';
const API_KEY = process.env.ZENTRAGRID_API_KEY || '${apiKeyPlaceholder}';

// Upload a file
async function uploadToZentraGrid(filePath: string) {
  const formData = new FormData();
  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer]);
  formData.append('file', blob, 'dataset.parquet');

  const res = await fetch(\`\${API_BASE}/v1/files\`, {
    method: 'POST',
    headers: {
      Authorization: \`Bearer \${API_KEY}\`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error(\`Upload failed: \${res.statusText}\`);
  const data = await res.json();
  console.log('Stored File ID:', data.id);
  return data;
}

// Generate secure streaming URL
function getStreamUrl(fileId: string) {
  return \`\${API_BASE}/v1/files/\${fileId}/stream\`;
}`,
      filename: 'zentragrid.ts',
      language: 'typescript',
    },
    python: {
      upload: `import os
import requests

API_BASE = "${apiBase}"
API_KEY = os.getenv("ZENTRAGRID_API_KEY", "${apiKeyPlaceholder}")

headers = {
    "Authorization": f"Bearer {API_KEY}"
}

# 1. Upload file
with open("recording.mp4", "rb") as f:
    response = requests.post(
        f"{API_BASE}/v1/files",
        headers=headers,
        files={"file": f}
    )
    file_data = response.json()
    print(f"File uploaded successfully! ID: {file_data.get('id')}")

# 2. Stream chunk
stream_res = requests.get(
    f"{API_BASE}/v1/files/{file_data['id']}/stream",
    headers={**headers, "Range": "bytes=0-5242880"},
    stream=True
)
print("HTTP Stream Status:", stream_res.status_code)`,
      filename: 'storage_client.py',
      language: 'python',
    },
  };

  const tabs = [
    { id: 'curl', label: 'cURL / CLI', icon: Terminal },
    { id: 'node', label: 'Node.js / TypeScript', icon: Code2 },
    { id: 'python', label: 'Python 3', icon: Zap },
  ] as const;

  return (
    <div className="p-6 rounded-3xl bg-[#0B0D14] border border-white/10 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[#FF4FD8]" />
            <h2 className="text-sm font-semibold text-white tracking-tight">
              Developer Integration Snippets
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Use your active secret key to upload, stream, and download files directly from your backend services.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <CodeBlock
        code={snippets[activeTab].upload}
        filename={snippets[activeTab].filename}
        language={snippets[activeTab].language}
      />
    </div>
  );
}
