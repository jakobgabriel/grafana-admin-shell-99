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
    <Card className="bg-grafana-card text-grafana-text hover:shadow-xl transition-all duration-200 w-full border-grafana-accent/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-grafana-text font-semibold">{instance.name}</span>
          <div className="flex items-center gap-2">
            {onRemove && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(instance.name);
                }}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 size={16} />
              </Button>
            )}
            <a 
              href={instance.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-grafana-blue hover:text-grafana-accent transition-colors p-2 rounded-full hover:bg-grafana-accent/10"
            >
              <LinkIcon size={16} />
            </a>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Badge 
            variant="secondary" 
            className="flex items-center gap-2 bg-grafana-accent/20 text-grafana-text hover:bg-grafana-accent/30"
          >
            <FolderOpen size={14} />
            {instance.folders} Folders
          </Badge>
          <Badge 
            variant="secondary"
            className="bg-grafana-accent/20 text-grafana-text hover:bg-grafana-accent/30"
          >
            {instance.dashboards} Dashboards
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrafanaInstanceCard;