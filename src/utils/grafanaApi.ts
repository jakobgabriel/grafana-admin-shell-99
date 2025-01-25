import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GrafanaInstanceFormData {
  name: string;
  url: string;
  apiKey: string;
  organizationId?: string;
}

export const fetchGrafanaData = async (instance: GrafanaInstanceFormData) => {
  console.log('Fetching Grafana data for instance:', instance.name);
  
  try {
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

    const folders = searchResults
      .filter((item: any) => item.type === 'folder')
      .map((folder: any) => ({
        id: folder.id.toString(),
        title: folder.title,
        uid: folder.uid
      }));

    const dashboards = searchResults
      .filter((item: any) => item.type === 'dash-db')
      .map((dash: any) => ({
        title: dash.title,
        description: dash.description || 'No description available',
        url: `${instance.url}${dash.url}`,
        tags: dash.tags || [],
        folderId: dash.folderId?.toString() || "0"
      }));

    const result = {
      ...instance,
      folders: folders.length,
      dashboards: dashboards.length,
      foldersList: folders,
      dashboardsList: dashboards
    };

    // Save to Supabase
    const { error } = await supabase
      .from('grafana_instances')
      .upsert([result], {
        onConflict: 'name'
      });

    if (error) {
      console.error('Error saving to Supabase:', error);
      toast.error('Failed to save instance data');
      return null;
    }

    console.log('Successfully processed Grafana instance data:', result);
    return result;

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

export const refreshGrafanaInstance = async (instance: GrafanaInstanceFormData) => {
  console.log('Refreshing Grafana instance:', instance.name);
  const result = await fetchGrafanaData(instance);
  if (result) {
    toast.success(`Successfully refreshed ${instance.name}`);
  }
  return result;
};