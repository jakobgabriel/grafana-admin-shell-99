import React, { useState } from 'react';
import GrafanaInstanceCard from '@/components/GrafanaInstanceCard';
import DashboardCard from '@/components/DashboardCard';
import SearchableTagFilter from '@/components/SearchableTagFilter';

// Mock data - replace with actual API calls
const mockInstances = [
  {
    name: "Production",
    url: "https://grafana.prod.example.com",
    folders: [
      {
        name: "System Monitoring",
        dashboards: [
          {
            title: "System Overview",
            description: "Key system metrics and health indicators",
            url: "https://grafana.prod.example.com/d/abc123",
            tags: ["system", "monitoring", "overview"],
          },
        ],
      },
      {
        name: "Application Metrics",
        dashboards: [
          {
            title: "Application Performance",
            description: "Application performance metrics and traces",
            url: "https://grafana.prod.example.com/d/def456",
            tags: ["application", "performance", "apm"],
          },
        ],
      },
    ],
    totalFolders: 12,
    totalDashboards: 45,
  },
  {
    name: "Staging",
    url: "https://grafana.staging.example.com",
    folders: [
      {
        name: "Testing",
        dashboards: [
          {
            title: "Test Coverage",
            description: "Test coverage and quality metrics",
            url: "https://grafana.staging.example.com/d/test123",
            tags: ["testing", "quality", "coverage"],
          },
        ],
      },
    ],
    totalFolders: 8,
    totalDashboards: 32,
  },
];

const mockTags = ["system", "monitoring", "overview", "application", "performance", "apm", "testing", "quality", "coverage"];

const Index = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandedInstances, setExpandedInstances] = useState<string[]>([]);

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleInstance = (instanceName: string) => {
    setExpandedInstances(prev =>
      prev.includes(instanceName)
        ? prev.filter(name => name !== instanceName)
        : [...prev, instanceName]
    );
  };

  const isInstanceExpanded = (instanceName: string) => expandedInstances.includes(instanceName);

  const shouldShowDashboard = (dashboard: { tags: string[] }) => {
    if (selectedTags.length === 0) return true;
    return dashboard.tags.some(tag => selectedTags.includes(tag));
  };

  return (
    <div className="min-h-screen bg-grafana-background text-grafana-text p-6">
      <h1 className="text-3xl font-bold mb-8">Grafana Overview</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Filter by Tags</h2>
            <SearchableTagFilter 
              tags={mockTags}
              selectedTags={selectedTags}
              onTagSelect={handleTagSelect}
            />
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {mockInstances.map((instance) => (
            <div key={instance.name} className="space-y-4">
              <div 
                className="cursor-pointer"
                onClick={() => toggleInstance(instance.name)}
              >
                <GrafanaInstanceCard 
                  instance={{
                    name: instance.name,
                    url: instance.url,
                    folders: instance.totalFolders,
                    dashboards: instance.totalDashboards,
                  }} 
                />
              </div>

              {isInstanceExpanded(instance.name) && (
                <div className="ml-6 space-y-6">
                  {instance.folders.map((folder) => (
                    <div key={folder.name} className="space-y-4">
                      <h3 className="text-lg font-semibold">{folder.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {folder.dashboards
                          .filter(shouldShowDashboard)
                          .map((dashboard, idx) => (
                            <DashboardCard key={idx} dashboard={dashboard} />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;