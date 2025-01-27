import React from 'react';
import { Database, ChartBar, Tag, GitCompare, AlertTriangle, Info } from "lucide-react";
import { GrafanaInstance } from "@/types/grafana";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  instances: GrafanaInstance[];
  overallCoverage: string;
}

const StatsCards = ({ instances, overallCoverage }: Props) => {
  console.log('Rendering StatsCards with instances:', instances);
  
  const getAllDashboards = instances.flatMap(instance => instance.dashboards_list || []);
  const allTags = new Set(getAllDashboards.flatMap(dashboard => dashboard.tags || []));
  
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
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Dashboard Coverage</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-grafana-blue cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[350px] p-4">
                    <p className="font-semibold mb-2">Coverage Rate Formula:</p>
                    <ol className="list-decimal pl-4 space-y-2 text-sm">
                      <li>For each tag combination, calculate:
                        <ul className="list-disc pl-4 mt-1">
                          <li>Instance coverage = (Instances with dashboards / Total instances) × 100</li>
                          <li>Dashboard weight = √(Number of dashboards / Instances using combination)</li>
                        </ul>
                      </li>
                      <li>Calculate weighted average across all combinations</li>
                      <li>Apply 15% positive adjustment to reflect implementation value</li>
                    </ol>
                    <p className="mt-2 text-xs italic">This formula emphasizes both breadth (across instances) and depth (number of dashboards) of implementation.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription>Average coverage across all tag combinations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-between cursor-help">
                  <div className="flex items-center gap-2">
                    <GitCompare className="h-4 w-4 text-grafana-blue" />
                    <span>Coverage Rate</span>
                  </div>
                  <span className={`font-bold ${
                    Number(overallCoverage) >= 80 ? 'text-green-600' :
                    Number(overallCoverage) >= 50 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>{overallCoverage}%</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Average coverage across all tag combinations, weighted by dashboard count and instance usage.
                </p>
              </TooltipContent>
            </Tooltip>
            <div className="flex items-center justify-between">
              <span>Total Tag Combinations</span>
              <span className="font-bold">{getAllDashboards.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Instances Analyzed</span>
              <span className="font-bold">{instances.length}</span>
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