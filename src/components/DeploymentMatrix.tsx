import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SearchableTagFilter from './SearchableTagFilter';
import { GrafanaInstance } from "@/types/grafana";

interface Props {
  instances: GrafanaInstance[];
}

const DeploymentMatrix = ({ instances }: Props) => {
  console.log('Rendering DeploymentMatrix with instances:', instances);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Get all unique tags across all instances
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    instances.forEach(instance => {
      (instance.dashboards_list || []).forEach(dashboard => {
        dashboard.tags.forEach(tag => tagsSet.add(tag));
      });
    });
    return Array.from(tagsSet);
  }, [instances]);

  // Count dashboards for each instance and tag
  const countDashboards = (instance: GrafanaInstance, tag: string) => {
    return (instance.dashboards_list || []).filter(dashboard => 
      dashboard.tags.includes(tag)
    ).length;
  };

  // Filter instances based on selected tags
  const filteredInstances = useMemo(() => {
    return instances.filter(instance => {
      if (selectedTags.length === 0) return true;
      return selectedTags.every(tag => 
        (instance.dashboards_list || []).some(dashboard => 
          dashboard.tags.includes(tag)
        )
      );
    });
  }, [instances, selectedTags]);

  // Sort instances based on current sort configuration
  const sortedInstances = useMemo(() => {
    if (!sortConfig) return filteredInstances;

    return [...filteredInstances].sort((a, b) => {
      if (sortConfig.key === 'name') {
        const comparison = a.name.localeCompare(b.name);
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      // For tag-based sorting
      const aCount = countDashboards(a, sortConfig.key);
      const bCount = countDashboards(b, sortConfig.key);
      const comparison = Number(aCount) - Number(bCount);
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredInstances, sortConfig]);

  const handleSort = (key: string) => {
    console.log('Handling sort for key:', key);
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Calculate maximum dashboard count for color intensity
  const maxDashboards = useMemo(() => {
    let max = 0;
    allTags.forEach(tag => {
      instances.forEach(instance => {
        const count = countDashboards(instance, tag);
        max = Math.max(max, count);
      });
    });
    return max;
  }, [instances, allTags]);

  const getCellColor = (count: number) => {
    if (count === 0) return 'bg-white';
    const intensity = Math.min((count / maxDashboards) * 100, 100);
    return `bg-grafana-accent/${Math.round(intensity)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-grafana-text">Deployment Matrix</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter Tags
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <SearchableTagFilter
              tags={allTags}
              selectedTags={selectedTags}
              onTagSelect={handleTagSelect}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="w-[200px] cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Instance Name
                  {sortConfig?.key === 'name' && (
                    sortConfig.direction === 'asc' ? (
                      <ArrowUp className="h-4 w-4 ml-2" />
                    ) : (
                      <ArrowDown className="h-4 w-4 ml-2" />
                    )
                  )}
                </div>
              </TableHead>
              {allTags.map((tag, index) => (
                <TableHead 
                  key={index}
                  className="cursor-pointer"
                  onClick={() => handleSort(tag)}
                >
                  <div className="flex items-center">
                    <span className="inline-block bg-grafana-accent/10 text-grafana-accent px-2 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                    {sortConfig?.key === tag && (
                      sortConfig.direction === 'asc' ? (
                        <ArrowUp className="h-4 w-4 ml-2" />
                      ) : (
                        <ArrowDown className="h-4 w-4 ml-2" />
                      )
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedInstances.map((instance, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{instance.name}</TableCell>
                {allTags.map((tag, tagIdx) => {
                  const count = countDashboards(instance, tag);
                  return (
                    <TableCell 
                      key={tagIdx}
                      className={`${getCellColor(count)} transition-colors duration-200`}
                    >
                      {count}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DeploymentMatrix;