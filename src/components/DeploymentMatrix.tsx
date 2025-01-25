import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter, SlidersHorizontal, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import SearchableTagFilter from './SearchableTagFilter';
import { GrafanaInstance } from "@/types/grafana";

interface Props {
  instances: GrafanaInstance[];
}

const DeploymentMatrix = ({ instances }: Props) => {
  console.log('Rendering DeploymentMatrix with instances:', instances);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Initialize dashboard range with full range
  const maxDashboards = useMemo(() => {
    return Math.max(...instances.map(instance => instance.dashboards || 0));
  }, [instances]);
  
  const [dashboardRange, setDashboardRange] = useState<[number, number]>([0, maxDashboards]);

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

  const getTagCombinations = () => {
    const combinations = new Set<string>();
    instances.forEach(instance => {
      (instance.dashboards_list || []).forEach(dashboard => {
        if (selectedTags.length === 0 || selectedTags.every(tag => dashboard.tags.includes(tag))) {
          const sortedTags = [...dashboard.tags].sort().join(',');
          if (sortedTags) combinations.add(sortedTags);
        }
      });
    });
    return Array.from(combinations);
  };

  // Count dashboards for each instance and tag combination
  const countDashboards = (instance: GrafanaInstance, tagCombination: string) => {
    const tags = tagCombination.split(',');
    return (instance.dashboards_list || []).filter(dashboard => {
      const dashboardTags = [...dashboard.tags].sort();
      return tags.length === dashboardTags.length && 
             tags.every((tag, index) => tag === dashboardTags[index]);
    }).length;
  };

  // Filter and sort instances
  const filteredInstances = useMemo(() => {
    return instances
      .filter(instance => {
        const dashCount = instance.dashboards || 0;
        return dashCount >= dashboardRange[0] && dashCount <= dashboardRange[1];
      })
      .sort((a, b) => {
        if (!sortColumn) return 0;
        
        const aCount = countDashboards(a, sortColumn);
        const bCount = countDashboards(b, sortColumn);
        
        return sortDirection === 'asc' 
          ? aCount - bCount 
          : bCount - aCount;
      });
  }, [instances, dashboardRange, sortColumn, sortDirection, selectedTags]);

  const maxTagDashboards = useMemo(() => {
    let max = 0;
    const combinations = getTagCombinations();
    combinations.forEach(combination => {
      instances.forEach(instance => {
        const count = countDashboards(instance, combination);
        max = Math.max(max, count);
      });
    });
    return max;
  }, [instances, selectedTags]);

  const getCellColor = (count: number) => {
    if (count === 0) return 'bg-white';
    const intensity = Math.min((count / maxTagDashboards) * 100, 100);
    return `bg-grafana-accent/${Math.round(intensity)}`;
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSliderChange = (values: number[]) => {
    if (values.length === 2) {
      setDashboardRange([values[0], values[1]]);
    }
  };

  const handleSort = (combination: string) => {
    if (sortColumn === combination) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(combination);
      setSortDirection('asc');
    }
  };

  const tagCombinations = getTagCombinations();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-grafana-text">Deployment Matrix</h2>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                Tag Combination
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                      <Filter className="h-4 w-4" />
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
              </TableHead>
              {filteredInstances.map((instance, idx) => (
                <TableHead key={idx} className="min-w-[150px]">
                  <div className="flex items-center justify-between">
                    <span>{instance.name}</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <SlidersHorizontal className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-muted-foreground">Dashboard Count Range</label>
                            <div className="mt-6">
                              <Slider
                                defaultValue={[0, maxDashboards]}
                                value={dashboardRange}
                                onValueChange={handleSliderChange}
                                max={maxDashboards}
                                min={0}
                                step={1}
                                minStepsBetweenThumbs={1}
                                className="mt-2"
                              />
                            </div>
                            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                              <span>{dashboardRange[0]}</span>
                              <span>{dashboardRange[1]}</span>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tagCombinations.map((combination, idx) => (
              <TableRow key={idx}>
                <TableCell 
                  className="font-medium cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort(combination)}
                >
                  <div className="flex items-center">
                    {sortColumn === combination && (
                      sortDirection === 'asc' ? (
                        <ArrowUp className="h-4 w-4 mr-2" />
                      ) : (
                        <ArrowDown className="h-4 w-4 mr-2" />
                      )
                    )}
                    {combination.split(',').map((tag, tagIdx) => (
                      <span 
                        key={tagIdx}
                        className="inline-block bg-grafana-accent/10 text-grafana-accent px-2 py-1 rounded-full text-sm mr-1 mb-1"
                      >
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