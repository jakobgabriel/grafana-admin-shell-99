import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GrafanaInstance } from "@/types/grafana";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getAllTags, getTagCombinations } from '@/utils/matrixUtils';

interface Props {
  instances: GrafanaInstance[];
}

const InstanceCharts = ({ instances }: Props) => {
  const prepareTagData = (instance: GrafanaInstance) => {
    const tagCounts: Record<string, number> = {};
    instance.dashboards_list?.forEach(dashboard => {
      dashboard.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts).map(([tag, count]) => ({
      tag,
      count
    }));
  };

  const prepareTagCombinationData = (instance: GrafanaInstance) => {
    const combinationCounts: Record<string, number> = {};
    instance.dashboards_list?.forEach(dashboard => {
      if (dashboard.tags.length > 0) {
        const combination = [...dashboard.tags].sort().join(', ');
        combinationCounts[combination] = (combinationCounts[combination] || 0) + 1;
      }
    });
    return Object.entries(combinationCounts).map(([combination, count]) => ({
      combination,
      count
    }));
  };

  return (
    <div className="space-y-6">
      {instances.map(instance => (
        <div key={instance.name} className="space-y-6">
          <h2 className="text-xl font-semibold">{instance.name}</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Dashboards per Tag</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepareTagData(instance)}>
                  <XAxis dataKey="tag" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Dashboards" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dashboards per Tag Combination</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepareTagCombinationData(instance)}>
                  <XAxis dataKey="combination" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" name="Dashboards" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default InstanceCharts;