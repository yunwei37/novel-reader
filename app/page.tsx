'use client';

import { useState, useRef, useEffect } from 'react';
import { useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Reader } from './components/Reader';
import { ReaderConfig } from './types';
import { loadFromStorage, saveToStorage } from './lib/reader';

// Default configuration
const DEFAULT_CONFIG: ReaderConfig = {
  isDarkMode: false,
};

export default function Home() {
  // State management
  const [content, setContent] = useState<string>('');
  const [config, setConfig] = useState<ReaderConfig>(DEFAULT_CONFIG);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load preferences from localStorage on client side
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    // Load saved config
    const savedConfig = loadFromStorage('readerConfig', DEFAULT_CONFIG);
    setConfig(savedConfig);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    saveToStorage('readerConfig', config);
  }, [config]);

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
      setContent(text);
      setCurrentOffset(0);
    };
    reader.readAsText(file);
  }, []);

  const scrollToTop = () => {
    setCurrentOffset(0);
  };

  // Determine if we should show the mobile layout
  const isMobile = windowWidth < 768;

  return (
    <div className={`min-h-screen transition-colors ${config.isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto p-4 min-h-screen">
        <div className="sticky top-0 z-50 bg-inherit pb-4">
          <Header
            isDarkMode={config.isDarkMode}
            onDarkModeToggle={() => setConfig(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }))}
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
            isMobile={isMobile}
          />
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
                  currentPosition={currentOffset}
                  onBookmarkSelect={(offset) => {
                    setCurrentOffset(offset);
                    if (isMobile) setIsSidebarOpen(false);
                  }}
                  isDarkMode={config.isDarkMode}
                />
              </div>
            </div>
            
            <Reader
              content={content}
              currentOffset={currentOffset}
              onPositionChange={setCurrentOffset}
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
