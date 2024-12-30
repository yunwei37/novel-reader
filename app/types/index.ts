/**
 * Common types used throughout the Novel Reader application
 */

/**
 * Chapter representation in the novel
 */
export interface Chapter {
  title: string;
  content: string;
  startIndex: number;
}

/**
 * Bookmark data structure
 */
export interface Bookmark {
  position: number;
  chapter: number;
  timestamp: number;
}

/**
 * Reader configuration options
 */
export interface ReaderConfig {
  isPaged: boolean;
  fontSize: number;
  isDarkMode: boolean;
  chunkSize: number;
}

/**
 * Common component props that are shared across multiple components
 */
export interface CommonComponentProps {
  isDarkMode?: boolean;
  className?: string;
}

/**
 * Props for components that can handle dark mode
 */
export interface DarkModeProps extends CommonComponentProps {
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
}

/**
 * Props for components that handle text content
 */
export interface TextContentProps extends CommonComponentProps {
  content: string;
  fontSize: number;
}

/**
 * Props for components that handle navigation
 */
export interface NavigationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Search-related props
 */
export interface SearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
}

/**
 * Bookmark-related props
 */
export interface BookmarkProps {
  bookmarks: Bookmark[];
  onBookmark: () => void;
  onBookmarkSelect: (position: number, chapter: number) => void;
}

/**
 * Chapter navigation props
 */
export interface ChapterNavigationProps {
  chapters: Chapter[];
  currentChapter: number;
  onChapterSelect: (index: number) => void;
}
