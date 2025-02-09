import { Novel, Chapter } from '../types';
import { LocalRepo } from '../types/repo';

export declare class NovelStorage {
    static saveNovel(novel: Novel, content: string): Promise<void>;
    static getAllNovels(): Promise<Novel[]>;
    static getNovelContent(novelId: string): Promise<string>;
    static updateNovelProgress(novelId: string, position: number): Promise<void>;
    static deleteNovel(novelId: string): Promise<void>;
    static importFromUrl(url: string): Promise<Novel>;
    static updateNovelChapters(novelId: string, chapters: Chapter[]): Promise<void>;
    static saveRepository(repo: LocalRepo): Promise<void>;
    static getAllRepositories(): Promise<LocalRepo[]>;
    static deleteRepository(url: string): Promise<void>;
} 