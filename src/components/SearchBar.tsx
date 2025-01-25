import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { logUserInteraction } from "@/utils/userInteractions";

interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const SearchBar = ({ searchQuery, onSearchChange }: Props) => {
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    await logUserInteraction({
      event_type: 'search',
      component: 'SearchBar',
      details: { query: value }
    });
    onSearchChange(value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search dashboards..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="pl-9"
      />
    </div>
  );
};

export default SearchBar;