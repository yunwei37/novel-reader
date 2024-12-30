'use client';

import { useState, useRef, useEffect } from 'react';
import { useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { Sidebar } from './components/Sidebar';
import { Reader } from './components/Reader';
import { Chapter, Bookmark, ReaderConfig } from './types';
import { detectChapters, loadFromStorage, saveToStorage, getPageContent, getChunkedContent, calculateLinesPerPage, calculateTotalPages } from './lib/reader';

// Default configuration
const DEFAULT_CONFIG: ReaderConfig = {
  isPaged: false,
  fontSize: 16,
  isDarkMode: false,
  chunkSize: 50000,
};

export default function Home() {
  // State management
  const [content, setContent] = useState<string>('');
  const [displayContent, setDisplayContent] = useState<string>('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [config, setConfig] = useState<ReaderConfig>(DEFAULT_CONFIG);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fullContentRef = useRef<string>('');

  // Load preferences from localStorage on client side
  useEffect(() => {
    // Set window width
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    // Load saved config
    const savedConfig = loadFromStorage('readerConfig', DEFAULT_CONFIG);
    setConfig(savedConfig);

    // Load saved bookmarks
    const savedBookmarks = loadFromStorage<Bookmark[]>('bookmarks', []);
    setBookmarks(savedBookmarks);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    saveToStorage('readerConfig', config);
    saveToStorage('bookmarks', bookmarks);
  }, [config, bookmarks]);

  // Content chunking and page calculation
  useEffect(() => {
    if (!fullContentRef.current || !chapters[currentChapter]) return;

    const currentContent = chapters[currentChapter].content;
    if (config.isPaged) {
      const linesPerPage = calculateLinesPerPage(window.innerHeight, config.fontSize);
      setTotalPages(calculateTotalPages(currentContent, linesPerPage));
      const content = getPageContent(currentContent, currentPage, linesPerPage);
      setDisplayContent(content);
    } else {
      const content = getChunkedContent(currentContent, currentChunk, config.chunkSize);
      setDisplayContent(content);
    }
  }, [currentChunk, config.isPaged, currentPage, config.fontSize, currentChapter, chapters]);

  // Handle window resize for page recalculation
  useEffect(() => {
    const handleResize = () => {
      if (config.isPaged && chapters[currentChapter]) {
        const linesPerPage = calculateLinesPerPage(window.innerHeight, config.fontSize);
        setTotalPages(calculateTotalPages(chapters[currentChapter].content, linesPerPage));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [config.isPaged, config.fontSize, currentChapter, chapters]);

  // Handle scroll events for "Go to top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      fullContentRef.current = text;
      setContent(text);
      setCurrentChunk(0);
      setCurrentPage(1);
      const detectedChapters = detectChapters(text);
      setChapters(detectedChapters);
      setCurrentChapter(0);
      setSearchQuery('');
      setSearchResults([]);
      setCurrentSearchIndex(-1);
    };
    reader.readAsText(file);
  }, []);

  const handleSearch = useCallback(() => {
    if (!searchQuery || !fullContentRef.current) return;

    const results: number[] = [];
    let position = -1;
    const lowerContent = fullContentRef.current.toLowerCase();
    const lowerQuery = searchQuery.toLowerCase();

    while ((position = lowerContent.indexOf(lowerQuery, position + 1)) !== -1) {
      results.push(position);
    }

    setSearchResults(results);
    setCurrentSearchIndex(results.length > 0 ? 0 : -1);

    if (results.length > 0) {
      if (config.isPaged) {
        const linesBeforeResult = fullContentRef.current
          .slice(0, results[0])
          .split('\n').length;
        const linesPerPage = calculateLinesPerPage(window.innerHeight, config.fontSize);
        const targetPage = Math.floor(linesBeforeResult / linesPerPage) + 1;
        setCurrentPage(targetPage);
      } else {
        const element = document.createElement('div');
        element.innerHTML = fullContentRef.current;
        const position = results[0];
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [searchQuery, config.isPaged, config.fontSize]);

  const addBookmark = useCallback(() => {
    const position = config.isPaged ? currentPage : window.scrollY;
    const bookmark: Bookmark = {
      position,
      chapter: currentChapter,
      timestamp: Date.now()
    };
    setBookmarks(prev => [...prev, bookmark]);
  }, [currentChapter, currentPage, config.isPaged]);

  const scrollToTop = () => {
    if (config.isPaged) {
      setCurrentPage(1);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const togglePageMode = () => {
    setConfig(prev => ({
      ...prev,
      isPaged: !prev.isPaged
    }));
    setCurrentPage(1);
    setCurrentChunk(0);
  };

  // Determine if we should show the mobile layout
  const isMobile = windowWidth < 768;

  return (
    <div className={`min-h-screen transition-colors ${config.isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto p-4 min-h-screen">
        <div className="sticky top-0 z-50 bg-inherit pb-4">
          <Header
            isDarkMode={config.isDarkMode}
            fontSize={config.fontSize}
            onDarkModeToggle={() => setConfig(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }))}
            onFontSizeChange={(size) => setConfig(prev => ({ ...prev, fontSize: size }))}
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
            isMobile={isMobile}
          />

          <div className="flex justify-between items-center mt-4 gap-4 flex-wrap">
            <button
              onClick={togglePageMode}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md"
            >
              {config.isPaged ? 'Switch to Scroll Mode' : 'Switch to Page Mode'}
            </button>

            {content && (
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearch={handleSearch}
                onBookmark={addBookmark}
                isDarkMode={config.isDarkMode}
              />
            )}
          </div>
        </div>

        {!content && (
          <div className="mt-8 border-4 border-dashed border-gray-300 rounded-lg p-12 text-center bg-white dark:bg-gray-800 shadow-lg">
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="hidden"
              ref={fileInputRef}
            />
            <div className="flex flex-col items-center gap-4">
              <div className="text-4xl mb-4">📚</div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
              >
                Choose TXT File
              </button>
              <p className="text-gray-500 dark:text-gray-400">or drag and drop your .txt file here</p>
            </div>
          </div>
        )}

        {content && (
          <div className={`
            mt-8 flex gap-6
            ${isMobile ? 'relative' : 'flex-row'}
          `}>
            <div className={`
              ${isMobile
                ? `fixed inset-y-0 left-0 w-64 transform transition-transform duration-300 ease-in-out z-40
                   ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
                : 'w-72 flex-shrink-0'
              }
            `}>
              <div className={`
                sticky top-[180px] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6
                ${isMobile ? 'h-full' : ''}
              `}>
                <Sidebar
                  chapters={chapters}
                  bookmarks={bookmarks}
                  currentChapter={currentChapter}
                  onChapterSelect={(index) => {
                    setCurrentChapter(index);
                    if (isMobile) setIsSidebarOpen(false);
                  }}
                  onBookmarkSelect={(position, chapter) => {
                    if (config.isPaged) {
                      setCurrentPage(position as number);
                    } else {
                      window.scrollTo({ top: position, behavior: 'smooth' });
                    }
                    setCurrentChapter(chapter);
                    if (isMobile) setIsSidebarOpen(false);
                  }}
                  isDarkMode={config.isDarkMode}
                />
              </div>
            </div>
            
            <Reader
              content={chapters[currentChapter]?.content || ''}
              displayContent={displayContent}
              fontSize={config.fontSize}
              isPaged={config.isPaged}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onScroll={() => {
                if (!config.isPaged) {
                  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
                  const progress = scrollTop / (scrollHeight - clientHeight);
                  const totalChunks = Math.ceil(fullContentRef.current.length / config.chunkSize);
                  const newChunk = Math.floor(progress * totalChunks);
                  if (newChunk !== currentChunk) {
                    setCurrentChunk(newChunk);
                  }
                }
              }}
              isDarkMode={config.isDarkMode}
            />
          </div>
        )}

        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
            aria-label="Scroll to top"
          >
            ↑
          </button>
        )}

        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
