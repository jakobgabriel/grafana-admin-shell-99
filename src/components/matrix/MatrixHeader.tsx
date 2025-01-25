import React from 'react';
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SearchableTagFilter from '../SearchableTagFilter';

interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  allTags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

const MatrixHeader = ({ 
  searchQuery, 
  onSearchChange, 
  allTags, 
  selectedTags, 
  onTagSelect 
}: Props) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-grafana-text">Deployment Matrix</h2>
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search tags..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="px-3 py-1 border rounded-md"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter Tags
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <SearchableTagFilter
              tags={allTags}
              selectedTags={selectedTags}
              onTagSelect={onTagSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default MatrixHeader;