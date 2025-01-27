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
  
  const avgDashboards = getAllDashboards.length / instances.length;
  const lowDashboardInstances = instances
    .map(instance => ({
      name: instance.name,
      dashboards: instance.dashboards,
      percentage: (instance.dashboards / avgDashboards) * 100
    }))
    .filter(i => i.percentage < 50)
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                  </ol>
                  <p className="mt-2 text-xs italic">This formula balances both breadth (across instances) and depth (number of dashboards) of implementation.</p>
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <p className="text-sm font-medium mb-1">Interpretation Guide:</p>
                    <ul className="list-disc pl-4 text-xs space-y-1">
                      <li><span className="text-green-600 font-medium">≥80%</span>: Excellent coverage across instances</li>
                      <li><span className="text-yellow-600 font-medium">50-79%</span>: Room for improvement</li>
                      <li><span className="text-red-600 font-medium">&lt;50%</span>: Needs attention - consider standardizing dashboards</li>
                    </ul>
                  </div>
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

      <Card>
        <CardHeader className="space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Instances Needing Attention</CardTitle>
          <CardDescription>Instances with low dashboard coverage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {lowDashboardInstances.length > 0 ? (
            lowDashboardInstances.map((instance, index) => (
              <div key={instance.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="truncate max-w-[150px]" title={instance.name}>
                    {instance.name}
                  </span>
                </div>
                <span className="font-bold text-yellow-600">
                  {Math.round(instance.percentage)}%
                </span>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">
              No instances currently need attention
            </div>
          )}
          <div className="text-xs text-muted-foreground mt-2">
            Shows instances with less than 50% of average dashboard count
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;