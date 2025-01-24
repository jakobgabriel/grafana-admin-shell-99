import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

const SearchableTagFilter = ({ tags, selectedTags, onTagSelect }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTags = useMemo(() => {
    if (!searchQuery) return tags;
    return tags.filter(tag => 
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tags, searchQuery]);

  const recommendedTags = useMemo(() => {
    if (selectedTags.length === 0) return tags.slice(0, 5);
    return tags.filter(tag => 
      !selectedTags.includes(tag) &&
      selectedTags.some(selectedTag => 
        tag.toLowerCase().includes(selectedTag.toLowerCase()) ||
        selectedTag.toLowerCase().includes(tag.toLowerCase())
      )
    ).slice(0, 3);
  }, [tags, selectedTags]);

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search tags..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />
      
      {selectedTags.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">Selected Tags:</p>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="default"
                className="cursor-pointer"
                onClick={() => onTagSelect(tag)}
              >
                {tag} ×
              </Badge>
            ))}
          </div>
        </div>
      )}

      {recommendedTags.length > 0 && !searchQuery && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">Recommended Tags:</p>
          <div className="flex flex-wrap gap-2">
            {recommendedTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer hover:bg-grafana-blue transition-colors"
                onClick={() => onTagSelect(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <ScrollArea className="h-[200px]">
        <div className="flex flex-wrap gap-2 p-4">
          {filteredTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer hover:bg-grafana-blue transition-colors"
              onClick={() => onTagSelect(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SearchableTagFilter;