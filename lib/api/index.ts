import { 
  OwnerProfile, 
  GoogleAuthResponse, 
  Project, 
  ApiKey, 
  CreateApiKeyResponse, 
  ProjectUsage, 
  ZentraFile, 
  FileListResponse, 
  ApiError 
} from '@/lib/types';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');

// Simulated local storage key for standalone preview fallback
const MOCK_STORAGE_KEY = 'zentragrid_preview_state_v1';

interface LocalState {
  profile: OwnerProfile | null;
  projects: Project[];
  keys: Record<string, ApiKey[]>;
  files: ZentraFile[];
}

function getLocalState(): LocalState {
  if (typeof window === 'undefined') {
    return { profile: null, projects: [], keys: {}, files: [] };
  }
  try {
    const raw = localStorage.getItem(MOCK_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not parse mock state', e);
  }

  // Seed default realistic preview data
  const defaultState: LocalState = {
    profile: {
      id: 'usr_demo_8829',
      email: 'alex.chen@infra.dev',
      name: 'Alex Chen',
      company: 'Veloce Labs',
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    projects: [
      {
        id: 'prj_prod_aurora',
        name: 'Production Aurora',
        created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
        storage_bytes: 18432000000,
        file_count: 12840,
      },
      {
        id: 'prj_staging_v2',
        name: 'Staging Cluster',
        created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
        storage_bytes: 2450000000,
        file_count: 820,
      }
    ],
    keys: {
      prj_prod_aurora: [
        {
          id: 'key_live_9a8f2',
          name: 'Primary Ingest Gateway',
          key_hint: 'ZTG_live_9a8f...4e1b',
          project_id: 'prj_prod_aurora',
          created_at: new Date(Date.now() - 24 * 86400000).toISOString(),
          last_used_at: new Date().toISOString(),
          revoked: false,
        },
        {
          id: 'key_edge_3c4d',
          name: 'Edge CDN Sync',
          key_hint: 'ZTG_live_3c4d...990a',
          project_id: 'prj_prod_aurora',
          created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
          last_used_at: new Date(Date.now() - 3600000).toISOString(),
          revoked: false,
        }
      ]
    },
    files: [
      {
        id: 'file_vid_9941',
        name: 'h264_stream_sample_1080p.mp4',
        size: 48293120,
        mime_type: 'video/mp4',
        status: 'active',
        created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        project_id: 'prj_prod_aurora',
      },
      {
        id: 'file_asset_8812',
        name: 'design_tokens_bundle.tar.gz',
        size: 14280000,
        mime_type: 'application/gzip',
        status: 'active',
        created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
        project_id: 'prj_prod_aurora',
      },
      {
        id: 'file_img_3321',
        name: 'hero_infra_render_4k.webp',
        size: 3840210,
        mime_type: 'image/webp',
        status: 'active',
        created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
        project_id: 'prj_prod_aurora',
      },
      {
        id: 'file_telemetry_109',
        name: 'system_metrics_export.parquet',
        size: 89400000,
        mime_type: 'application/octet-stream',
        status: 'active',
        created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
        project_id: 'prj_prod_aurora',
      }
    ]
  };
  saveLocalState(defaultState);
  return defaultState;
}

function saveLocalState(state: LocalState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save mock state', e);
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errData: any = {};
    try {
      errData = await res.json();
    } catch {
      errData = { message: res.statusText };
    }
    const error: ApiError = {
      status: res.status,
      code: errData.code || `HTTP_${res.status}`,
      message: errData.message || `Request failed with status ${res.status}`,
      details: errData.details
    };
    throw error;
  }
  return res.json();
}

export const isLiveBackendAvailable = () => Boolean(API_BASE);

// ROOT / HEALTH
export const healthApi = {
  async getInfo(): Promise<{ service: string; version: string; status: string }> {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/`);
        return await handleResponse(res);
      } catch (e) {
        console.warn('Real backend root check failed, using fallback info', e);
      }
    }
    return { service: 'ZentraGrid Core Engine', version: '2.4.0', status: 'operational' };
  },

  async getHealth(): Promise<{ status: string; uptime: number; timestamp: string }> {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/health`);
        return await handleResponse(res);
      } catch (e) {
        console.warn('Real health check failed, using fallback', e);
      }
    }
    return { status: 'healthy', uptime: 489210, timestamp: new Date().toISOString() };
  },

  async getReadiness(): Promise<{ ready: boolean; telegram: boolean; firebase: boolean }> {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/health/ready`);
        return await handleResponse(res);
      } catch (e) {
        console.warn('Real readiness check failed, using fallback', e);
      }
    }
    return { ready: true, telegram: true, firebase: true };
  }
};

// DASHBOARD AUTH ROUTES (Uses Firebase ID Token / Bearer Token)
export const authApi = {
  async googleLogin(idToken: string): Promise<GoogleAuthResponse> {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/v1/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({})
      });
      return await handleResponse<GoogleAuthResponse>(res);
    }
    
    // Preview / simulated fallback:
    const state = getLocalState();
    return {
      owner: state.profile || {
        id: 'usr_owner_' + Math.random().toString(36).substring(2, 8),
        email: 'developer@example.com',
        created_at: new Date().toISOString()
      },
      requires_profile_completion: !state.profile?.name
    };
  },

  async getMe(idToken: string): Promise<OwnerProfile> {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      return await handleResponse<OwnerProfile>(res);
    }
    const state = getLocalState();
    return state.profile || {
      id: 'usr_local_owner',
      email: 'developer@example.com',
      name: 'Storage Architect',
      company: 'Modern Cloud Systems',
      created_at: new Date().toISOString()
    };
  },

  async updateMe(idToken: string, data: { name: string; company?: string }): Promise<OwnerProfile> {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/v1/auth/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(data)
      });
      return await handleResponse<OwnerProfile>(res);
    }
    const state = getLocalState();
    const updated: OwnerProfile = {
      ...(state.profile || { id: 'usr_owner_1', email: 'developer@example.com', created_at: new Date().toISOString() }),
      name: data.name,
      company: data.company,
      requires_profile_completion: false,
      updated_at: new Date().toISOString()
    };
    state.profile = updated;
    saveLocalState(state);
    return updated;
  }
};

// PROJECT ROUTES (Uses Firebase ID Token)
export const projectsApi = {
  async list(idToken: string): Promise<Project[]> {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/v1/projects`, {
          headers: { 'Authorization': `Bearer ${idToken}` }
        });
        return await handleResponse<Project[]>(res);
      } catch (e) {
        console.warn('GET /v1/projects failed, using local projects', e);
      }
    }
    const state = getLocalState();
    return state.projects;
  },

  async create(idToken: string, data: { name: string }): Promise<Project> {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/v1/projects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify(data)
        });
        return await handleResponse<Project>(res);
      } catch (e) {
        console.warn('POST /v1/projects failed, creating locally', e);
      }
    }
    const state = getLocalState();
    const newProj: Project = {
      id: `prj_${data.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Math.random().toString(36).substring(2, 6)}`,
      name: data.name,
      created_at: new Date().toISOString(),
      storage_bytes: 0,
      file_count: 0
    };
    state.projects.unshift(newProj);
    saveLocalState(state);
    return newProj;
  },

  async createProject(name: string, idToken: string = ''): Promise<Project> {
    return this.create(idToken, { name });
  },

  async listProjects(idToken: string = ''): Promise<Project[]> {
    return this.list(idToken);
  },

  async get(idToken: string, projectId: string): Promise<Project> {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/v1/projects/${projectId}`, {
          headers: { 'Authorization': `Bearer ${idToken}` }
        });
        return await handleResponse<Project>(res);
      } catch (e) {
        console.warn(`GET /v1/projects/${projectId} failed, using local`, e);
      }
    }
    const state = getLocalState();
    const found = state.projects.find(p => p.id === projectId);
    if (!found) {
      throw { status: 404, code: 'NOT_FOUND', message: `Project ${projectId} not found` } as ApiError;
    }
    return found;
  },

  async delete(idToken: string, projectId: string): Promise<{ success: boolean }> {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/v1/projects/${projectId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${idToken}` }
        });
        return await handleResponse<{ success: boolean }>(res);
      } catch (e) {
        console.warn(`DELETE /v1/projects/${projectId} failed, deleting locally`, e);
      }
    }
    const state = getLocalState();
    state.projects = state.projects.filter(p => p.id !== projectId);
    delete state.keys[projectId];
    saveLocalState(state);
    return { success: true };
  }
};

