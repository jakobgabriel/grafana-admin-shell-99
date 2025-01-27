import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUp, ArrowDown, HelpCircle } from "lucide-react";
import { GrafanaInstance } from "@/types/grafana";
import { countDashboards, getCellColor } from '@/utils/matrixUtils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const calculateCoverage = (combination: string): { percentage: number; instancesWithDashboards: number } => {
    let instancesWithDashboards = 0;
    instances.forEach(instance => {
      if (countDashboards(instance, combination) > 0) {
        instancesWithDashboards++;
      }
    });
    const percentage = (instancesWithDashboards / instances.length) * 100;
    return { percentage, instancesWithDashboards };
  };

  const getCoverageColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

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
            <TableHead className="w-[100px] sticky left-[300px] bg-white z-20">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-1">
                    Coverage
                    <HelpCircle className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Percentage of instances that have dashboards with this tag combination.</p>
                    <p className="text-xs mt-1">Formula: (Instances with dashboards / Total instances) × 100</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
          {tagCombinations.map((combination, idx) => {
            const coverage = calculateCoverage(combination);
            return (
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
                <TableCell className={`sticky left-[300px] bg-white z-10 ${getCoverageColor(coverage.percentage)}`}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {coverage.percentage.toFixed(1)}%
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{coverage.instancesWithDashboards} out of {instances.length} instances</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                {instances.map((instance, instanceIdx) => {
                  const count = countDashboards(instance, combination);
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default MatrixTable;