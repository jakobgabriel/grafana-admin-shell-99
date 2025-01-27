import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TagFilter from './TagFilter';
import DemoInstances from './DemoInstances';

interface Props {
  instances: any[];
  demoInstances: any[];
  searchQuery: string;
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
  viewMode: 'list' | 'grid' | 'compact';
}

const InstancesSection = ({
  instances,
  demoInstances,
  searchQuery,
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
  viewMode,
}: Props) => {
  const hasInstances = instances.length > 0;
  const displayInstances = hasInstances ? instances : demoInstances;

  if (!displayInstances.length) {
    return (
      <div className="text-center py-8">
        <p className="text-lg mb-4">No Grafana instances found</p>
        <Button onClick={onOpenAdminPanel} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Grafana Instance
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TagFilter
        allTags={allTags}
        selectedTags={selectedTags}
        onTagSelect={onTagSelect}
      />
      <DemoInstances
        instances={displayInstances}
        searchQuery={searchQuery}
        selectedTags={selectedTags}
        expandedFolders={expandedFolders}
        expandedInstances={expandedInstances}
        onFolderToggle={onFolderToggle}
        onInstanceToggle={onInstanceToggle}
        onRemoveInstance={hasInstances ? onRemoveInstance : undefined}
        onRefreshInstance={hasInstances ? onRefreshInstance : undefined}
        viewMode={viewMode}
      />
    </div>
  );
};

export default InstancesSection;