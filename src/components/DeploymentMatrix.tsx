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

  // Get all unique tag combinations across all instances
  const tagCombinations = useMemo(() => {
    const combinationsSet = new Set<string>();
    instances.forEach(instance => {
      (instance.dashboards_list || []).forEach(dashboard => {
        if (dashboard.tags.length > 0) {
          const sortedTags = [...dashboard.tags].sort();
          combinationsSet.add(sortedTags.join(', '));
        }
      });
    });
    return Array.from(combinationsSet);
  }, [instances]);

  // Count dashboards for each instance and tag combination
  const countDashboards = (instance: GrafanaInstance, tagCombination: string) => {
    const tagSet = new Set(tagCombination.split(', '));
    return (instance.dashboards_list || []).filter(dashboard => {
      const dashboardTagSet = new Set(dashboard.tags);
      return tagSet.size === dashboardTagSet.size && 
             Array.from(tagSet).every(tag => dashboardTagSet.has(tag));
    }).length;
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

  // Sort tag combinations based on current sort configuration
  const sortedTagCombinations = useMemo(() => {
    if (!sortConfig) return tagCombinations;

    return [...tagCombinations].sort((a, b) => {
      if (sortConfig.key === 'tag') {
        const comparison = a.localeCompare(b);
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      const aCount = Number(countDashboards(
        filteredInstances.find(i => i.name === sortConfig.key) || filteredInstances[0],
        a
      ));
      const bCount = Number(countDashboards(
        filteredInstances.find(i => i.name === sortConfig.key) || filteredInstances[0],
        b
      ));
      const comparison = aCount - bCount;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [tagCombinations, filteredInstances, sortConfig]);

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
    tagCombinations.forEach(combination => {
      instances.forEach(instance => {
        const count = countDashboards(instance, combination);
        max = Math.max(max, count);
      });
    });
    return max;
  }, [instances, tagCombinations]);

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

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead 
                className="w-[300px] cursor-pointer sticky left-0 bg-white z-20"
                onClick={() => handleSort('tag')}
              >
                <div className="flex items-center">
                  Tag Combinations
                  {sortConfig?.key === 'tag' && (
                    sortConfig.direction === 'asc' ? (
                      <ArrowUp className="h-4 w-4 ml-2" />
                    ) : (
                      <ArrowDown className="h-4 w-4 ml-2" />
                    )
                  )}
                </div>
              </TableHead>
              {filteredInstances.map((instance, index) => (
                <TableHead 
                  key={index}
                  className="cursor-pointer min-w-[150px]"
                  onClick={() => handleSort(instance.name)}
                >
                  <div className="flex items-center">
                    {instance.name}
                    {sortConfig?.key === instance.name && (
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
            {sortedTagCombinations.map((combination, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium sticky left-0 bg-white z-10">
                  <div className="flex flex-wrap gap-1">
                    {combination.split(', ').map((tag, tagIdx) => (
                      <span key={tagIdx} className="inline-block bg-grafana-accent/10 text-grafana-accent px-2 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </TableCell>
                {filteredInstances.map((instance, instanceIdx) => {
                  const count = countDashboards(instance, combination);
                  return (
                    <TableCell 
                      key={instanceIdx}
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