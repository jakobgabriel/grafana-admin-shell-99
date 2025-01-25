import { GrafanaInstance } from "@/types/grafana";

export const getAllTags = (instances: GrafanaInstance[]): string[] => {
  const tagsSet = new Set<string>();
  instances.forEach(instance => {
    (instance.dashboards_list || []).forEach(dashboard => {
      dashboard.tags.forEach(tag => tagsSet.add(tag));
    });
  });
  return Array.from(tagsSet);
};

export const getTagCombinations = (instances: GrafanaInstance[]): string[] => {
  const combinationsSet = new Set<string>();
  instances.forEach(instance => {
    (instance.dashboards_list || []).forEach(dashboard => {
      if (dashboard.tags.length > 0) {
        const sortedTags = [...dashboard.tags].sort();
        combinationsSet.add(sortedTags.join(', '));
      }
    });
  });
  return Array.from(combinationsSet);
};

export const countDashboards = (instance: GrafanaInstance, tagCombination: string): number => {
  const tagSet = new Set(tagCombination.split(', '));
  return (instance.dashboards_list || []).filter(dashboard => {
    const dashboardTagSet = new Set(dashboard.tags);
    return tagSet.size === dashboardTagSet.size && 
           Array.from(tagSet).every(tag => dashboardTagSet.has(tag));
  }).length;
};

export const filterInstances = (instances: GrafanaInstance[], selectedTags: string[]): GrafanaInstance[] => {
  if (selectedTags.length === 0) return instances;
  return instances.filter(instance => 
    selectedTags.every(tag => 
      (instance.dashboards_list || []).some(dashboard => 
        dashboard.tags.includes(tag)
      )
    )
  );
};

export const getMaxDashboards = (instances: GrafanaInstance[], tagCombinations: string[]): number => {
  let max = 0;
  tagCombinations.forEach(combination => {
    instances.forEach(instance => {
      const count = countDashboards(instance, combination);
      max = Math.max(max, count);
    });
  });
  return max;
};

export const getCellColor = (count: number, maxDashboards: number): string => {
  if (count === 0) return 'bg-white';
  const intensity = Math.min((count / maxDashboards) * 100, 100);
  return `bg-grafana-accent/${Math.round(intensity)}`;
};