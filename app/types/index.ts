/**
 * Type definitions for the Novel Reader application
 */

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
