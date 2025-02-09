import { useTranslation } from '../../contexts/LanguageContext';
import { PlusIcon } from '../icons';
import { LocalRepo } from '../../types/repo';
import { RepoCard } from './RepoCard';

interface RepositorySectionProps {
  repositories: LocalRepo[];
  onAddClick: () => void;
  onSync: (url: string) => void;
  onRemove: (url: string) => void;
}

export function RepositorySection({
  repositories,
  onAddClick,
  onSync,
  onRemove,
}: RepositorySectionProps) {
  const { t } = useTranslation();

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {t('discover.repositories')}
        </h2>
        <button
          onClick={onAddClick}
          className="flex items-center space-x-1 text-blue-500 dark:text-blue-400"
        >
          <PlusIcon className="h-5 w-5" />
          <span>{t('discover.addRepo')}</span>
        </button>
      </div>

      <div className="space-y-4">
        {repositories.map(repo => (
          <RepoCard
            key={repo.url}
            repo={repo}
            onSync={onSync}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  );
} 