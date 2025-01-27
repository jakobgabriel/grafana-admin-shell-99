import React from "react";

const Footer = () => {
  return (
    <footer className="mt-auto py-4 bg-gray-100">
      <div className="container mx-auto text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} Grafana Dashboard Explorer</p>
      </div>
    </footer>
  );
};

export

<lov-write file_path="src/components/SearchableTagFilter.tsx">
import React from "react";

interface SearchableTagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

const SearchableTagFilter: React.FC<SearchableTagFilterProps> = ({
  tags,
  selectedTags,
  onTagSelect,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagSelect(tag)}
          className={`px-2 py-1 rounded ${
            selectedTags.includes(tag)
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default SearchableTagFilter;