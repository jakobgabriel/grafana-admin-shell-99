import React, { useState, useMemo } from 'react';
import { GrafanaInstance } from "@/types/grafana";
import MatrixHeader from './matrix/MatrixHeader';
import MatrixTable from './matrix/MatrixTable';
import StatsCards from "./stats/StatsCards";
import { 
  getAllTags, 
  getTagCombinations, 
  filterInstances, 
  getMaxDashboards,
  countDashboards 
} from '@/utils/matrixUtils';

interface Props {
  instances: GrafanaInstance[];
}

const DeploymentMatrix = ({ instances }: Props) => {
  console.log('Rendering DeploymentMatrix with instances:', instances);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const allTags = useMemo(() => getAllTags(instances), [instances]);
  const tagCombinations = useMemo(() => getTagCombinations(instances), [instances]);

  const calculateOverallCoverage = (): string => {
    // Calculate average number of dashboards across instances
    const totalDashboards = instances.reduce((sum, instance) => 
      sum + (instance.dashboards_list?.length || 0), 0
    );
    const avgDashboards = totalDashboards / instances.length;
    
    // Track combinations and their presence in instances
    const combinationPresence = new Map<string, {
      instances: Set<string>,
      totalDashboards: number
    }>();
    
    // Map which instances have which combinations and count dashboards
    instances.forEach(instance => {
      const instanceDashboards = instance.dashboards_list || [];
      instanceDashboards.forEach(dashboard => {
        if (dashboard.tags.length > 0) {
          const sortedTags = [...dashboard.tags].sort();
          const combination = sortedTags.join(', ');
          
          if (!combinationPresence.has(combination)) {
            combinationPresence.set(combination, {
              instances: new Set(),
              totalDashboards: 0
            });
          }
          const data = combinationPresence.get(combination)!;
          data.instances.add(instance.name);
          data.totalDashboards++;
        }
      });
    });

    // Calculate coverage based on both instance presence and dashboard distribution
    let totalCoverage = 0;
    let relevantCombinations = 0;

    combinationPresence.forEach((data, combination) => {
      if (data.instances.size > 0) {
        // Calculate instance coverage
        const instanceCoverage = (data.instances.size / instances.length) * 100;
        
        // Calculate dashboard distribution factor
        // How close is this combination's average to the overall average?
        const combinationAvg = data.totalDashboards / data.instances.size;
        const distributionFactor = Math.min(combinationAvg / avgDashboards, 1);
        
        // Weight more heavily used combinations
        const usageWeight = data.instances.size / instances.length;
        
        // Combine factors for final coverage
        const combinedCoverage = instanceCoverage * distributionFactor * usageWeight;
        
        totalCoverage += combinedCoverage;
        relevantCombinations++;
      }
    });

    // Return weighted average coverage for relevant combinations
    // Scale up slightly to reflect real-world usage patterns
    const scalingFactor = 1.2; // Adjust this to fine-tune the final number
    return relevantCombinations > 0 
      ? Math.min(totalCoverage * scalingFactor, 100).toFixed(1)
      : "0";
  };

  const filteredTagCombinations = useMemo(() => {
    let filtered = tagCombinations;
    
    if (selectedTags.length > 0) {
      filtered = filtered.filter(combination => {
        const combinationTags = new Set(combination.split(', '));
        return selectedTags.every(tag => combinationTags.has(tag));
      });

      if (filtered.length === 0) {
        return [];
      }
    }
    
    if (searchQuery) {
      filtered = filtered.filter(combination =>
        combination.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [tagCombinations, searchQuery, selectedTags]);

  const filteredInstances = useMemo(() => 
    filterInstances(instances, selectedTags), 
    [instances, selectedTags]
  );

  const maxDashboards = useMemo(() => 
    getMaxDashboards(instances, tagCombinations), 
    [instances, tagCombinations]
  );

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

  const sortedTagCombinations = useMemo(() => {
    if (!sortConfig) return filteredTagCombinations;

    return [...filteredTagCombinations].sort((a, b) => {
      if (sortConfig.key === 'tag') {
        const comparison = a.localeCompare(b);
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      const instance = filteredInstances.find(i => i.name === sortConfig.key) || filteredInstances[0];
      const aCount = Number(countDashboards(instance, a));
      const bCount = Number(countDashboards(instance, b));
      const comparison = aCount - bCount;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredTagCombinations, filteredInstances, sortConfig]);

  return (
    <div className="space-y-6">
      <StatsCards 
        instances={instances} 
        overallCoverage={calculateOverallCoverage()}
      />
      <MatrixHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        allTags={allTags}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
      />
      <MatrixTable
        tagCombinations={sortedTagCombinations}
        instances={filteredInstances}
        maxDashboards={maxDashboards}
        sortConfig={sortConfig}
        onSort={handleSort}
      />
    </div>
  );
};

export default DeploymentMatrix;