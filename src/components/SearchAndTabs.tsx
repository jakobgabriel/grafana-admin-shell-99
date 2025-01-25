import React from 'react';
import SearchBar from './SearchBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  return (
    <>
      <div className="mb-6">
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
      </div>

      <Tabs defaultValue="instances" className="space-y-4">
        <TabsList>
          <TabsTrigger value="instances">Instances</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
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
          />
        </TabsContent>
        
        <TabsContent value="overview">
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