import { useState } from 'react';
import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';
import { NovelMeta, LocalRepo } from '../../types/repo';
import { searchNovels } from '../../lib/discover';

interface SearchProps {
  repositories: LocalRepo[];
  onSearching: (isSearching: boolean) => void;
  className?: string;
}

export function Search({ repositories, onSearching, className = '' }: SearchProps) {
  const [results, setResults] = useState<NovelMeta[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      onSearching(false);
      return;
    }

    setIsSearching(true);
    onSearching(true);
    
    try {
      const searchResults = await Promise.resolve(searchNovels(repositories, query));
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
      onSearching(false);
    }
  };

  return (
    <div className={`${className} flex flex-col`}>
      <SearchBar onSearch={handleSearch} isSearching={isSearching} />
      <div className="flex-1 overflow-y-auto">
        <SearchResults results={results} />
      </div>
    </div>
  );
} 