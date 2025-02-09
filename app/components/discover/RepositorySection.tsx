import { useTranslation } from '../../contexts/LanguageContext';
import { PlusIcon, RefreshIcon, TrashIcon } from '../icons';
import { LocalRepo } from '../../types/repo';

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
          <div key={repo.url} className="bg-white dark:bg-gray-800 p-4 rounded-lg
            shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {repo.meta.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {`${repo.meta.novels}`}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {`${t('discover.lastSync')} ${new Date(repo.lastSync).toLocaleString()}`}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onSync(repo.url)}
                  className="p-2 text-blue-500 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <RefreshIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onRemove(repo.url)}
                  className="p-2 text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 