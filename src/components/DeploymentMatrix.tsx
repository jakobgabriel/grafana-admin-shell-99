import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GrafanaInstance } from "@/types/grafana";
import SearchableTagFilter from './SearchableTagFilter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Filter, SlidersHorizontal, List, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  instances: GrafanaInstance[];
}

const DeploymentMatrix = ({ instances }: Props) => {
  console.log('Rendering DeploymentMatrix with instances:', instances);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dashboardRange, setDashboardRange] = useState<number[]>([0, 1000]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const maxDashboards = useMemo(() => {
    return Math.max(...instances.map(instance => instance.dashboards || 0));
  }, [instances]);

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

  // Get all unique tag combinations
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

  // Filter and sort instances based on dashboard count
  const filteredInstances = useMemo(() => {
    return instances
      .filter(instance => {
        const totalDashboards = instance.dashboards || 0;
        return totalDashboards >= dashboardRange[0] && totalDashboards <= dashboardRange[1];
      })
      .sort((a, b) => {
        const diff = (a.dashboards || 0) - (b.dashboards || 0);
        return sortOrder === 'asc' ? diff : -diff;
      });
  }, [instances, dashboardRange, sortOrder]);

  const tagCombinations = getTagCombinations();

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

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
                      <List className="h-4 w-4" />
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
                    <div className="flex items-center gap-1">
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
                              <Slider
                                value={dashboardRange}
                                onValueChange={setDashboardRange}
                                max={maxDashboards}
                                step={1}
                                className="mt-2"
                              />
                              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                                <span>{dashboardRange[0]}</span>
                                <span>{dashboardRange[1]}</span>
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                      >
                        {sortOrder === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {instance.dashboards || 0} dashboards
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tagCombinations.map((combination, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">
                  {combination.split(',').map((tag, tagIdx) => (
                    <span 
                      key={tagIdx}
                      className="inline-block bg-grafana-accent/10 text-grafana-accent px-2 py-1 rounded-full text-sm mr-1 mb-1"
                    >
                      {tag}
                    </span>
                  ))}
                </TableCell>
                {filteredInstances.map((instance, instanceIdx) => (
                  <TableCell key={instanceIdx}>
                    {countDashboards(instance, combination)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DeploymentMatrix;