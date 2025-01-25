import React from 'react';
import DemoInstances from './DemoInstances';
import TagFilter from './TagFilter';
import WelcomeSection from './WelcomeSection';

interface InstancesSectionProps {
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
}: InstancesSectionProps) => {
  // Only show welcome section and demo instances if there are no real instances
  if (instances.length === 0) {
    return (
      <div className="grid gap-6">
        <WelcomeSection onOpenAdminPanel={onOpenAdminPanel} />
        <div className="grid gap-6">
          <h3 className="text-lg font-semibold">Demo View</h3>
          <div className="grid md:grid-cols-[250px,1fr] gap-6">
            <TagFilter
              tags={allTags}
              selectedTags={selectedTags}
              onTagSelect={onTagSelect}
            />
            <DemoInstances
              instances={demoInstances}
              searchQuery={searchQuery}
              selectedTags={selectedTags}
              expandedFolders={expandedFolders}
              expandedInstances={expandedInstances}
              onFolderToggle={onFolderToggle}
              onInstanceToggle={onInstanceToggle}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-[250px,1fr] gap-6">
      <TagFilter
        tags={allTags}
        selectedTags={selectedTags}
        onTagSelect={onTagSelect}
      />
      <DemoInstances
        instances={instances}
        searchQuery={searchQuery}
        selectedTags={selectedTags}
        expandedFolders={expandedFolders}
        expandedInstances={expandedInstances}
        onFolderToggle={onFolderToggle}
        onInstanceToggle={onInstanceToggle}
        onRemoveInstance={onRemoveInstance}
        onRefreshInstance={onRefreshInstance}
      />
    </div>
  );
};

export default InstancesSection;