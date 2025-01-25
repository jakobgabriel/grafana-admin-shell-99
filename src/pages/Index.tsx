import React, { useState, useEffect, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";
import AdminPanel from "@/components/AdminPanel";
import Header from "@/components/Header";
import SearchAndTabs from "@/components/SearchAndTabs";
import { fetchGrafanaData, logUserInteraction } from "@/utils/grafanaApi";
import { supabase } from "@/integrations/supabase/client";
import { GrafanaInstance, GrafanaInstanceFormData } from "@/types/grafana";

const STORAGE_KEY = 'grafana-instances';

// Demo data
const demoInstances: GrafanaInstance[] = [
  {
    name: "Production Grafana",
    url: "https://play.grafana.org",
    api_key: "",
    folders: 3,
    dashboards: 8,
    folders_list: [
      { id: "1", title: "System Monitoring" },
      { id: "2", title: "Application Metrics" },
      { id: "3", title: "Infrastructure" }
    ],
    dashboards_list: [
      {
        title: "System Overview",
        description: "Complete system metrics dashboard with CPU, Memory, Network, and Disk usage metrics",
        url: "https://play.grafana.org/d/rYdddlPWk/node-exporter-full",
        tags: ["system", "monitoring", "node-exporter"],
        folderId: "1"
      },
      {
        title: "Application Performance",
        description: "Application performance monitoring with response times, error rates, and throughput metrics",
        url: "https://play.grafana.org/d/apm",
        tags: ["apm", "performance", "traces"],
        folderId: "2"
      },
      {
        title: "Database Metrics",
        description: "PostgreSQL database performance monitoring",
        url: "https://play.grafana.org/d/postgres",
        tags: ["database", "postgresql", "performance"],
        folderId: "2"
      }
    ]
  },
  {
    name: "Development Grafana",
    url: "https://play-dev.grafana.org",
    api_key: "",
    folders: 2,
    dashboards: 7,
    folders_list: [
      { id: "4", title: "Development Metrics" },
      { id: "5", title: "Testing Environment" }
    ],
    dashboards_list: [
      {
        title: "Dev Environment Health",
        description: "Development environment health monitoring",
        url: "https://play.grafana.org/d/dev-health",
        tags: ["development", "monitoring"],
        folderId: "4"
      },
      {
        title: "Test Coverage Dashboard",
        description: "Test coverage and quality metrics",
        url: "https://play.grafana.org/d/test-coverage",
        tags: ["testing", "quality"],
        folderId: "5"
      },
      {
        title: "CI/CD Pipeline",
        description: "Continuous Integration and Deployment metrics",
        url: "https://play.grafana.org/d/cicd",
        tags: ["ci-cd", "pipeline"],
        folderId: "4"
      }
    ]
  }
];

const Index = () => {
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [instances, setInstances] = useState<GrafanaInstance[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [expandedInstances, setExpandedInstances] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const loadInstances = async () => {
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
        setInstances(data as GrafanaInstance[]);
        await logUserInteraction('load_instances', 'Index', { count: data.length });
      }
    };

    loadInstances();
  }, []);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
    logUserInteraction('toggle_folder', 'Index', { folder_id: folderId });
  };

  const toggleInstance = (instanceName: string) => {
    setExpandedInstances(prev => ({
      ...prev,
      [instanceName]: !prev[instanceName]
    }));
    logUserInteraction('toggle_instance', 'Index', { instance_name: instanceName });
  };

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    const allInstances = [...instances, ...demoInstances];
    allInstances.forEach(instance => {
      instance.dashboards_list.forEach(dashboard => {
        dashboard.tags.forEach((tag: string) => tagsSet.add(tag));
      });
    });
    return Array.from(tagsSet);
  }, [instances]);

  const handleTagSelect = async (tag: string) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag];
      logUserInteraction('select_tag', 'Index', { tag, selected: !prev.includes(tag) });
      return newTags;
    });
  };

  const handleAddInstance = async (instance: GrafanaInstanceFormData) => {
    console.log("Adding new instance:", instance);
    
    const data = await fetchGrafanaData(instance);
    
    if (data) {
      setInstances(prev => [...prev, data]);
      await logUserInteraction('add_instance', 'Index', { instance_name: instance.name });
      toast({
        title: "Instance Added",
        description: `Successfully added ${instance.name} to your instances.`
      });
    }
    
    setIsAdminPanelOpen(false);
  };

  const handleRemoveInstance = async (name: string) => {
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
      return;
    }

    setInstances(prev => prev.filter(instance => instance.name !== name));
    await logUserInteraction('remove_instance', 'Index', { instance_name: name });
    toast({
      title: "Instance Removed",
      description: `Successfully removed ${name} from your instances.`
    });
  };

  const handleRefreshInstance = (updatedInstance: GrafanaInstance) => {
    setInstances(prev => 
      prev.map(instance => 
        instance.name === updatedInstance.name ? updatedInstance : instance
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Header onOpenAdminPanel={() => setIsAdminPanelOpen(true)} />
      
      <SearchAndTabs
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        instances={instances}
        demoInstances={demoInstances}
        selectedTags={selectedTags}
        expandedFolders={expandedFolders}
        expandedInstances={expandedInstances}
        allTags={allTags}
        onTagSelect={handleTagSelect}
        onFolderToggle={toggleFolder}
        onInstanceToggle={toggleInstance}
        onRemoveInstance={handleRemoveInstance}
        onRefreshInstance={handleRefreshInstance}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
      />

      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        onAddInstance={handleAddInstance}
      />
    </div>
  );
};

export default Index;
