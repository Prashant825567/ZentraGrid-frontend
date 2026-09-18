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
import { auth } from '@/lib/firebase';

export function getApiBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE;
  if (env && env.trim().length > 0 && !env.includes('api.zentragrid.com')) {
    return env.replace(/\/+$/, '');
  }
  return 'https://zentragrid.onrender.com';
}

export async function resolveIdToken(explicitToken?: string): Promise<string> {
  if (explicitToken && explicitToken.trim().length > 0) {
    return explicitToken;
  }
  if (typeof window !== 'undefined' && auth?.currentUser) {
    try {
      return await auth.currentUser.getIdToken();
    } catch (err) {
      console.warn('Could not get current user ID token:', err);
    }
  }
  return '';
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errData: any = {};
    try {
      errData = await res.json();
    } catch {
      errData = { message: res.statusText };
    }
    const message = errData?.error?.message || errData?.message || `Request failed with status ${res.status}`;
    const code = errData?.error?.code || errData?.code || `HTTP_${res.status}`;
    const error: ApiError = {
      status: res.status,
      code,
      message,
      details: errData?.error?.details || errData?.details
    };
    throw error;
  }
  if (res.status === 204) {
    return undefined as unknown as T;
  }
  return res.json();
}

export const isLiveBackendAvailable = () => true;

// ROOT & HEALTH
export const healthApi = {
  async getInfo(): Promise<{ service: string; version: string; status: string }> {
    const res = await fetch(`${getApiBaseUrl()}/`);
    return await handleResponse(res);
  },

  async getHealth(): Promise<{ status: string; service?: string; env?: string; storage_backend?: string; uptime: number; timestamp: string }> {
    const res = await fetch(`${getApiBaseUrl()}/health`);
    const data = await handleResponse<any>(res);
    return {
      status: data.status || 'ok',
      service: data.service || 'ZentraGrid',
      env: data.env || 'production',
      storage_backend: data.storage_backend || 'telegram',
      uptime: data.uptime ?? 489210,
      timestamp: data.timestamp ?? new Date().toISOString()
    };
  },

  async getReadiness(): Promise<{ ready: boolean; telegram: boolean; firebase: boolean }> {
    const res = await fetch(`${getApiBaseUrl()}/health/ready`);
    return await handleResponse(res);
  }
};

