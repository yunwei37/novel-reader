/**
 * Reader Component
 * 
 * A versatile text reader component that handles content display and navigation.
 * Supports both paged and scroll modes with position tracking.
 */

import React, { useState } from 'react';
import { PagedReader } from './PagedReader';
import { ScrollReader } from './ScrollReader';
import { ReaderMenu } from './reader/ReaderMenu';

interface ReaderConfig {
  fontSize: number;
  isPaged: boolean;
  charsPerPage: number;
}

interface ReaderProps {
  content: string;
  currentOffset: number;
  onPositionChange: (offset: number) => void;
  defaultConfig?: Partial<ReaderConfig>;
}

const DEFAULT_CONFIG: ReaderConfig = {
  fontSize: 16,
  isPaged: false,
  charsPerPage: 500,
};

export const Reader: React.FC<ReaderProps> = ({
  content,
  currentOffset,
  onPositionChange,
  defaultConfig = {},
}) => {
  const [config, setConfig] = useState<ReaderConfig>({
    ...DEFAULT_CONFIG,
    ...defaultConfig,
  });

  const updateConfig = (updates: Partial<ReaderConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="h-full flex flex-col">
      {/* Menu Button */}
      <div className="sticky top-0 z-20">
        <button
          onClick={() => setShowMenu(true)}
          className="absolute top-2 right-2 p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm
            hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Reader Content */}
      <div className="flex-1 min-h-0">
        {config.isPaged ? (
          <PagedReader
            content={content}
            currentOffset={currentOffset}
            onPositionChange={onPositionChange}
            fontSize={config.fontSize}
            charsPerPage={config.charsPerPage}
          />
        ) : (
          <ScrollReader
            content={content}
            currentOffset={currentOffset}
            onPositionChange={onPositionChange}
            fontSize={config.fontSize}
          />
        )}
      </div>

      {/* Menu */}
      <ReaderMenu
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        config={config}
        onConfigChange={updateConfig}
        content={content}
        currentPosition={currentOffset}
        onPositionChange={onPositionChange}
      />
    </div>
  );
};
