import { NovelMeta, LocalRepo } from '../types/repo';

export interface SearchResult extends NovelMeta {
  repoUrl: string;
  score: number;
}

export function searchNovels(repositories: LocalRepo[], query: string): SearchResult[] {
  const searchTerms = query.toLowerCase().split(/\s+/);
  const results: SearchResult[] = [];
  
  for (const repo of repositories) {
    if (!repo.index?.novels) continue;
    
    for (const novel of repo.index.novels) {
      // Check if all search terms match either title or author
      const matchesAllTerms = searchTerms.every(term => {
        const title = novel.title.toLowerCase();
        const author = (novel.author || '').toLowerCase();
        return title.includes(term) || author.includes(term);
      });

      if (matchesAllTerms) {
        results.push({
          ...novel,
          repoUrl: repo.url,
          score: 1 // Placeholder score, actual calculation needed
        });
      }
    }
  }

  // Sort by title
  results.sort((a, b) => a.title.localeCompare(b.title));
  
  return results;
}

export function sortSearchResults(results: SearchResult[], rankBy: 'relevance' | 'newest' | 'popular' | 'rating'): SearchResult[] {
  return [...results].sort((a, b) => {
    switch (rankBy) {
      case 'relevance':
        return b.score - a.score;
      case 'newest':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      case 'popular':
        // Assuming size or chapters count could indicate popularity
        return (b.size || 0) - (a.size || 0);
      case 'rating':
        // If we don't have actual ratings, we could use a combination of factors
        const aRating = ((a.size || 0) / 1000) + (a.chapters || 0);
        const bRating = ((b.size || 0) / 1000) + (b.chapters || 0);
        return bRating - aRating;
      default:
        return 0;
    }
  });
} 