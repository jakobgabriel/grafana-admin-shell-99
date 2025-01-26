import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GrafanaInstance } from "@/types/grafana";
import { Database, LayoutDashboard, Calculator } from "lucide-react";

interface Props {
  instances: GrafanaInstance[];
}

const StatisticsCards = ({ instances }: Props) => {
  const totalInstances = instances.length;
  const totalDashboards = instances.reduce((sum, instance) => sum + instance.dashboards, 0);
  const averageDashboards = totalInstances > 0 
    ? (totalDashboards / totalInstances).toFixed(1) 
    : '0';

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Instances</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalInstances}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Dashboards</CardTitle>
          <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDashboards}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Dashboards per Instance</CardTitle>
          <Calculator className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageDashboards}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCards;