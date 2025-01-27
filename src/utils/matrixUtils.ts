import { GrafanaInstance } from "@/types/grafana";

export const getUniqueDashboards = (instances: GrafanaInstance[]) => {
  const allDashboards = instances.flatMap((instance) =>
    instance.dashboards_list.map((d) => d.title)
  );
  return [...new Set(allDashboards)].sort();
};