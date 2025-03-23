import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Card {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
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
  addBoard: (board: Board) => void;
  removeBoard: (id: string) => void;
  addList: (boardId: string, title: string) => void;
  removeList: (boardId: string, listId: string) => void;
  addCard: (boardId: string, listId: string, title: string) => void;
  removeCard: (boardId: string, listId: string, cardId: string) => void;
  moveCard: (boardId: string, fromListId: string, toListId: string, fromIndex: number, toIndex: number) => void;
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
      addBoard: (board) =>
        set((state) => ({
          boards: [...state.boards, { ...board, isStarred: false }],
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
                  lists: [
                    ...board.lists,
                    {
                      id: crypto.randomUUID(),
                      title,
                      cards: [],
                      background: '#101204',
                    },
                  ],
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
                          cards: [
                            ...list.cards,
                            {
                              id: crypto.randomUUID(),
                              title,
                              isCompleted: false,
                            },
                          ],
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
      moveCard: (boardId: string, fromListId: string, toListId: string, fromIndex: number, toIndex: number) => {
        set((state) => {
          const newBoards = state.boards.map((board) => {
            if (board.id === boardId) {
              const newLists = [...board.lists];
              const fromList = newLists.find((list) => list.id === fromListId);
              const toList = newLists.find((list) => list.id === toListId);

              if (!fromList || !toList) return board;

              // Get the card being moved
              const [movedCard] = fromList.cards.splice(fromIndex, 1);

              // If moving to a different list
              if (fromListId !== toListId) {
                toList.cards.splice(toIndex, 0, movedCard);
              } else {
                // If moving within the same list
                fromList.cards.splice(toIndex, 0, movedCard);
              }

              return {
                ...board,
                lists: newLists,
              };
            }
            return board;
          });

          return {
            ...state,
            boards: newBoards,
          };
        });
      },
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
      toggleCardComplete: (boardId: string, listId: string, cardId: string) => {
        set((state) => {
          const boards = state.boards.map((board) => {
            if (board.id === boardId) {
              const lists = board.lists.map((list) => {
                if (list.id === listId) {
                  const cards = list.cards.map((card) => {
                    if (card.id === cardId) {
                      return { ...card, isCompleted: !card.isCompleted };
                    }
                    return card;
                  });
                  return { ...list, cards };
                }
                return list;
              });
              return { ...board, lists };
            }
            return board;
          });
          return { ...state, boards };
        });
      },
      updateCardTitle: (boardId: string, listId: string, cardId: string, title: string) => {
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
        }));
      },
    }),
    {
      name: 'board-storage',
    },
  ),
);
