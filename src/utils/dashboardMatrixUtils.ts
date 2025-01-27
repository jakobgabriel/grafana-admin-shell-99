import { GrafanaInstance } from "@/types/grafana";

export const calculateInstanceStats = (instances: GrafanaInstance[]) => {
  return instances.reduce(
    (acc, instance) => {
      acc.totalDashboards += instance.dashboards;
      acc.totalFolders += instance.folders;
      return acc;
    },
    { totalDashboards: 0, totalFolders: 0 }
  );
};