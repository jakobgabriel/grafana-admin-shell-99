import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { GrafanaInstance, GrafanaInstanceFormData } from "@/types/grafana";
import { Json } from "@/integrations/supabase/types";
import { fetchGrafanaData, logUserInteraction } from "@/utils/grafanaApi";
import { toast } from "sonner";
import { transformGrafanaData } from "@/utils/grafanaTransforms";

export const useGrafanaInstances = () => {
  const [instances, setInstances] = useState<GrafanaInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInstances();
  }, []);

  const loadInstances = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('grafana_instances')
        .select('*');
      
      if (error) {
        console.error('Error loading instances:', error);
        toast("Failed to load saved instances");
        return;
      }

      if (data && data.length > 0) {
        const transformedData = transformGrafanaData(data);
        setInstances(transformedData);
        await logUserInteraction('load_instances', 'Index', { count: data.length });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addInstance = async (instance: GrafanaInstanceFormData) => {
    console.log("Adding new instance:", instance);
    const data = await fetchGrafanaData(instance);
    
    if (data) {
      setInstances(prev => [...prev, data]);
      await logUserInteraction('add_instance', 'Index', { instance_name: instance.name });
      toast(`Successfully added ${instance.name} to your instances.`);
      return true;
    }
    return false;
  };

  const addPastedInstance = async (instance: GrafanaInstance) => {
    try {
      const { error } = await supabase
        .from('grafana_instances')
        .insert({
          name: instance.name,
          url: instance.url,
          api_key: instance.api_key,
          folders: instance.folders,
          dashboards: instance.dashboards,
          folders_list: instance.folders_list as unknown as Json,
          dashboards_list: instance.dashboards_list as unknown as Json
        });

      if (error) {
        console.error('Error saving pasted instance:', error);
        toast.error('Failed to save pasted instance');
        return false;
      }

      setInstances(prev => [...prev, instance]);
      await logUserInteraction('add_pasted_instance', 'Index', { 
        instance_name: instance.name,
        folders_count: instance.folders,
        dashboards_count: instance.dashboards
      });
      
      return true;
    } catch (error) {
      console.error('Error adding pasted instance:', error);
      return false;
    }
  };

  const removeInstance = async (name: string) => {
    const { error } = await supabase
      .from('grafana_instances')
      .delete()
      .eq('name', name);

    if (error) {
      console.error('Error removing instance:', error);
      toast(`Failed to remove ${name}`);
      return false;
    }

    setInstances(prev => prev.filter(instance => instance.name !== name));
    await logUserInteraction('remove_instance', 'Index', { instance_name: name });
    toast(`Successfully removed ${name} from your instances.`);
    return true;
  };

  const refreshInstance = (updatedInstance: GrafanaInstance) => {
    setInstances(prev => 
      prev.map(instance => 
        instance.name === updatedInstance.name ? updatedInstance : instance
      )
    );
  };

  return {
    instances,
    isLoading,
    addInstance,
    removeInstance,
    refreshInstance,
    addPastedInstance
  };
};