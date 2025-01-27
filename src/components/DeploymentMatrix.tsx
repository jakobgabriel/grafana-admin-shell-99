import React, { useState, useMemo } from 'react';
import { GrafanaInstance } from "@/types/grafana";
import MatrixHeader from './matrix/MatrixHeader';
import MatrixTable from './matrix/MatrixTable';
import StatsCards from "./stats/StatsCards";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { 
  getAllTags, 
  getTagCombinations, 
  filterInstances, 
  getMaxDashboards,
  countDashboards 
} from '@/utils/matrixUtils';
import { exportMatrixToExcel } from '@/utils/excelExport';

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
    const totalInstances = instances.length;
    if (totalInstances === 0) return "0";

    const activeCombinations = new Set<string>();
    instances.forEach(instance => {
      (instance.dashboards_list || []).forEach(dashboard => {
        if (dashboard.tags.length > 0) {
          const sortedTags = [...dashboard.tags].sort();
          activeCombinations.add(sortedTags.join(', '));
        }
      });
    });

    const combinationStats = new Map<string, {
      instanceCount: number;
      dashboardCount: number;
    }>();

    activeCombinations.forEach(combination => {
      let instanceCount = 0;
      let dashboardCount = 0;

      instances.forEach(instance => {
        const count = countDashboards(instance, combination);
        if (count > 0) {
          instanceCount++;
          dashboardCount += count;
        }
      });

      combinationStats.set(combination, {
        instanceCount,
        dashboardCount
      });
    });

    let totalScore = 0;
    let totalWeight = 0;

    combinationStats.forEach((stats, combination) => {
      const instanceCoverage = (stats.instanceCount / totalInstances) * 100;
      const dashboardWeight = stats.dashboardCount / Math.max(1, stats.instanceCount);
      const weight = Math.sqrt(dashboardWeight);
      totalScore += instanceCoverage * weight;
      totalWeight += weight;
    });

    const finalScore = totalWeight > 0 
      ? (totalScore / totalWeight)
      : 0;

    return Math.min(100, Math.max(0, finalScore)).toFixed(1);
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

  const handleExport = () => {
    exportMatrixToExcel(sortedTagCombinations, filteredInstances);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <StatsCards 
          instances={instances} 
          overallCoverage={calculateOverallCoverage()}
        />
        <Button
          onClick={handleExport}
          className="flex items-center gap-2"
          variant="outline"
        >
          <Download className="h-4 w-4" />
          Export to Excel
        </Button>
      </div>
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
