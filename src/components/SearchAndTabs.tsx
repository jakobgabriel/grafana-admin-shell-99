import React from 'react';
import SearchBar from './SearchBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Grid, List, Layout } from "lucide-react";
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
  const [viewMode, setViewMode] = React.useState<'list' | 'grid' | 'compact'>('list');

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          />
          <div className="flex items-center gap-2">
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
        </div>
      </div>

      <Tabs defaultValue="instances" className="space-y-4">
        <TabsList>
          <TabsTrigger value="instances">Instances</TabsTrigger>
          <TabsTrigger value="dashboard-list">Dashboard List</TabsTrigger>
          <TabsTrigger value="matrix">Deployment Matrix</TabsTrigger>
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
            onTagSelect={onTagSelect}
            onFolderToggle={onFolderToggle}
            onInstanceToggle={onInstanceToggle}
            onRemoveInstance={onRemoveInstance}
            onRefreshInstance={onRefreshInstance}
            onOpenAdminPanel={onOpenAdminPanel}
            viewMode={viewMode}
          />
        </TabsContent>
        
        <TabsContent value="dashboard-list">
          <OverviewStats 
            instances={instances.length > 0 ? instances : demoInstances} 
          />
        </TabsContent>

        <TabsContent value="matrix">
          <DeploymentMatrix 
            instances={instances.length > 0 ? instances : demoInstances}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default SearchAndTabs;