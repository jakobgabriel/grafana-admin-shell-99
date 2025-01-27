import { GrafanaInstance } from "@/types/grafana";

export const getAllDashboardNames = (instances: GrafanaInstance[]): string[] => {
  const namesSet = new Set<string>();
  instances.forEach(instance => {
    (instance.dashboards_list || []).forEach(dashboard => {
      namesSet.add(dashboard.title);
    });
  });
  return Array.from(namesSet).sort();
};

export const countDashboardsByName = (instance: GrafanaInstance, dashboardName: string): number => {
  return (instance.dashboards_list || []).filter(dashboard => 
    dashboard.title === dashboardName
  ).length;
};

export const getMaxDashboardsByName = (instances: GrafanaInstance[], dashboardNames: string[]): number => {
  let max = 0;
  dashboardNames.forEach(name => {
    instances.forEach(instance => {
      const count = countDashboardsByName(instance, name);
      max = Math.max(max, count);
    });
  });
  return max;
};

export const exportDashboardMatrixToExcel = (dashboardNames: string[], instances: GrafanaInstance[]) => {
  const XLSX = require('xlsx');
  const workbook = XLSX.utils.book_new();

  // Prepare the data
  const headers = ['Dashboard Name', ...instances.map(i => i.name)];
  const data = [headers];

  dashboardNames.forEach(name => {
    const row = [name];
    instances.forEach(instance => {
      row.push(String(countDashboardsByName(instance, name)));
    });
    data.push(row);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Dashboard Matrix');
  XLSX.writeFile(workbook, 'dashboard_matrix.xlsx');
};