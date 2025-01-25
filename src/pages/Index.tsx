import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import AdminPanel from "@/components/AdminPanel";
import Header from "@/components/Header";
import SearchAndTabs from "@/components/SearchAndTabs";
import { useGrafanaInstances } from "@/hooks/useGrafanaInstances";
import { GrafanaInstance, GrafanaInstanceFormData } from "@/types/grafana";
import { logUserInteraction } from "@/utils/userInteractions";

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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [expandedInstances, setExpandedInstances] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const {
    instances,
    addInstance,
    removeInstance,
    refreshInstance,
    addPastedInstance
  } = useGrafanaInstances();

  const handlePasteContent = async (data: { content: any[], name: string, url: string }) => {
    console.log('Processing pasted content:', data);
    
    try {
      // Group items by folder
      const folders = data.content
        .filter(item => item.type === 'dash-folder')
        .map(folder => ({
          id: folder.id.toString(),
          title: folder.title
        }));

      const dashboards = data.content
        .filter(item => item.type === 'dash-db')
        .map(dashboard => ({
          title: dashboard.title,
          description: dashboard.title,
          url: dashboard.url,
          tags: dashboard.tags,
          folderId: dashboard.folderId?.toString() || '0'
        }));

      const newInstance: GrafanaInstance = {
        name: data.name,
        url: data.url,
        api_key: '',
        folders: folders.length,
        dashboards: dashboards.length,
        folders_list: folders,
        dashboards_list: dashboards
      };

      const success = await addPastedInstance(newInstance);
      
      if (success) {
        toast({
          title: "Content added successfully",
          description: `Added ${dashboards.length} dashboards from ${folders.length} folders`,
        });
      }
    } catch (error) {
      console.error('Error processing pasted content:', error);
      toast({
        title: "Error processing content",
        description: "Failed to process and store the pasted content",
        variant: "destructive",
      });
    }
  };

  const toggleFolder = async (folderId: string) => {
    await logUserInteraction({
      event_type: 'toggle_folder',
      component: 'Index',
      details: { folder_id: folderId }
    });
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const toggleInstance = async (instanceName: string) => {
    await logUserInteraction({
      event_type: 'toggle_instance',
      component: 'Index',
      details: { instance_name: instanceName }
    });
    setExpandedInstances(prev => ({
      ...prev,
      [instanceName]: !prev[instanceName]
    }));
  };

  const handleTagSelect = async (tag: string) => {
    await logUserInteraction({
      event_type: 'select_tag',
      component: 'Index',
      details: { tag }
    });
    setSelectedTags(prev => {
      const newTags = prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag];
      return newTags;
    });
  };

  const allTags = React.useMemo(() => {
    const tagsSet = new Set<string>();
    const allInstances = [...instances];
    allInstances.forEach(instance => {
      const dashboardsList = instance.dashboards_list || [];
      dashboardsList.forEach(dashboard => {
        dashboard.tags.forEach(tag => tagsSet.add(tag));
      });
    });
    return Array.from(tagsSet);
  }, [instances]);

  return (
    <div className="container mx-auto p-4">
      <Header 
        onOpenAdminPanel={() => {
          logUserInteraction({
            event_type: 'open_admin_panel',
            component: 'Index'
          });
          setIsAdminPanelOpen(true);
        }}
        onPasteContent={handlePasteContent}
        showWelcome={instances.length === 0}
      />
      
      <SearchAndTabs
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        instances={instances}
        demoInstances={instances.length === 0 ? demoInstances : []}
        selectedTags={selectedTags}
        expandedFolders={expandedFolders}
        expandedInstances={expandedInstances}
        allTags={allTags}
        onTagSelect={handleTagSelect}
        onFolderToggle={toggleFolder}
        onInstanceToggle={toggleInstance}
        onRemoveInstance={removeInstance}
        onRefreshInstance={refreshInstance}
        onOpenAdminPanel={() => {
          logUserInteraction({
            event_type: 'open_admin_panel',
            component: 'SearchAndTabs'
          });
          setIsAdminPanelOpen(true);
        }}
      />

      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => {
          logUserInteraction({
            event_type: 'close_admin_panel',
            component: 'Index'
          });
          setIsAdminPanelOpen(false);
        }}
        onAddInstance={addInstance}
      />
    </div>
  );
};

export default Index;