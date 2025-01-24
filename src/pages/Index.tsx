import React, { useState, useEffect, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";
import AdminPanel from "@/components/AdminPanel";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import InstancesSection from "@/components/InstancesSection";
import OverviewStats from "@/components/OverviewStats";
import { fetchGrafanaData } from "@/utils/grafanaApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      const parsedInstances = JSON.parse(savedInstances);
      setInstances(parsedInstances);
      parsedInstances.forEach(async (instance: GrafanaInstance) => {
        const data = await fetchGrafanaData(instance);
        if (data) {
          setInstances(prev => 
            prev.map(i => i.name === instance.name ? data : i)
          );
        }
      });
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

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    const allInstances = [...instances, ...demoInstances];
    allInstances.forEach(instance => {
      instance.dashboardsList.forEach(dashboard => {
        dashboard.tags.forEach((tag: string) => tagsSet.add(tag));
      });
    });
    return Array.from(tagsSet);
  }, [instances]);

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      }
      return [...prev, tag];
    });
  };

  const handleAddInstance = async (instance: GrafanaInstanceFormData) => {
    console.log("Adding new instance:", instance);
    
    const data = await fetchGrafanaData(instance);
    
    if (data) {
      setInstances(prev => [...prev, data]);
      toast({
        title: "Instance Added",
        description: `Successfully added ${instance.name} to your instances.`
      });
    }
    
    setIsAdminPanelOpen(false);
  };

  const handleRemoveInstance = (name: string) => {
    setInstances(prev => prev.filter(instance => instance.name !== name));
    toast({
      title: "Instance Removed",
      description: `Successfully removed ${name} from your instances.`
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Header onOpenAdminPanel={() => setIsAdminPanelOpen(true)} />
      
      <div className="mb-6">
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <Tabs defaultValue="instances" className="space-y-4">
        <TabsList>
          <TabsTrigger value="instances">Instances</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="instances">
          <InstancesSection
            instances={instances}
            demoInstances={demoInstances}
            searchQuery={searchQuery}
            selectedTags={selectedTags}
            expandedFolders={expandedFolders}
            expandedInstances={expandedInstances}
            allTags={allTags}
            onTagSelect={handleTagSelect}
            onFolderToggle={toggleFolder}
            onInstanceToggle={toggleInstance}
            onRemoveInstance={handleRemoveInstance}
            onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
          />
        </TabsContent>
        
        <TabsContent value="overview">
          <OverviewStats 
            instances={instances.length > 0 ? instances : demoInstances} 
          />
        </TabsContent>
      </Tabs>

      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        onAddInstance={handleAddInstance}
      />
    </div>
  );
};

export default Index;