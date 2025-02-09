import { NovelMeta } from '../../types/repo';
import { NovelCard } from './NovelCard';
import { useTranslation } from '../../contexts/LanguageContext';

interface SearchResultsProps {
  results: NovelMeta[];
}

export function SearchResults({ results }: SearchResultsProps) {
  const { t } = useTranslation();

  if (results.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {t('discover.searchResults')} ({results.length})
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {results.map(novel => (
          <NovelCard key={novel.id} novel={novel} />
        ))}
      </div>
    </section>
  );
} 