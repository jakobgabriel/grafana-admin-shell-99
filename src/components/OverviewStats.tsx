import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import DashboardsTable from "./stats/DashboardsTable";
import { GrafanaInstance } from "@/types/grafana";
import { exportDashboardListToExcel } from '@/utils/excelExport';

interface Props {
  instances: GrafanaInstance[];
}

const OverviewStats = ({ instances }: Props) => {
  console.log('Rendering OverviewStats with instances:', instances);

  const handleExport = () => {
    exportDashboardListToExcel(instances);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={handleExport}
          className="flex items-center gap-2"
          variant="outline"
        >
          <Download className="h-4 w-4" />
          Export to Excel
        </Button>
      </div>
      <DashboardsTable instances={instances} />
    </div>
  );
};

export default OverviewStats;