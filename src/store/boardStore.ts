import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Board, List, Card, Activity } from '../types';

export type { List, Card };

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
  toggleCardWatching: (boardId: string, listId: string, cardId: string) => void;
  updateCardDescription: (boardId: string, listId: string, cardId: string, description: string) => void;
  addComment: (boardId: string, listId: string, cardId: string, content: string) => void;
  updateComment: (boardId: string, listId: string, cardId: string, commentId: string, content: string) => void;
  deleteComment: (boardId: string, listId: string, cardId: string, commentId: string) => void;
}

const addActivity = (card: Card, type: Activity['type'], data: Activity['data'] = {}) => {
  const activity: Activity = {
    id: uuidv4(),
    type,
    data,
    createdAt: Date.now(),
    userId: 'user1',
    userName: 'Chí Công Nguyễn',
  };

  return {
    ...card,
    activities: [...(card.activities || []), activity],
  };
};

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
        set((state) => {
          const newCard = addActivity(
            {
              id: uuidv4(),
              title,
              isCompleted: false,
              createdAt: Date.now(),
              activities: [],
            },
            'add',
            { to: 'To do' },
          );

          return {
            boards: state.boards.map((board) =>
              board.id === boardId
                ? {
                    ...board,
                    lists: board.lists.map((list) =>
                      list.id === listId
                        ? {
                            ...list,
                            cards: [...list.cards, newCard],
                          }
                        : list,
                    ),
                  }
                : board,
            ),
          };
        }),
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
          try {
            const board = state.boards.find((b) => b.id === boardId);
            if (!board) return state;

            const fromList = board.lists.find((l) => l.id === fromListId);
            const toList = board.lists.find((l) => l.id === toListId);
            if (!fromList || !toList) return state;

            // Safety check for invalid indices
            if (
              fromIndex < 0 ||
              fromIndex >= fromList.cards.length ||
              toIndex < 0 ||
              toIndex > (fromListId === toListId ? fromList.cards.length - 1 : toList.cards.length)
            ) {
              return state;
            }

            const newFromCards = [...fromList.cards];
            const [movedCard] = newFromCards.splice(fromIndex, 1);

            // Safety check for corrupted card data
            if (!movedCard || !movedCard.id) {
              console.error('Invalid card data during move operation');
              return state;
            }

            // Moving to a different list
            if (fromListId !== toListId) {
              const newToCards = [...toList.cards];
              const updatedCard = addActivity(
                {
                  ...movedCard,
                  activities: movedCard.activities || [],
                },
                'move',
                {
                  from: fromList.title,
                  to: toList.title,
                },
              );
              newToCards.splice(toIndex, 0, updatedCard);

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
            const updatedCard = addActivity(
              {
                ...movedCard,
                activities: movedCard.activities || [],
              },
              'move',
              {
                from: `position ${fromIndex + 1}`,
                to: `position ${toIndex + 1}`,
              },
            );
            newFromCards.splice(toIndex, 0, updatedCard);

            return {
              boards: state.boards.map((board) =>
                board.id === boardId
                  ? {
                      ...board,
                      lists: board.lists.map((list) =>
                        list.id === fromListId ? { ...list, cards: newFromCards } : list,
                      ),
                    }
                  : board,
              ),
            };
          } catch (error) {
            console.error('Error during card move:', error);
            return state;
          }
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
                            card.id === cardId
                              ? addActivity({ ...card, isCompleted: !card.isCompleted }, 'complete', {
                                  value: (!card.isCompleted).toString(),
                                })
                              : card,
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
      toggleCardWatching: (boardId, listId, cardId) =>
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
                            card.id === cardId ? { ...card, isWatching: !card.isWatching } : card,
                          ),
                        }
                      : list,
                  ),
                }
              : board,
          ),
        })),
      updateCardDescription: (boardId, listId, cardId, description) =>
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
                            card.id === cardId
                              ? addActivity({ ...card, description }, 'description', { value: description })
                              : card,
                          ),
                        }
                      : list,
                  ),
                }
              : board,
          ),
        })),
      addComment: (boardId, listId, cardId, content) =>
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
                            card.id === cardId
                              ? {
                                  ...card,
                                  comments: [
                                    ...(card.comments || []),
                                    {
                                      id: uuidv4(),
                                      content,
                                      userId: 'user1',
                                      userName: 'Chí Công Nguyễn',
                                      createdAt: Date.now(),
                                    },
                                  ],
                                }
                              : card,
                          ),
                        }
                      : list,
                  ),
                }
              : board,
          ),
        })),
      updateComment: (boardId, listId, cardId, commentId, content) =>
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
                            card.id === cardId
                              ? {
                                  ...card,
                                  comments: card.comments?.map((comment) =>
                                    comment.id === commentId
                                      ? {
                                          ...comment,
                                          content,
                                          updatedAt: Date.now(),
                                        }
                                      : comment,
                                  ),
                                }
                              : card,
                          ),
                        }
                      : list,
                  ),
                }
              : board,
          ),
        })),
      deleteComment: (boardId, listId, cardId, commentId) =>
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
                            card.id === cardId
                              ? {
                                  ...card,
                                  comments: card.comments?.filter((comment) => comment.id !== commentId),
                                }
                              : card,
                          ),
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
