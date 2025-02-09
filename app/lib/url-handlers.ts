import { Novel } from '../types';
import { LocalRepo } from '../types/repo';
import { NovelStorage } from './storage';
import { fetchRepoIndex, syncRepository } from './discover';

// Add this type for translation parameters
type TranslationParams = Record<string, string | number>;

export async function handleUrlImport(
  url: string,
  options: {
    onLoading: (isLoading: boolean) => void;
    onLoadingMessage: (message: string) => void;
    onNovelSelect: (novel: Novel) => void;
    t: (key: string, params?: TranslationParams) => string;
  }
): Promise<void> {
  const { onLoading, onLoadingMessage, onNovelSelect, t } = options;
  
  const existingNovel = await NovelStorage.findNovelByUrl(url);
  if (existingNovel) {
    const shouldDownloadAgain = window.confirm(t('add.confirmRedownload'));
    if (!shouldDownloadAgain) {
      onNovelSelect(existingNovel);
      return;
    }
  }

  onLoading(true);
  onLoadingMessage(t('add.loadingUrl'));
  
  try {
    const novel = await NovelStorage.importFromUrl(url);
    onNovelSelect(novel);
  } catch (err) {
    console.error('Failed to import novel from URL:', err);
  } finally {
    onLoading(false);
    onLoadingMessage('');
  }
}

export async function handleRepoImport(
  repoUrls: string[],
  options: {
    repositories: LocalRepo[];
    onLoading: (isLoading: boolean) => void;
    onLoadingMessage: (message: string) => void;
    onRepositoriesChange: (repos: LocalRepo[]) => void;
    onViewChange: (view: 'discover') => void;
    t: (key: string, params?: TranslationParams) => string;
  }
): Promise<void> {
  const { repositories, onLoading, onLoadingMessage, onRepositoriesChange, onViewChange, t } = options;
  
  onLoading(true);
  onLoadingMessage(t('discover.addRepoButton'));
  
  try {
    for (const url of repoUrls) {
      const existingRepo = repositories.find(repo => repo.url === url);
      
      if (existingRepo) {
        const index = await syncRepository(existingRepo);
        const updatedRepo = {
          ...existingRepo,
          index,
          lastSync: new Date().toISOString()
        };
        await NovelStorage.saveRepository(updatedRepo);
        onRepositoriesChange(
          repositories.map(r => r.url === url ? updatedRepo : r)
        );
      } else {
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
        onRepositoriesChange([...repositories, newRepo]);
      }
    }
    onViewChange('discover');
  } catch (error) {
    console.error('Failed to add repositories:', error);
    alert(t('discover.error.invalidRepo'));
  } finally {
    onLoading(false);
    onLoadingMessage('');
  }
} 