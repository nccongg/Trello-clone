import { StarIcon, ChevronDownIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useBoardStore } from '../store/boardStore';

interface BoardHeaderProps {
  boardId: string;
}

export default function BoardHeader({ boardId }: BoardHeaderProps) {
  const { boards, toggleStar } = useBoardStore();
  const board = boards.find((b) => b.id === boardId);

  if (!board) return null;

  return (
    <div className="h-12 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-white text-lg font-semibold">{board.title}</h1>
          <button onClick={() => toggleStar(board.id)} className="text-[#9FADBC] hover:text-[#B6C2CF]">
            {board.isStarred ? <StarIconSolid className="h-4 w-4 text-yellow-400" /> : <StarIcon className="h-4 w-4" />}
          </button>
        </div>
        <div className="flex items-center space-x-1">
          <button className="px-3 py-1.5 text-[#9FADBC] hover:bg-[#A6C5E229] rounded text-sm">
            <div className="flex items-center">
              <span className="mr-1">Workspace visible</span>
              <ChevronDownIcon className="h-3 w-3" />
            </div>
          </button>
          <button className="px-3 py-1.5 text-[#9FADBC] hover:bg-[#A6C5E229] rounded text-sm flex items-center">
            <TableCellsIcon className="h-4 w-4 mr-2" />
            Board
            <ChevronDownIcon className="h-3 w-3 ml-1" />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button className="px-3 py-1.5 text-[#9FADBC] hover:bg-[#A6C5E229] rounded text-sm">Power-Ups</button>
        <button className="px-3 py-1.5 text-[#9FADBC] hover:bg-[#A6C5E229] rounded text-sm">Automation</button>
        <button className="px-3 py-1.5 text-[#9FADBC] hover:bg-[#A6C5E229] rounded text-sm">Filter</button>
        <div className="h-6 w-6 rounded-full bg-[#579DFF] flex items-center justify-center">
          <span className="text-white text-sm font-medium">A</span>
        </div>
        <button className="px-3 py-1.5 bg-[#22272B] text-white hover:bg-[#454F59] rounded text-sm">Share</button>
        <button className="p-2 text-[#9FADBC] hover:bg-[#A6C5E229] rounded">
          <span className="block w-4 h-0.5 bg-current mb-1"></span>
          <span className="block w-4 h-0.5 bg-current mb-1"></span>
          <span className="block w-4 h-0.5 bg-current"></span>
        </button>
      </div>
    </div>
  );
}
