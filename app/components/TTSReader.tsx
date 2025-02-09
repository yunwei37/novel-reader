import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { ScrollProgress } from './reader/ScrollProgress';
import { TTSConfig } from './reader/TTSConfig';
import { TTSManager } from '../lib/TTSManager';

interface TTSReaderProps {
    content: string;
    currentOffset: number;
    onPositionChange: (offset: number) => void;
    fontSize: number;
}

const LINES_PER_CHUNK = 2;
const DEFAULT_RATE = 1;

export const TTSReader: React.FC<TTSReaderProps> = ({
    content,
    currentOffset,
    onPositionChange,
    fontSize,
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(currentOffset);
    const [rate, setRate] = useState(DEFAULT_RATE);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const ttsManager = useRef(new TTSManager());

    // Split content into chunks
    const chunks = useMemo(() => {
        const lines = content.split(/\n+/);
        const result: string[] = [];
        
        for (let i = 0; i < lines.length; i += LINES_PER_CHUNK) {
            const chunk = lines.slice(i, i + LINES_PER_CHUNK).join('\n');
            if (chunk.trim()) {
                result.push(chunk);
            }
        }
        return result;
    }, [content]);

    // Find current chunk based on position
    const currentChunkIndex = useMemo(() => {
        let totalLength = 0;
        for (let i = 0; i < chunks.length; i++) {
            totalLength += chunks[i].length;
            if (currentPosition <= totalLength) {
                return i;
            }
        }
        return chunks.length - 1;
    }, [chunks, currentPosition]);

    // Calculate start offset for current chunk
    const getChunkStartOffset = useCallback((index: number) => {
        return chunks.slice(0, index).reduce((acc, chunk) => acc + chunk.length, 0);
    }, [chunks]);

    const playChunk = useCallback((chunkIndex: number) => {
        if (!selectedVoice || chunkIndex >= chunks.length) return;

        const chunk = chunks[chunkIndex];
        const startOffset = getChunkStartOffset(chunkIndex);

        ttsManager.current.speak(
            chunk,
            selectedVoice,
            rate,
            startOffset,
            {
                onBoundary: (position) => {
                    setCurrentPosition(position);
                    onPositionChange(position);
                },
                onEnd: () => {
                    if (chunkIndex < chunks.length - 1) {
                        playChunk(chunkIndex + 1);
                    } else {
                        setIsPlaying(false);
                    }
                },
                onStart: () => setIsPlaying(true),
                onError: () => setIsPlaying(false)
            }
        );
    }, [chunks, selectedVoice, rate, onPositionChange, getChunkStartOffset]);

    const togglePlayback = useCallback(() => {
        if (isPlaying) {
            ttsManager.current.stop();
            setIsPlaying(false);
        } else {
            playChunk(currentChunkIndex);
        }
    }, [isPlaying, currentChunkIndex, playChunk]);

    // Voice initialization
    useEffect(() => {
        const handleVoicesChanged = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length && !selectedVoice) {
                setSelectedVoice(voices[0]);
            }
        };

        window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
        handleVoicesChanged();

        return () => {
            window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        };
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const currentChunk = chunks[currentChunkIndex] || '';
    const progress = (currentPosition / content.length) * 100;
    const chunkProgress = ((currentChunkIndex + 1) / chunks.length) * 100;

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-800">
            {/* Progress indicators */}
            <div className="px-4 py-2 border-b dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400 flex justify-between items-center">
                    <span>Section {currentChunkIndex + 1} of {chunks.length}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="mt-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${chunkProgress}%` }}
                    />
                </div>
            </div>

            {/* Content area with current chunk and configuration panel */}
            <div className="flex-1 overflow-hidden flex">
                {/* Current chunk (highlighted) */}
                <div className="w-1/2 p-6 border-r dark:border-gray-700">
                    <div className="h-full flex items-center justify-center">
                        <div className="max-w-xl w-full">
                            <p
                                className="whitespace-pre-line text-center font-sans leading-relaxed 
                                          text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-gray-700/50 
                                          p-4 rounded-lg"
                                style={{ fontSize: `${fontSize}px` }}
                            >
                                {currentChunk}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Configuration panel */}
                <div className="w-1/2 p-6 overflow-y-auto border-l dark:border-gray-700">
                    <TTSConfig
                        rate={rate}
                        onRateChange={setRate}
                        selectedVoice={selectedVoice}
                        onVoiceChange={setSelectedVoice}
                        voices={window.speechSynthesis.getVoices()}
                    />
                </div>
            </div>

            {/* Playback controls */}
            <div className="p-4 border-t dark:border-gray-700">
                <div className="max-w-xl mx-auto">
                    <button
                        onClick={togglePlayback}
                        className="w-full py-4 px-6 rounded-lg bg-blue-500 hover:bg-blue-600 
                               text-white font-semibold text-lg transition-colors
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                               dark:focus:ring-offset-gray-800"
                    >
                        {isPlaying ? 'Stop' : 'Start Reading'}
                    </button>
                    <div className="mt-4">
                        <ScrollProgress progress={progress.toFixed(2)} />
                    </div>
                </div>
            </div>
        </div>
    );
}; 