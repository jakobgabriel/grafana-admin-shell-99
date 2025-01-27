import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Props {
  allTags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

const TagFilter = ({ allTags, selectedTags, onTagSelect }: Props) => {
  if (!allTags.length) return null;

  return (
    <ScrollArea className="w-full" type="scroll">
      <div className="flex gap-2 pb-4 px-1">
        {allTags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className="cursor-pointer hover:bg-grafana-accent/10 whitespace-nowrap"
            onClick={() => onTagSelect(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default TagFilter;