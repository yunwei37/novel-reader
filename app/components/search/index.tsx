import { useState, useEffect } from 'react';
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
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const repoUrl = params.get('repo');
    
    if (repoUrl) {
      const repo = repositories.find(r => r.url === repoUrl);
      if (repo) {
        setIsSearching(true);
        onSearching(true);
        
        setTimeout(() => {
          const searchResults = searchNovels([repo], '', true);
          const sortedResults = sortSearchResults(searchResults, currentRank);
          setResults(sortedResults);
          setCurrentPage(1); // Reset to first page when showing new results
          setIsSearching(false);
          onSearching(false);
        }, 0);
      }
    }
  }, [repositories, currentRank, onSearching]);

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
        setCurrentPage(1); // Reset to first page when searching
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
              currentPage={currentPage}
              onPageChange={handlePageChange}
              itemsPerPage={50}
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