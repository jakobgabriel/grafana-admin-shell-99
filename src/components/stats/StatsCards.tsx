import React from 'react';
import { Database, ChartBar, Tag, GitCompare, AlertTriangle } from "lucide-react";
import { GrafanaInstance } from "@/types/grafana";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  instances: GrafanaInstance[];
}

const StatsCards = ({ instances }: Props) => {
  console.log('Rendering StatsCards with instances:', instances);
  
  const getAllDashboards = instances.flatMap(instance => instance.dashboards_list || []);
  const allTags = new Set(getAllDashboards.flatMap(dashboard => dashboard.tags || []));
  
  // Calculate dashboard coverage
  const calculateCoverage = () => {
    const dashboardTitles = new Set();
    let totalOccurrences = 0;
    
    instances.forEach(instance => {
      (instance.dashboards_list || []).forEach(dashboard => {
        dashboardTitles.add(dashboard.title);
        totalOccurrences++;
      });
    });
    
    const uniqueDashboards = dashboardTitles.size;
    const maxPossibleOccurrences = uniqueDashboards * instances.length;
    const coverage = (totalOccurrences / maxPossibleOccurrences) * 100;
    
    return {
      coverage: coverage.toFixed(1),
      uniqueDashboards,
      totalOccurrences
    };
  };

  const coverageStats = calculateCoverage();
  
  // Find instances with low dashboard count
  const avgDashboards = getAllDashboards.length / instances.length;
  const lowDashboardInstances = instances.filter(i => i.dashboards < avgDashboards * 0.5).length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Infrastructure Overview</CardTitle>
          <CardDescription>Basic metrics about your setup</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-grafana-blue" />
              <span>Instances</span>
            </div>
            <span className="font-bold">{instances.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChartBar className="h-4 w-4 text-grafana-blue" />
              <span>Dashboards</span>
            </div>
            <span className="font-bold">{getAllDashboards.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-grafana-blue" />
              <span>Unique Tags</span>
            </div>
            <span className="font-bold">{allTags.size}</span>
          </div>
        </CardContent>
      </Card>

      <TooltipProvider>
        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dashboard Coverage</CardTitle>
            <CardDescription>How well dashboards are distributed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-between cursor-help">
                  <div className="flex items-center gap-2">
                    <GitCompare className="h-4 w-4 text-grafana-blue" />
                    <span>Coverage Rate</span>
                  </div>
                  <span className="font-bold">{coverageStats.coverage}%</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Coverage = (Total Dashboard Occurrences / (Unique Dashboards × Instance Count)) × 100
                </p>
              </TooltipContent>
            </Tooltip>
            <div className="flex items-center justify-between">
              <span>Unique Dashboards</span>
              <span className="font-bold">{coverageStats.uniqueDashboards}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Occurrences</span>
              <span className="font-bold">{coverageStats.totalOccurrences}</span>
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>

      <Card>
        <CardHeader className="space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Potential Issues</CardTitle>
          <CardDescription>Areas that might need attention</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span>Low Dashboard Count</span>
            </div>
            <span className="font-bold">{lowDashboardInstances} instances</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Instances with less than 50% of average dashboard count
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;