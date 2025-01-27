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

  // Calculate overall coverage with improved logic focusing on actual usage
  const calculateOverallCoverage = () => {
    // Track combinations and their presence in instances
    const combinationPresence = new Map<string, Set<string>>();
    
    // First, map which instances have which combinations
    instances.forEach(instance => {
      (instance.dashboards_list || []).forEach(dashboard => {
        if (dashboard.tags.length > 0) {
          const sortedTags = [...dashboard.tags].sort();
          const combination = sortedTags.join(', ');
          
          if (!combinationPresence.has(combination)) {
            combinationPresence.set(combination, new Set());
          }
          combinationPresence.get(combination)?.add(instance.name);
        }
      });
    });

    // Calculate coverage based on actual usage patterns
    let totalCoverage = 0;
    let relevantCombinations = 0;

    combinationPresence.forEach((instancesWithCombination, combination) => {
      if (instancesWithCombination.size > 0) {
        // Calculate coverage relative to instances where this combination appears
        // This makes the metric more meaningful as it considers actual usage patterns
        const instancesWithAnyDashboards = instances.filter(instance => 
          (instance.dashboards_list || []).some(d => d.tags.length > 0)
        ).length;
        
        // Calculate coverage relative to instances that have any dashboards
        const coverage = (instancesWithCombination.size / instancesWithAnyDashboards) * 100;
        
        // Weight the coverage by how many instances use this combination
        const weight = instancesWithCombination.size / instances.length;
        totalCoverage += coverage * weight;
        relevantCombinations++;
      }
    });

    // Return weighted average coverage for relevant combinations
    return relevantCombinations > 0 
      ? (totalCoverage).toFixed(1) 
      : "0";
  };

  const filteredTagCombinations = useMemo(() => {
    let filtered = tagCombinations;
    
    // Apply tag filter first - only show combinations that contain ALL selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(combination => {
        const combinationTags = new Set(combination.split(', '));
        return selectedTags.every(tag => combinationTags.has(tag));
      });

      // If no combinations match the selected tags, return empty array
      if (filtered.length === 0) {
        return [];
      }
    }
    
    // Then apply search filter
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