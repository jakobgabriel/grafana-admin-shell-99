import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GrafanaInstance, GrafanaInstanceFormData, DashboardData, FolderData } from "@/types/grafana";
import { Json } from "@/integrations/supabase/types";

interface GrafanaSearchItem {
  id: number;
  uid: string;
  title: string;
  uri: string;
  url: string;
  slug: string;
  type: string;
  tags: string[];
  isStarred: boolean;
  folderId?: number;
  folderUid?: string;
  folderTitle?: string;
  folderUrl?: string;
  description?: string;
}

const fetchFolderContents = async (instance: GrafanaInstanceFormData, folderUid: string): Promise<GrafanaSearchItem[]> => {
  console.log(`Fetching contents for folder ${folderUid}`);
  try {
    const response = await fetch(`${instance.url}/api/search?folderIds=${folderUid}`, {
      headers: {
        'Authorization': `Bearer ${instance.apiKey}`,
        'Accept': 'application/json',
      },
      mode: 'cors'
    });

    if (!response.ok) {
      console.error(`Failed to fetch folder contents for ${folderUid}:`, response.statusText);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching folder contents for ${folderUid}:`, error);
    return [];
  }
};

const processSearchResults = async (
  instance: GrafanaInstanceFormData,
  items: GrafanaSearchItem[]
): Promise<{ folders: FolderData[], dashboards: DashboardData[] }> => {
  console.log('Processing search results:', items);
  
  const folders: FolderData[] = [];
  const dashboards: DashboardData[] = [];
  
  for (const item of items) {
    if (item.type === 'dash-folder') {
      folders.push({
        id: item.id.toString(),
        title: item.title,
      });
      
      // Recursively fetch contents of this folder
      const folderContents = await fetchFolderContents(instance, item.uid);
      const processedContents = await processSearchResults(instance, folderContents);
      
      folders.push(...processedContents.folders);
      dashboards.push(...processedContents.dashboards);
    } else if (item.type === 'dash-db') {
      dashboards.push({
        title: item.title,
        description: item.description || 'No description available',
        url: `${instance.url}${item.url}`,
        tags: item.tags || [],
        folderId: (item.folderId || 0).toString()
      });
    }
  }
  
  return { folders, dashboards };
};

export const fetchGrafanaData = async (instance: GrafanaInstanceFormData) => {
  console.log('Fetching Grafana data for instance:', instance.name);
  
  try {
    // Initial search to get all items
    const searchResponse = await fetch(`${instance.url}/api/search`, {
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

    const searchResults: GrafanaSearchItem[] = await searchResponse.json();
    console.log('Successfully fetched search results:', searchResults);

    const { folders, dashboards } = await processSearchResults(instance, searchResults);

    // Convert the complex types to JSON-compatible format
    const supabaseData = {
      name: instance.name,
      url: instance.url,
      api_key: instance.apiKey,
      folders: folders.length,
      dashboards: dashboards.length,
      folders_list: folders as Json,
      dashboards_list: dashboards as Json
    };

    // Save to Supabase
    const { error } = await supabase
      .from('grafana_instances')
      .upsert(supabaseData);

    if (error) {
      console.error('Error saving to Supabase:', error);
      toast.error('Failed to save instance data');
      return null;
    }

    await logUserInteraction('fetch_grafana_data', 'GrafanaAPI', {
      instance_name: instance.name,
      folders_count: folders.length,
      dashboards_count: dashboards.length
    });

    console.log('Successfully processed Grafana instance data:', supabaseData);
    return supabaseData as GrafanaInstance;

  } catch (error) {
    console.error('Error fetching Grafana data:', error);
    toast.error(`Unable to connect to ${instance.name}. Please verify the URL is accessible and CORS is enabled.`);
    return null;
  }
};

export const logUserInteraction = async (eventType: string, component: string, details: any = {}) => {
  console.log(`Logging user interaction: ${eventType} on ${component}`, details);
  
  const { error } = await supabase
    .from('user_interactions')
    .insert([{
      event_type: eventType,
      component,
      details
    }]);

  if (error) {
    console.error('Error logging user interaction:', error);
  }
};

export const refreshGrafanaInstance = async (instance: GrafanaInstance) => {
  console.log('Refreshing Grafana instance:', instance.name);
  const formData: GrafanaInstanceFormData = {
    name: instance.name,
    url: instance.url,
    apiKey: instance.api_key
  };
  const result = await fetchGrafanaData(formData);
  if (result) {
    toast.success(`Successfully refreshed ${instance.name}`);
  }
  return result;
};