import { sandboxStore } from './sandbox-store';

/**
 * ZentraGrid API Client
 *
 * All dashboard requests authenticate via:
 * Authorization: Bearer <FIREBASE_ID_TOKEN>
 */

export interface OwnerPublic {
  owner_id: string;
  email: string;
  name: string | null;
  company: string | null;
  picture: string | null;
  plan: string;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface GoogleAuthResponse {
  owner: OwnerPublic;
  is_new_owner: boolean;
  requires_profile_completion: boolean;
}

export interface ProjectPublic {
  project_id: string;
  owner_id: string;
  name: string;
  description: string | null;
  plan: string;
  max_bytes: number;
  max_files: number;
  created_at: string;
  updated_at: string;
}

export interface ApiKeyPublic {
  key_id: string;
  project_id: string;
  name: string | null;
  key_hint: string;
  revoked: boolean;
  last_used_at: string | null;
  created_at: string;
}

export interface ApiKeyCreated {
  key: ApiKeyPublic;
  api_key: string;
}

export interface UsagePublic {
  project_id: string;
  total_files: number;
  total_bytes: number;
  uploads: number;
  downloads: number;
  streams: number;
  bandwidth_out_bytes: number;
  api_requests: number;
  quota_bytes: number;
  quota_files: number;
  bytes_remaining: number;
  files_remaining: number;
  updated_at: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  env: string;
  storage_backend: string;
}

export class ApiError extends Error {
  status: number;
  code: string;
  retryAfter?: number;

