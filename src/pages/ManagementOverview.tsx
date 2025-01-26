import React from 'react';
import { GrafanaInstance } from "@/types/grafana";
import StatisticsCards from '@/components/management/StatisticsCards';
import InstanceCharts from '@/components/management/InstanceCharts';
import { useGrafanaInstances } from "@/hooks/useGrafanaInstances";

const ManagementOverview = () => {
  const { instances, isLoading } = useGrafanaInstances();
  console.log('Rendering ManagementOverview with instances:', instances);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Management Overview</h1>
      <StatisticsCards instances={instances} />
      <InstanceCharts instances={instances} />
    </div>
  );
};

export default ManagementOverview;