import { useState } from 'react';
import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';
import { LocalRepo } from '../../types/repo';
import { searchNovels, SearchResult, sortSearchResults } from '../../lib/search';
import { useTranslation } from '../../contexts/LanguageContext';
import { RankOption } from './SearchResults';

interface SearchViewProps {
  repositories: LocalRepo[];
  onSearching: (isSearching: boolean) => void;
  className?: string;
}

export function SearchView({ repositories, onSearching, className = '' }: SearchViewProps) {
  const { t } = useTranslation();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [currentRank, setCurrentRank] = useState<RankOption>('relevance');

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) {
      setResults([]);
      onSearching(false);
      return;
    }

    setIsSearching(true);
    onSearching(true);
    
    try {
      setTimeout(() => {
        const searchResults = searchNovels(repositories, searchQuery);
        const sortedResults = sortSearchResults(searchResults, currentRank);
        setResults(sortedResults);
      }, 0);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
      onSearching(false);
    }
  };

  const handleRankChange = (rank: RankOption) => {
    setCurrentRank(rank);
    setResults(sortedResults => sortSearchResults(sortedResults, rank));
  };

  return (
    <div className={`${className} flex flex-col h-full`}>
      <div className="flex-none bg-gray-50 dark:bg-gray-900 p-4 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <SearchBar onSearch={handleSearch} isSearching={isSearching} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-4xl mx-auto px-4">
          {results.length > 0 ? (
            <SearchResults 
              results={results} 
              defaultRank={currentRank}
              onRankChange={handleRankChange}
            />
          ) : query ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              {t('discover.noResults')}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
} 