  constructor(status: number, code: string, message: string, retryAfter?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

const getApiBase = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_BASE_URL;
  if (envUrl && envUrl.trim().length > 0 && !envUrl.includes('api.zentragrid.com')) {
    return envUrl.replace(/\/+$/, '');
  }
  return 'https://zentragrid.onrender.com';
};

const isSandboxToken = (token?: string) =>
  Boolean(token && (token.startsWith('sandbox_') || token === 'sandbox_mode'));

/**
 * Universal helper that handles token attachment, typed error unwrapping, and responses
 */
async function apiFetch<T>(
  endpoint: string,
  options: {
    token?: string;
    method?: string;
    body?: unknown;
  } = {}
): Promise<T> {
  const apiBase = getApiBase();
  const url = `${apiBase}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    let errorCode = 'UNKNOWN_ERROR';
    let errorMessage = `HTTP error ${res.status}: ${res.statusText}`;

    try {
      const errorJson = await res.json();
      if (errorJson?.error) {
        errorCode = errorJson.error.code || errorCode;
        errorMessage = errorJson.error.message || errorMessage;
      }
    } catch {
      // Body was not JSON
    }

    const retryAfterHeader = res.headers.get('Retry-After');
    const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : undefined;

    throw new ApiError(res.status, errorCode, errorMessage, retryAfter);
  }

  // Handle 204 No Content
  if (res.status === 204) {
    return undefined as unknown as T;
  }

  return (await res.json()) as T;
}

// ==========================================
// API Module
// ==========================================
export const api = {
  // Auth
  auth: {
    /**
     * POST /v1/auth/google
     * Verifies Firebase ID Token on backend and creates/retrieves Owner
     */
    async google(token: string, body: { name?: string; company?: string } = {}): Promise<GoogleAuthResponse> {
      if (isSandboxToken(token)) {
        return sandboxStore.googleAuth(body.name, body.company);
      }
      return apiFetch<GoogleAuthResponse>('/v1/auth/google', {
        method: 'POST',
        token,
        body,
      });
    },

    /**
     * GET /v1/auth/me
     * Retrieves currently signed-in owner's profile
     */
    async getMe(token: string): Promise<OwnerPublic> {
      if (isSandboxToken(token)) {
        return sandboxStore.getOwner();
      }
      return apiFetch<OwnerPublic>('/v1/auth/me', {
        method: 'GET',
        token,
      });
    },

    /**
     * PATCH /v1/auth/me
     * Completes or updates name & company
     */
    async updateMe(token: string, data: { name: string; company?: string }): Promise<OwnerPublic> {
      if (isSandboxToken(token)) {
        return sandboxStore.updateOwner(data);
      }
      return apiFetch<OwnerPublic>('/v1/auth/me', {
        method: 'PATCH',
        token,
        body: data,
      });
    },
  },

  // Projects
  projects: {
    /**
     * GET /v1/projects
     * Lists all projects owned by the user (max 50)
     */
    async list(token: string): Promise<{ projects: ProjectPublic[] }> {
      if (isSandboxToken(token)) {
        return { projects: sandboxStore.listProjects() };
      }
      return apiFetch<{ projects: ProjectPublic[] }>('/v1/projects', {
        method: 'GET',
        token,
      });
    },

    /**
     * GET /v1/projects/{id}
     */
    async get(token: string, projectId: string): Promise<ProjectPublic> {
      if (isSandboxToken(token)) {
        const p = sandboxStore.getProject(projectId);
        if (!p) {
          throw new ApiError(404, 'PROJECT_NOT_FOUND', 'Project not found in sandbox');
        }
        return p;
      }
      return apiFetch<ProjectPublic>(`/v1/projects/${encodeURIComponent(projectId)}`, {
        method: 'GET',
        token,
      });
    },

    /**
     * POST /v1/projects (201)
     */
    async create(token: string, data: { name: string; description?: string }): Promise<ProjectPublic> {
      if (isSandboxToken(token)) {
        return sandboxStore.createProject(data);
      }
      return apiFetch<ProjectPublic>('/v1/projects', {
        method: 'POST',
        token,
        body: data,
      });
    },

    /**
     * DELETE /v1/projects/{id} (204)
     * Also revokes all its API keys
     */
    async delete(token: string, projectId: string): Promise<void> {
      if (isSandboxToken(token)) {
        sandboxStore.deleteProject(projectId);
        return;
      }
      return apiFetch<void>(`/v1/projects/${encodeURIComponent(projectId)}`, {
        method: 'DELETE',
        token,
      });
    },
  },

  // API Keys
  keys: {
    /**
     * GET /v1/projects/{id}/keys
     */
    async list(token: string, projectId: string): Promise<{ keys: ApiKeyPublic[] }> {
      if (isSandboxToken(token)) {
        return { keys: sandboxStore.listKeys(projectId) };
      }
      return apiFetch<{ keys: ApiKeyPublic[] }>(`/v1/projects/${encodeURIComponent(projectId)}/keys`, {
        method: 'GET',
        token,
      });
    },

    /**
     * POST /v1/projects/{id}/keys (201)
     * Returns { key, api_key } - Note: api_key is plaintext and only returned ONCE!
     */
    async create(token: string, projectId: string, data: { name?: string } = {}): Promise<ApiKeyCreated> {
      if (isSandboxToken(token)) {
        return sandboxStore.createKey(projectId, data.name);
      }
      return apiFetch<ApiKeyCreated>(`/v1/projects/${encodeURIComponent(projectId)}/keys`, {
        method: 'POST',
        token,
        body: data,
      });
    },

    /**
     * DELETE /v1/projects/{id}/keys/{key_id}
     * Revokes the specified key
     */
    async revoke(token: string, projectId: string, keyId: string): Promise<ApiKeyPublic> {
      if (isSandboxToken(token)) {
        return sandboxStore.revokeKey(projectId, keyId);
      }
      return apiFetch<ApiKeyPublic>(
        `/v1/projects/${encodeURIComponent(projectId)}/keys/${encodeURIComponent(keyId)}`,
        {
          method: 'DELETE',
          token,
        }
      );
    },
  },

  // Usage
  usage: {
    /**
     * GET /v1/projects/{id}/usage
     */
    async get(token: string, projectId: string): Promise<UsagePublic> {
      if (isSandboxToken(token)) {
        return sandboxStore.getUsage(projectId);
      }
      return apiFetch<UsagePublic>(`/v1/projects/${encodeURIComponent(projectId)}/usage`, {
        method: 'GET',
        token,
      });
    },
  },

  // Health
  health: {
    /**
     * GET /health
     */
    async get(): Promise<HealthResponse> {
      return apiFetch<HealthResponse>('/health');
    },
  },
};

export {
  healthApi,
  authApi,
  projectsApi,
  keysApi,
  usageApi,
  filesApi,
  apiKeysApi,
  isLiveBackendAvailable,
} from './api/index';

