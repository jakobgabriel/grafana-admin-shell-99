import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2 } from "lucide-react";
import { logUserInteraction, refreshGrafanaInstance } from "@/utils/grafanaApi";

interface Instance {
  name: string;
  url: string;
  apiKey: string;
  folders: number;
  dashboards: number;
}

interface Props {
  instance: Instance;
  onRemove?: (name: string) => void;
  onRefresh?: (instance: Instance) => void;
}

const GrafanaInstanceCard = ({ instance, onRemove, onRefresh }: Props) => {
  const handleRemove = async () => {
    if (onRemove) {
      await logUserInteraction('remove_instance', 'GrafanaInstanceCard', { instance_name: instance.name });
      onRemove(instance.name);
    }
  };

  const handleRefresh = async () => {
    await logUserInteraction('refresh_instance', 'GrafanaInstanceCard', { instance_name: instance.name });
    const refreshedData = await refreshGrafanaInstance(instance);
    if (refreshedData && onRefresh) {
      onRefresh(refreshedData);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <h3 className="font-semibold">{instance.name}</h3>
          <p className="text-sm text-muted-foreground">
            {instance.folders} folders, {instance.dashboards} dashboards
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="text-grafana-blue hover:text-grafana-accent hover:bg-grafana-accent/10"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GrafanaInstanceCard;