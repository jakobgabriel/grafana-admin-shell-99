import * as XLSX from 'xlsx';
import { GrafanaInstance } from "@/types/grafana";
import { countDashboards } from './matrixUtils';

export const exportMatrixToExcel = (
  tagCombinations: string[],
  instances: GrafanaInstance[]
) => {
  console.log('Exporting matrix to Excel:', { tagCombinations, instances });
  
  // Create worksheet data with header row
  const wsData = [
    ['Tag Combinations', ...instances.map(i => i.name)]
  ];

  // Add data rows, converting numbers to strings
  tagCombinations.forEach(combination => {
    const row = [
      combination,
      ...instances.map(instance => String(countDashboards(instance, combination)))
    ];
    wsData.push(row);
  });

  // Create workbook and add worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Deployment Matrix');

  // Save file
  XLSX.writeFile(wb, 'deployment-matrix.xlsx');
};

export const exportDashboardListToExcel = (instances: GrafanaInstance[]) => {
  console.log('Exporting dashboard list to Excel:', { instances });
  
  // Create worksheet data
  const wsData = [
    ['Instance', 'Dashboard', 'Description', 'Tags', 'URL']
  ];

  instances.forEach(instance => {
    (instance.dashboards_list || []).forEach(dashboard => {
      wsData.push([
        instance.name,
        dashboard.title,
        dashboard.description || '',
        (dashboard.tags || []).join(', '),
        dashboard.url
      ]);
    });
  });

  // Create workbook and add worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Dashboard List');

  // Save file
  XLSX.writeFile(wb, 'dashboard-list.xlsx');
};