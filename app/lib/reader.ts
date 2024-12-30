/**
 * Utility functions for the Novel Reader application
 */

import { Chapter } from '../types';

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

  lines.forEach((line, index) => {
    if (chapterPattern.test(line.trim())) {
      if (currentChapterTitle) {
        chapters.push({
          title: currentChapterTitle,
          content: currentChapterContent,
          startIndex
        });
        currentChapterContent = '';
      }
      currentChapterTitle = line.trim();
      startIndex = index;
    } else {
      currentChapterContent += line + '\n';
    }
  });

  if (currentChapterTitle) {
    chapters.push({
      title: currentChapterTitle,
      content: currentChapterContent,
      startIndex
    });
  }

  return chapters.length > 0 ? chapters : [{
    title: 'Full Text',
    content: text,
    startIndex: 0
  }];
};

/**
 * Calculates the number of lines that can fit in the container
 * @param containerHeight Height of the container
 * @param fontSize Current font size
 * @returns Number of lines that can fit
 */
export const calculateLinesPerPage = (
  containerHeight: number,
  fontSize: number
): number => {
  // Using 1.5 line height and accounting for container padding
  const lineHeight = fontSize * 1.5;
  const availableHeight = containerHeight - 100; // Account for padding and margins
  return Math.floor(availableHeight / lineHeight);
};

/**
 * Calculates the total number of pages for the content
 * @param content Text content
 * @param linesPerPage Number of lines per page
 * @returns Total number of pages
 */
export const calculateTotalPages = (
  content: string,
  linesPerPage: number
): number => {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  return Math.max(1, Math.ceil(lines.length / linesPerPage));
};

/**
 * Gets the content for a specific page
 * @param content Full text content
 * @param currentPage Current page number
 * @param linesPerPage Number of lines per page
 * @returns Content for the specified page
 */
export const getPageContent = (
  content: string,
  currentPage: number,
  linesPerPage: number
): string => {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const start = (currentPage - 1) * linesPerPage;
  const end = start + linesPerPage;
  return lines.slice(start, end).join('\n');
};

/**
 * Gets chunked content for scroll mode
 * @param content Full text content
 * @param currentChunk Current chunk index
 * @param chunkSize Size of each chunk
 * @returns Chunked content
 */
export const getChunkedContent = (
  content: string,
  currentChunk: number,
  chunkSize: number
): string => {
  const start = currentChunk * chunkSize;
  const end = Math.min(start + chunkSize * 3, content.length);
  return content.slice(start, end);
};

/**
 * Calculates scroll progress
 * @param container Container element
 * @returns Progress value between 0 and 1
 */
export const calculateScrollProgress = (
  container: HTMLElement
): number => {
  const progress = container.scrollTop / (container.scrollHeight - container.clientHeight);
  return Math.min(1, Math.max(0, progress));
};

/**
 * Formats a timestamp into a readable date string
 * @param timestamp Timestamp in milliseconds
 * @returns Formatted date string
 */
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

/**
 * Saves data to localStorage
 * @param key Storage key
 * @param data Data to store
 */
export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
  }
};

/**
 * Loads data from localStorage
 * @param key Storage key
 * @param defaultValue Default value if key doesn't exist
 * @returns Stored data or default value
 */
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error loading from localStorage: ${error}`);
    return defaultValue;
  }
};
