import { useState } from 'react';
import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';
import { LocalRepo } from '../../types/repo';
import { searchNovels, SearchResult } from '../../lib/search';

interface SearchViewProps {
  repositories: LocalRepo[];
  onSearching: (isSearching: boolean) => void;
  className?: string;
}

export function SearchView({ repositories, onSearching, className = '' }: SearchViewProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
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
      setTimeout(() => {
        const searchResults = searchNovels(repositories, query);
        setResults(searchResults);
      }, 0);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
      onSearching(false);
    }
  };

  return (
    <div className={`${className} flex flex-col h-full`}>
      <div className="flex-none bg-gray-50 dark:bg-gray-900 pb-4 px-4">
        <SearchBar onSearch={handleSearch} isSearching={isSearching} />
      </div>
      {results.length > 0 && (
        <div className="flex-1 overflow-y-auto min-h-0">
          <SearchResults results={results} />
        </div>
      )}
    </div>
  );
} 