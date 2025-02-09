import { useTranslation } from '../../contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { NovelMeta, LocalRepo } from '../../types/repo';
import { NovelCard } from './NovelCard';
import { ImportSection } from './ImportSection';
import { RepositorySection } from './RepositorySection';
import { Novel } from '../../types';
import {
  fetchRepoIndex,
  syncRepository,
  getPopularNovels,
  getLatestNovels
} from '../../lib/discover';
import { Search } from './Search';
import { AddRepositoryDialog } from './AddRepositoryDialog';
import { useRouter } from 'next/navigation';

export function DiscoverView() {
  const { t } = useTranslation();
  const router = useRouter();
  const [repositories, setRepositories] = useState<LocalRepo[]>([]);
  const [showAddRepo, setShowAddRepo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleAddRepository = async (url: string) => {
    if (!url) return;
    setIsLoading(true);
    try {
      const repoData = await fetchRepoIndex(url);
      const newRepo: LocalRepo = {
        url,
        meta: {
          name: repoData.name,
          description: '',
          url: url,
          lastUpdated: repoData.lastSync,
          novels: repoData.novels.length,
          updatedNovels: repoData.updatedNovels
        },
        lastSync: new Date().toISOString(),
        index: repoData
      };
      
      setRepositories(prev => [...prev, newRepo]);
      setShowAddRepo(false);
    } catch (error) {
      console.error('Failed to add repository:', error);
      alert(t('discover.error.invalidRepo'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async (repoUrl: string) => {
    setIsLoading(true);
    try {
      const repo = repositories.find(r => r.url === repoUrl);
      if (!repo) return;
      
      const index = await syncRepository(repo);
      const updatedRepo: LocalRepo = {
        ...repo,
        index,
        lastSync: new Date().toISOString()
      };

      setRepositories(prev => 
        prev.map(r => r.url === repoUrl ? updatedRepo : r)
      );
    } catch (error) {
      console.error('Failed to sync repository:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleRemoveRepo = (url: string) => {
    setRepositories(prev => prev.filter(repo => repo.url !== url));
  };

  const handleImportComplete = (novel: Novel) => {
    console.log('Novel imported:', novel);
    alert(t('discover.importComplete') + novel.title);
    router.push('/');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Search 
        repositories={repositories} 
        onSearching={setIsSearching}
        className="flex-none px-4 pt-4"
      />

      {!isSearching && (
        <div className="flex-1 overflow-y-auto">
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
                <section>
                  <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                    {t('discover.popular')}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {getPopularNovels(repositories).map(novel => (
                      <NovelCard key={novel.id} novel={novel} />
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                    {t('discover.latest')}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {getLatestNovels(repositories).map(novel => (
                      <NovelCard key={novel.id} novel={novel} />
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      )}

      <AddRepositoryDialog
        isOpen={showAddRepo}
        isLoading={isLoading}
        onClose={() => setShowAddRepo(false)}
        onAdd={handleAddRepository}
      />
    </div>
  );
} 