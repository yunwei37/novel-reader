import { NovelMeta, LocalRepo, RepoIndex, YamlNovelSearchIndex } from '../types/repo';
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

    // Collect all categories and tags
    const categorySet = new Set<string>();
    const tagSet = new Set<string>();

    // Transform the YAML data into NovelMeta array
    const novels: NovelMeta[] = Object.entries(yamlData).map(([path, data]) => {
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
      return {
        id: path,
        title,
        author: data.author || 'Unknown',
        description: data.description || '',
        cover: null,
        tags: data.tags || [],
        categories: data.categories || [],
        chapters: data.chapters || 0,
        lastUpdated: data.date || new Date().toISOString(),
        size: data.size,
        region: data.region,
        pageUrl,
        downloadUrl
      };
    });

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
export function searchNovels(repositories: LocalRepo[], query: string): NovelMeta[] {
  const searchTerms = query.toLowerCase().split(/\s+/);
  
  const results: NovelMeta[] = [];
  
  for (const repo of repositories) {
    // Add null check for index
    if (!repo.index?.novels) continue;
    
    const novels = repo.index.novels;
    
    for (const novel of novels) {
      // Check if all search terms match either title or author
      const matchesAllTerms = searchTerms.every(term => {
        const title = novel.title.toLowerCase();
        const author = novel.author?.toLowerCase() || '';
        return title.includes(term) || author.includes(term);
      });

      if (matchesAllTerms) {
        // Create a new object without the repoUrl property
        results.push({
          id: novel.id,
          title: novel.title,
          author: novel.author,
          description: novel.description,
          cover: novel.cover,
          tags: novel.tags,
          categories: novel.categories,
          chapters: novel.chapters,
          lastUpdated: novel.lastUpdated,
          pageUrl: novel.pageUrl,
          size: novel.size,
          region: novel.region
        });
      }
    }
  }

  // Sort by title
  results.sort((a, b) => a.title.localeCompare(b.title));
  
  return results;
}

// Ranking and sorting functions
export function getPopularNovels(repositories: LocalRepo[], limit = 6): NovelMeta[] {
  return repositories
    .flatMap(repo => repo.index?.novels || [])
    .sort((a, b) => (b.chapters || 0) - (a.chapters || 0))
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
