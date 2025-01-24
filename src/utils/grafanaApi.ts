import { toast } from "sonner";

interface GrafanaInstanceFormData {
  name: string;
  url: string;
  apiKey: string;
  organizationId?: string;
}

interface FolderData {
  id: string;
  title: string;
  uid: string;
}

interface DashboardData {
  title: string;
  description: string;
  url: string;
  tags: string[];
  folderId?: string;
}

interface GrafanaInstance extends GrafanaInstanceFormData {
  folders: number;
  dashboards: number;
  foldersList: FolderData[];
  dashboardsList: DashboardData[];
}

export const fetchGrafanaData = async (instance: GrafanaInstanceFormData): Promise<GrafanaInstance | null> => {
  console.log('Fetching Grafana data for instance:', instance.name);
  
  try {
    // First verify the connection by fetching health status
    const healthResponse = await fetch(`${instance.url}/api/health`, {
      headers: {
        'Authorization': `Bearer ${instance.apiKey}`,
      },
    });

    if (!healthResponse.ok) {
      console.error('Health check failed:', healthResponse.statusText);
      toast.error(`Failed to connect to ${instance.name}: ${healthResponse.statusText}`);
      return null;
    }

    // Fetch folders
    console.log('Fetching folders...');
    const foldersResponse = await fetch(`${instance.url}/api/folders`, {
      headers: {
        'Authorization': `Bearer ${instance.apiKey}`,
      },
    });

    if (!foldersResponse.ok) {
      console.error('Failed to fetch folders:', foldersResponse.statusText);
      toast.error(`Failed to fetch folders from ${instance.name}`);
      return null;
    }

    const folders: FolderData[] = await foldersResponse.json();
    console.log('Fetched folders:', folders);

    // Fetch dashboards
    console.log('Fetching dashboards...');
    const searchResponse = await fetch(`${instance.url}/api/search?type=dash-db`, {
      headers: {
        'Authorization': `Bearer ${instance.apiKey}`,
      },
    });

    if (!searchResponse.ok) {
      console.error('Failed to fetch dashboards:', searchResponse.statusText);
      toast.error(`Failed to fetch dashboards from ${instance.name}`);
      return null;
    }

    const dashboardsSearch = await searchResponse.json();
    console.log('Fetched dashboards:', dashboardsSearch);

    // Transform dashboard data to match our interface
    const dashboards: DashboardData[] = dashboardsSearch.map((dash: any) => ({
      title: dash.title,
      description: dash.description || 'No description available',
      url: dash.url,
      tags: dash.tags || [],
      folderId: dash.folderId?.toString() || "0"
    }));

    // Return the complete instance data
    return {
      ...instance,
      folders: folders.length,
      dashboards: dashboards.length,
      foldersList: folders.map(folder => ({
        id: folder.id,
        title: folder.title,
        uid: folder.uid
      })),
      dashboardsList: dashboards
    };

  } catch (error) {
    console.error('Error fetching Grafana data:', error);
    toast.error(`Failed to fetch data from ${instance.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
};