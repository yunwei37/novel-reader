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
import { TTSReader } from './TTSReader';
import { SoundIcon } from './icons';

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
  showMenu?: boolean;
  onMenuClose?: () => void;
  isTTSMode?: boolean;
  onTTSToggle?: () => void;
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
  showMenu = false,
  onMenuClose = () => {},
  isTTSMode = false,
  onTTSToggle = () => {},
}) => {
  const [config, setConfig] = useState<ReaderConfig>({
    ...DEFAULT_CONFIG,
    ...defaultConfig,
  });

  const updateConfig = (updates: Partial<ReaderConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Reader Content */}
      <div className="flex-1 min-h-0">
        {isTTSMode ? (
          <TTSReader
            content={content}
            currentOffset={currentOffset}
            onPositionChange={onPositionChange}
            fontSize={config.fontSize}
          />
        ) : config.isPaged ? (
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
        onClose={onMenuClose}
        config={config}
        onConfigChange={updateConfig}
        content={content}
        currentPosition={currentOffset}
        onPositionChange={onPositionChange}
      />
    </div>
  );
};
