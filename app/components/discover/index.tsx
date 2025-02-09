import { useTranslation } from '../../contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { LocalRepo } from '../../types/repo';
import { NovelCard } from './NovelCard';
import { ImportSection } from './ImportSection';
import { RepositorySection } from './RepositorySection';
import {
  fetchRepoIndex,
  syncRepository,
  getLatestNovels
} from '../../lib/discover';
import { AddRepositoryDialog } from './AddRepositoryDialog';
import { useRouter } from 'next/navigation';
import { NovelStorage } from '../../lib/storage';
import type { Novel, View } from '../../types';
import { RepoCard } from './RepoCard';

interface DiscoverViewProps {
  onViewChange: (view: View) => void;
}

export function DiscoverView({ onViewChange }: DiscoverViewProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [repositories, setRepositories] = useState<LocalRepo[]>([]);
  const [showAddRepo, setShowAddRepo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load repositories on mount
  useEffect(() => {
    const loadRepositories = async () => {
      try {
        const repos = await NovelStorage.getAllRepositories();
        setRepositories(repos);
      } catch (error) {
        console.error('Failed to load repositories:', error);
      }
    };
    loadRepositories();
  }, []);

  const handleAddRepository = async (url: string) => {
    if (!url) return;

    // Check if repository already exists
    const existingRepo = repositories.find(repo => repo.url === url);
    if (existingRepo) {
      alert(t('discover.error.repoExists'));
      return;
    }

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

      await NovelStorage.saveRepository(newRepo);
      setRepositories(prev => [...prev, newRepo]);
      setShowAddRepo(false);
    } catch (error) {
      console.error('Failed to add repository:', error);
      alert(t('discover.error.invalidRepo'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveRepo = async (url: string) => {
    try {
      await NovelStorage.deleteRepository(url);
      setRepositories(prev => prev.filter(repo => repo.url !== url));
    } catch (error) {
      console.error('Failed to remove repository:', error);
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

      await NovelStorage.saveRepository(updatedRepo);
      setRepositories(prev =>
        prev.map(r => r.url === repoUrl ? updatedRepo : r)
      );
    } catch (error) {
      console.error('Failed to sync repository:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportComplete = (novel: Novel) => {
    console.log('Novel imported:', novel);
    alert(t('discover.importComplete') + novel.title);
    router.push('/');
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
          <ImportSection onImportComplete={handleImportComplete} />

          {repositories.length > 0 && (
            <>
              {/* <section>
                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                  {t('discover.popular')}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {getPopularNovels(repositories).map(novel => (
                    <NovelCard key={novel.id} novel={novel} />
                  ))}
                </div>
              </section> */}

              <section>
                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                  {t('discover.latest')}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {getLatestNovels(repositories).map(novel => (
                    <NovelCard key={novel.id} novel={novel} />
                  ))}
                </div>
              </section>
            </>
          )}

          <RepositorySection
            repositories={repositories}
            onAddClick={() => setShowAddRepo(true)}
            onSync={handleSync}
            onRemove={handleRemoveRepo}
            onViewChange={onViewChange}
          />
        </div>
      </div>

      <AddRepositoryDialog
        isOpen={showAddRepo}
        isLoading={isLoading}
        onClose={() => setShowAddRepo(false)}
        onAdd={handleAddRepository}
      />
    </div>
  );
} 