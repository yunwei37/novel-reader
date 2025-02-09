import { useState } from 'react';
import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';
import { NovelMeta, LocalRepo } from '../../types/repo';
import { searchNovels } from '../../lib/discover';

interface SearchProps {
  repositories: LocalRepo[];
  onSearching: (isSearching: boolean) => void;
}

export function Search({ repositories, onSearching }: SearchProps) {
  const [results, setResults] = useState<NovelMeta[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    onSearching(true);
    
    try {
      const searchResults = searchNovels(repositories, query);
      setResults(searchResults);
    } finally {
      setIsSearching(false);
      onSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <SearchBar onSearch={handleSearch} isSearching={isSearching} />
      <SearchResults results={results} />
    </div>
  );
} 