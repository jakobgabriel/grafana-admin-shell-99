import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Link as LinkIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GrafanaInstance {
  name: string;
  url: string;
  folders: number;
  dashboards: number;
}

interface Props {
  instance: GrafanaInstance;
  onRemove?: (name: string) => void;
}

const GrafanaInstanceCard = ({ instance, onRemove }: Props) => {
  return (
    <Card className="bg-grafana-card text-grafana-text hover:shadow-lg transition-shadow w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{instance.name}</span>
          <div className="flex items-center gap-2">
            {onRemove && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(instance.name);
                }}
                className="text-red-500 hover:text-red-700 hover:bg-red-100"
              >
                <Trash2 size={16} />
              </Button>
            )}
            <a 
              href={instance.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-grafana-blue hover:text-blue-400"
            >
              <LinkIcon size={16} />
            </a>
          </div>
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