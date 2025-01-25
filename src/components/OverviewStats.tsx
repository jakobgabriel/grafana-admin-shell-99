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
  const getTagStats = (dashboards: DashboardData[] = []) => {
    const tagCount: Record<string, number> = {};
    dashboards.forEach(dashboard => {
      (dashboard.tags || []).forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    return tagCount;
  };

  return (
    <div className="space-y-6">
      {(instances || []).map((instance) => (
        <div key={instance.name} className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Database className="h-5 w-5" />
            <span>{instance.name}</span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-2 p-4 bg-grafana-card rounded-lg">
              <ChartBar className="h-5 w-5 text-grafana-blue" />
              <span>{instance.dashboards || 0} Dashboards</span>
            </div>
            <div className="flex items-center gap-2 p-4 bg-grafana-card rounded-lg">
              <Tag className="h-5 w-5 text-grafana-blue" />
              <span>{Object.keys(getTagStats(instance.dashboardsList)).length} Unique Tags</span>
            </div>
            <div className="flex items-center gap-2 p-4 bg-grafana-card rounded-lg">
              <LinkIcon className="h-5 w-5 text-grafana-blue" />
              <a href={instance.url} target="_blank" rel="noopener noreferrer" className="hover:text-grafana-blue">
                View Instance
              </a>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dashboard</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(instance.dashboardsList || []).map((dashboard, idx) => (
                <TableRow key={idx}>
                  <TableCell>{dashboard.title}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {(dashboard.tags || []).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
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
                      className="text-grafana-blue hover:text-blue-400"
                    >
                      <LinkIcon size={16} />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
};

export default OverviewStats;