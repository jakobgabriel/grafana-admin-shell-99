import React from 'react';
import SearchBar from './SearchBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Grid, List, Layout, LayoutDashboard, Database } from "lucide-react";
import InstancesSection from './InstancesSection';
import OverviewStats from './OverviewStats';
import DeploymentMatrix from './DeploymentMatrix';

interface SearchAndTabsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  instances: any[];
  demoInstances: any[];
  selectedTags: string[];
  expandedFolders: Record<string, boolean>;
  expandedInstances: Record<string, boolean>;
  allTags: string[];
  onTagSelect: (tag: string) => void;
  onFolderToggle: (folderId: string) => void;
  onInstanceToggle: (instanceName: string) => void;
  onRemoveInstance: (name: string) => void;
  onRefreshInstance: (instance: any) => void;
  onOpenAdminPanel: () => void;
}

const SearchAndTabs = ({
  searchQuery,
  onSearchChange,
  instances,
  demoInstances,
  selectedTags,
  expandedFolders,
  expandedInstances,
  allTags,
  onTagSelect,
  onFolderToggle,
  onInstanceToggle,
  onRemoveInstance,
  onRefreshInstance,
  onOpenAdminPanel,
}: SearchAndTabsProps) => {
  const [activeView, setActiveView] = React.useState('instances');
  const [viewMode, setViewMode] = React.useState<'list' | 'grid' | 'compact'>('list');

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          />
          <div className="flex items-center gap-4">
            <Button
              variant={activeView === 'instances' ? 'default' : 'outline'}
              onClick={() => setActiveView('instances')}
              className="flex items-center gap-2"
            >
              <Grid className="w-4 h-4" />
              Instances
            </Button>
            <Button
              variant={activeView === 'dashboard-list' ? 'default' : 'outline'}
              onClick={() => setActiveView('dashboard-list')}
              className="flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard List
            </Button>
            <Button
              variant={activeView === 'matrix' ? 'default' : 'outline'}
              onClick={() => setActiveView('matrix')}
              className="flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              Deployment Matrix
            </Button>
          </div>
        </div>

        {activeView === 'instances' && (
          <div className="flex justify-end gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="text-grafana-blue hover:text-grafana-accent hover:bg-grafana-accent/10"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="text-grafana-blue hover:text-grafana-accent hover:bg-grafana-accent/10"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'compact' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('compact')}
              className="text-grafana-blue hover:text-grafana-accent hover:bg-grafana-accent/10"
            >
              <Layout className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {activeView === 'instances' && (
        <InstancesSection
          instances={instances}
          demoInstances={demoInstances}
          searchQuery={searchQuery}
          selectedTags={selectedTags}
          expandedFolders={expandedFolders}
          expandedInstances={expandedInstances}
          allTags={allTags}
          onTagSelect={onTagSelect}
          onFolderToggle={onFolderToggle}
          onInstanceToggle={onInstanceToggle}
          onRemoveInstance={onRemoveInstance}
          onRefreshInstance={onRefreshInstance}
          onOpenAdminPanel={onOpenAdminPanel}
          viewMode={viewMode}
        />
      )}
      
      {activeView === 'dashboard-list' && (
        <OverviewStats 
          instances={instances.length > 0 ? instances : demoInstances} 
        />
      )}

      {activeView === 'matrix' && (
        <DeploymentMatrix 
          instances={instances.length > 0 ? instances : demoInstances}
        />
      )}
    </>
  );
};

export default SearchAndTabs;