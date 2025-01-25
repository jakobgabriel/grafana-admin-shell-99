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
        toast({
          title: "Error",
          description: "Failed to load saved instances"
        });
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
      toast({
        title: "Instance Added",
        description: `Successfully added ${instance.name} to your instances.`
      });
      return true;
    }
    return false;
  };

  const removeInstance = async (name: string) => {
    const { error } = await supabase
      .from('grafana_instances')
      .delete()
      .eq('name', name);

    if (error) {
      console.error('Error removing instance:', error);
      toast({
        title: "Error",
        description: `Failed to remove ${name}`
      });
      return false;
    }

    setInstances(prev => prev.filter(instance => instance.name !== name));
    await logUserInteraction('remove_instance', 'Index', { instance_name: name });
    toast({
      title: "Instance Removed",
      description: `Successfully removed ${name} from your instances.`
    });
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
    refreshInstance
  };
};