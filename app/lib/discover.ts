import { NovelMeta, LocalRepo, RepoIndex } from '../types/repo';

// Repository management functions
export async function fetchRepoIndex(url: string): Promise<RepoIndex> {
  const response = await fetch(`${url}/index.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch repository index');
  }
  return response.json();
}

export async function syncRepository(repo: LocalRepo): Promise<RepoIndex> {
  const index = await fetchRepoIndex(repo.url);
  return index;
}

// Search and filter functions
export function searchNovels(repositories: LocalRepo[], query: string): NovelMeta[] {
  if (!query.trim()) return [];
  
  const searchTerms = query.toLowerCase().split(/\s+/);
  return repositories
    .flatMap(repo => repo.index?.novels || [])
    .filter(novel => {
      const searchText = `${novel.title} ${novel.author} ${novel.description || ''} ${
        novel.categories.join(' ')} ${novel.tags.join(' ')}`.toLowerCase();
      return searchTerms.every(term => searchText.includes(term));
    });
}

// Ranking and sorting functions
export function getPopularNovels(repositories: LocalRepo[], limit = 6): NovelMeta[] {
  return repositories
    .flatMap(repo => repo.index?.novels || [])
    .sort((a, b) => b.chapters - a.chapters)
    .slice(0, limit);
}

export function getLatestNovels(repositories: LocalRepo[], limit = 5): NovelMeta[] {
  return repositories
    .flatMap(repo => repo.index?.novels || [])
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, limit);
}
