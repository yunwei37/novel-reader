'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Header } from './components/Header';
import { Reader } from './components/Reader';
import { Sidebar } from './components/Sidebar';

export default function Home() {
  // State management
  const [content, setContent] = useState<string>('');
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    // Check localStorage first
    const savedDarkMode = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Determine initial dark mode state
    const shouldBeDark = savedDarkMode
      ? savedDarkMode === 'true'
      : systemPrefersDark;

    // Update state and DOM
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Handle dark mode toggle
  const handleDarkModeToggle = useCallback(() => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      if (newValue) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('darkMode', newValue.toString());
      return newValue;
    });
  }, []);

  // Handle window resize
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  // Determine if we should show the mobile layout
  const isMobile = windowWidth < 768;

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="h-full flex flex-col p-2">
        {/* Header */}
        <div className="h-14">
          <Header
            onDarkModeToggle={handleDarkModeToggle}
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
          />
        </div>

        {/* Main content area */}
        <div className="flex-1 min-h-0 mt-2">
          {!content ? (
            <div className="h-full flex items-center justify-center">
              {/* File upload UI */}
              <div className="
                w-full max-w-2xl p-12 text-center
                bg-white dark:bg-gray-800 
                border-4 border-dashed border-gray-200 dark:border-gray-700
                rounded-lg shadow-sm
              ">
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
                    className="
                      px-6 py-3 rounded-lg shadow-sm
                      bg-gray-100 dark:bg-gray-700
                      hover:bg-gray-200 dark:hover:bg-gray-600
                      text-gray-700 dark:text-gray-100
                      transition-colors
                    "
                  >
                    Choose TXT File
                  </button>
                  <p className="text-gray-500 dark:text-gray-400">
                    or drag and drop your .txt file here
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex relative">
              {/* Sidebar - always in overlay mode */}
              <div className={`
                fixed inset-y-0 left-2 w-64 transform transition-transform duration-300 ease-in-out z-40
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              `}>
                <div className="h-[calc(100vh-4rem)] mt-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                  <Sidebar
                    currentPosition={currentOffset}
                    onBookmarkSelect={(offset) => {
                      setCurrentOffset(offset);
                      setIsSidebarOpen(false);
                    }}
                  />
                </div>
              </div>

              {/* Reader container */}
              <div className="flex-1 min-w-0 h-full">
                <Reader
                  content={content}
                  currentOffset={currentOffset}
                  onPositionChange={setCurrentOffset}
                  defaultFontSize={16}
                  defaultIsPaged={false}
                />
              </div>

              {/* Sidebar overlay */}
              {isSidebarOpen && (
                <div
                  className="fixed inset-0 bg-black/50 dark:bg-black/70 z-30"
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
