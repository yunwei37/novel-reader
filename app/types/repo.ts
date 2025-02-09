export interface NovelMeta {
  id: string;
  title: string;
  author: string;
  cover?: string;
  description?: string;
  categories: string[];
  tags: string[];
  language: string;
  chapters: number;
  lastUpdated: string;
  size: number;
  downloadUrl: string;
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
  novels: NovelMeta[];
  categories: string[];
  tags: string[];
}

export interface LocalRepo {
  url: string;
  meta: RepoMeta;
  lastSync: string;
  index?: RepoIndex;
} 