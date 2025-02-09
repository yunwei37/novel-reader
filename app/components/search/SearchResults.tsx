import { useTranslation } from '../../contexts/LanguageContext';
import { NovelCard } from '../discover/NovelCard';
import { SearchResult } from '../../lib/search';

export type RankOption = 'relevance' | 'newest' | 'popular' | 'rating';

interface SearchResultsProps {
  results: SearchResult[];
  defaultRank?: RankOption;
  onRankChange?: (rank: RankOption) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
}

export function SearchResults({ 
  results, 
  defaultRank = 'relevance',
  onRankChange,
  currentPage,
  onPageChange,
  itemsPerPage = 50
}: SearchResultsProps) {
  const { t } = useTranslation();
  
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = results.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center sticky top-0 bg-gray-50 dark:bg-gray-900 py-3 text-gray-900 dark:text-gray-100 z-10">
        <h2 className="text-xl font-bold">
          {t('discover.searchResults')} ({results.length})
        </h2>
        <div className="flex items-center gap-2">
          <label htmlFor="rank-select" className="text-sm">
            {t('discover.sortBy')}:
          </label>
          <select
            id="rank-select"
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm"
            value={defaultRank}
            onChange={(e) => onRankChange?.(e.target.value as RankOption)}
          >
            <option value="relevance">{t('discover.sortOptions.relevance')}</option>
            <option value="newest">{t('discover.sortOptions.newest')}</option>
            <option value="popular">{t('discover.sortOptions.popular')}</option>
            <option value="rating">{t('discover.sortOptions.rating')}</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-6">
        {currentResults.map(novel => (
          <NovelCard key={novel.id} novel={novel} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white
              disabled:bg-gray-300 dark:disabled:bg-gray-700
              hover:bg-blue-600 transition-colors"
          >
            {t('common.previous')}
          </button>
          <span className="text-gray-700 dark:text-gray-300">
            {`${currentPage} / ${totalPages}`}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white
              disabled:bg-gray-300 dark:disabled:bg-gray-700
              hover:bg-blue-600 transition-colors"
          >
            {t('common.next')}
          </button>
        </div>
      )}
    </div>
  );
} 