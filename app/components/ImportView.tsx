import React, { useRef, useState } from 'react';
import { NovelStorage } from '../lib/storage';
import { Novel } from '../types';

interface ImportViewProps {
    onImportComplete: (novel: Novel) => void;
}

export const ImportView: React.FC<ImportViewProps> = ({
    onImportComplete,
}) => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUrlImport = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const novel = await NovelStorage.importFromUrl(url);
            onImportComplete(novel);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to import novel');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsLoading(true);
            setError(null);

            const content = await file.text();
            const novel: Novel = {
                id: crypto.randomUUID(),
                title: file.name.replace(/\.[^/.]+$/, ''),
                source: 'local',
                filepath: file.name,
                lastRead: Date.now(),
                lastPosition: 0,
            };

            await NovelStorage.saveNovel(novel, content);
            onImportComplete(novel);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to import file');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 p-4 overflow-auto">
            <div className="max-w-lg mx-auto">
                {/* File Import */}
                <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
                        Import from File
                    </h3>
                    <input
                        type="file"
                        accept=".txt,.epub"
                        onChange={handleFileImport}
                        className="hidden"
                        ref={fileInputRef}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="
                            w-full px-4 py-6 rounded-lg
                            border-2 border-dashed border-gray-300 dark:border-gray-600
                            hover:border-gray-400 dark:hover:border-gray-500
                            text-gray-600 dark:text-gray-300
                            transition-colors
                        "
                        disabled={isLoading}
                    >
                        Choose File or Drag & Drop
                    </button>
                </div>

                {/* URL Import */}
                <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
                        Import from URL
                    </h3>
                    <div className="flex flex-col gap-3">
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Enter URL to TXT file"
                            className="
                                w-full px-4 py-3 rounded-lg
                                bg-gray-50 dark:bg-gray-700
                                border border-gray-300 dark:border-gray-600
                                focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                                text-gray-900 dark:text-gray-100
                                placeholder-gray-500 dark:placeholder-gray-400
                            "
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleUrlImport}
                            disabled={!url || isLoading}
                            className="
                                w-full px-4 py-3 rounded-lg
                                bg-blue-500 hover:bg-blue-600
                                disabled:bg-gray-300 dark:disabled:bg-gray-600
                                text-white
                                transition-colors
                            "
                        >
                            Import
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}; 