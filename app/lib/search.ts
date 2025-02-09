import { NovelMeta, LocalRepo } from '../types/repo';

export interface SearchResult extends NovelMeta {
  repoUrl: string;
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
          repoUrl: repo.url
        });
      }
    }
  }

  // Sort by title
  results.sort((a, b) => a.title.localeCompare(b.title));
  
  return results;
} 