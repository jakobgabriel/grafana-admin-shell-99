import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Settings, ChevronRight, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminPanel from "@/components/AdminPanel";
import GrafanaInstanceCard from "@/components/GrafanaInstanceCard";
import DashboardCard from "@/components/DashboardCard";
import TagFilter from "@/components/TagFilter";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface GrafanaInstanceFormData {
  name: string;
  url: string;
  apiKey: string;
  organizationId?: string;
}

interface GrafanaInstance extends GrafanaInstanceFormData {
  folders: number;
  dashboards: number;
  foldersList: any[];
  dashboardsList: any[];
}

const STORAGE_KEY = 'grafana-instances';

const Index = () => {
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [instances, setInstances] = useState<GrafanaInstance[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [expandedInstances, setExpandedInstances] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Load instances from localStorage on mount
  useEffect(() => {
    const savedInstances = localStorage.getItem(STORAGE_KEY);
    if (savedInstances) {
      setInstances(JSON.parse(savedInstances));
    }
  }, []);

  // Save instances to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(instances));
  }, [instances]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  // Enhanced demo data with two instances
  const demoInstances = [
    {
      name: "Production Grafana",
      url: "https://play.grafana.org",
      apiKey: "", // Added apiKey to match GrafanaInstance type
      folders: 3,
      dashboards: 8,
      foldersList: [
        { id: "1", title: "System Monitoring" },
        { id: "2", title: "Application Metrics" },
        { id: "3", title: "Infrastructure" }
      ],
      dashboardsList: [
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
      apiKey: "", // Added apiKey to match GrafanaInstance type
      folders: 2,
      dashboards: 7,
      foldersList: [
        { id: "4", title: "Development Metrics" },
        { id: "5", title: "Testing Environment" }
      ],
      dashboardsList: [
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

  const fetchGrafanaData = async (instance: GrafanaInstanceFormData) => {
    console.log('Fetching data for instance:', instance.name);
    
    try {
      const corsProxy = 'https://api.allorigins.win/get?url=';
      const headers: Record<string, string> = {};
      if (instance.url !== 'https://play.grafana.org') {
        headers['Authorization'] = `Bearer ${instance.apiKey}`;
      }
      
      const foldersUrl = `${instance.url}/api/folders`;
      const encodedFoldersUrl = encodeURIComponent(foldersUrl);
      console.log('Fetching folders from:', foldersUrl);
      
      const foldersResponse = await fetch(`${corsProxy}${encodedFoldersUrl}`, {
        headers
      });
      
      if (!foldersResponse.ok) {
        throw new Error(`Failed to fetch folders: ${foldersResponse.statusText}`);
      }
      
      const foldersData = await foldersResponse.json();
      console.log('Raw folders response:', foldersData);
      let folders = [];
      try {
        folders = JSON.parse(foldersData.contents || '[]');
      } catch (e) {
        console.error('Error parsing folders:', e);
        folders = [];
      }
      console.log('Parsed folders:', folders);

      const dashboardsUrl = `${instance.url}/api/search?type=dash-db`;
      const encodedDashboardsUrl = encodeURIComponent(dashboardsUrl);
      console.log('Fetching dashboards from:', dashboardsUrl);
      
      const searchResponse = await fetch(`${corsProxy}${encodedDashboardsUrl}`, {
        headers
      });
      
      if (!searchResponse.ok) {
        throw new Error(`Failed to fetch dashboards: ${searchResponse.statusText}`);
      }
      
      const dashboardsData = await searchResponse.json();
      console.log('Raw dashboards response:', dashboardsData);
      let dashboards = [];
      try {
        dashboards = JSON.parse(dashboardsData.contents || '[]');
      } catch (e) {
        console.error('Error parsing dashboards:', e);
        dashboards = [];
      }
      console.log('Parsed dashboards:', dashboards);

      return {
        ...instance,
        folders: folders.length,
        dashboards: dashboards.length,
        foldersList: folders,
        dashboardsList: dashboards.map((dashboard: any) => ({
          title: dashboard.title,
          description: dashboard.description || 'No description available',
          url: `${instance.url}/d/${dashboard.uid}`,
          tags: dashboard.tags || []
        }))
      };

    } catch (error) {
      console.error('Error fetching Grafana data:', error);
      toast({
        title: "Error fetching data",
        description: `Failed to fetch data from ${instance.name}: ${error.message}`,
        variant: "destructive",
      });
      return {
        ...instance,
        folders: 0,
        dashboards: 0,
        foldersList: [],
        dashboardsList: [],
      };
    }
  };

  const handleAddInstance = async (instanceData: GrafanaInstanceFormData) => {
    console.log('Adding new instance:', instanceData);
    toast({
      title: "Adding instance",
      description: `Fetching data from ${instanceData.name}...`,
    });

    const enrichedInstance = await fetchGrafanaData(instanceData);
    setInstances(prev => [...prev, enrichedInstance]);

    toast({
      title: "Instance added",
      description: `Successfully added ${instanceData.name} with ${enrichedInstance.folders} folders and ${enrichedInstance.dashboards} dashboards`,
    });
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const allTags = [
    "system", "monitoring", "node-exporter",
    "kubernetes", "containers", "infrastructure",
    "apm", "performance", "traces",
    "database", "postgresql"
  ];

  const toggleInstance = (instanceName: string) => {
    setExpandedInstances(prev => ({
      ...prev,
      [instanceName]: !prev[instanceName]
    }));
  };

  const renderFolderStructure = (instance: GrafanaInstance) => {
    const generalDashboards = instance.dashboardsList.filter(
      dashboard => !dashboard.folderId || dashboard.folderId === 0
    );

    return (
      <div className="space-y-4">
        {instance.foldersList.map((folder: any) => (
          <Collapsible
            key={folder.id}
            open={expandedFolders[folder.id]}
            onOpenChange={() => toggleFolder(folder.id)}
          >
            <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded">
              {expandedFolders[folder.id] ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <span className="font-medium">{folder.title}</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6 space-y-2">
              {instance.dashboardsList
                .filter(dashboard => dashboard.folderId === folder.id)
                .filter(dashboard =>
                  selectedTags.length === 0 ||
                  dashboard.tags.some(tag => selectedTags.includes(tag))
                )
                .map((dashboard, idx) => (
                  <DashboardCard key={idx} dashboard={dashboard} />
                ))}
            </CollapsibleContent>
          </Collapsible>
        ))}

        {generalDashboards.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">General</h3>
            {generalDashboards
              .filter(dashboard =>
                selectedTags.length === 0 ||
                dashboard.tags.some(tag => selectedTags.includes(tag))
              )
              .map((dashboard, idx) => (
                <DashboardCard key={idx} dashboard={dashboard} />
              ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Grafana Dashboard Explorer</h1>
        <Button
          variant="outline"
          onClick={() => setIsAdminPanelOpen(true)}
          className="flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Admin Panel
        </Button>
      </div>

      {instances.length === 0 ? (
        <div className="grid gap-6">
          <div className="text-center p-8 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Welcome to Grafana Dashboard Explorer</h2>
            <p className="text-muted-foreground mb-6">
              Get started by adding your first Grafana instance or explore the demo view
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setIsAdminPanelOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Grafana Instance
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Demo View</h3>
            <div className="grid md:grid-cols-[250px,1fr] gap-6">
              <TagFilter
                tags={allTags}
                selectedTags={selectedTags}
                onTagSelect={handleTagSelect}
              />
              <div className="space-y-6">
                {demoInstances.map((instance, index) => (
                  <Collapsible
                    key={index}
                    open={expandedInstances[instance.name] !== false}
                    onOpenChange={() => toggleInstance(instance.name)}
                  >
                    <div className="space-y-4">
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center gap-2">
                          {expandedInstances[instance.name] !== false ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <GrafanaInstanceCard instance={instance} />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        {renderFolderStructure(instance)}
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-[250px,1fr] gap-6">
          <TagFilter
            tags={allTags}
            selectedTags={selectedTags}
            onTagSelect={handleTagSelect}
          />
          <div className="space-y-6">
            {instances.map((instance, index) => (
              <Collapsible
                key={index}
                open={expandedInstances[instance.name] !== false}
                onOpenChange={() => toggleInstance(instance.name)}
              >
                <div className="space-y-4">
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      {expandedInstances[instance.name] !== false ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <GrafanaInstanceCard instance={instance} />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {renderFolderStructure(instance)}
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        </div>
      )}

      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        onAddInstance={handleAddInstance}
      />
    </div>
  );
};

export default Index;
