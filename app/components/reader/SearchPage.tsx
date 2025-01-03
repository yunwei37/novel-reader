import React, { useCallback, useState } from 'react';

interface SearchResult {
    text: string;
    index: number;
}

interface SearchPageProps {
    content: string;
    onPositionChange: (position: number) => void;
    onBack: () => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
    content,
    onPositionChange,
    onBack,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);

    const handleSearch = useCallback(() => {
        if (!searchQuery.trim() || !content) return;

        const searchResults: SearchResult[] = [];
        const query = searchQuery.toLowerCase();
        let index = 0;

        while (index < content.length) {
            const foundIndex = content.toLowerCase().indexOf(query, index);
            if (foundIndex === -1) break;

            // Get surrounding context (50 chars before and after)
            const start = Math.max(0, foundIndex - 50);
            const end = Math.min(content.length, foundIndex + query.length + 50);
            const context = content.slice(start, end);

            searchResults.push({
                text: context,
                index: foundIndex,
            });

            index = foundIndex + 1;
        }

        setResults(searchResults);
    }, [searchQuery, content]);

    const handleResultClick = (index: number) => {
        onPositionChange(index);
    };

    return (
        <div className="space-y-6">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
            </button>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Search</h2>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Enter search term..."
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSearch}
                    className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                >
                    Search
                </button>
            </div>

            <div className="space-y-2">
                {results.map((result, index) => {
                    const queryStart = result.text.toLowerCase().indexOf(searchQuery.toLowerCase());
                    const before = result.text.slice(0, queryStart);
                    const match = result.text.slice(queryStart, queryStart + searchQuery.length);
                    const after = result.text.slice(queryStart + searchQuery.length);

                    return (
                        <button
                            key={index}
                            onClick={() => handleResultClick(result.index)}
                            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-left"
                        >
                            <p className="text-sm text-gray-900 dark:text-gray-100">
                                {before}
                                <span className="bg-yellow-200 dark:bg-yellow-900 font-medium">
                                    {match}
                                </span>
                                {after}
                            </p>
                        </button>
                    );
                })}
                {searchQuery && results.length === 0 && (
                    <p className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                        No results found
                    </p>
                )}
            </div>
        </div>
    );
}; 