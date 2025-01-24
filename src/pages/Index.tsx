import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Settings, ChevronRight, ChevronDown, Search, Folder } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState('');
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

  const toggleInstance = (instanceName: string) => {
    setExpandedInstances(prev => ({
      ...prev,
      [instanceName]: !prev[instanceName]
    }));
  };

  const filterDashboards = (dashboards: any[]) => {
    return dashboards.filter(dashboard => {
      const matchesSearch = searchQuery === '' || 
        dashboard.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dashboard.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 ||
        dashboard.tags.some((tag: string) => selectedTags.includes(tag));
      
      return matchesSearch && matchesTags;
    });
  };

  const renderFolderStructure = (instance: GrafanaInstance) => {
    const generalDashboards = filterDashboards(
      instance.dashboardsList.filter(dashboard => !dashboard.folderId || dashboard.folderId === "0")
    );

    return (
      <div className="space-y-4">
        {instance.foldersList.map((folder: any) => {
          const folderDashboards = filterDashboards(
            instance.dashboardsList.filter(dashboard => dashboard.folderId === folder.id)
          );

          if (folderDashboards.length === 0) return null;

          return (
            <Collapsible
              key={folder.id}
              open={expandedFolders[folder.id]}
              onOpenChange={() => toggleFolder(folder.id)}
              className="bg-grafana-card rounded-lg border border-grafana-blue/20"
            >
              <CollapsibleTrigger className="flex items-center gap-2 w-full p-4">
                <div className="flex items-center gap-2 text-grafana-blue">
                  {expandedFolders[folder.id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <Folder className="h-4 w-4" />
                </div>
                <span className="font-medium text-grafana-text">{folder.title}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  ({folderDashboards.length} {folderDashboards.length === 1 ? 'dashboard' : 'dashboards'})
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-0 space-y-4">
                  {folderDashboards.map((dashboard, idx) => (
                    <DashboardCard key={idx} dashboard={dashboard} />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}

        {generalDashboards.length > 0 && (
          <div className="bg-grafana-card rounded-lg border border-grafana-blue/20 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Folder className="h-4 w-4 text-grafana-blue" />
              <span className="font-medium text-grafana-text">General</span>
              <span className="text-sm text-muted-foreground ml-2">
                ({generalDashboards.length} {generalDashboards.length === 1 ? 'dashboard' : 'dashboards'})
              </span>
            </div>
            <div className="space-y-4">
              {generalDashboards.map((dashboard, idx) => (
                <DashboardCard key={idx} dashboard={dashboard} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Extract all unique tags from demo instances
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    demoInstances.forEach(instance => {
      instance.dashboardsList.forEach(dashboard => {
        dashboard.tags.forEach((tag: string) => tagsSet.add(tag));
      });
    });
    return Array.from(tagsSet);
  }, []);

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      }
      return [...prev, tag];
    });
  };

  const handleAddInstance = (instance: GrafanaInstanceFormData) => {
    console.log("Adding new instance:", instance);
    const newInstance: GrafanaInstance = {
      ...instance,
      folders: 0,
      dashboards: 0,
      foldersList: [],
      dashboardsList: []
    };
    
    setInstances(prev => [...prev, newInstance]);
    toast({
      title: "Instance Added",
      description: `Successfully added ${instance.name} to your instances.`
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-grafana-text">Grafana Dashboard Explorer</h1>
        <Button
          variant="outline"
          onClick={() => setIsAdminPanelOpen(true)}
          className="flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Admin Panel
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search dashboards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
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
                className="border border-grafana-card rounded-lg overflow-hidden"
              >
                <CollapsibleTrigger className="w-full">
                  <div className="p-4 hover:bg-grafana-card transition-colors">
                    <div className="flex items-center gap-2">
                      {expandedInstances[instance.name] !== false ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <GrafanaInstanceCard instance={instance} />
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {renderFolderStructure(instance)}
                </CollapsibleContent>
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
