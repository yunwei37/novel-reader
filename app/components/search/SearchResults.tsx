import { useTranslation } from '../../contexts/LanguageContext';
import { NovelCard } from '../discover/NovelCard';
import { SearchResult } from '../../lib/search';

export type RankOption = 'relevance' | 'newest' | 'popular' | 'rating';

interface SearchResultsProps {
  results: SearchResult[];
  defaultRank?: RankOption;
  onRankChange?: (rank: RankOption) => void;
}

export function SearchResults({ 
  results, 
  defaultRank = 'relevance',
  onRankChange 
}: SearchResultsProps) {
  const { t } = useTranslation();

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
        {results.map(novel => (
          <NovelCard key={novel.id} novel={novel} />
        ))}
      </div>
    </div>
  );
} 