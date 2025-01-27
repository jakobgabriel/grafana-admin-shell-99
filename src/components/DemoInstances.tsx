import React from 'react';
import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import GrafanaInstanceCard from "@/components/GrafanaInstanceCard";
import DashboardCard from "@/components/DashboardCard";
import { GrafanaInstance, DashboardData, FolderData } from "@/types/grafana";

interface Props {
  instances: GrafanaInstance[];
  searchQuery: string;
  selectedTags: string[];
  expandedFolders: Record<string, boolean>;
  expandedInstances: Record<string, boolean>;
  onFolderToggle: (folderId: string) => void;
  onInstanceToggle: (instanceName: string) => void;
  onRemoveInstance?: (name: string) => void;
  onRefreshInstance?: (instance: GrafanaInstance) => void;
  viewMode: 'list' | 'grid' | 'compact';
}

const DemoInstances = ({
  instances,
  searchQuery,
  selectedTags,
  expandedFolders,
  expandedInstances,
  onFolderToggle,
  onInstanceToggle,
  onRemoveInstance,
  onRefreshInstance,
  viewMode,
}: Props) => {
  const filterDashboards = (dashboards: DashboardData[], folderTitle?: string) => {
    if (!dashboards) return [];
    
    return dashboards.filter(dashboard => {
      const searchTerms = searchQuery.toLowerCase().split(' ');
      
      // Changed to use some() instead of every() to match any term instead of all terms
      const matchesSearch = searchQuery === '' || searchTerms.some(term => 
        dashboard.title.toLowerCase().includes(term) ||
        dashboard.description.toLowerCase().includes(term) ||
        dashboard.tags.some(tag => tag.toLowerCase().includes(term)) ||
        (folderTitle && folderTitle.toLowerCase().includes(term))
      );
      
      const matchesTags = selectedTags.length === 0 ||
        dashboard.tags.some(tag => selectedTags.includes(tag));
      
      return matchesSearch && matchesTags;
    });
  };

  const renderFolderStructure = (instance: GrafanaInstance) => {
    const foldersList = instance.folders_list || [];
    const dashboardsList = instance.dashboards_list || [];

    const generalDashboards = filterDashboards(
      dashboardsList.filter(dashboard => !dashboard.folderId || dashboard.folderId === "0")
    );

    return (
      <div className="space-y-2">
        {foldersList.map((folder) => {
          const folderDashboards = filterDashboards(
            dashboardsList.filter(dashboard => dashboard.folderId === folder.id),
            folder.title
          );

          if (folderDashboards.length === 0 && searchQuery !== '') return null;

          return (
            <Collapsible
              key={folder.id}
              open={expandedFolders[folder.id] || searchQuery !== ''}
              onOpenChange={() => onFolderToggle(folder.id)}
              className="overflow-hidden"
            >
              <CollapsibleTrigger className="flex items-center w-full p-3 hover:bg-grafana-background/80 transition-colors">
                <div className="flex items-center gap-2 text-grafana-blue">
                  {expandedFolders[folder.id] || searchQuery !== '' ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <Folder className="h-4 w-4" />
                </div>
                <span className="font-medium text-grafana-text ml-2">{folder.title}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  ({folderDashboards.length} {folderDashboards.length === 1 ? 'dashboard' : 'dashboards'})
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-3 space-y-2 bg-grafana-background/30">
                  {folderDashboards.map((dashboard, idx) => (
                    <DashboardCard key={idx} dashboard={dashboard} />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}

        {generalDashboards.length > 0 && (
          <div className="overflow-hidden">
            <div className="flex items-center p-3">
              <div className="flex items-center gap-2 text-grafana-blue">
                <Folder className="h-4 w-4" />
              </div>
              <span className="font-medium text-grafana-text ml-2">General</span>
              <span className="text-sm text-muted-foreground ml-2">
                ({generalDashboards.length} {generalDashboards.length === 1 ? 'dashboard' : 'dashboards'})
              </span>
            </div>
            <div className="p-3 space-y-2 bg-grafana-background/30">
              {generalDashboards.map((dashboard, idx) => (
                <DashboardCard key={idx} dashboard={dashboard} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${
      viewMode === 'grid' ? 'grid grid-cols-2 gap-6 space-y-0' :
      viewMode === 'compact' ? 'space-y-2' : 'space-y-6'
    }`}>
      {instances.map((instance, index) => (
        <Collapsible
          key={index}
          open={expandedInstances[instance.name] !== false || searchQuery !== ''}
          onOpenChange={() => onInstanceToggle(instance.name)}
        >
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center gap-2">
              {expandedInstances[instance.name] !== false || searchQuery !== '' ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <GrafanaInstanceCard 
                instance={instance} 
                onRemove={onRemoveInstance}
                onRefresh={onRefreshInstance}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {renderFolderStructure(instance)}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

export default DemoInstances;