import { toast } from "sonner";

interface GrafanaFolder {
  id: string;
  title: string;
}

interface GrafanaDashboard {
  uid: string;
  title: string;
  folderUid: string | null;
  meta: {
    folderTitle?: string;
    folderUrl?: string;
    url: string;
  };
}

interface GrafanaInstance {
  name: string;
  url: string;
  apiKey: string;
}

export const fetchGrafanaData = async (instance: GrafanaInstance) => {
  console.log('Fetching data for Grafana instance:', instance.name);
  
  try {
    // Fetch folders
    const foldersResponse = await fetch(`${instance.url}/api/folders`, {
      headers: {
        'Authorization': `Bearer ${instance.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!foldersResponse.ok) {
      throw new Error(`Failed to fetch folders: ${foldersResponse.statusText}`);
    }

    const folders: GrafanaFolder[] = await foldersResponse.json();
    console.log('Fetched folders:', folders);

    // Fetch dashboards
    const searchResponse = await fetch(`${instance.url}/api/search?type=dash-db`, {
      headers: {
        'Authorization': `Bearer ${instance.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!searchResponse.ok) {
      throw new Error(`Failed to fetch dashboards: ${searchResponse.statusText}`);
    }

    const dashboards: GrafanaDashboard[] = await searchResponse.json();
    console.log('Fetched dashboards:', dashboards);

    // Transform the data to match our app's format
    return {
      name: instance.name,
      url: instance.url,
      apiKey: instance.apiKey,
      folders: folders.length,
      dashboards: dashboards.length,
      foldersList: folders.map(folder => ({
        id: folder.id,
        title: folder.title,
      })),
      dashboardsList: dashboards.map(dashboard => ({
        title: dashboard.title,
        description: 'Dashboard from Grafana', // Grafana API doesn't provide descriptions
        url: `${instance.url}${dashboard.meta.url}`,
        tags: [], // We'll need to fetch tags separately if needed
        folderId: dashboard.folderUid || "0"
      }))
    };
  } catch (error) {
    console.error('Error fetching Grafana data:', error);
    toast.error(`Failed to fetch data from ${instance.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
};