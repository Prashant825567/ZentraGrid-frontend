export interface OwnerProfile {
  owner_id: string;
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  picture?: string | null;
  avatar_url?: string;
  plan?: string;
  profile_completed?: boolean;
  requires_profile_completion?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface GoogleAuthResponse {
  owner: OwnerProfile;
  is_new_owner?: boolean;
  requires_profile_completion: boolean;
  token?: string;
}

export interface Project {
  id: string;
  project_id: string;
  owner_id?: string;
  name: string;
  description?: string | null;
  plan?: string;
  max_bytes?: number;
  max_files?: number;
  storage_bytes?: number;
  file_count?: number;
  storage_used_bytes?: number;
  storage_quota_bytes?: number;
  status?: 'active' | 'suspended';
  created_at: string;
  updated_at?: string;
}

export type ZentraProject = Project;

export interface ApiKey {
  id: string;
  key_id: string;
  name: string | null;
  key_hint: string;
  project_id: string;
  created_at: string;
  last_used_at?: string | null;
  revoked: boolean;
}

export type ZentraApiKey = ApiKey;

export interface CreateApiKeyResponse {
  key: ApiKey;
  plaintext_key: string;
  api_key?: string;
}

export interface ProjectUsage {
  project_id: string;
  total_files: number;
  file_count: number;
  total_bytes: number;
  quota_bytes: number;
  quota_files?: number;
  uploads?: number;
  downloads?: number;
  streams?: number;
  bandwidth_bytes: number;
  bandwidth_out_bytes?: number;
  bandwidth_quota_bytes?: number;
  api_requests: number;
  api_requests_quota?: number;
  bytes_remaining?: number;
  files_remaining?: number;
  usage_period?: string;
  updated_at?: string;
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
  next_cursor?: string | null;
  page?: number;
  limit?: number;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
