import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";
import { GrafanaInstance } from "@/types/grafana";
import { countDashboardsByName } from '@/utils/dashboardMatrixUtils';
import { getCellColor } from '@/utils/matrixUtils';

interface Props {
  dashboardNames: string[];
  instances: GrafanaInstance[];
  maxDashboards: number;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  onSort: (key: string) => void;
}

const DashboardMatrixTable = ({ 
  dashboardNames, 
  instances, 
  maxDashboards, 
  sortConfig, 
  onSort 
}: Props) => {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-white z-10">
          <TableRow>
            <TableHead 
              className="w-[300px] cursor-pointer sticky left-0 bg-white z-20"
              onClick={() => onSort('dashboard')}
            >
              <div className="flex items-center">
                Dashboard Names
                {sortConfig?.key === 'dashboard' && (
                  sortConfig.direction === 'asc' ? (
                    <ArrowUp className="h-4 w-4 ml-2" />
                  ) : (
                    <ArrowDown className="h-4 w-4 ml-2" />
                  )
                )}
              </div>
            </TableHead>
            {instances.map((instance, index) => (
              <TableHead 
                key={index}
                className="cursor-pointer w-[20px] p-0"
                onClick={() => onSort(instance.name)}
              >
                <div className="flex items-center justify-center h-[180px] relative">
                  <div className="absolute transform -rotate-90 whitespace-nowrap origin-center">
                    <span>{instance.name}</span>
                    {sortConfig?.key === instance.name && (
                      <span className="ml-2 inline-block transform rotate-90">
                        {sortConfig.direction === 'asc' ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dashboardNames.map((name, idx) => (
            <TableRow key={idx}>
              <TableCell className="font-medium sticky left-0 bg-white z-10">
                {name}
              </TableCell>
              {instances.map((instance, instanceIdx) => {
                const count = countDashboardsByName(instance, name);
                return (
                  <TableCell 
                    key={instanceIdx}
                    className={`${getCellColor(count, maxDashboards)} transition-colors duration-300 text-center font-medium p-1 w-[20px]`}
                  >
                    {count}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DashboardMatrixTable;