export interface GrafanaInstanceFormData {
  name: string;
  url: string;
  apiKey: string;
  organizationId?: string;
}

export interface DashboardData {
  title: string;
  description: string;
  url: string;
  tags: string[];
  folderId?: string;
}

export interface FolderData {
  id: string;
  title: string;
}

export interface GrafanaInstance {
  id?: string;
  name: string;
  url: string;
  api_key: string;
  folders: number;
  dashboards: number;
  folders_list: FolderData[];
  dashboards_list: DashboardData[];
  created_at?: string;
  updated_at?: string;
}