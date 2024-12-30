export interface Chapter {
  title: string;
  content: string;
  startIndex: number;
}

export interface Bookmark {
  position: number;
  chapter: number;
  timestamp: number;
}

export interface ReaderConfig {
  isPaged: boolean;
  fontSize: number;
  isDarkMode: boolean;
  chunkSize: number;
}
