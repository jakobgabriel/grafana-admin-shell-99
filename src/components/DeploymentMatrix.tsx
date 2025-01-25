import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GrafanaInstance } from "@/types/grafana";
import SearchableTagFilter from './SearchableTagFilter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Props {
  instances: GrafanaInstance[];
}

const DeploymentMatrix = ({ instances }: Props) => {
  console.log('Rendering DeploymentMatrix with instances:', instances);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minDashboards, setMinDashboards] = useState<string>('');
  const [maxDashboards, setMaxDashboards] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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
        const min = minDashboards ? parseInt(minDashboards) : -Infinity;
        const max = maxDashboards ? parseInt(maxDashboards) : Infinity;
        return totalDashboards >= min && totalDashboards <= max;
      })
      .sort((a, b) => {
        const diff = (a.dashboards || 0) - (b.dashboards || 0);
        return sortOrder === 'asc' ? diff : -diff;
      });
  }, [instances, minDashboards, maxDashboards, sortOrder]);

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
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Filter Tag Combinations</h3>
          <SearchableTagFilter
            tags={allTags}
            selectedTags={selectedTags}
            onTagSelect={handleTagSelect}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Filter Instances</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Min Dashboards</label>
              <Input
                type="number"
                value={minDashboards}
                onChange={(e) => setMinDashboards(e.target.value)}
                placeholder="Min"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Max Dashboards</label>
              <Input
                type="number"
                value={maxDashboards}
                onChange={(e) => setMaxDashboards(e.target.value)}
                placeholder="Max"
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Sort Order</label>
            <Select
              value={sortOrder}
              onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sort by dashboard count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Most Dashboards First</SelectItem>
                <SelectItem value="asc">Least Dashboards First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Tag Combination</TableHead>
              {filteredInstances.map((instance, idx) => (
                <TableHead key={idx}>
                  {instance.name}
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