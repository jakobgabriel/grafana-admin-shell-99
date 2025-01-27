import { GrafanaInstance } from "@/types/grafana";
import * as XLSX from 'xlsx';

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

export const calculateDashboardStats = (instances: GrafanaInstance[]) => {
  const allDashboards = instances.flatMap(instance => instance.dashboards_list || []);
  const uniqueDashboardTitles = new Set(allDashboards.map(d => d.title));
  
  // Calculate reusage rate
  const reusedDashboards = Array.from(uniqueDashboardTitles).filter(title => 
    allDashboards.filter(d => d.title === title).length > 1
  );
  const reusageRate = ((reusedDashboards.length / uniqueDashboardTitles.size) * 100).toFixed(1);

  // Calculate standardization score
  const totalInstances = instances.length;
  const standardizationScores = Array.from(uniqueDashboardTitles).map(title => {
    const instancesWithDashboard = new Set(
      allDashboards
        .filter(d => d.title === title)
        .map(d => instances.findIndex(i => 
          i.dashboards_list?.some(dash => dash.title === title)
        ))
    ).size;
    return (instancesWithDashboard / totalInstances) * 100;
  });

  const standardization = standardizationScores.length > 0
    ? (standardizationScores.reduce((a, b) => a + b) / standardizationScores.length).toFixed(1)
    : "0.0";

  return {
    reusageRate,
    standardization
  };
};

export const exportDashboardMatrixToExcel = (dashboardNames: string[], instances: GrafanaInstance[]) => {
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
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Dashboard Matrix');
  XLSX.writeFile(workbook, 'dashboard_matrix.xlsx');
};