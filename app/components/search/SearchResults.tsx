import { useTranslation } from '../../contexts/LanguageContext';
import { NovelCard } from '../discover/NovelCard';
import { SearchResult } from '../../lib/search';

interface SearchResultsProps {
  results: SearchResult[];
}

export function SearchResults({ results }: SearchResultsProps) {
  const { t } = useTranslation();

  if (results.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-bold mb-4 sticky top-0 bg-gray-50 dark:bg-gray-900 py-2 text-gray-900 dark:text-gray-100">
        {t('discover.searchResults')} ({results.length})
      </h2>
      <div className="grid grid-cols-2 gap-4 pb-4">
        {results.map(novel => (
          <NovelCard key={novel.id} novel={novel} />
        ))}
      </div>
    </section>
  );
} 