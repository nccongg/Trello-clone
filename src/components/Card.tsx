import { useState, useRef, useEffect } from 'react';
import { Card as CardType } from '../store/boardStore';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { PencilIcon } from '@heroicons/react/24/outline';
import { useBoardStore } from '../store/boardStore';
import CardActions from './CardActions';

interface CardProps {
  card: CardType;
  boardId: string;
  listId: string;
  index: number;
}

export default function Card({ card, boardId, listId, index }: CardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const { toggleCardComplete, updateCardTitle } = useBoardStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (title.trim() && title.trim() !== card.title) {
      updateCardTitle(boardId, listId, card.id, title.trim());
    } else {
      setTitle(card.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setTitle(card.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      draggable={true}
      data-card-id={card.id}
      data-list-id={listId}
      className="card group relative bg-[#22272B] hover:bg-[#282E33] rounded-lg p-1.5 cursor-pointer shadow-sm"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="group/check relative">
            <CheckCircleIcon
              onClick={(e) => {
                e.stopPropagation();
                toggleCardComplete(boardId, listId, card.id);
              }}
              className={`w-5 h-5 cursor-pointer ${
                card.isCompleted
                  ? 'text-[#4CAF50]'
                  : 'text-[#A6C5E229] opacity-0 group-hover:opacity-100 hover:text-[#4CAF50]'
              }`}
            />
            <div className="absolute left-1/2 -translate-x-1/2 -top-8 hidden group-hover/check:block bg-[#1D2125] text-[#B6C2CF] text-xs px-2 py-1 rounded whitespace-nowrap">
              {card.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
            </div>
          </div>
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-[#22272B] text-sm text-[#B6C2CF] focus:outline-none px-0"
            />
          ) : (
            <span className="text-sm text-[#B6C2CF]">{card.title}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-2 py-0.5 bg-[#579DFF] text-white rounded text-xs hover:bg-[#4B8BE0]"
            >
              Save
            </button>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#A6C5E229] rounded"
              >
                <PencilIcon className="w-3.5 h-3.5 text-[#9FADBC]" />
              </button>
              <CardActions onClose={() => {}} boardId={boardId} listId={listId} cardId={card.id} />
            </>
          )}
        </div>
      </div>
      {card.description && <p className="mt-2 text-xs text-gray-400">{card.description}</p>}
    </div>
  );
}
