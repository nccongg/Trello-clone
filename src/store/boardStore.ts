import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Card {
  id: string;
  title: string;
  description?: string;
  isCompleted?: boolean;
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

interface BoardStore {
  boards: Board[];
  lists: List[];
  getBoard: (id: string) => Board | undefined;
  addBoard: (title: string, background: string) => void;
  removeBoard: (id: string) => void;
  addList: (boardId: string, title: string) => void;
  removeList: (boardId: string, listId: string) => void;
  addCard: (boardId: string, listId: string, title: string) => void;
  removeCard: (boardId: string, listId: string, cardId: string) => void;
  moveCard: (boardId: string, fromListId: string, fromIndex: number, toListId: string, toIndex: number) => void;
  toggleStar: (boardId: string) => void;
  updateListBackground: (boardId: string, listId: string, background: string) => void;
  updateListTitle: (boardId: string, listId: string, title: string) => void;
  toggleCardComplete: (boardId: string, listId: string, cardId: string) => void;
  updateCardTitle: (boardId: string, listId: string, cardId: string, title: string) => void;
}

export const useBoardStore = create<BoardStore>()(
  persist(
    (set, get) => ({
      boards: [
        {
          id: '1',
          title: 'My trello board',
          background: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2000&auto=format&fit=crop',
          members: ['John'],
          lists: [],
          isStarred: false,
        },
      ],
      lists: [],
      getBoard: (id: string) => {
        return get().boards.find((board) => board.id === id);
      },
      addBoard: (title, background) =>
        set((state) => ({
          boards: [...state.boards, { id: uuidv4(), title, background, lists: [], isStarred: false }],
        })),
      removeBoard: (id) =>
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== id),
        })),
      addList: (boardId, title) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: [...board.lists, { id: uuidv4(), title, cards: [] }],
                }
              : board,
          ),
        })),
      removeList: (boardId, listId) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.filter((list) => list.id !== listId),
                }
              : board,
          ),
        })),
      addCard: (boardId, listId, title) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.map((list) =>
                    list.id === listId
                      ? {
                          ...list,
                          cards: [...list.cards, { id: uuidv4(), title }],
                        }
                      : list,
                  ),
                }
              : board,
          ),
        })),
      removeCard: (boardId, listId, cardId) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.map((list) =>
                    list.id === listId
                      ? {
                          ...list,
                          cards: list.cards.filter((card) => card.id !== cardId),
                        }
                      : list,
                  ),
                }
              : board,
          ),
        })),
      moveCard: (boardId, fromListId, fromIndex, toListId, toIndex) =>
        set((state) => {
          const board = state.boards.find((b) => b.id === boardId);
          if (!board) return state;

          const fromList = board.lists.find((l) => l.id === fromListId);
          const toList = board.lists.find((l) => l.id === toListId);
          if (!fromList || !toList) return state;

          const newCards = [...fromList.cards];
          const [movedCard] = newCards.splice(fromIndex, 1);

          // Moving to a different list
          if (fromListId !== toListId) {
            const newFromCards = [...fromList.cards];
            const [movedCard] = newFromCards.splice(fromIndex, 1);
            const newToCards = [...toList.cards];
            newToCards.splice(toIndex, 0, movedCard);

            return {
              boards: state.boards.map((board) =>
                board.id === boardId
                  ? {
                      ...board,
                      lists: board.lists.map((list) => {
                        if (list.id === fromListId) {
                          return { ...list, cards: newFromCards };
                        }
                        if (list.id === toListId) {
                          return { ...list, cards: newToCards };
                        }
                        return list;
                      }),
                    }
                  : board,
              ),
            };
          }

          // Moving within the same list
          newCards.splice(toIndex, 0, movedCard);
          return {
            boards: state.boards.map((board) =>
              board.id === boardId
                ? {
                    ...board,
                    lists: board.lists.map((list) => (list.id === fromListId ? { ...list, cards: newCards } : list)),
                  }
                : board,
            ),
          };
        }),
      toggleStar: (boardId) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId ? { ...board, isStarred: !board.isStarred } : board,
          ),
        })),
      updateListBackground: (boardId, listId, background) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.map((list) =>
                    list.id === listId
                      ? {
                          ...list,
                          background,
                        }
                      : list,
                  ),
                }
              : board,
          ),
        })),
      updateListTitle: (boardId, listId, title) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.map((list) =>
                    list.id === listId
                      ? {
                          ...list,
                          title,
                        }
                      : list,
                  ),
                }
              : board,
          ),
        })),
      toggleCardComplete: (boardId, listId, cardId) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.map((list) =>
                    list.id === listId
                      ? {
                          ...list,
                          cards: list.cards.map((card) =>
                            card.id === cardId ? { ...card, isCompleted: !card.isCompleted } : card,
                          ),
                        }
                      : list,
                  ),
                }
              : board,
          ),
        })),
      updateCardTitle: (boardId, listId, cardId, title) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.map((list) =>
                    list.id === listId
                      ? {
                          ...list,
                          cards: list.cards.map((card) => (card.id === cardId ? { ...card, title } : card)),
                        }
                      : list,
                  ),
                }
              : board,
          ),
        })),
    }),
    {
      name: 'board-storage',
    },
  ),
);
