import { EllipsisHorizontalIcon, StarIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useEffect, useRef } from 'react';

interface BoardMenuProps {
  boardId: string;
  onClose: () => void;
  onCloseBoard: (e: React.MouseEvent) => void;
  position?: 'left' | 'right';
  menuClassName?: string;
  buttonClassName?: string;
}

export default function BoardMenu({
  boardId,
  onClose,
  onCloseBoard,
  position = 'right',
  menuClassName = 'absolute right-0 top-8 z-50 w-48 bg-[#282E33] rounded-lg shadow-lg py-1.5 transform opacity-0 scale-95 transition-all duration-100 ease-in-out origin-top-right',
  buttonClassName = 'opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-black/20 rounded flex items-center justify-center',
}: BoardMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add animation class after mount
    const timer = setTimeout(() => {
      if (menuRef.current) {
        menuRef.current.classList.remove('opacity-0', 'scale-95');
        menuRef.current.classList.add('opacity-100', 'scale-100');
      }
    }, 0);

    // Handle click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div ref={menuRef} className={menuClassName} onClick={handleMenuClick}>
      <div className="px-1 space-y-0.5">
        <button
          onClick={onCloseBoard}
          className="w-full px-3 py-1.5 text-left text-sm text-[#B6C2CF] hover:bg-[#A6C5E229] rounded transition-colors duration-100 flex items-center gap-2"
        >
          <TrashIcon className="w-4 h-4" />
          Close board
        </button>
        <button className="w-full px-3 py-1.5 text-left text-sm text-[#B6C2CF] hover:bg-[#A6C5E229] rounded transition-colors duration-100 flex items-center gap-2">
          <PencilIcon className="w-4 h-4" />
          Edit board
        </button>
        <button className="w-full px-3 py-1.5 text-left text-sm text-[#B6C2CF] hover:bg-[#A6C5E229] rounded transition-colors duration-100 flex items-center gap-2">
          <StarIcon className="w-4 h-4" />
          Add to favorites
        </button>
      </div>
    </div>
  );
}
