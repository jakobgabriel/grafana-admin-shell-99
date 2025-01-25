import { GrafanaInstance, FolderData, DashboardData } from "@/types/grafana";
import { Json } from "@/integrations/supabase/types";

export const transformGrafanaData = (data: any[]): GrafanaInstance[] => {
  return data.map(instance => {
    const foldersList = instance.folders_list as Json[];
    const dashboardsList = instance.dashboards_list as Json[];
    
    return {
      ...instance,
      folders_list: Array.isArray(foldersList) ? foldersList.map(folder => ({
        id: (folder as any).id?.toString() || '',
        title: (folder as any).title || ''
      })) as FolderData[] : [],
      dashboards_list: Array.isArray(dashboardsList) ? dashboardsList.map(dashboard => ({
        title: (dashboard as any).title || '',
        description: (dashboard as any).description || '',
        url: (dashboard as any).url || '',
        tags: Array.isArray((dashboard as any).tags) ? (dashboard as any).tags : [],
        folderId: (dashboard as any).folderId?.toString() || '0'
      })) as DashboardData[] : []
    };
  }) as GrafanaInstance[];
};