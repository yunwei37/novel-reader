import { useTranslation } from '../../contexts/LanguageContext';
import { useState } from 'react';
import { SearchIcon } from '../icons';
import { NovelMeta, LocalRepo } from '../../types/repo';
import { NovelCard } from './NovelCard';
import { ImportSection } from './ImportSection';
import { RepositorySection } from './RepositorySection';
import { Novel } from '../../types';

export function DiscoverView() {
  const { t } = useTranslation();
  const [repositories, setRepositories] = useState<LocalRepo[]>([]);
  const [showAddRepo, setShowAddRepo] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [novels, setNovels] = useState<NovelMeta[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddRepository = async () => {
    if (!repoUrl) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${repoUrl}/index.json`);
      if (!response.ok) throw new Error(t('discover.error.invalidRepo'));
      const repoData = await response.json();
      
      const newRepo: LocalRepo = {
        url: repoUrl,
        meta: repoData,
        lastSync: new Date().toISOString()
      };
      
      setRepositories(prev => [...prev, newRepo]);
      setRepoUrl('');
      setShowAddRepo(false);
    } catch (error) {
      console.error('Failed to add repository:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async (repoUrl: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${repoUrl}/index.json`);
      if (!response.ok) throw new Error(t('discover.error.fetchFailed'));
      const repoData = await response.json();
      // TODO: Implement sync logic
      console.log('Syncing with data:', repoData);
    } catch (error) {
      console.error('Failed to sync repository:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveRepo = (url: string) => {
    setRepositories(prev => prev.filter(repo => repo.url !== url));
    setNovels(prev => prev.filter(novel => !novel.downloadUrl.startsWith(url)));
  };

  const handleImportComplete = (novel: Novel) => {
    console.log('Novel imported:', novel);
    // TODO: Implement import completion logic
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div className="relative">
          <input
            type="search"
            placeholder={t('discover.search')}
            className="w-full pl-10 pr-4 py-2 rounded-lg
              bg-gray-100 dark:bg-gray-700
              text-gray-900 dark:text-gray-100
              placeholder-gray-500 dark:placeholder-gray-400
              focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
              border border-gray-200 dark:border-gray-600"
          />
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        <ImportSection onImportComplete={handleImportComplete} />
        
        <RepositorySection
          repositories={repositories}
          onAddClick={() => setShowAddRepo(true)}
          onSync={handleSync}
          onRemove={handleRemoveRepo}
        />

        {repositories.length > 0 && (
          <>
            {/* Popular Novels */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {t('discover.popular')}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {novels
                  .sort((a, b) => b.chapters - a.chapters)
                  .slice(0, 6)
                  .map(novel => (
                    <NovelCard key={novel.id} novel={novel} />
                  ))}
              </div>
            </section>

            {/* Latest Updates */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {t('discover.latest')}
              </h2>
              <div className="space-y-4">
                {novels
                  .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
                  .slice(0, 5)
                  .map(novel => (
                    <NovelCard key={novel.id} novel={novel} />
                  ))}
              </div>
            </section>
          </>
        )}
      </div>

      {/* Add Repository Dialog */}
      {showAddRepo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
              {t('discover.addRepo')}
            </h3>
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder={t('discover.addRepoUrl')}
              className="w-full px-4 py-2 rounded-lg mb-4
                bg-gray-100 dark:bg-gray-700
                text-gray-900 dark:text-gray-100
                border border-gray-200 dark:border-gray-600"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAddRepo(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400"
              >
                {t('dialog.cancel')}
              </button>
              <button
                onClick={handleAddRepository}
                disabled={!repoUrl || isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg
                  disabled:bg-gray-300 dark:disabled:bg-gray-700"
              >
                {t('discover.addRepoButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 