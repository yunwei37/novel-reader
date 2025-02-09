import { NovelMeta, LocalRepo } from '../types/repo';

export interface SearchResult extends NovelMeta {
  repoUrl: string;
  score: number;
}

export function searchNovels(
  repositories: LocalRepo[], 
  query: string,
  showAll: boolean = false
): SearchResult[] {
  const results: SearchResult[] = [];

  for (const repo of repositories) {
    if (!repo.index?.novels) continue;
    
    for (const novel of repo.index.novels) {
      if (showAll || 
          novel.title.toLowerCase().includes(query.toLowerCase()) ||
          novel.description?.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          ...novel,
          repoUrl: repo.url,
          score: calculateRelevanceScore(novel, query)
        });
      }
    }
  }

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

function calculateRelevanceScore(novel: NovelMeta, query: string): number {
  if (!query) return 1; // If showing all, every result has same relevance
  
  const searchTerms = query.toLowerCase().split(/\s+/);
  let score = 0;
  
  // Check title matches (highest weight)
  searchTerms.forEach(term => {
    if (novel.title.toLowerCase().includes(term)) {
      score += 3;
    }
  });
  
  // Check description matches (medium weight)
  searchTerms.forEach(term => {
    if (novel.description?.toLowerCase().includes(term)) {
      score += 1;
    }
  });
  
  // Check author matches (high weight)
  searchTerms.forEach(term => {
    if (novel.author?.toLowerCase().includes(term)) {
      score += 2;
    }
  });
  
  return score;
} 