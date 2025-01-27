import React from "react";
import { StatisticsCards } from "@/components/management/StatisticsCards";

const Index = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
      <StatisticsCards />
    </div>
  );
};

export default Index;