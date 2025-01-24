import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminPanel from "@/components/AdminPanel";
import TagFilter from "@/components/TagFilter";
import WelcomeSection from "@/components/WelcomeSection";
import DemoInstances from "@/components/DemoInstances";

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

// Demo data
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

const Index = () => {
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [instances, setInstances] = useState<GrafanaInstance[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [expandedInstances, setExpandedInstances] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const savedInstances = localStorage.getItem(STORAGE_KEY);
    if (savedInstances) {
      setInstances(JSON.parse(savedInstances));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(instances));
  }, [instances]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const toggleInstance = (instanceName: string) => {
    setExpandedInstances(prev => ({
      ...prev,
      [instanceName]: !prev[instanceName]
    }));
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
          <WelcomeSection onOpenAdminPanel={() => setIsAdminPanelOpen(true)} />
          <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Demo View</h3>
            <div className="grid md:grid-cols-[250px,1fr] gap-6">
              <TagFilter
                tags={allTags}
                selectedTags={selectedTags}
                onTagSelect={handleTagSelect}
              />
              <DemoInstances
                instances={demoInstances}
                searchQuery={searchQuery}
                selectedTags={selectedTags}
                expandedFolders={expandedFolders}
                expandedInstances={expandedInstances}
                onFolderToggle={toggleFolder}
                onInstanceToggle={toggleInstance}
              />
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
          <DemoInstances
            instances={instances}
            searchQuery={searchQuery}
            selectedTags={selectedTags}
            expandedFolders={expandedFolders}
            expandedInstances={expandedInstances}
            onFolderToggle={toggleFolder}
            onInstanceToggle={toggleInstance}
          />
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
