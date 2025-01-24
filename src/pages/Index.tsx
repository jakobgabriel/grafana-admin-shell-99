import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminPanel from "@/components/AdminPanel";
import GrafanaInstanceCard from "@/components/GrafanaInstanceCard";
import DashboardCard from "@/components/DashboardCard";
import TagFilter from "@/components/TagFilter";

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

const Index = () => {
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [instances, setInstances] = useState<GrafanaInstance[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();

  // Demo data for hierarchy view
  const demoInstance = {
    name: "Demo Instance",
    url: "https://demo.grafana.net",
    folders: 3,
    dashboards: 12,
    foldersList: [],
    dashboardsList: []
  };

  const demoDashboards = [
    {
      title: "System Overview",
      description: "Key system metrics and health indicators",
      url: "https://demo.grafana.net/d/system",
      tags: ["system", "monitoring"]
    },
    {
      title: "Application Performance",
      description: "Application performance metrics and traces",
      url: "https://demo.grafana.net/d/apm",
      tags: ["apm", "performance"]
    }
  ];

  // Handle keyboard shortcut for admin panel
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        setIsAdminPanelOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const fetchGrafanaData = async (instance: GrafanaInstanceFormData) => {
    console.log('Fetching data for instance:', instance.name);
    
    try {
      // Using allorigins.win as CORS proxy with JSON response
      const corsProxy = 'https://api.allorigins.win/get?url=';
      const headers = new Headers({
        'Authorization': `Bearer ${instance.apiKey}`,
        'Content-Type': 'application/json',
      });

      // Fetch folders
      const encodedFoldersUrl = encodeURIComponent(`${instance.url}/api/folders`);
      console.log('Fetching folders from:', `${corsProxy}${encodedFoldersUrl}`);
      
      const foldersResponse = await fetch(`${corsProxy}${encodedFoldersUrl}`);
      if (!foldersResponse.ok) {
        throw new Error(`Failed to fetch folders: ${foldersResponse.statusText}`);
      }
      
      const foldersData = await foldersResponse.json();
      const folders = JSON.parse(foldersData.contents);
      console.log('Fetched folders:', folders);

      // Fetch dashboards
      const encodedDashboardsUrl = encodeURIComponent(`${instance.url}/api/search?type=dash-db`);
      console.log('Fetching dashboards from:', `${corsProxy}${encodedDashboardsUrl}`);
      
      const searchResponse = await fetch(`${corsProxy}${encodedDashboardsUrl}`);
      if (!searchResponse.ok) {
        throw new Error(`Failed to fetch dashboards: ${searchResponse.statusText}`);
      }
      
      const dashboardsData = await searchResponse.json();
      const dashboards = JSON.parse(dashboardsData.contents);
      console.log('Fetched dashboards:', dashboards);

      return {
        ...instance,
        folders: folders.length,
        dashboards: dashboards.length,
        foldersList: folders,
        dashboardsList: dashboards,
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

  const allTags = ["system", "monitoring", "apm", "performance"];

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
              <Button variant="outline">
                Explore Demo
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
                <GrafanaInstanceCard instance={demoInstance} />
                <div className="grid gap-4">
                  {demoDashboards
                    .filter(dashboard =>
                      selectedTags.length === 0 ||
                      dashboard.tags.some(tag => selectedTags.includes(tag))
                    )
                    .map((dashboard, index) => (
                      <DashboardCard key={index} dashboard={dashboard} />
                    ))}
                </div>
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
              <div key={index} className="space-y-4">
                <GrafanaInstanceCard instance={instance} />
                {instance.dashboardsList.length > 0 && (
                  <div className="grid gap-4">
                    {instance.dashboardsList
                      .filter(dashboard =>
                        selectedTags.length === 0 ||
                        (dashboard.tags && dashboard.tags.some(tag => selectedTags.includes(tag)))
                      )
                      .map((dashboard, idx) => (
                        <DashboardCard
                          key={idx}
                          dashboard={{
                            title: dashboard.title,
                            description: dashboard.description || 'No description available',
                            url: `${instance.url}/d/${dashboard.uid}`,
                            tags: dashboard.tags || []
                          }}
                        />
                      ))}
                  </div>
                )}
              </div>
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
