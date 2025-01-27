import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  allTags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

const TagFilter = ({ allTags, selectedTags, onTagSelect }: Props) => {
  if (!allTags.length) return null;

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-4">
        {allTags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className="cursor-pointer hover:bg-grafana-accent/10"
            onClick={() => onTagSelect(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </ScrollArea>
  );
};

export default TagFilter;