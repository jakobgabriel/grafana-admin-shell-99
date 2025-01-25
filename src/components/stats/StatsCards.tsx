import React from 'react';
import { Database, ChartBar, Tag } from "lucide-react";
import { DemoInstance } from "@/types/grafana";

interface Props {
  instances: DemoInstance[];
}

const StatsCards = ({ instances }: Props) => {
  console.log('Rendering StatsCards with instances:', instances);
  
  const getAllDashboards = instances.flatMap(instance => instance.dashboardsList || []);
  const allTags = new Set(getAllDashboards.flatMap(dashboard => dashboard.tags || []));

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="flex items-center gap-2 p-4 bg-grafana-card rounded-lg">
        <Database className="h-5 w-5 text-grafana-blue" />
        <span>{instances.length} Instances</span>
      </div>
      <div className="flex items-center gap-2 p-4 bg-grafana-card rounded-lg">
        <ChartBar className="h-5 w-5 text-grafana-blue" />
        <span>{getAllDashboards.length} Dashboards</span>
      </div>
      <div className="flex items-center gap-2 p-4 bg-grafana-card rounded-lg">
        <Tag className="h-5 w-5 text-grafana-blue" />
        <span>{allTags.size} Unique Tags</span>
      </div>
    </div>
  );
};

export default StatsCards;