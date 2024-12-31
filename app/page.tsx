'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Header } from './components/Header';
import { Reader } from './components/Reader';
import { Sidebar } from './components/Sidebar';
import { loadFromStorage, saveToStorage } from './lib/reader';
import { ReaderConfig } from './types';

// Default configuration
const DEFAULT_CONFIG: ReaderConfig = {
  isDarkMode: false,
};

export default function Home() {
  // State management
  const [content, setContent] = useState<string>('');
  const [config, setConfig] = useState<ReaderConfig>(DEFAULT_CONFIG);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load preferences and handle window resize
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

  // Determine if we should show the mobile layout
  const isMobile = windowWidth < 768;

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      <div className="h-full flex flex-col p-2">
        {/* Header - fixed height */}
        <div className="h-14 bg-inherit">
          <Header
            isDarkMode={config.isDarkMode}
            onDarkModeToggle={() => setConfig(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }))}
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
            isMobile={isMobile}
          />
        </div>

        {/* Main content area - takes remaining height */}
        <div className="flex-1 min-h-0 mt-2">
          {!content ? (
            <div className="h-full flex items-center justify-center">
              {/* File upload UI */}
              <div className="w-full max-w-2xl border-4 border-dashed border-gray-300 rounded-lg p-12 text-center bg-white dark:bg-gray-800 shadow-lg">
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
            </div>
          ) : (
            <div className="h-full flex relative">
              {/* Sidebar */}
              <div className={`
                fixed inset-y-0 left-2 w-64 transform transition-transform duration-300 ease-in-out z-40
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              `}>
                <div className="h-[calc(100vh-4rem)] mt-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                  <Sidebar
                    currentPosition={currentOffset}
                    onBookmarkSelect={(offset) => {
                      setCurrentOffset(offset);
                      setIsSidebarOpen(false);
                    }}
                    isDarkMode={config.isDarkMode}
                  />
                </div>
              </div>

              {/* Reader container */}
              <div className="flex-1 min-w-0 h-full">
                <Reader
                  content={content}
                  currentOffset={currentOffset}
                  onPositionChange={setCurrentOffset}
                  isDarkMode={config.isDarkMode}
                  defaultFontSize={16}
                  defaultIsPaged={false}
                />
              </div>

              {/* Sidebar overlay */}
              {isSidebarOpen && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-30"
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
