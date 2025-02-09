import { useTranslation } from '../../contexts/LanguageContext';
import { NovelCard } from '../discover/NovelCard';
import { SearchResult } from '../../lib/search';

interface SearchResultsProps {
  results: SearchResult[];
}

export function SearchResults({ results }: SearchResultsProps) {
  const { t } = useTranslation();

  return (
    <div className="py-6">
      <h2 className="text-xl font-bold mb-6 sticky top-0 bg-gray-50 dark:bg-gray-900 py-3 text-gray-900 dark:text-gray-100 z-10">
        {t('discover.searchResults')} ({results.length})
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {results.map(novel => (
          <NovelCard key={novel.id} novel={novel} />
        ))}
      </div>
    </div>
  );
} 