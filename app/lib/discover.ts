import { NovelMeta, LocalRepo, RepoIndex, YamlNovelSearchIndex, SearchResult } from '../types/repo';
import yaml from 'js-yaml';

// Repository management functions
export async function fetchRepoIndex(url: string): Promise<RepoIndex> {
  try {
    // Append search_index.yml if not present
    const indexUrl = url.endsWith('search_index.yml') 
      ? url 
      : url.replace(/\/?$/, '/search_index.yml');

    const response = await fetch(indexUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch index: ${response.statusText}`);
    }

    const yamlText = await response.text();
    const yamlData = yaml.load(yamlText) as Record<string, YamlNovelSearchIndex>;

    // Collect all categories and tags using Sets to prevent duplicates
    const categorySet = new Set<string>();
    const tagSet = new Set<string>();
    const processedPaths = new Set<string>();
    const novels: NovelMeta[] = [];

    // Transform the YAML data into NovelMeta array
    for (const [path, data] of Object.entries(yamlData)) {
      // Skip if we've already processed this path
      if (processedPaths.has(path)) continue;
      processedPaths.add(path);

      // Skip if filename doesn't end with .txt
      if (data.filename && !data.filename.endsWith('.txt')) continue;

      // Add categories and tags to sets
      data.categories?.forEach(cat => categorySet.add(cat));
      data.tags?.forEach(tag => tagSet.add(tag));

      // Extract title from filename or path
      const title = data.filename?.replace(/\.[^/.]+$/, '') || 
                   path.split('/').pop()?.replace(/\.[^/.]+$/, '') || 
                   'Untitled';

      // Construct download URL
      let pageUrl = url.replace(/\/search_index\.yml$/, '') + '/' + path;
      // remove .md from pageUrl
      pageUrl = pageUrl.replace(/\.md$/, '');
      // downloadUrl is the same as pageUrl but replace the last part with filename
      const downloadUrl = pageUrl.replace(/\/[^/]+$/, '') + '/' + data.filename;

      novels.push({
        id: path,
        title,
        author: data.author || 'Unknown',
        description: data.description || '',
        cover: null,
        tags: data.tags || [],
        categories: data.categories || [],
        chapters: data.chapters || 0,
        date: data.date || new Date().toISOString(),
        lastUpdated: data['archived date'] || new Date().toISOString(),
        size: data.size,
        region: data.region,
        pageUrl,
        downloadUrl
      });
    }

    // Extract repository name from URL
    const repoName = new URL(url).hostname.split('.')[0];

    return {
      name: repoName,
      novels,
      updatedNovels: novels.length,
      lastSync: new Date().toISOString(),
      categories: Array.from(categorySet),
      tags: Array.from(tagSet)
    };

  } catch (error) {
    console.error('Error fetching repo index:', error);
    throw new Error('Failed to fetch repository data');
  }
}

export async function syncRepository(repo: LocalRepo): Promise<RepoIndex> {
  const index = await fetchRepoIndex(repo.url);
  return index;
}

// Search and filter functions
export function searchNovels(repositories: LocalRepo[], query: string, showAll: boolean = false): SearchResult[] {
  const searchTerms = query.toLowerCase().split(/\s+/);
  const results: SearchResult[] = [];
  const seenNovelIds = new Set<string>();  // Track unique novels
  
  for (const repo of repositories) {
    if (!repo.index?.novels) continue;
    
    const novels = repo.index.novels;
    
    for (const novel of novels) {
      // Skip if we've already seen this novel (using a combination of title and author as unique identifier)
      const novelId = `${novel.title}|${novel.author}`;
      if (seenNovelIds.has(novelId)) continue;

      // If showAll is true or if the novel matches search terms
      if (showAll || searchTerms.every(term => {
        const title = novel.title.toLowerCase();
        const author = novel.author?.toLowerCase() || '';
        const description = novel.description?.toLowerCase() || '';
        return title.includes(term) || author.includes(term) || description.includes(term);
      })) {
        seenNovelIds.add(novelId);
        results.push({
          ...novel,
          repoUrl: repo.url,
          score: calculateRelevanceScore(novel, query)
        });
      }
    }
  }

  // Sort by title
  results.sort((a, b) => a.title.localeCompare(b.title));
  
  return results;
}

function calculateRelevanceScore(novel: NovelMeta, query: string): number {
  if (!query) return 1;
  
  const searchTerms = query.toLowerCase().split(/\s+/);
  let score = 0;
  
  searchTerms.forEach(term => {
    if (novel.title.toLowerCase().includes(term)) score += 3;
    if (novel.author?.toLowerCase().includes(term)) score += 2;
    if (novel.description?.toLowerCase().includes(term)) score += 1;
  });
  
  return score;
}

// Ranking and sorting functions
export function getPopularNovels(repositories: LocalRepo[], limit = 6): NovelMeta[] {
  return repositories
    .flatMap(repo => repo.index?.novels || [])
    .sort((a, b) => {
      // First compare by chapters
      const chapterDiff = (b.chapters || 0) - (a.chapters || 0);
      if (chapterDiff !== 0) return chapterDiff;
      
      // If chapters are equal, compare by date
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    })
    .slice(0, limit);
}

export function getLatestNovels(repositories: LocalRepo[], limit = 5): NovelMeta[] {
  return repositories
    .flatMap(repo => repo.index?.novels || [])
    .sort((a, b) => {
      const dateA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
      const dateB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, limit);
}
