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

  // Calculate unique dashboard templates by comparing titles
  const uniqueDashboardTitles = new Set(getAllDashboards.map(d => d.title));
  const reusedDashboards = Array.from(uniqueDashboardTitles).filter(title => 
    getAllDashboards.filter(d => d.title === title).length > 1
  );
  const reusageRate = Math.round((reusedDashboards.length / uniqueDashboardTitles.size) * 100);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="space-y-0 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Dashboard Standardization Score</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-grafana-blue cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[350px] p-4">
                  <p className="font-semibold mb-2">Standardization Score Formula:</p>
                  <ol className="list-decimal pl-4 space-y-2 text-sm">
                    <li>For each dashboard template:
                      <ul className="list-disc pl-4 mt-1">
                        <li>Instance adoption = (Instances using template / Total instances) × 100</li>
                        <li>Template impact = √(Usage instances / Total instances)</li>
                      </ul>
                    </li>
                    <li>Calculate weighted average across all templates</li>
                  </ol>
                  <p className="mt-2 text-xs italic">This score reflects how well dashboard templates are standardized and adopted across your instances.</p>
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <p className="text-sm font-medium mb-1">Score Interpretation:</p>
                    <ul className="list-disc pl-4 text-xs space-y-1">
                      <li><span className="text-green-600 font-medium">≥80%</span>: Excellent standardization</li>
                      <li><span className="text-yellow-600 font-medium">50-79%</span>: Good progress</li>
                      <li><span className="text-red-600 font-medium">&lt;50%</span>: Opportunity for standardization</li>
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription>How well dashboard templates are adopted across instances</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-between cursor-help">
                <div className="flex items-center gap-2">
                  <GitCompare className="h-4 w-4 text-grafana-blue" />
                  <span>Standardization Score</span>
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
                Overall standardization score based on template adoption and usage across instances.
              </p>
            </TooltipContent>
          </Tooltip>
          <div className="flex items-center justify-between">
            <span>Reused Templates</span>
            <span className="font-bold text-green-600">{reusedDashboards.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Template Reuse Rate</span>
            <span className="font-bold text-blue-600">{reusageRate}%</span>
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