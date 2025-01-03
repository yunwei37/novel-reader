'use client';

import { useCallback, useEffect, useState } from 'react';
import { AddView } from './components/AddView';
import { Header } from './components/Header';
import { LibraryView } from './components/library/LibraryView';
import { Reader } from './components/Reader';
import { SettingsView } from './components/SettingsView';
import { NovelStorage } from './lib/storage';
import { Novel } from './types';

type View = 'library' | 'reader' | 'settings' | 'add';

export default function Home() {
  // State management
  const [currentView, setCurrentView] = useState<View>('library');
  const [currentNovel, setCurrentNovel] = useState<Novel | null>(null);
  const [content, setContent] = useState<string>('');
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Handle URL query parameters for auto-import
  useEffect(() => {
    const handleUrlImport = async (url: string) => {
      try {
        const novel = await NovelStorage.importFromUrl(url);
        handleNovelSelect(novel);
      } catch (err) {
        console.error('Failed to import novel from URL:', err);
      }
    };

    const params = new URLSearchParams(window.location.search);
    const addUrl = params.get('add');
    if (addUrl) {
      handleUrlImport(addUrl);
      // Clear the URL parameter after import attempt
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedDarkMode ? savedDarkMode === 'true' : systemPrefersDark;
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

  const handleNovelSelect = useCallback(async (novel: Novel) => {
    const content = await NovelStorage.getNovelContent(novel.id);
    setCurrentNovel(novel);
    setContent(content);
    setCurrentOffset(novel.lastPosition);
    setCurrentView('reader');
  }, []);

  const handlePositionChange = useCallback((offset: number) => {
    setCurrentOffset(offset);
    if (currentNovel) {
      NovelStorage.updateNovelProgress(currentNovel.id, offset);
    }
  }, [currentNovel]);

  const handleBackToLibrary = useCallback(() => {
    setCurrentNovel(null);
    setContent('');
    setCurrentOffset(0);
    setCurrentView('library');
  }, []);

  // Get the current view title
  const getViewTitle = () => {
    switch (currentView) {
      case 'reader':
        return currentNovel?.title || 'Reading';
      case 'settings':
        return 'Settings';
      case 'add':
        return 'Add Novel';
      default:
        return 'Novel Reader';
    }
  };

  // Get back action for current view
  const getBackAction = () => {
    if (currentView === 'library') return undefined;
    return handleBackToLibrary;
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="h-full flex flex-col">
        {/* Header */}
        <Header
          title={getViewTitle()}
          onSettingsClick={currentView === 'library' ? () => setCurrentView('settings') : undefined}
          onBackClick={getBackAction()}
        />

        {/* Main content area */}
        <div className="flex-1 min-h-0">
          {currentView === 'library' && (
            <LibraryView
              onNovelSelect={handleNovelSelect}
              onImportClick={() => setCurrentView('add')}
            />
          )}

          {currentView === 'reader' && currentNovel && (
            <div className="h-full flex relative">
              <div className="flex-1 min-w-0 h-full">
                <Reader
                  content={content}
                  currentOffset={currentOffset}
                  onPositionChange={handlePositionChange}
                  defaultConfig={{
                    fontSize: 16,
                    isPaged: false,
                  }}
                />
              </div>
            </div>
          )}

          {currentView === 'settings' && (
            <SettingsView
              isDarkMode={isDarkMode}
              onDarkModeToggle={handleDarkModeToggle}
            />
          )}

          {currentView === 'add' && (
            <AddView
              onImportComplete={(novel: Novel) => {
                handleNovelSelect(novel);
                setCurrentView('reader');
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
