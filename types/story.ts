export interface Character {
  id: string;
  name: string;
  description: string;
}

export interface Story {
  id: string;
  userId: string;
  title: string;
  content: string;
  genre: string;
  characters: Character[];
  language: string;
  readingTime: number;
  createdAt: string;
}