export interface OwnerProfile {
  id: string;
  email: string;
  name?: string;
  company?: string;
  avatar_url?: string;
  requires_profile_completion?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface GoogleAuthResponse {
  owner: OwnerProfile;
  requires_profile_completion: boolean;
  token?: string;
}

export interface Project {
  id: string;
  name: string;
  created_at: string;
  updated_at?: string;
  storage_bytes?: number;
  file_count?: number;
  storage_used_bytes?: number;
  storage_quota_bytes?: number;
  status?: 'active' | 'suspended';
}

export type ZentraProject = Project;

export interface ApiKey {
  id: string;
  name: string;
  key_hint: string;
  project_id: string;
  created_at: string;
  last_used_at?: string;
  revoked: boolean;
}

export type ZentraApiKey = ApiKey;

export interface CreateApiKeyResponse {
  key: ApiKey;
  plaintext_key: string;
}

export interface ProjectUsage {
  project_id: string;
  file_count: number;
  total_bytes: number;
  quota_bytes: number;
  bandwidth_bytes: number;
  bandwidth_quota_bytes: number;
  api_requests: number;
  api_requests_quota: number;
  usage_period: string;
  storage_history?: { date: string; bytes: number; requests: number; bandwidth: number }[];
}

export interface ZentraFile {
  id: string;
  name: string;
  size: number;
  mime_type: string;
  status: 'active' | 'processing' | 'archived' | 'error';
  created_at: string;
  updated_at?: string;
  project_id?: string;
  download_url?: string;
  stream_url?: string;
  sha256?: string;
}

export interface FileListResponse {
  files: ZentraFile[];
  total: number;
  page?: number;
  limit?: number;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
