export interface Board {
  id: string;
  title: string;
  background: string;
  lists: List[];
  isStarred: boolean;
  isClosed: boolean;
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
  background?: string;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  isWatching?: boolean;
  createdAt: number;
  activities: Activity[];
  comments?: Comment[];
}

export interface Activity {
  id: string;
  type: 'add' | 'move' | 'complete' | 'description';
  data: Record<string, string>;
  createdAt: number;
  userId: string;
  userName: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: number;
  updatedAt?: number;
}
