/**
 * Type definitions for the Novel Reader application
 */

/**
 * Reader configuration options
 */
export interface ReaderConfig {
  isPaged: boolean;       // Whether to use paged mode
  fontSize: number;       // Font size in pixels
  isDarkMode: boolean;    // Whether dark mode is enabled
  chunkSize: number;      // Size of content chunks in scroll mode
}

/**
 * Props for components that handle text content
 */
export interface TextContentProps {
  content: string;        // Text content to display
  fontSize: number;       // Font size in pixels
  isDarkMode: boolean;    // Whether dark mode is enabled
}

/**
 * Bookmark definition
 */
export interface Bookmark {
  position: number;       // Page number or scroll position
  chapter: number;        // Chapter index (deprecated)
  timestamp: number;      // When the bookmark was created
}
