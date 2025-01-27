import { useState, useEffect } from 'react';
import { GrafanaInstance, GrafanaInstanceFormData } from "@/types/grafana";
import { fetchGrafanaData } from "@/utils/githubData";
import { toast } from "sonner";
import { transformGrafanaData } from "@/utils/grafanaTransforms";

export const useGrafanaInstances = () => {
  const [instances, setInstances] = useState<GrafanaInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadInstances = async () => {
    setIsLoading(true);
    try {
      // Replace with your GitHub repository details
      const data = await fetchGrafanaData('your-username/your-repo');
      if (data && data.length > 0) {
        const transformedData = transformGrafanaData(data);
        setInstances(transformedData);
        console.log('Loaded instances:', transformedData);
      }
    } catch (error) {
      console.error('Error loading instances:', error);
      toast.error("Failed to load instances from GitHub");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInstances();
  }, []);

  const addInstance = async (instance: GrafanaInstanceFormData) => {
    console.log("Adding new instance:", instance);
    toast.error("Adding instances is not supported in the GitHub version");
    return false;
  };

  const removeInstance = async (name: string) => {
    console.log("Removing instance not supported in GitHub version");
    toast.error("Removing instances is not supported in the GitHub version");
    return false;
  };

  const refreshInstance = (updatedInstance: GrafanaInstance) => {
    console.log("Refreshing instance not supported in GitHub version");
    toast.error("Refreshing instances is not supported in the GitHub version");
  };

  const addPastedInstance = async (instance: GrafanaInstance) => {
    console.log("Adding pasted instance not supported in GitHub version");
    toast.error("Adding pasted instances is not supported in the GitHub version");
    return false;
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