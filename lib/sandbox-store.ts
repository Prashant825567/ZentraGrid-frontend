import {
  type OwnerPublic,
  type ProjectPublic,
  type ApiKeyPublic,
  type ApiKeyCreated,
  type UsagePublic,
  type GoogleAuthResponse,
} from './api';

const STORAGE_KEYS = {
  OWNER: 'zg_sandbox_owner',
  PROJECTS: 'zg_sandbox_projects',
  KEYS: 'zg_sandbox_keys',
  USAGE: 'zg_sandbox_usage',
};

function getStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }
}

const DEFAULT_OWNER: OwnerPublic = {
  owner_id: 'sandbox_owner_alpha',
  email: 'founder@zentragrid.dev',
  name: 'Dev Founder',
  company: 'ZentraGrid Labs',
  picture: null,
  plan: 'founder',
  profile_completed: true,
  created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
  updated_at: new Date().toISOString(),
};

const DEFAULT_PROJECTS: ProjectPublic[] = [
  {
    project_id: 'proj_grid_core_01',
    owner_id: 'sandbox_owner_alpha',
    name: 'Core Media Storage Cluster',
    description: 'Ultra-low latency user upload and HLS video streaming node',
    plan: 'founder',
    max_bytes: 107374182400, // 100 GB
    max_files: 500000,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    project_id: 'proj_grid_analytics_02',
    owner_id: 'sandbox_owner_alpha',
    name: 'Telemetry & Asset Ingestion',
    description: 'Encrypted document pipeline for user profiles and telemetry records',
    plan: 'founder',
    max_bytes: 53687091200, // 50 GB
    max_files: 250000,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const DEFAULT_KEYS: ApiKeyPublic[] = [
  {
    key_id: 'key_node_worker_7a',
    project_id: 'proj_grid_core_01',
    name: 'NodeJS Production Ingest',
    key_hint: 'zg_live_...9f8b',
    revoked: false,
    last_used_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    key_id: 'key_python_pipeline_8b',
    project_id: 'proj_grid_core_01',
    name: 'FastAPI Transcoder Daemon',
    key_hint: 'zg_live_...4a2c',
    revoked: false,
    last_used_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

const DEFAULT_USAGE: Record<string, UsagePublic> = {
  proj_grid_core_01: {
    project_id: 'proj_grid_core_01',
    total_files: 3480,
    total_bytes: 38654705664, // ~36 GB
    uploads: 4210,
    downloads: 18450,
    streams: 9840,
    bandwidth_out_bytes: 85899345920, // ~80 GB
    api_requests: 32490,
    quota_bytes: 107374182400,
    quota_files: 500000,
    bytes_remaining: 68719476736,
    files_remaining: 496520,
    updated_at: new Date().toISOString(),
  },
  proj_grid_analytics_02: {
    project_id: 'proj_grid_analytics_02',
    total_files: 810,
    total_bytes: 4294967296, // 4 GB
    uploads: 950,
    downloads: 1420,
    streams: 320,
    bandwidth_out_bytes: 8589934592, // 8 GB
    api_requests: 5210,
    quota_bytes: 53687091200,
    quota_files: 250000,
    bytes_remaining: 49392123904,
    files_remaining: 249190,
    updated_at: new Date().toISOString(),
  },
};

export const sandboxStore = {
  getOwner(): OwnerPublic {
    return getStorage<OwnerPublic>(STORAGE_KEYS.OWNER, DEFAULT_OWNER);
  },

  updateOwner(data: { name: string; company?: string }): OwnerPublic {
    const current = this.getOwner();
    const updated: OwnerPublic = {
      ...current,
      name: data.name,
      company: data.company || null,
      profile_completed: true,
      updated_at: new Date().toISOString(),
    };
    setStorage(STORAGE_KEYS.OWNER, updated);
    return updated;
  },

  googleAuth(name?: string, company?: string): GoogleAuthResponse {
    let owner = this.getOwner();
    if (name) {
      owner = this.updateOwner({ name, company });
    }
    return {
      owner,
      is_new_owner: false,
      requires_profile_completion: !owner.profile_completed || !owner.name,
    };
  },

  listProjects(): ProjectPublic[] {
    return getStorage<ProjectPublic[]>(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS);
  },

  getProject(id: string): ProjectPublic | null {
    const list = this.listProjects();
    return list.find((p) => p.project_id === id) || null;
  },

  createProject(data: { name: string; description?: string }): ProjectPublic {
    const list = this.listProjects();
    const newId = `proj_${Math.random().toString(36).substring(2, 10)}`;
    const newProj: ProjectPublic = {
      project_id: newId,
      owner_id: this.getOwner().owner_id,
      name: data.name,
      description: data.description || null,
      plan: 'founder',
      max_bytes: 107374182400,
      max_files: 500000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const updated = [newProj, ...list];
    setStorage(STORAGE_KEYS.PROJECTS, updated);

    // Initialize usage
    const usages = getStorage<Record<string, UsagePublic>>(STORAGE_KEYS.USAGE, DEFAULT_USAGE);
    usages[newId] = {
      project_id: newId,
      total_files: 0,
      total_bytes: 0,
      uploads: 0,
      downloads: 0,
      streams: 0,
      bandwidth_out_bytes: 0,
      api_requests: 0,
      quota_bytes: newProj.max_bytes,
      quota_files: newProj.max_files,
      bytes_remaining: newProj.max_bytes,
      files_remaining: newProj.max_files,
      updated_at: new Date().toISOString(),
    };
    setStorage(STORAGE_KEYS.USAGE, usages);

    return newProj;
  },

  deleteProject(id: string): void {
    const list = this.listProjects();
    setStorage(STORAGE_KEYS.PROJECTS, list.filter((p) => p.project_id !== id));
    
    // Also remove keys
    const keys = this.listKeys();
    setStorage(STORAGE_KEYS.KEYS, keys.filter((k) => k.project_id !== id));
  },

  listKeys(projectId?: string): ApiKeyPublic[] {
    const all = getStorage<ApiKeyPublic[]>(STORAGE_KEYS.KEYS, DEFAULT_KEYS);
    if (!projectId) return all;
    return all.filter((k) => k.project_id === projectId);
  },

  createKey(projectId: string, name?: string): ApiKeyCreated {
    const randPart = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const fullApiKey = `zg_live_${randPart}`;
    const keyHint = `zg_live_...${randPart.slice(-4)}`;
    const newKeyId = `key_${Math.random().toString(36).substring(2, 9)}`;

    const newKey: ApiKeyPublic = {
      key_id: newKeyId,
      project_id: projectId,
      name: name || 'Standard API Key',
      key_hint: keyHint,
      revoked: false,
      last_used_at: null,
      created_at: new Date().toISOString(),
    };

    const all = this.listKeys();
    setStorage(STORAGE_KEYS.KEYS, [newKey, ...all]);

    return {
      key: newKey,
      api_key: fullApiKey,
    };
  },

  revokeKey(projectId: string, keyId: string): ApiKeyPublic {
    const all = this.listKeys();
    let target: ApiKeyPublic | null = null;
    const updated = all.map((k) => {
      if (k.key_id === keyId && k.project_id === projectId) {
        target = { ...k, revoked: true };
        return target;
      }
      return k;
    });
    setStorage(STORAGE_KEYS.KEYS, updated);

    return (
      target || {
        key_id: keyId,
        project_id: projectId,
        name: 'Revoked Key',
        key_hint: 'zg_live_...revk',
        revoked: true,
        last_used_at: null,
        created_at: new Date().toISOString(),
      }
    );
  },

  getUsage(projectId: string): UsagePublic {
    const usages = getStorage<Record<string, UsagePublic>>(STORAGE_KEYS.USAGE, DEFAULT_USAGE);
    if (usages[projectId]) {
      return usages[projectId];
    }
    const proj = this.getProject(projectId);
    const maxB = proj?.max_bytes || 107374182400;
    const maxF = proj?.max_files || 500000;
    return {
      project_id: projectId,
      total_files: 0,
      total_bytes: 0,
      uploads: 0,
      downloads: 0,
      streams: 0,
      bandwidth_out_bytes: 0,
      api_requests: 0,
      quota_bytes: maxB,
      quota_files: maxF,
      bytes_remaining: maxB,
      files_remaining: maxF,
      updated_at: new Date().toISOString(),
    };
  },
};