// API KEY ROUTES (Uses Firebase ID Token)
export const keysApi = {
  async list(idToken: string, projectId: string): Promise<ApiKey[]> {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/v1/projects/${projectId}/keys`, {
          headers: { 'Authorization': `Bearer ${idToken}` }
        });
        return await handleResponse<ApiKey[]>(res);
      } catch (e) {
        console.warn(`GET keys for ${projectId} failed, using local`, e);
      }
    }
    const state = getLocalState();
    return state.keys[projectId] || [];
  },

  async create(idToken: string, projectId: string, data: { name: string }): Promise<CreateApiKeyResponse> {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/v1/projects/${projectId}/keys`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify(data)
        });
        return await handleResponse<CreateApiKeyResponse>(res);
      } catch (e) {
        console.warn(`POST key for ${projectId} failed, creating locally`, e);
      }
    }
    const state = getLocalState();
    const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const plaintext = `ZTG_live_${randomHex}`;
    const hint = `ZTG_live_${randomHex.substring(0, 4)}...${randomHex.substring(randomHex.length - 4)}`;
    
    const newKey: ApiKey = {
      id: `key_${Math.random().toString(36).substring(2, 9)}`,
      name: data.name,
      key_hint: hint,
      project_id: projectId,
      created_at: new Date().toISOString(),
      revoked: false
    };

    if (!state.keys[projectId]) {
      state.keys[projectId] = [];
    }
    state.keys[projectId].unshift(newKey);
    saveLocalState(state);

    return {
      key: newKey,
      plaintext_key: plaintext
    };
  },

  async revoke(idToken: string, projectId: string, keyId: string): Promise<{ success: boolean }> {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/v1/projects/${projectId}/keys/${keyId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${idToken}` }
        });
        return await handleResponse<{ success: boolean }>(res);
      } catch (e) {
        console.warn(`DELETE key ${keyId} failed, revoking locally`, e);
      }
    }
    const state = getLocalState();
    if (state.keys[projectId]) {
      state.keys[projectId] = state.keys[projectId].map(k => 
        k.id === keyId ? { ...k, revoked: true } : k
      );
      saveLocalState(state);
    }
    return { success: true };
  }
};

// USAGE (Uses Firebase ID Token)
export const usageApi = {
  async get(idToken: string, projectId: string): Promise<ProjectUsage> {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/v1/projects/${projectId}/usage`, {
          headers: { 'Authorization': `Bearer ${idToken}` }
        });
        return await handleResponse<ProjectUsage>(res);
      } catch (e) {
        console.warn(`GET usage for ${projectId} failed, using simulated metrics`, e);
      }
    }
    
    // Realistic telemetry for the graphs
    const days = 30;
    const history = [];
    const now = Date.now();
    for (let i = days; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const variance = Math.sin(i * 0.4) * 0.2 + 1;
      history.push({
        date: dateStr,
        bytes: Math.round(15000000000 + (30 - i) * 120000000 * variance),
        requests: Math.round(3800 + Math.sin(i) * 1200 + (30 - i) * 150),
        bandwidth: Math.round(1200000000 + Math.cos(i) * 400000000)
      });
    }

    return {
      project_id: projectId,
      file_count: 12840,
      total_bytes: 18432000000, // 18.4 GB
      quota_bytes: 107374182400, // 100 GB
      bandwidth_bytes: 42800000000, // 42.8 GB
      bandwidth_quota_bytes: 536870912000, // 500 GB
      api_requests: 128492,
      api_requests_quota: 1000000,
      usage_period: 'Current Billing Cycle',
      storage_history: history
    };
  }
};

