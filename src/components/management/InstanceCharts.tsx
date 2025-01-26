import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GrafanaInstance } from "@/types/grafana";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronUp, Tag } from 'lucide-react';

interface Props {
  instances: GrafanaInstance[];
}

const InstanceCharts = ({ instances }: Props) => {
  const [expandedInstances, setExpandedInstances] = useState<Record<string, boolean>>(
    instances.reduce((acc, instance) => ({ ...acc, [instance.name]: true }), {})
  );

  const prepareTagData = (instance: GrafanaInstance) => {
    const tagCounts: Record<string, number> = {};
    instance.dashboards_list?.forEach(dashboard => {
      dashboard.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  };

  const prepareTagCombinationData = (instance: GrafanaInstance) => {
    const combinationCounts: Record<string, number> = {};
    instance.dashboards_list?.forEach(dashboard => {
      if (dashboard.tags.length > 0) {
        const combination = [...dashboard.tags].sort().join(', ');
        combinationCounts[combination] = (combinationCounts[combination] || 0) + 1;
      }
    });
    return Object.entries(combinationCounts)
      .map(([combination, count]) => ({ combination, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getTopThreeTags = (instance: GrafanaInstance) => {
    const tagData = prepareTagData(instance);
    return tagData.slice(0, 3).map(({ tag, count }) => ({
      tag,
      count,
    }));
  };

  const toggleInstance = (instanceName: string) => {
    setExpandedInstances(prev => ({
      ...prev,
      [instanceName]: !prev[instanceName]
    }));
  };

  return (
    <div className="space-y-6">
      {instances.map(instance => {
        const topTags = getTopThreeTags(instance);
        
        return (
          <Card key={instance.name} className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer hover:bg-accent/5"
              onClick={() => toggleInstance(instance.name)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{instance.name}</CardTitle>
                <button className="p-2 hover:bg-accent/10 rounded-full">
                  {expandedInstances[instance.name] ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-3 mt-4">
                {topTags.map((tagData, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Top Tag {index + 1}
                      </CardTitle>
                      <Tag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{tagData.tag}</div>
                      <p className="text-xs text-muted-foreground">
                        {tagData.count} dashboards
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardHeader>
            
            {expandedInstances[instance.name] && (
              <CardContent className="space-y-6">
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
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default InstanceCharts;