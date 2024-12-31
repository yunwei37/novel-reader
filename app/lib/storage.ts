import { Novel } from '../types';

export class NovelStorage {
    private static NOVELS_KEY = 'novels';
    private static CONTENT_PREFIX = 'novel_content_';

    static async saveNovel(novel: Novel, content: string) {
        // Save novel metadata
        const novels = this.getAllNovels();
        novels.push(novel);
        localStorage.setItem(this.NOVELS_KEY, JSON.stringify(novels));

        // Save content in chunks to handle large files
        const chunkSize = 512 * 1024; // 512KB chunks
        for (let i = 0; i < content.length; i += chunkSize) {
            const chunk = content.slice(i, i + chunkSize);
            localStorage.setItem(
                `${this.CONTENT_PREFIX}${novel.id}_${i}`,
                chunk
            );
        }
    }

    static getAllNovels(): Novel[] {
        const novels = localStorage.getItem(this.NOVELS_KEY);
        return novels ? JSON.parse(novels) : [];
    }

    static async getNovelContent(novelId: string): Promise<string> {
        let content = '';
        let chunk;
        let i = 0;

        while (chunk = localStorage.getItem(`${this.CONTENT_PREFIX}${novelId}_${i}`)) {
            content += chunk;
            i += 512 * 1024;
        }

        return content;
    }

    static async updateNovelProgress(novelId: string, position: number) {
        const novels = this.getAllNovels();
        const novel = novels.find(n => n.id === novelId);
        if (novel) {
            novel.lastPosition = position;
            novel.lastRead = Date.now();
            localStorage.setItem(this.NOVELS_KEY, JSON.stringify(novels));
        }
    }

    static async deleteNovel(novelId: string) {
        // Remove novel metadata
        const novels = this.getAllNovels().filter(n => n.id !== novelId);
        localStorage.setItem(this.NOVELS_KEY, JSON.stringify(novels));

        // Remove content chunks
        let i = 0;
        while (localStorage.getItem(`${this.CONTENT_PREFIX}${novelId}_${i}`)) {
            localStorage.removeItem(`${this.CONTENT_PREFIX}${novelId}_${i}`);
            i += 512 * 1024;
        }
    }

    static async importFromUrl(url: string): Promise<Novel> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch novel content');
        }

        const content = await response.text();
        const filename = url.split('/').pop() || 'Unknown';
        const novel: Novel = {
            id: crypto.randomUUID(),
            title: filename.replace(/\.[^/.]+$/, ''),
            source: 'url',
            url,
            lastRead: Date.now(),
            lastPosition: 0,
        };

        await this.saveNovel(novel, content);
        return novel;
    }
} 