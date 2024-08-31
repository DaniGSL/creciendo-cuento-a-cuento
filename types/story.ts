// types/story.ts
export interface Story {
    id: string;
    userId: string;
    title: string;
    content: string;
    genre: string;
    characters: string[];
    language: string;
    readingTime: number;
    createdAt: string;
  }
  