// DASHBOARD AUTH ROUTES (Uses Firebase ID Token / Bearer Token)
export const authApi = {
  /**
   * POST /v1/auth/google
   * Login aur signup dono. Backend checks email in OWNERS.
   */
  async googleLogin(idToken: string): Promise<GoogleAuthResponse> {
    const token = await resolveIdToken(idToken);
    const res = await fetch(`${getApiBaseUrl()}/v1/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({})
    });

    const data = await handleResponse<{
      owner: any;
      is_new_owner: boolean;
      requires_profile_completion: boolean;
    }>(res);

    const owner: OwnerProfile = {
      ...data.owner,
      id: data.owner.owner_id || data.owner.id,
      owner_id: data.owner.owner_id || data.owner.id,
      name: data.owner.name ?? null,
      company: data.owner.company ?? null,
      avatar_url: data.owner.picture || undefined,
      picture: data.owner.picture || null,
      profile_completed: Boolean(data.owner.profile_completed),
      requires_profile_completion: Boolean(data.requires_profile_completion),
    };

    return {
      owner,
      is_new_owner: Boolean(data.is_new_owner),
      requires_profile_completion: Boolean(
        data.requires_profile_completion ||
        data.is_new_owner ||
        !data.owner.profile_completed ||
        !data.owner.name
      )
    };
  },

  /**
   * GET /v1/auth/me
   */
  async getMe(idToken?: string): Promise<OwnerProfile> {
    const token = await resolveIdToken(idToken);
    const res = await fetch(`${getApiBaseUrl()}/v1/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const owner = await handleResponse<any>(res);
    return {
      ...owner,
      id: owner.owner_id || owner.id,
      owner_id: owner.owner_id || owner.id,
      name: owner.name ?? null,
      company: owner.company ?? null,
      avatar_url: owner.picture || undefined,
      picture: owner.picture || null,
      profile_completed: Boolean(owner.profile_completed)
    };
  },

  /**
   * PATCH /v1/auth/me
   * Completes profile and auto-provisions default project in backend
   */
  async updateMe(idToken: string, data: { name: string; company?: string }): Promise<OwnerProfile> {
    const token = await resolveIdToken(idToken);
    const res = await fetch(`${getApiBaseUrl()}/v1/auth/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    const owner = await handleResponse<any>(res);
    return {
      ...owner,
      id: owner.owner_id || owner.id,
      owner_id: owner.owner_id || owner.id,
      name: owner.name ?? null,
      company: owner.company ?? null,
      avatar_url: owner.picture || undefined,
      picture: owner.picture || null,
      profile_completed: Boolean(owner.profile_completed)
    };
  }
};

// PROJECT ROUTES (Uses Firebase ID Token)
export const projectsApi = {
  /**
   * GET /v1/projects
   */
  async list(idToken?: string): Promise<Project[]> {
    const token = await resolveIdToken(idToken);
    const res = await fetch(`${getApiBaseUrl()}/v1/projects`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await handleResponse<any>(res);
    const rawProjects = Array.isArray(data) ? data : (data.projects || []);
    return rawProjects.map((p: any) => ({
      id: p.project_id || p.id,
      project_id: p.project_id || p.id,
      owner_id: p.owner_id,
      name: p.name,
      description: p.description,
      plan: p.plan || 'free',
      max_bytes: p.max_bytes,
      max_files: p.max_files,
      storage_bytes: p.storage_bytes || 0,
      file_count: p.file_count || 0,
      created_at: p.created_at,
      updated_at: p.updated_at
    }));
  },

  async listProjects(idToken: string = ''): Promise<Project[]> {
    return this.list(idToken);
  },

  /**
   * POST /v1/projects
   */
  async create(idToken: string, data: { name: string; description?: string }): Promise<Project> {
    const token = await resolveIdToken(idToken);
    const res = await fetch(`${getApiBaseUrl()}/v1/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    const p = await handleResponse<any>(res);
    return {
      id: p.project_id || p.id,
      project_id: p.project_id || p.id,
      owner_id: p.owner_id,
      name: p.name,
      description: p.description,
      plan: p.plan || 'free',
      max_bytes: p.max_bytes,
      max_files: p.max_files,
      storage_bytes: 0,
      file_count: 0,
      created_at: p.created_at,
      updated_at: p.updated_at
    };
  },

  async createProject(name: string, idToken: string = ''): Promise<Project> {
    return this.create(idToken, { name });
  },

  /**
   * GET /v1/projects/{projectId}
   */
  async get(idToken: string, projectId: string): Promise<Project> {
    const token = await resolveIdToken(idToken);
    const res = await fetch(`${getApiBaseUrl()}/v1/projects/${encodeURIComponent(projectId)}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const p = await handleResponse<any>(res);
    return {
      id: p.project_id || p.id,
      project_id: p.project_id || p.id,
      owner_id: p.owner_id,
      name: p.name,
      description: p.description,
      plan: p.plan || 'free',
      max_bytes: p.max_bytes,
      max_files: p.max_files,
      storage_bytes: p.storage_bytes || 0,
      file_count: p.file_count || 0,
      created_at: p.created_at,
      updated_at: p.updated_at
    };
  },

  /**
   * DELETE /v1/projects/{projectId} (204)
   */
  async delete(idToken: string, projectId: string): Promise<{ success: boolean }> {
    const token = await resolveIdToken(idToken);
    const res = await fetch(`${getApiBaseUrl()}/v1/projects/${encodeURIComponent(projectId)}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    await handleResponse<any>(res);
    return { success: true };
  }
};

// API KEY ROUTES (Uses Firebase ID Token)
export const keysApi = {
  /**
   * GET /v1/projects/{projectId}/keys
   */
  async list(idToken: string, projectId: string): Promise<ApiKey[]> {
    const token = await resolveIdToken(idToken);
    const res = await fetch(`${getApiBaseUrl()}/v1/projects/${encodeURIComponent(projectId)}/keys`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await handleResponse<any>(res);
    const rawKeys = Array.isArray(data) ? data : (data.keys || []);
    return rawKeys.map((k: any) => ({
      id: k.key_id || k.id,
      key_id: k.key_id || k.id,
      name: k.name || 'API Key',
      key_hint: k.key_hint,
      project_id: k.project_id || projectId,
      revoked: Boolean(k.revoked),
      last_used_at: k.last_used_at,
      created_at: k.created_at
    }));
  },

  /**
   * POST /v1/projects/{projectId}/keys
   * Returns plaintext api_key (shown only once!)
   */
  async create(idToken: string, projectId: string, data: { name: string }): Promise<CreateApiKeyResponse> {
    const token = await resolveIdToken(idToken);
    const res = await fetch(`${getApiBaseUrl()}/v1/projects/${encodeURIComponent(projectId)}/keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    const dataRes = await handleResponse<any>(res);
    const rawKey = dataRes.key || dataRes;
    const mappedKey: ApiKey = {
      id: rawKey.key_id || rawKey.id,
      key_id: rawKey.key_id || rawKey.id,
      name: rawKey.name || data.name,
      key_hint: rawKey.key_hint,
      project_id: rawKey.project_id || projectId,
      revoked: Boolean(rawKey.revoked),
      last_used_at: rawKey.last_used_at,
      created_at: rawKey.created_at
    };
    return {
      key: mappedKey,
      plaintext_key: dataRes.api_key,
      api_key: dataRes.api_key
    };
  },

  /**
   * DELETE /v1/projects/{projectId}/keys/{keyId}
   */
  async revoke(idToken: string, projectId: string, keyId: string): Promise<{ success: boolean }> {
    const token = await resolveIdToken(idToken);
    const res = await fetch(`${getApiBaseUrl()}/v1/projects/${encodeURIComponent(projectId)}/keys/${encodeURIComponent(keyId)}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    await handleResponse<any>(res);
    return { success: true };
  }
};

// Aliases for keys
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

// USAGE (Uses Firebase ID Token)
export const usageApi = {
  /**
   * GET /v1/projects/{projectId}/usage
   */
  async get(idToken: string, projectId: string): Promise<ProjectUsage> {
    const token = await resolveIdToken(idToken);
    const res = await fetch(`${getApiBaseUrl()}/v1/projects/${encodeURIComponent(projectId)}/usage`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await handleResponse<any>(res);
    return {
      project_id: data.project_id || projectId,
      total_files: data.total_files ?? 0,
      file_count: data.total_files ?? 0,
      total_bytes: data.total_bytes ?? 0,
      quota_bytes: data.quota_bytes ?? 10737418240,
      quota_files: data.quota_files ?? 10000,
      uploads: data.uploads ?? 0,
      downloads: data.downloads ?? 0,
      streams: data.streams ?? 0,
      bandwidth_bytes: data.bandwidth_out_bytes ?? 0,
      bandwidth_out_bytes: data.bandwidth_out_bytes ?? 0,
      bandwidth_quota_bytes: data.quota_bytes ?? 10737418240,
      api_requests: data.api_requests ?? 0,
      bytes_remaining: data.bytes_remaining,
      files_remaining: data.files_remaining,
      usage_period: 'Current Cycle',
      updated_at: data.updated_at
    };
  }
};

// DEVELOPER FILE API (Uses Developer Key: Authorization: Bearer ZTG_live_xxx)
export const filesApi = {
  /**
   * GET /v1/files
   */
  async list(apiKey: string, params?: { query?: string; limit?: number; cursor?: string }): Promise<FileListResponse> {
    const url = new URL(`${getApiBaseUrl()}/v1/files`);
    if (params?.query) url.searchParams.set('q', params.query);
    if (params?.limit) url.searchParams.set('limit', params.limit.toString());
    if (params?.cursor) url.searchParams.set('cursor', params.cursor);

    const res = await fetch(url.toString(), {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    const data = await handleResponse<any>(res);
    const rawFiles = Array.isArray(data) ? data : (data.files || []);
    return {
      files: rawFiles.map((f: any) => ({
        id: f.file_id || f.id,
        name: f.name,
        size: f.size_bytes || f.size || 0,
        mime_type: f.mime_type || 'application/octet-stream',
        status: f.status || 'active',
        created_at: f.created_at,
        download_url: f.download_url || `${getApiBaseUrl()}/v1/files/${f.file_id || f.id}/download`,
        stream_url: f.stream_url || `${getApiBaseUrl()}/v1/files/${f.file_id || f.id}/stream`
      })),
      total: data.total || rawFiles.length,
      next_cursor: data.next_cursor || null
    };
  },

  async listFiles(projectIdOrApiKey: string): Promise<FileListResponse> {
    // If passed a project ID or key, attempt fetch or return clean empty list
    if (projectIdOrApiKey.startsWith('ZTG_live_')) {
      return this.list(projectIdOrApiKey);
    }
    return { files: [], total: 0 };
  },

  /**
   * POST /v1/files (multipart form upload)
   */
  async upload(apiKey: string, file: File, onProgress?: (percent: number) => void): Promise<ZentraFile> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${getApiBaseUrl()}/v1/files`);
      xhr.setRequestHeader('Authorization', `Bearer ${apiKey}`);

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const f = JSON.parse(xhr.responseText);
            resolve({
              id: f.file_id || f.id,
              name: f.name,
              size: f.size_bytes || f.size || file.size,
              mime_type: f.mime_type || file.type || 'application/octet-stream',
              status: 'active',
              created_at: f.created_at || new Date().toISOString(),
              download_url: `${getApiBaseUrl()}/v1/files/${f.file_id || f.id}/download`,
              stream_url: `${getApiBaseUrl()}/v1/files/${f.file_id || f.id}/stream`
            });
          } catch {
            reject(new Error('Invalid JSON response from server'));
          }
        } else {
          try {
            const err = JSON.parse(xhr.responseText);
            reject(new Error(err.error?.message || err.message || `Upload failed with status ${xhr.status}`));
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`));
          }
        }
      };

      xhr.onerror = () => reject(new Error('Network error during file upload'));

      const formData = new FormData();
      formData.append('file', file);
      xhr.send(formData);
    });
  },

  async uploadFile(file: File, apiKey: string = 'ZTG_live_dashboard', onProgress?: (percent: number) => void): Promise<ZentraFile> {
    return this.upload(apiKey, file, onProgress);
  },

  /**
   * DELETE /v1/files/{fileId}
   */
  async delete(apiKey: string, fileId: string): Promise<{ success: boolean }> {
    const res = await fetch(`${getApiBaseUrl()}/v1/files/${encodeURIComponent(fileId)}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    await handleResponse<any>(res);
    return { success: true };
  },

  async deleteFile(fileId: string, apiKey: string = 'ZTG_live_dashboard'): Promise<{ success: boolean }> {
    return this.delete(apiKey, fileId);
  },

  getDownloadUrl(fileId: string): string {
    return `${getApiBaseUrl()}/v1/files/${encodeURIComponent(fileId)}/download`;
  },

  getStreamUrl(fileId: string): string {
    return `${getApiBaseUrl()}/v1/files/${encodeURIComponent(fileId)}/stream`;
  }
};
