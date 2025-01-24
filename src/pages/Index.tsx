import React, { useState } from 'react';
import GrafanaInstanceCard from '@/components/GrafanaInstanceCard';
import DashboardCard from '@/components/DashboardCard';
import TagFilter from '@/components/TagFilter';

// Mock data - replace with actual API calls
const mockInstances = [
  {
    name: "Production",
    url: "https://grafana.prod.example.com",
    folders: 12,
    dashboards: 45,
  },
  {
    name: "Staging",
    url: "https://grafana.staging.example.com",
    folders: 8,
    dashboards: 32,
  },
];

const mockDashboards = [
  {
    title: "System Overview",
    description: "Key system metrics and health indicators",
    url: "https://grafana.prod.example.com/d/abc123",
    tags: ["system", "monitoring", "overview"],
  },
  {
    title: "Application Performance",
    description: "Application performance metrics and traces",
    url: "https://grafana.prod.example.com/d/def456",
    tags: ["application", "performance", "apm"],
  },
];

const mockTags = ["system", "monitoring", "overview", "application", "performance", "apm"];

const Index = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredDashboards = selectedTags.length > 0
    ? mockDashboards.filter(dashboard => 
        dashboard.tags.some(tag => selectedTags.includes(tag))
      )
    : mockDashboards;

  return (
    <div className="min-h-screen bg-grafana-background text-grafana-text p-6">
      <h1 className="text-3xl font-bold mb-8">Grafana Overview</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Instances</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockInstances.map((instance, index) => (
            <GrafanaInstanceCard key={index} instance={instance} />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Filter by Tags</h2>
        <TagFilter 
          tags={mockTags}
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Dashboards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDashboards.map((dashboard, index) => (
            <DashboardCard key={index} dashboard={dashboard} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;