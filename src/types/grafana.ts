export interface GrafanaInstance {
  name: string;
  url: string;
  folders: number;
  dashboards: number;
  folders_list: Folder[];
  dashboards_list: Dashboard[];
}

export interface Folder {
  id: string;
  title: string;
}

export interface Dashboard {
  title: string;
  description: string;
  url: string;
  tags: string[];
  folder_id: string;
}