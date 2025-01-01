/**
 * Reader utility functions
 */

import { Chapter, TextPosition } from '../types';

/**
 * Detects chapters in the given text content
 * @param text The full text content to analyze
 * @returns Array of detected chapters
 */
export const detectChapters = (text: string): Chapter[] => {
  const lines = text.split('\n');
  const chapterPattern = /^(chapter|第|卷|章|section)\s*\d+/i;
  const chapters: Chapter[] = [];
  let currentChapterContent = '';
  let currentChapterTitle = '';
  let startIndex = 0;
  let currentOffset = 0;

  lines.forEach((line, index) => {
    if (chapterPattern.test(line.trim())) {
      if (currentChapterTitle) {
        chapters.push({
          title: currentChapterTitle,
          content: currentChapterContent,
          startIndex: startIndex
        });
      }
      currentChapterTitle = line.trim();
      startIndex = currentOffset;
      currentChapterContent = '';
    } else {
      currentChapterContent += line + '\n';
    }
    // Add line length plus newline character to track character offset
    currentOffset += line.length + 1;
  });

  if (currentChapterTitle) {
    chapters.push({
      title: currentChapterTitle,
      content: currentChapterContent,
      startIndex: startIndex
    });
  }

  // If no chapters were detected, treat the entire text as one chapter
  return chapters.length > 0 ? chapters : [{
    title: 'Full Text',
    content: text,
    startIndex: 0
  }];
};

/**
 * Calculate the number of lines that can fit in a given height
 */
export const calculateLinesPerPage = (height: number, fontSize: number): number => {
  const lineHeight = fontSize * 1.5; // Assuming 1.5 line height
  const paddingTop = 32;  // Account for container padding
  const paddingBottom = 32;
  const availableHeight = height - paddingTop - paddingBottom;
  return Math.floor(availableHeight / lineHeight);
};

/**
 * Calculate total pages based on content and lines per page
 */
export const calculateTotalPages = (content: string, linesPerPage: number): number => {
  const lines = content.split('\n');
  return Math.ceil(lines.length / linesPerPage);
};

/**
 * Get content for a specific page
 */
export const getPageContent = (content: string, pageNumber: number, linesPerPage: number): string => {
  const lines = content.split('\n');
  const startLine = (pageNumber - 1) * linesPerPage;
  return lines.slice(startLine, startLine + linesPerPage).join('\n');
};

/**
 * Convert character offset to page number
 */
export const offsetToPage = (offset: number, content: string, linesPerPage: number): number => {
  const textBeforeOffset = content.slice(0, offset);
  const linesBeforeOffset = textBeforeOffset.split('\n').length;
  return Math.max(1, Math.ceil(linesBeforeOffset / linesPerPage));
};

/**
 * Convert page number to character offset
 */
export const pageToOffset = (page: number, content: string, linesPerPage: number): number => {
  const lines = content.split('\n');
  const targetLine = Math.min((page - 1) * linesPerPage, lines.length);
  let offset = 0;
  for (let i = 0; i < targetLine; i++) {
    offset += lines[i].length + 1; // +1 for newline character
  }
  return Math.min(offset, content.length);
};

/**
 * Get text position information
 */
export const getTextPosition = (content: string, offset: number): TextPosition => {
  return {
    offset: Math.min(Math.max(0, offset), content.length),
    total: content.length
  };
};

/**
 * Calculate scroll progress
 */
export const calculateScrollProgress = (element: HTMLElement): number => {
  const { scrollTop, scrollHeight, clientHeight } = element;
  return scrollTop / (scrollHeight - clientHeight);
};

/**
 * Calculate character offset from scroll position
 */
export const scrollToOffset = (
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number,
  contentLength: number
): number => {
  const maxScroll = scrollHeight - clientHeight;
  const scrollProgress = maxScroll > 0 ? scrollTop / maxScroll : 0;
  return Math.round(scrollProgress * contentLength);
};

/**
 * Calculate scroll position from character offset
 */
export const offsetToScroll = (
  offset: number,
  contentLength: number,
  scrollHeight: number,
  clientHeight: number
): number => {
  const progress = offset / contentLength;
  return Math.round(progress * (scrollHeight - clientHeight));
};

/**
 * Load from local storage with type safety
 */
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const stored = localStorage.getItem(key);
  if (!stored) return defaultValue;
  try {
    return JSON.parse(stored) as T;
  } catch {
    return defaultValue;
  }
};

/**
 * Save to local storage
 */
export const saveToStorage = (key: string, value: unknown): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * Formats a timestamp into a readable date string
 * @param timestamp Timestamp in milliseconds
 * @returns Formatted date string
 */
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

export const calculatePageMetrics = (
  width: number,
  height: number,
  fontSize: number,
  content: string
) => {
  const lineHeight = fontSize * 1.5;
  const charsPerLine = Math.floor(width / (fontSize * 0.6)); // Approximate chars per line
  const linesPerPage = Math.floor(height / lineHeight);
  const charsPerPage = charsPerLine * linesPerPage;

  return {
    lineHeight,
    charsPerLine,
    linesPerPage,
    charsPerPage,
    totalPages: Math.ceil(content.length / charsPerPage)
  };
};
