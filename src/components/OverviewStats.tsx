import React from 'react';
import DashboardsTable from "./stats/DashboardsTable";
import { GrafanaInstance } from "@/types/grafana";

interface Props {
  instances: GrafanaInstance[];
}

const OverviewStats = ({ instances }: Props) => {
  console.log('Rendering OverviewStats with instances:', instances);

  return (
    <div className="space-y-6">
      <DashboardsTable instances={instances} />
    </div>
  );
};

export default OverviewStats;