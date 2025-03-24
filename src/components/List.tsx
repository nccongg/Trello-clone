import { useState, useRef, useEffect } from 'react';
import { PlusIcon, XMarkIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useBoardStore } from '../store/boardStore';
import type { List as ListType, Card as CardType } from '../store/boardStore';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Card from './Card';
import ListActions from './ListActions';

interface ListProps {
  boardId: string;
  list: ListType;
  index: number;
}

export default function List({ boardId, list, index }: ListProps) {
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [listTitle, setListTitle] = useState(list.title);
  const { addCard, removeList, updateListTitle, moveList } = useBoardStore();
  const listRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const addCardRef = useRef<HTMLDivElement>(null);

  const { setNodeRef } = useDroppable({
    id: list.id,
    data: {
      type: 'List',
      list,
      boardId,
    },
  });

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    disabled: isAddingCard || isEditingTitle,
    data: {
      type: 'List',
      list,
      index,
      boardId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
    position: isDragging ? ('relative' as const) : ('static' as const),
  };

  const refs = (node: HTMLDivElement) => {
    setNodeRef(node);
    setSortableRef(node);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (isAddingCard && listRef.current && !listRef.current.contains(event.target as Node)) ||
        (isEditingTitle && titleInputRef.current && !titleInputRef.current.contains(event.target as Node)) ||
        (addCardRef.current && !addCardRef.current.contains(event.target as Node))
      ) {
        setIsAddingCard(false);
        setNewCardTitle('');
        if (isEditingTitle) {
          setIsEditingTitle(false);
          if (listTitle.trim() !== list.title) {
            updateListTitle(boardId, list.id, listTitle.trim());
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAddingCard, isEditingTitle, boardId, list.id, list.title, listTitle, updateListTitle]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditingTitle(false);
    if (listTitle.trim() && listTitle.trim() !== list.title) {
      updateListTitle(boardId, list.id, listTitle.trim());
    } else {
      setListTitle(list.title);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleSubmit(e);
    } else if (e.key === 'Escape') {
      setListTitle(list.title);
      setIsEditingTitle(false);
    }
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCardTitle.trim()) {
      addCard(boardId, list.id, newCardTitle.trim());
      setNewCardTitle('');
      setIsAddingCard(false);
    }
  };

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  const getBackgroundStyle = () => {
    const bg = list.background || '#101204';
    if (bg.startsWith('http')) {
      return {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return { backgroundColor: bg };
  };

  return (
    <div
      ref={setSortableRef}
      data-list-id={list.id}
      className={`list rounded-xl flex-shrink-0 transition-all duration-200 ${
        isCollapsed ? 'w-[40px] cursor-pointer' : 'w-[272px]'
      } ${isDragging ? 'opacity-90 scale-105 shadow-xl' : ''}`}
      onClick={() => isCollapsed && setIsCollapsed(false)}
      {...attributes}
      {...(isEditingTitle || isAddingCard ? {} : listeners)}
      style={style}
    >
      <div
        className={`transition-all duration-200 rounded-xl ${isCollapsed ? 'p-1.5' : 'p-2.5'}`}
        style={getBackgroundStyle()}
      >
        {isCollapsed ? (
          <div className="h-full flex flex-col justify-between items-center py-1.5">
            <button
              onClick={toggleCollapse}
              className="group relative p-1.5 text-[#9FADBC] hover:bg-[#A6C5E229] rounded-lg text-sm"
            >
              <div className="flex items-center">
                <ChevronRightIcon className="w-3.5 h-3.5 rotate-180" />
                <ChevronRightIcon className="w-3.5 h-3.5 -ml-1" />
              </div>
              <span className="hidden group-hover:block absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap text-xs mt-0.5 bg-[#1D2125] px-2 py-1 rounded-lg z-50">
                Expand list
              </span>
            </button>
            <h3 className="text-sm font-medium text-[#B6C2CF] vertical-text py-2.5">{list.title}</h3>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2.5">
              {isEditingTitle ? (
                <form onSubmit={handleTitleSubmit} className="flex-1 px-0.5" onClick={(e) => e.stopPropagation()}>
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={listTitle}
                    onChange={(e) => setListTitle(e.target.value)}
                    onKeyDown={handleTitleKeyDown}
                    className="w-[178px] bg-transparent text-sm font-medium text-[#B6C2CF] focus:outline-none focus:bg-[#22272B] rounded px-2 py-1"
                    autoFocus
                    onBlur={handleTitleSubmit}
                  />
                </form>
              ) : (
                <h3
                  className="text-sm font-medium text-white px-2 py-1 cursor-pointer hover:bg-[#A6C5E229] rounded min-w-[178px]"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {list.title}
                </h3>
              )}
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleCollapse}
                  className="group relative p-1.5 text-[#9FADBC] hover:bg-[#A6C5E229] rounded-lg text-sm"
                >
                  <div className="flex items-center">
                    <ChevronRightIcon className="w-3.5 h-3.5" />
                    <ChevronRightIcon className="w-3.5 h-3.5 rotate-180 -ml-1" />
                  </div>
                  <span className="hidden group-hover:block absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap text-xs mt-0.5 bg-[#1D2125] px-2 py-1 rounded-lg z-50">
                    Collapse list
                  </span>
                </button>
                <ListActions onClose={() => setIsActionsOpen(false)} boardId={boardId} listId={list.id} />
              </div>
            </div>

            <div ref={setNodeRef} className="cards-container space-y-2 min-h-[1px]">
              <SortableContext items={list.cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
                {list.cards.map((card: CardType, index: number) => (
                  <Card key={card.id} index={index} card={card} boardId={boardId} listId={list.id} />
                ))}
              </SortableContext>
            </div>

            {isAddingCard ? (
              <form
                onSubmit={handleAddCard}
                className="mt-2.5"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddCard(e);
                  }
                  if (e.key === 'Escape') {
                    setIsAddingCard(false);
                    setNewCardTitle('');
                  }
                }}
              >
                <textarea
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  placeholder="Enter a title for this card..."
                  className="w-full bg-[#22272B] rounded-xl p-2.5 text-sm text-white placeholder-[#A6C5E2] focus:outline-none resize-none min-h-[54px]"
                  autoFocus
                  onKeyDown={(e) => e.stopPropagation()}
                />
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#579DFF] text-white rounded-lg text-sm hover:bg-[#4B8BE0]"
                  >
                    Add card
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAddingCard(false);
                      setNewCardTitle('');
                    }}
                    className="p-1.5 text-[#9FADBC] hover:text-[#B6C2CF] hover:bg-[#A6C5E229] rounded-lg"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddingCard(true);
                }}
                className="mt-2 w-full flex items-center px-2.5 py-1.5 text-[#9FADBC] hover:bg-[#454F59] hover:text-[#B6C2CF] rounded-xl text-sm"
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                Add a card
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Add this CSS to your global styles
const styles = `
.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
}
`;

const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