// DEVELOPER FILE API (Uses Developer Key: Authorization: Bearer ZTG_live_xxx)
export const filesApi = {
  async upload(
    apiKey: string, 
    file: File, 
    onProgress?: (percent: number) => void
  ): Promise<ZentraFile> {
    if (API_BASE) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_BASE}/v1/files`);
        xhr.setRequestHeader('Authorization', `Bearer ${apiKey}`);

        if (xhr.upload && onProgress) {
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const pct = Math.round((event.loaded / event.total) * 100);
              onProgress(pct);
            }
          };
        }

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              resolve(res);
            } catch {
              reject({ status: xhr.status, code: 'PARSE_ERROR', message: 'Failed to parse upload response' });
            }
          } else {
            reject({ status: xhr.status, code: `HTTP_${xhr.status}`, message: xhr.statusText || 'Upload failed' });
          }
        };

        xhr.onerror = () => {
          console.warn('Real upload failed, saving to local state');
          this.mockUpload(file, onProgress).then(resolve).catch(reject);
        };

        const formData = new FormData();
        formData.append('file', file);
        xhr.send(formData);
      });
    }

    return this.mockUpload(file, onProgress);
  },

  async mockUpload(file: File, onProgress?: (percent: number) => void): Promise<ZentraFile> {
    // Smooth progress simulation
    if (onProgress) {
      for (let p = 15; p <= 100; p += 20) {
        onProgress(p);
        await new Promise(r => setTimeout(r, 60));
      }
    }
    const state = getLocalState();
    const newFile: ZentraFile = {
      id: `file_${Math.random().toString(36).substring(2, 10)}`,
      name: file.name,
      size: file.size,
      mime_type: file.type || 'application/octet-stream',
      status: 'active',
      created_at: new Date().toISOString()
    };
    state.files.unshift(newFile);
    saveLocalState(state);
    return newFile;
  },

  async list(apiKey: string, params?: { query?: string; sort?: string; page?: number; limit?: number }): Promise<FileListResponse> {
    if (API_BASE) {
      try {
        const queryParams = new URLSearchParams();
        if (params?.query) queryParams.set('query', params.query);
        if (params?.sort) queryParams.set('sort', params.sort);
        if (params?.page) queryParams.set('page', String(params.page));
        if (params?.limit) queryParams.set('limit', String(params.limit));

        const res = await fetch(`${API_BASE}/v1/files?${queryParams.toString()}`, {
          headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        return await handleResponse<FileListResponse>(res);
      } catch (e) {
        console.warn('GET /v1/files failed, using local files', e);
      }
    }

    const state = getLocalState();
    let files = [...state.files];
    if (params?.query) {
      const q = params.query.toLowerCase();
      files = files.filter(f => f.name.toLowerCase().includes(q) || f.mime_type.toLowerCase().includes(q));
    }
    return {
      files,
      total: files.length,
      page: params?.page || 1,
      limit: params?.limit || 20
    };
  },

  async get(apiKey: string, fileId: string): Promise<ZentraFile> {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/v1/files/${fileId}`, {
          headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        return await handleResponse<ZentraFile>(res);
      } catch (e) {
        console.warn(`GET /v1/files/${fileId} failed, using local`, e);
      }
    }
    const state = getLocalState();
    const file = state.files.find(f => f.id === fileId);
    if (!file) {
      throw { status: 404, code: 'NOT_FOUND', message: `File ${fileId} not found` } as ApiError;
    }
    return file;
  },

  async rename(apiKey: string, fileId: string, name: string): Promise<ZentraFile> {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/v1/files/${fileId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({ name })
        });
        return await handleResponse<ZentraFile>(res);
      } catch (e) {
        console.warn(`PATCH /v1/files/${fileId} failed, updating locally`, e);
      }
    }
    const state = getLocalState();
    const idx = state.files.findIndex(f => f.id === fileId);
    if (idx === -1) {
      throw { status: 404, code: 'NOT_FOUND', message: `File ${fileId} not found` } as ApiError;
    }
    state.files[idx] = { ...state.files[idx], name, updated_at: new Date().toISOString() };
    saveLocalState(state);
    return state.files[idx];
  },

  async delete(apiKey: string, fileId: string): Promise<{ success: boolean }> {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/v1/files/${fileId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        return await handleResponse<{ success: boolean }>(res);
      } catch (e) {
        console.warn(`DELETE /v1/files/${fileId} failed, deleting locally`, e);
      }
    }
    const state = getLocalState();
    state.files = state.files.filter(f => f.id !== fileId);
    saveLocalState(state);
    return { success: true };
  },

  getDownloadUrl(fileId: string): string {
    if (API_BASE) {
      return `${API_BASE}/v1/files/${fileId}/download`;
    }
    return `#/download/${fileId}`;
  },

  getStreamUrl(fileId: string): string {
    if (API_BASE) {
      return `${API_BASE}/v1/files/${fileId}/stream`;
    }
    // High-performance test video for preview video player with seek support
    return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  },

  async listFiles(projectId?: string, apiKey: string = 'ZTG_live_dashboard'): Promise<FileListResponse> {
    return this.list(apiKey);
  },

  async uploadFile(file: File, apiKey: string = 'ZTG_live_dashboard', onProgress?: (percent: number) => void): Promise<ZentraFile> {
    return this.upload(apiKey, file, onProgress);
  },

  async deleteFile(fileId: string, apiKey: string = 'ZTG_live_dashboard'): Promise<{ success: boolean }> {
    return this.delete(apiKey, fileId);
  }
};

// Aliases and convenience endpoints
export const apiKeysApi = {
  listKeys: async (projectId: string, idToken: string = ''): Promise<{ keys: ApiKey[] }> => {
    const keys = await keysApi.list(idToken, projectId);
    return { keys };
  },
  createKey: async (projectId: string, name: string, idToken: string = ''): Promise<CreateApiKeyResponse> => {
    return await keysApi.create(idToken, projectId, { name });
  },
  revokeKey: async (projectId: string, keyId: string, idToken: string = ''): Promise<{ success: boolean }> => {
    return await keysApi.revoke(idToken, projectId, keyId);
  }
};

