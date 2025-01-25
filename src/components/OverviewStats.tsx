import React from 'react';
import StatsCards from "./stats/StatsCards";
import DashboardsTable from "./stats/DashboardsTable";
import { DemoInstance } from "@/types/grafana";

interface Props {
  instances: DemoInstance[];
}

const OverviewStats = ({ instances }: Props) => {
  console.log('Rendering OverviewStats with instances:', instances);

  return (
    <div className="space-y-6">
      <StatsCards instances={instances} />
      <DashboardsTable instances={instances} />
    </div>
  );
};

export default OverviewStats;