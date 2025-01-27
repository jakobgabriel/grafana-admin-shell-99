import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";
import { GrafanaInstance } from "@/types/grafana";
import { countDashboards, getCellColor } from '@/utils/matrixUtils';

interface Props {
  tagCombinations: string[];
  instances: GrafanaInstance[];
  maxDashboards: number;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  onSort: (key: string) => void;
}

const MatrixTable = ({ 
  tagCombinations, 
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
              onClick={() => onSort('tag')}
            >
              <div className="flex items-center">
                Tag Combinations
                {sortConfig?.key === 'tag' && (
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
                className="cursor-pointer min-w-[80px] h-[140px] align-bottom"
                onClick={() => onSort(instance.name)}
              >
                <div className="flex items-center justify-center transform -rotate-90 origin-center translate-y-[-20px]">
                  <span className="whitespace-nowrap">{instance.name}</span>
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
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tagCombinations.map((combination, idx) => (
            <TableRow key={idx}>
              <TableCell className="font-medium sticky left-0 bg-white z-10">
                <div className="flex flex-wrap gap-1">
                  {combination.split(', ').map((tag, tagIdx) => (
                    <span key={tagIdx} className="inline-block bg-grafana-accent/10 text-grafana-accent px-2 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </TableCell>
              {instances.map((instance, instanceIdx) => {
                const count = countDashboards(instance, combination);
                return (
                  <TableCell 
                    key={instanceIdx}
                    className={`${getCellColor(count, maxDashboards)} transition-colors duration-300 text-center font-medium rounded-sm`}
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

export default MatrixTable;