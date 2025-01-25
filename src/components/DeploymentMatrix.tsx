import React, { useState, useMemo } from 'react';
import { GrafanaInstance } from "@/types/grafana";
import MatrixHeader from './matrix/MatrixHeader';
import MatrixTable from './matrix/MatrixTable';
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

  const filteredTagCombinations = useMemo(() => {
    if (!searchQuery) return tagCombinations;
    return tagCombinations.filter(combination =>
      combination.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tagCombinations, searchQuery]);

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