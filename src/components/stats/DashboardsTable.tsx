import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DemoInstance } from "@/types/grafana";

interface Props {
  instances: DemoInstance[];
}

const DashboardsTable = ({ instances }: Props) => {
  console.log('Rendering DashboardsTable with instances:', instances);

  const getAllDashboards = () => {
    const allDashboards: Array<{ instance: string, dashboard: any }> = [];
    instances.forEach(instance => {
      (instance.dashboardsList || []).forEach(dashboard => {
        allDashboards.push({
          instance: instance.name,
          dashboard
        });
      });
    });
    return allDashboards;
  };

  const dashboards = getAllDashboards();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Instance</TableHead>
          <TableHead>Dashboard</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead>Link</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dashboards.map(({ instance, dashboard }, idx) => (
          <TableRow key={`${instance}-${idx}`}>
            <TableCell className="font-medium">{instance}</TableCell>
            <TableCell>{dashboard.title}</TableCell>
            <TableCell className="max-w-md truncate">{dashboard.description}</TableCell>
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