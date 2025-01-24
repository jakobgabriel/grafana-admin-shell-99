import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Link as LinkIcon } from "lucide-react";

interface GrafanaInstance {
  name: string;
  url: string;
  folders: number;
  dashboards: number;
}

interface Props {
  instance: GrafanaInstance;
}

const GrafanaInstanceCard = ({ instance }: Props) => {
  return (
    <Card className="bg-grafana-card text-grafana-text hover:shadow-lg transition-shadow w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{instance.name}</span>
          <a 
            href={instance.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-grafana-blue hover:text-blue-400"
          >
            <LinkIcon size={16} />
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Badge variant="secondary" className="flex items-center gap-2">
            <FolderOpen size={14} />
            {instance.folders} Folders
          </Badge>
          <Badge variant="secondary">
            {instance.dashboards} Dashboards
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrafanaInstanceCard;