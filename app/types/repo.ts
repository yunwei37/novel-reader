export interface YamlNovelSearchIndex {
  author?: string;
  date?: string;
  description?: string;
  tags?: string[];
  categories?: string[];
  filename?: string;
  region?: string;
  size?: number;
  chapters?: number;
  lastUpdated?: string;
  'archived date'?: string;
}

export interface NovelMeta {
  id: string;
  title: string;
  author: string;
  description?: string;
  cover?: string | null;
  tags: string[];
  categories: string[];
  chapters: number;
  date: string;
  lastUpdated: string;
  pageUrl: string;
  size?: number;
  region?: string;
  downloadUrl?: string;
}

export interface RepoMeta {
  name: string;
  description: string;
  url: string;
  lastUpdated: string;
  novels: number;
  updatedNovels: number;
}

export interface RepoIndex {
  name: string;
  novels: NovelMeta[];
  updatedNovels: number;
  lastSync: string;
  categories: string[];
  tags: string[];
}

export interface LocalRepo {
  url: string;
  meta: RepoMeta;
  lastSync: string;
  index?: RepoIndex;
} 