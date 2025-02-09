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
  
  try {
    // Get base URL (repository URL)
    const baseUrl = new URL(url).origin;
    
    // Check if novel already exists
    const existingNovel = await NovelStorage.findNovelByUrl(url);
    if (existingNovel) {
      const shouldDownloadAgain = window.confirm(t('add.confirmRedownload'));
      if (!shouldDownloadAgain) {
        onNovelSelect(existingNovel);
        return;
      }
    }

    // Check if repository exists
    const repositories = await NovelStorage.getAllRepositories();
    const repoExists = repositories.some(repo => repo.url === baseUrl);

    // If repo doesn't exist, ask user if they want to import it
    if (!repoExists) {
      const shouldImportRepo = window.confirm(t('add.confirmImportRepo'));
      if (shouldImportRepo) {
        try {
          await handleRepoImport([baseUrl], {
            repositories,
            onLoading,
            onLoadingMessage,
            onRepositoriesChange: async (repos) => {
              console.log('Repositories changed:', repos);
              window.alert(t('add.repoImported'));
            },
            onViewChange: () => {}, // Don't change view in this case
            t
          });
        } catch (error) {
          console.error('Failed to import repository:', error);
          // Continue with novel import even if repo import fails
        }
      }
    }

    onLoading(true);
    onLoadingMessage(t('add.loadingUrl'));
    
    const novel = await NovelStorage.importFromUrl(url);
    onNovelSelect(novel);
  } catch (err) {
    console.error('Failed to import novel from URL:', err);
    alert(t('add.error.url'));
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
    let hasChanges = false;
    for (const url of repoUrls) {
      const existingRepo = repositories.find(repo => repo.url === url);
      
      if (existingRepo) {
        try {
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
          hasChanges = true;
        } catch (error) {
          console.error(`Failed to sync repository ${url}:`, error);
          continue; // Skip to next repo if sync fails
        }
      } else {
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
          onRepositoriesChange([...repositories, newRepo]);
          hasChanges = true;
        } catch (error) {
          console.error(`Failed to add repository ${url}:`, error);
          continue; // Skip to next repo if add fails
        }
      }
    }
    
    if (hasChanges) {
      window.alert(t('add.repoImported'));
      onViewChange('discover');
    }
  } catch (error) {
    console.error('Failed to handle repositories:', error);
    alert(t('discover.error.invalidRepo'));
  } finally {
    onLoading(false);
    onLoadingMessage('');
  }
} 