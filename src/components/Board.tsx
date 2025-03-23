import { useState, useRef, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useBoardStore } from '../store/boardStore';
import List from './List';
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

interface BoardProps {
  id: string;
}

export default function Board({ id }: BoardProps) {
  const [newListTitle, setNewListTitle] = useState('');
  const [isAddingList, setIsAddingList] = useState(false);
  const { boards, addList, moveCard } = useBoardStore();
  const board = boards.find((b) => b.id === id);
  const addListRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addListRef.current && !addListRef.current.contains(event.target as Node)) {
        setIsAddingList(false);
        setNewListTitle('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListTitle.trim()) {
      addList(id, newListTitle.trim());
      setNewListTitle('');
      setIsAddingList(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Card') {
      setActiveCard(event.active.data.current.card);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);
    const { active, over } = event;

    if (!over) return;

    const activeCard = active.data.current;
    const overCard = over.data.current;

    if (!activeCard || !overCard) return;

    const isActiveACard = activeCard.type === 'Card';
    const isOverACard = overCard.type === 'Card';

    if (!isActiveACard) return;

    // Dropping a card over another card
    if (isActiveACard && isOverACard) {
      const activeListId = activeCard.listId;
      const overListId = overCard.listId;
      const activeIndex = activeCard.index;
      const overIndex = overCard.index;

      // Same list
      if (activeListId === overListId) {
        moveCard(id, activeListId, activeIndex, overListId, overIndex);
      }
      // Different lists
      else {
        moveCard(id, activeListId, activeIndex, overListId, overIndex);
      }
    }

    // Dropping a card over a list
    if (isActiveACard && overCard.type === 'List') {
      const activeListId = activeCard.listId;
      const overListId = overCard.list.id;
      const activeIndex = activeCard.index;
      const overIndex = overCard.list.cards.length;

      if (activeListId !== overListId) {
        moveCard(id, activeListId, activeIndex, overListId, overIndex);
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeCard = active.data.current;
    const overCard = over.data.current;

    if (!activeCard || !overCard) return;

    const isActiveACard = activeCard.type === 'Card';
    const isOverACard = overCard.type === 'Card';

    if (!isActiveACard) return;

    // Dropping a card over another card in a different list
    if (isActiveACard && isOverACard) {
      const activeListId = activeCard.listId;
      const overListId = overCard.listId;
      const activeIndex = activeCard.index;
      const overIndex = overCard.index;

      if (activeListId !== overListId) {
        moveCard(id, activeListId, activeIndex, overListId, overIndex);
      }
    }

    // Dropping a card over a list
    if (isActiveACard && overCard.type === 'List') {
      const activeListId = activeCard.listId;
      const overListId = overCard.list.id;
      const activeIndex = activeCard.index;
      const overIndex = overCard.list.cards.length;

      if (activeListId !== overListId) {
        moveCard(id, activeListId, activeIndex, overListId, overIndex);
      }
    }
  };

  if (!board) return null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
      <div className="board flex-1 overflow-x-auto">
        <div className="flex gap-2.5 p-2.5 items-start h-full">
          {board.lists.map((list) => (
            <List key={list.id} boardId={id} list={list} />
          ))}

          <div ref={addListRef} className="w-[272px] flex-shrink-0">
            {isAddingList ? (
              <form onSubmit={handleAddList} className="bg-[#101204] p-2.5 rounded-xl">
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="Enter list title..."
                  className="w-full bg-[#22272B] rounded-lg px-3 py-2 text-sm text-white placeholder-[#A6C5E2] focus:outline-none"
                  autoFocus
                />
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#579DFF] text-white rounded-lg text-sm hover:bg-[#4B8BE0]"
                  >
                    Add list
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingList(false);
                      setNewListTitle('');
                    }}
                    className="p-1.5 text-[#9FADBC] hover:text-[#B6C2CF] hover:bg-[#A6C5E229] rounded-lg"
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsAddingList(true)}
                className="w-full flex items-center px-3 py-2 bg-[#22272B] hover:bg-[#454F59] text-white rounded-xl text-sm"
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                Add another list
              </button>
            )}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeCard && (
          <div className="card bg-[#22272B] rounded-lg p-1.5 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#B6C2CF]">{activeCard.title}</span>
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
