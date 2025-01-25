import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link as LinkIcon, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GrafanaInstance } from "@/types/grafana";

interface Props {
  instances: GrafanaInstance[];
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
} | null;

const DashboardsTable = ({ instances }: Props) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const getAllDashboards = () => {
    const allDashboards: Array<{ instance: string, dashboard: any }> = [];
    instances.forEach(instance => {
      (instance.dashboards_list || []).forEach(dashboard => {
        allDashboards.push({
          instance: instance.name,
          dashboard
        });
      });
    });
    console.log('Processed dashboards:', allDashboards);
    return allDashboards;
  };

  const sortData = (data: Array<{ instance: string, dashboard: any }>) => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      if (sortConfig.key === 'instance') {
        const aValue = a.instance.toLowerCase();
        const bValue = b.instance.toLowerCase();
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (sortConfig.key === 'dashboard') {
        const aValue = a.dashboard.title.toLowerCase();
        const bValue = b.dashboard.title.toLowerCase();
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (sortConfig.key === 'description') {
        const aValue = (a.dashboard.description || 'No description available').toLowerCase();
        const bValue = (b.dashboard.description || 'No description available').toLowerCase();
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (sortConfig.key === 'tags') {
        const aValue = (a.dashboard.tags || []).join(',').toLowerCase();
        const bValue = (b.dashboard.tags || []).join(',').toLowerCase();
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
  };

  const requestSort = (key: string) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4 text-grafana-accent" />;
  };

  const dashboards = sortData(getAllDashboards());

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => requestSort('instance')}
          >
            Instance {getSortIcon('instance')}
          </TableHead>
          <TableHead 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => requestSort('dashboard')}
          >
            Dashboard {getSortIcon('dashboard')}
          </TableHead>
          <TableHead 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => requestSort('description')}
          >
            Description {getSortIcon('description')}
          </TableHead>
          <TableHead 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => requestSort('tags')}
          >
            Tags {getSortIcon('tags')}
          </TableHead>
          <TableHead>Link</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dashboards.map(({ instance, dashboard }, idx) => (
          <TableRow key={`${instance}-${idx}`}>
            <TableCell className="font-medium">{instance}</TableCell>
            <TableCell>{dashboard.title}</TableCell>
            <TableCell className="max-w-md truncate">
              {dashboard.description || 'No description available'}
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-2">
                {(dashboard.tags || []).map((tag: string) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-xs bg-grafana-accent text-white hover:bg-grafana-accent/90"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <a 
                href={dashboard.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-grafana-blue hover:text-grafana-accent transition-colors p-2 rounded-full hover:bg-grafana-accent/10"
              >
                <LinkIcon size={16} />
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DashboardsTable;