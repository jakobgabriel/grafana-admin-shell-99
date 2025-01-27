import React, { useState, useMemo } from 'react';
import { GrafanaInstance } from "@/types/grafana";
import MatrixHeader from '../matrix/MatrixHeader';
import DashboardMatrixTable from './DashboardMatrixTable';
import StatsCards from "../stats/StatsCards";
import { 
  getAllDashboardNames,
  getMaxDashboardsByName,
  exportDashboardMatrixToExcel
} from '@/utils/dashboardMatrixUtils';

interface Props {
  instances: GrafanaInstance[];
}

const DashboardMatrix = ({ instances }: Props) => {
  console.log('Rendering DashboardMatrix with instances:', instances);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    instances.forEach(instance => {
      (instance.dashboards_list || []).forEach(dashboard => {
        dashboard.tags.forEach(tag => tagsSet.add(tag));
      });
    });
    return Array.from(tagsSet);
  }, [instances]);

  const dashboardNames = useMemo(() => {
    let names = getAllDashboardNames(instances);
    if (searchQuery) {
      names = names.filter(name =>
        name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return names;
  }, [instances, searchQuery]);

  const maxDashboards = useMemo(() => 
    getMaxDashboardsByName(instances, dashboardNames),
    [instances, dashboardNames]
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

  const handleExport = () => {
    exportDashboardMatrixToExcel(dashboardNames, instances);
  };

  return (
    <div className="space-y-6">
      <StatsCards 
        instances={instances} 
        overallCoverage="N/A"
      />
      <MatrixHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        allTags={allTags}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
        onExport={handleExport}
      />
      <DashboardMatrixTable
        dashboardNames={dashboardNames}
        instances={instances}
        maxDashboards={maxDashboards}
        sortConfig={sortConfig}
        onSort={handleSort}
      />
    </div>
  );
};

export default DashboardMatrix;