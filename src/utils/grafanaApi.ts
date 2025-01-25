import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GrafanaInstance, GrafanaInstanceFormData } from "@/types/grafana";

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
      name: instance.name,
      url: instance.url,
      api_key: instance.apiKey,
      folders: folders.length,
      dashboards: dashboards.length,
      folders_list: folders,
      dashboards_list: dashboards
    };

    // Save to Supabase
    const { error } = await supabase
      .from('grafana_instances')
      .upsert([result]);

    if (error) {
      console.error('Error saving to Supabase:', error);
      toast.error('Failed to save instance data');
      return null;
    }

    console.log('Successfully processed Grafana instance data:', result);
    return result as GrafanaInstance;

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