/**
 * Type definitions for the Novel Reader application
 */

/**
 * Reader configuration options
 */
export interface ReaderConfig {
  isDarkMode: boolean;    // Whether dark mode is enabled
}

/**
 * Props for components that handle text content
 */
export interface TextContentProps {
  content: string;        // Text content to display
  isDarkMode: boolean;    // Whether dark mode is enabled
}

/**
 * Text position definition
 */
export interface TextPosition {
  offset: number;         // Character offset in the text file (0-based)
  total: number;         // Total length of the text
}

/**
 * Bookmark definition
 */
export interface Bookmark {
  offset: number;        // Character offset in the text file
  timestamp: number;     // When the bookmark was created
  note?: string;        // Optional note for the bookmark
}

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
