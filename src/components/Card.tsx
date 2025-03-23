import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { PencilIcon, EyeIcon, ChatBubbleLeftIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useBoardStore } from '../store/boardStore';
import CardActions from './CardActions';
import CardModal from './CardModal';

interface CardProps {
  card: {
    id: string;
    title: string;
    isCompleted?: boolean;
    description?: string;
    isWatching?: boolean;
    comments?: any[];
  };
  boardId: string;
  listId: string;
  index: number;
}

export default function Card({ card, boardId, listId, index }: CardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState(card.title);
  const { toggleCardComplete, updateCardTitle } = useBoardStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: {
      type: 'Card',
      card,
      index,
      listId,
      boardId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
    position: isDragging ? ('relative' as const) : ('static' as const),
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
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

  const handleCardClick = (e: React.MouseEvent) => {
    if (!isEditing && !isDragging) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={handleCardClick}
        className={`card group relative bg-[#22272B] hover:bg-[#282E33] rounded-lg p-2 shadow-sm transition-colors duration-200 cursor-pointer active:cursor-grabbing ${
          isDragging ? 'shadow-xl opacity-90 scale-105' : ''
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
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
              <div className="absolute left-1/2 -translate-x-1/2 -top-8 hidden group-hover/check:block bg-[#1D2125] text-[#B6C2CF] text-xs px-2 py-1 rounded whitespace-nowrap z-50">
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
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-[#22272B] text-sm text-[#B6C2CF] focus:outline-none px-0"
              />
            ) : (
              <span className="text-sm text-[#B6C2CF] flex-1 truncate max-w-[180px]">{card.title}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {isEditing ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
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

        {(card.description || card.isWatching || (card.comments && card.comments.length > 0)) && (
          <div className="flex items-center gap-2 mt-2 text-[#9FADBC] text-xs min-w-0">
            {card.isWatching && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <EyeIcon className="w-3.5 h-3.5" />
              </div>
            )}
            {card.description && (
              <div className="flex items-center gap-1 min-w-0 flex-1">
                <Bars3Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{card.description}</span>
              </div>
            )}
            {card.comments && card.comments.length > 0 && (
              <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
                <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
                <span>{card.comments.length}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <CardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        boardId={boardId}
        listId={listId}
        cardId={card.id}
      />
    </>
  );
}
