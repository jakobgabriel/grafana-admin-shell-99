import React from 'react';
import { GrafanaInstance } from "@/types/grafana";
import StatisticsCards from '@/components/management/StatisticsCards';
import InstanceCharts from '@/components/management/InstanceCharts';
import { useGrafanaInstances } from "@/hooks/useGrafanaInstances";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Statistics = () => {
  const { instances, isLoading } = useGrafanaInstances();
  const navigate = useNavigate();
  
  console.log('Rendering Statistics with instances:', instances);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Statistics</h1>
      </div>
      <StatisticsCards instances={instances} />
      <InstanceCharts instances={instances} />
    </div>
  );
};

export default Statistics;