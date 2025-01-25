import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GrafanaInstance } from "@/types/grafana";

interface Props {
  instances: GrafanaInstance[];
}

const DeploymentMatrix = ({ instances }: Props) => {
  console.log('Rendering DeploymentMatrix with instances:', instances);

  // Get all unique tag combinations
  const getTagCombinations = () => {
    const combinations = new Set<string>();
    instances.forEach(instance => {
      (instance.dashboards_list || []).forEach(dashboard => {
        const sortedTags = [...dashboard.tags].sort().join(',');
        if (sortedTags) combinations.add(sortedTags);
      });
    });
    return Array.from(combinations);
  };

  // Count dashboards for each instance and tag combination
  const countDashboards = (instance: GrafanaInstance, tagCombination: string) => {
    const tags = tagCombination.split(',');
    return (instance.dashboards_list || []).filter(dashboard => {
      const dashboardTags = [...dashboard.tags].sort();
      return tags.length === dashboardTags.length && 
             tags.every((tag, index) => tag === dashboardTags[index]);
    }).length;
  };

  const tagCombinations = getTagCombinations();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-grafana-text">Deployment Matrix</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Tag Combination</TableHead>
              {instances.map((instance, idx) => (
                <TableHead key={idx}>{instance.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tagCombinations.map((combination, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">
                  {combination.split(',').map((tag, tagIdx) => (
                    <span 
                      key={tagIdx}
                      className="inline-block bg-grafana-accent/10 text-grafana-accent px-2 py-1 rounded-full text-sm mr-1 mb-1"
                    >
                      {tag}
                    </span>
                  ))}
                </TableCell>
                {instances.map((instance, instanceIdx) => (
                  <TableCell key={instanceIdx}>
                    {countDashboards(instance, combination)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DeploymentMatrix;