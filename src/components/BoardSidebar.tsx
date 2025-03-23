import { useState } from 'react';
import {
  Squares2X2Icon,
  UserGroupIcon,
  Cog6ToothIcon,
  TableCellsIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  StarIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useBoardStore } from '../store/boardStore';
import { useNavigate } from 'react-router-dom';

interface BoardSidebarProps {
  boardId: string;
}

export default function BoardSidebar({ boardId }: BoardSidebarProps) {
  const { workspaces } = useWorkspaceStore();
  const { boards, toggleStar } = useBoardStore();
  const navigate = useNavigate();
  const currentWorkspace = workspaces[0];
  const [isWorkspaceExpanded, setIsWorkspaceExpanded] = useState(true);
  const [isViewsExpanded, setIsViewsExpanded] = useState(true);
  const [isBoardsExpanded, setIsBoardsExpanded] = useState(true);

  const handleStarClick = (e: React.MouseEvent, boardId: string) => {
    e.stopPropagation();
    toggleStar(boardId);
  };

  return (
    <div className="w-[260px] bg-[#1D2125] border-r border-[#2C3338] overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white text-sm font-medium">
              {currentWorkspace.icon}
            </div>
            <span className="text-[#B6C2CF] text-sm font-medium">{currentWorkspace.name}</span>
          </div>
          <button className="text-[#9FADBC] hover:text-[#B6C2CF]">
            <ChevronDownIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2">
          <div>
            <button
              onClick={() => navigate('/boards')}
              className="flex items-center w-full px-2 py-1.5 text-[#B6C2CF] hover:bg-[#A6C5E229] rounded text-xs"
            >
              <Squares2X2Icon className="w-4 h-4 mr-2" />
              Boards
            </button>
          </div>
          <div>
            <button className="flex items-center w-full px-2 py-1.5 text-[#B6C2CF] hover:bg-[#A6C5E229] rounded text-xs">
              <UserGroupIcon className="w-4 h-4 mr-2" />
              Members
            </button>
          </div>
          <div>
            <button className="flex items-center w-full px-2 py-1.5 text-[#B6C2CF] hover:bg-[#A6C5E229] rounded text-xs">
              <Cog6ToothIcon className="w-4 h-4 mr-2" />
              Workspace settings
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2">
            <button
              onClick={() => setIsViewsExpanded(!isViewsExpanded)}
              className="w-full flex items-center justify-between px-2 py-1.5 text-[#9FADBC] hover:bg-[#A6C5E229] rounded"
            >
              <span className="text-sm font-medium">Workspace views</span>
              {isViewsExpanded ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
            </button>
            {isViewsExpanded && (
              <div className="ml-2 mt-1 space-y-1">
                <button className="flex items-center w-full px-2 py-1.5 text-[#B6C2CF] hover:bg-[#A6C5E229] rounded text-xs">
                  <TableCellsIcon className="w-4 h-4 mr-2" />
                  Table
                </button>
                <button className="flex items-center w-full px-2 py-1.5 text-[#B6C2CF] hover:bg-[#A6C5E229] rounded text-xs">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Calendar
                </button>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setIsBoardsExpanded(!isBoardsExpanded)}
              className="w-full flex items-center justify-between px-2 py-1.5 text-[#9FADBC] hover:bg-[#A6C5E229] rounded"
            >
              <span className="text-sm font-medium">Your boards</span>
              {isBoardsExpanded ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
            </button>
            {isBoardsExpanded && (
              <div className="ml-2 mt-1 space-y-1">
                {boards.map((board) => (
                  <div
                    key={board.id}
                    className={`group relative flex items-center ${
                      board.id === boardId ? 'bg-[#A6C5E229]' : 'hover:bg-[#A6C5E229]'
                    } rounded`}
                  >
                    <button
                      onClick={() => navigate(`/board/${board.id}`)}
                      className={`flex items-center w-full px-2 py-1.5 text-[#B6C2CF] hover:bg-[#A6C5E229] rounded text-xs ${
                        boardId === board.id ? 'bg-[#A6C5E229]' : ''
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded mr-2"
                        style={
                          board.background.startsWith('http')
                            ? {
                                backgroundImage: `url(${board.background})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                imageRendering: 'crisp-edges',
                                WebkitBackfaceVisibility: 'hidden',
                                MozBackfaceVisibility: 'hidden',
                              }
                            : {
                                backgroundColor: board.background,
                              }
                        }
                      />
                      {board.title}
                    </button>
                    <div className="absolute right-0 hidden group-hover:flex items-center mr-1">
                      <button
                        onClick={(e) => handleStarClick(e, board.id)}
                        className="p-1 text-[#9FADBC] hover:text-[#B6C2CF] hover:bg-[#A6C5E240] rounded"
                      >
                        {board.isStarred ? (
                          <StarIconSolid className="h-3.5 w-3.5 text-yellow-400" />
                        ) : (
                          <StarIcon className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button className="p-1 text-[#9FADBC] hover:text-[#B6C2CF] hover:bg-[#A6C5E240] rounded">
                        <EllipsisHorizontalIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
