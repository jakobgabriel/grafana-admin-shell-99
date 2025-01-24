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
  console.log('Attempting to fetch Grafana data for instance:', instance.name);
  
  try {
    // Fetch both folders and dashboards in a single request
    console.log('Fetching Grafana data using search endpoint...');
    const searchResponse = await fetch(`${instance.url}/api/search?type=dash-db,folder`, {
      headers: {
        'Authorization': `Bearer ${instance.apiKey}`,
        'Accept': 'application/json',
      },
      mode: 'cors'
    });

    if (!searchResponse.ok) {
      console.error('Search request failed:', searchResponse.statusText);
      toast.error(`Connection to ${instance.name} failed. Please check your URL and API key.`);
      return null;
    }

    const searchResults = await searchResponse.json();
    console.log('Successfully fetched search results:', searchResults);

    // Separate folders and dashboards
    const folders: FolderData[] = searchResults
      .filter((item: any) => item.type === 'folder')
      .map((folder: any) => ({
        id: folder.id.toString(),
        title: folder.title,
        uid: folder.uid
      }));

    const dashboards: DashboardData[] = searchResults
      .filter((item: any) => item.type === 'dash-db')
      .map((dash: any) => ({
        title: dash.title,
        description: dash.description || 'No description available',
        url: `${instance.url}${dash.url}`,
        tags: dash.tags || [],
        folderId: dash.folderId?.toString() || "0"
      }));

    console.log('Processed folders:', folders);
    console.log('Processed dashboards:', dashboards);

    const result: GrafanaInstance = {
      ...instance,
      folders: folders.length,
      dashboards: dashboards.length,
      foldersList: folders,
      dashboardsList: dashboards
    };

    console.log('Successfully processed Grafana instance data:', result);
    return result;

  } catch (error) {
    console.error('Error fetching Grafana data:', error);
    toast.error(`Unable to connect to ${instance.name}. Please verify the URL is accessible and CORS is enabled on your Grafana server.`);
    return null;
  }
};