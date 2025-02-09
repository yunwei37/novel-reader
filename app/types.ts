export interface Novel {
  id: string;
  title: string;
  author?: string;
  source: 'local' | 'url';
  filepath?: string;
  url?: string;
  coverUrl?: string;
  lastRead: number;
  lastPosition: number;
  totalChapters?: number;
  description?: string;
  tags?: string[];
  bookmarks: Bookmark[];
  chapters: Chapter[];
}

export interface ReaderConfig {
  isDarkMode: boolean;
}

export interface TextPosition {
  offset: number;
  total: number;
}

export interface Bookmark {
  offset: number;
  timestamp: number;
  note?: string;
}

export interface Chapter {
  title: string;
  content: string;
  startIndex: number;
}

export type View = 'library' | 'reader' | 'settings' | 'discover' | 'search';
