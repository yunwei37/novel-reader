import React, { useRef, useState } from 'react';
import { NovelStorage } from '../lib/storage';
import { Novel } from '../types';
import { LoadingDialog } from './LoadingDialog';
import { useTranslation } from '../contexts/LanguageContext';

interface AddViewProps {
    onImportComplete: (novel: Novel) => void;
}

export const AddView: React.FC<AddViewProps> = ({
    onImportComplete,
}) => {
    const { t } = useTranslation();
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
        setLoadingMessage(t('add.loading').replace('{filename}', file.name));
        setError(null);

        try {
            const novel = await NovelStorage.importFromFile(file);
            onImportComplete(novel);
        } catch (err) {
            setError(t('add.error.import'));
            console.error('Import error:', err);
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    const handleUrlImport = async () => {
        const url = urlInputRef.current?.value;
        if (!url) return;

        // Redirect to root with the URL as a query parameter
        const encodedUrl = encodeURIComponent(url);
        window.location.href = `/?add=${encodedUrl}`;
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
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                        {t('add.uploadTitle')}
                    </h2>
                    <div className="space-y-4">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".txt,.epub"
                            onChange={handleFileUpload}
                            className="block w-full text-sm text-gray-500 dark:text-gray-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-lg file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                dark:file:bg-blue-900/20 dark:file:text-blue-400
                                hover:file:bg-blue-100 dark:hover:file:bg-blue-900/30
                                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                    </div>
                </div>

                {/* URL Import Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                        {t('add.urlTitle')}
                    </h2>
                    <div className="space-y-4">
                        <input
                            ref={urlInputRef}
                            type="url"
                            placeholder={t('add.urlPlaceholder')}
                            className="w-full px-4 py-2 rounded-lg 
                                bg-white dark:bg-gray-700 
                                border border-gray-200 dark:border-gray-600 
                                text-gray-900 dark:text-gray-100
                                placeholder-gray-500 dark:placeholder-gray-400
                                focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                        />
                        <button
                            onClick={handleUrlImport}
                            disabled={isLoading}
                            className="w-full px-4 py-2 rounded-lg
                                bg-blue-500 hover:bg-blue-600 
                                text-white font-medium
                                transition-colors
                                disabled:bg-gray-300 dark:disabled:bg-gray-700
                                disabled:text-gray-500 dark:disabled:text-gray-400
                                disabled:cursor-not-allowed"
                        >
                            {t('add.import')}
                        </button>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="text-red-500 dark:text-red-400 text-sm mt-2 px-2">
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