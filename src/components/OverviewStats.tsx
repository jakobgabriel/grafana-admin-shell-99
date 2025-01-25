import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link as LinkIcon, Database, ChartBar, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DashboardData {
  title: string;
  description: string;
  url: string;
  tags: string[];
  folderId?: string;
}

interface FolderData {
  id: string;
  title: string;
}

interface DemoInstance {
  name: string;
  url: string;
  apiKey: string;
  folders: number;
  dashboards: number;
  foldersList: FolderData[];
  dashboardsList: DashboardData[];
}

interface Props {
  instances: DemoInstance[];
}

const OverviewStats = ({ instances }: Props) => {
  console.log('Rendering OverviewStats with instances:', instances);

  const getAllDashboards = () => {
    const allDashboards: Array<{ instance: string, dashboard: DashboardData }> = [];
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

  const getTagStats = (dashboards: DashboardData[] = []) => {
    const tagCount: Record<string, number> = {};
    dashboards.forEach(dashboard => {
      (dashboard.tags || []).forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    return tagCount;
  };

  const allDashboards = getAllDashboards();
  const totalInstances = instances.length;
  const totalDashboards = allDashboards.length;
  const allTags = new Set(allDashboards.flatMap(({ dashboard }) => dashboard.tags || []));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex items-center gap-2 p-4 bg-grafana-card rounded-lg">
          <Database className="h-5 w-5 text-grafana-blue" />
          <span>{totalInstances} Instances</span>
        </div>
        <div className="flex items-center gap-2 p-4 bg-grafana-card rounded-lg">
          <ChartBar className="h-5 w-5 text-grafana-blue" />
          <span>{totalDashboards} Dashboards</span>
        </div>
        <div className="flex items-center gap-2 p-4 bg-grafana-card rounded-lg">
          <Tag className="h-5 w-5 text-grafana-blue" />
          <span>{allTags.size} Unique Tags</span>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Instance</TableHead>
            <TableHead>Dashboard</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allDashboards.map(({ instance, dashboard }, idx) => (
            <TableRow key={`${instance}-${idx}`}>
              <TableCell className="font-medium">{instance}</TableCell>
              <TableCell>{dashboard.title}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {(dashboard.tags || []).map((tag) => (
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
    </div>
  );
};

export default OverviewStats;