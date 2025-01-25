import React from 'react';
import { Badge } from "@/components/ui/badge";
import { logUserInteraction } from "@/utils/userInteractions";

interface Props {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

const TagFilter = ({ tags, selectedTags, onTagSelect }: Props) => {
  const handleTagClick = async (tag: string) => {
    await logUserInteraction({
      event_type: 'tag_filter',
      component: 'TagFilter',
      details: { 
        tag,
        action: selectedTags.includes(tag) ? 'remove' : 'add'
      }
    });
    onTagSelect(tag);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Filter by Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;