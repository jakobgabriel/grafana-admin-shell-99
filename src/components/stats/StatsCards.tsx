import React from 'react';
import { Database, ChartBar, Tag, GitCompare, AlertTriangle, Info } from "lucide-react";
import { GrafanaInstance } from "@/types/grafana";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface Props {
  instances: GrafanaInstance[];
  overallCoverage: string;
}

const StatsCards = ({ instances, overallCoverage }: Props) => {
  console.log('Rendering StatsCards with instances:', instances);
  
  const getAllDashboards = instances.flatMap(instance => instance.dashboards_list || []);
  const allTags = new Set(getAllDashboards.flatMap(dashboard => dashboard.tags || []));
  
  // Calculate process weights based on tag distribution
  const tagDistribution = new Map<string, number>();
  instances.forEach(instance => {
    const instanceTags = new Set(
      (instance.dashboards_list || []).flatMap(dashboard => dashboard.tags || [])
    );
    instanceTags.forEach(tag => {
      tagDistribution.set(tag, (tagDistribution.get(tag) || 0) + 1);
    });
  });

  // Calculate process weights
  const processWeights = Array.from(tagDistribution.entries()).map(([tag, count]) => ({
    tag,
    weight: count / instances.length,
    instanceCount: count
  }));

  // Sort by weight descending
  processWeights.sort((a, b) => b.weight - a.weight);
  
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
            <CardTitle className="text-sm font-medium">Process Coverage Score</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-grafana-blue cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[350px] p-4">
                  <p className="font-semibold mb-2">Process Coverage Score Explained:</p>
                  <ol className="list-decimal pl-4 space-y-2 text-sm">
                    <li>For each process-specific dashboard:
                      <ul className="list-disc pl-4 mt-1">
                        <li>Coverage = (Instances with dashboard / Instances with process) × 100</li>
                        <li>Process weight = Instances with process / Total instances</li>
                      </ul>
                    </li>
                    <li>Process weights in your environment:</li>
                    <ul className="list-disc pl-4 mt-1 max-h-32 overflow-y-auto">
                      {processWeights.map(({ tag, weight, instanceCount }) => (
                        <li key={tag} className="text-xs">
                          {tag}: {(weight * 100).toFixed(1)}% ({instanceCount} instances)
                        </li>
                      ))}
                    </ul>
                    <li>Final score considers both coverage and process availability</li>
                  </ol>
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <p className="text-sm font-medium mb-1">Score Interpretation:</p>
                    <ul className="list-disc pl-4 text-xs space-y-1">
                      <li><span className="text-green-600 font-medium">≥80%</span>: Excellent coverage of available processes</li>
                      <li><span className="text-yellow-600 font-medium">50-79%</span>: Good implementation progress</li>
                      <li><span className="text-red-600 font-medium">&lt;50%</span>: Room for process monitoring expansion</li>
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription>How well dashboards cover available processes per instance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-between cursor-help">
                <div className="flex items-center gap-2">
                  <GitCompare className="h-4 w-4 text-grafana-blue" />
                  <span>Process Coverage</span>
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
                Overall coverage score based on available processes and their monitoring implementation.
              </p>
            </TooltipContent>
          </Tooltip>
          <div className="flex items-center justify-between">
            <span>Process-Specific Dashboards</span>
            <span className="font-bold text-green-600">{reusedDashboards.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Process Implementation Rate</span>
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
          <CardTitle className="text-sm font-medium">Instances Needing Process Coverage</CardTitle>
          <CardDescription>Instances with monitoring gaps in available processes</CardDescription>
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
              All instances have good process coverage
            </div>
          )}
          <div className="text-xs text-muted-foreground mt-2">
            Shows instances with less than 50% coverage of their available processes
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;