import React, { useRef, useState } from 'react';
import { NovelStorage } from '../lib/storage';
import { Novel } from '../types';
import { LoadingDialog } from './LoadingDialog';

interface AddViewProps {
    onImportComplete: (novel: Novel) => void;
}

export const AddView: React.FC<AddViewProps> = ({
    onImportComplete,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const urlInputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setLoadingMessage(`Opening ${file.name}...`);
        setError(null);

        try {
            const novel = await NovelStorage.importFromFile(file);
            onImportComplete(novel);
        } catch (err) {
            setError('Failed to import file. Please try again.');
            console.error('Import error:', err);
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    const handleUrlImport = async () => {
        const url = urlInputRef.current?.value;
        if (!url) return;

        setIsLoading(true);
        setLoadingMessage('Downloading from URL...');
        setError(null);

        // Create new AbortController for this request
        abortControllerRef.current = new AbortController();

        try {
            const novel = await NovelStorage.importFromUrl(url, abortControllerRef.current.signal);
            onImportComplete(novel);
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                setError('Import cancelled.');
            } else {
                setError('Failed to import from URL. Please check the URL and try again.');
                console.error('Import error:', err);
            }
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
            abortControllerRef.current = null;
        }
    };

    const handleCancel = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };

    return (
        <div className="p-4 max-w-xl mx-auto">
            <div className="space-y-6">
                {/* File Upload Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 dark:text-white">Upload File</h2>
                    <div className="space-y-4">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".txt,.epub"
                            onChange={handleFileUpload}
                            className="block w-full text-sm text-gray-500 dark:text-gray-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                dark:file:bg-blue-900/20 dark:file:text-blue-400
                                hover:file:bg-blue-100 dark:hover:file:bg-blue-900/30"
                        />
                    </div>
                </div>

                {/* URL Import Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 dark:text-white">Import from URL</h2>
                    <div className="space-y-4">
                        <input
                            ref={urlInputRef}
                            type="url"
                            placeholder="Enter URL"
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <button
                            onClick={handleUrlImport}
                            disabled={isLoading}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 
                                disabled:bg-gray-300 disabled:cursor-not-allowed
                                dark:disabled:bg-gray-700"
                        >
                            Import
                        </button>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="text-red-500 dark:text-red-400 text-sm mt-2">
                        {error}
                    </div>
                )}

                {/* Loading Dialog */}
                {isLoading && (
                    <LoadingDialog
                        message={loadingMessage}
                        onCancel={handleCancel}
                    />
                )}
            </div>
        </div>
    );
}; 