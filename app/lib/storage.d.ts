import { Novel } from '../types';

export declare class NovelStorage {
    static saveNovel(novel: Novel, content: string): Promise<void>;
    static getAllNovels(): Novel[];
    static getNovelContent(novelId: string): Promise<string>;
    static updateNovelProgress(novelId: string, position: number): Promise<void>;
    static deleteNovel(novelId: string): Promise<void>;
    static importFromUrl(url: string): Promise<Novel>;
} 