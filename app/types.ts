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
}

export interface ReaderConfig {
  isDarkMode: boolean;
}

export interface TextContentProps {
  content: string;
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
