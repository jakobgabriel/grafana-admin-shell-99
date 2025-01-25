import { Json } from "@/integrations/supabase/types";

export interface GrafanaInstanceFormData {
  name: string;
  url: string;
  apiKey: string;
  organizationId?: string;
}

export interface GrafanaInstance extends GrafanaInstanceFormData {
  id?: string;
  folders: number;
  dashboards: number;
  folders_list: Json;
  dashboards_list: Json;
  created_at?: string;
  updated_at?: string;
}