import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { logUserInteraction } from "@/utils/userInteractions";

interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const SearchBar = ({ searchQuery, onSearchChange }: Props) => {
  const [inputValue, setInputValue] = React.useState(searchQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Search submitted:', inputValue);
      await logUserInteraction({
        event_type: 'search',
        component: 'SearchBar',
        details: { query: inputValue }
      });
      onSearchChange(inputValue);
    }
  };

  // Update local input value when searchQuery prop changes
  React.useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search dashboards... (Press Enter to search)"
        value={inputValue}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        className="pl-9"
      />
    </div>
  );
};

export default SearchBar;