export interface Activity {
  id: string;
  type: 'add' | 'move' | 'complete' | 'description' | 'title';
  data: {
    from?: string;
    to?: string;
    value?: string;
  };
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

export interface Card {
  id: string;
  title: string;
  isCompleted?: boolean;
  description?: string;
  createdAt: number;
  activities?: Activity[];
  comments?: Comment[];
  isWatching?: boolean;
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
  background?: string;
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  background: string;
  members?: string[];
  lists: List[];
  isStarred?: boolean;
}
