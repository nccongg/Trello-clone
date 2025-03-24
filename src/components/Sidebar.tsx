import {
  Squares2X2Icon,
  DocumentDuplicateIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  StarIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBoardStore } from '../store/boardStore';
import BoardMenu from './BoardMenu';
import { useState } from 'react';

export default function Sidebar() {
  const { workspaces, toggleWorkspace } = useWorkspaceStore();
  const { boards, toggleStar, closeBoard } = useBoardStore();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleStarClick = (e: React.MouseEvent, boardId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleStar(boardId);
  };

  const handleCloseBoard = (e: React.MouseEvent, boardId: string) => {
    e.preventDefault();
    e.stopPropagation();
    closeBoard(boardId);
    setActiveMenu(null);
  };

  const handleMenuClick = (e: React.MouseEvent, boardId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveMenu(activeMenu === boardId ? null : boardId);
  };

  return (
    <aside className="w-[240px] bg-[#1D2125] border-r border-gray-700 overflow-y-auto">
      <div className="p-2">
        <div className="space-y-2">
          {/* Boards */}
          <div>
            <button
              onClick={() => navigate('/boards')}
              className={`w-full flex items-center px-3 py-1.5 rounded group ${
                currentPath === '/boards' ? 'bg-[#A6C5E229] text-[#B6C2CF]' : 'text-[#9FADBC] hover:bg-[#A6C5E229]'
              }`}
            >
              <Squares2X2Icon className="h-4 w-4 mr-2 text-[#9FADBC] group-hover:text-[#B6C2CF]" />
              <span className="text-sm text-[#B6C2CF] font-medium">Boards</span>
            </button>
          </div>

          {/* Templates */}
          <div>
            <button
              onClick={() => navigate('/templates')}
              className={`w-full flex items-center px-3 py-1.5 rounded group ${
                currentPath === '/templates' ? 'bg-[#A6C5E229] text-[#B6C2CF]' : 'text-[#9FADBC] hover:bg-[#A6C5E229]'
              }`}
            >
              <DocumentDuplicateIcon className="h-4 w-4 mr-2 text-[#9FADBC] group-hover:text-[#B6C2CF]" />
              <span className="text-sm text-[#9FADBC] group-hover:text-[#B6C2CF]">Templates</span>
            </button>
          </div>

          {/* Workspaces */}
          <div className="mt-4">
            <h2 className="text-xs font-medium text-[#9FADBC] px-3 mb-1">Workspaces</h2>
            <div className="space-y-0.5">
              {workspaces.map((workspace) => (
                <div key={workspace.id}>
                  <button
                    onClick={() => toggleWorkspace(workspace.id)}
                    className="w-full flex items-center px-3 py-1.5 text-[#9FADBC] hover:bg-[#A6C5E229] rounded group"
                  >
                    <div className="w-4 h-4 mr-2 bg-emerald-600 rounded flex items-center justify-center text-white text-xs font-medium">
                      {workspace.icon}
                    </div>
                    <span className="text-sm flex-1 text-left text-[#B6C2CF]">{workspace.name}</span>
                    {workspace.isExpanded ? (
                      <ChevronDownIcon className="h-3.5 w-3.5 text-[#9FADBC]" />
                    ) : (
                      <ChevronRightIcon className="h-3.5 w-3.5 text-[#9FADBC]" />
                    )}
                  </button>
                  {workspace.isExpanded && (
                    <div className="ml-0 mt-0.5 space-y-0.5">
                      {boards
                        .filter((board) => !board.isClosed)
                        .map((board) => (
                          <div key={board.id} className="relative group">
                            <button
                              onClick={() => navigate(`/board/${board.id}`)}
                              className={`w-full flex items-center px-3 py-1.5 text-[#9FADBC] hover:bg-[#A6C5E229] rounded ${
                                location.pathname === `/board/${board.id}` ? 'bg-[#A6C5E229]' : ''
                              }`}
                            >
                              <div
                                className="w-4 h-4 rounded-[3px] mr-2 flex-shrink-0"
                                style={
                                  board.background && board.background.startsWith('http')
                                    ? {
                                        backgroundImage: `url(${board.background})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                      }
                                    : {
                                        backgroundColor: board.background || '#1D2125',
                                      }
                                }
                              />
                              <span className="text-sm truncate flex-1 text-[#B6C2CF] text-left">{board.title}</span>
                              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100">
                                <button
                                  onClick={(e) => handleStarClick(e, board.id)}
                                  className="p-1 hover:bg-black/20 rounded"
                                >
                                  {board.isStarred ? (
                                    <StarIconSolid className="w-5 h-5 text-yellow-400" />
                                  ) : (
                                    <StarIcon className="w-5 h-5 text-[#9FADBC]" />
                                  )}
                                </button>
                                <div className="relative">
                                  <button
                                    onClick={(e) => handleMenuClick(e, board.id)}
                                    className="p-1 hover:bg-black/20 rounded"
                                  >
                                    <EllipsisHorizontalIcon className="w-5 h-5 text-[#9FADBC]" />
                                  </button>
                                  {activeMenu === board.id && (
                                    <BoardMenu
                                      boardId={board.id}
                                      onClose={() => setActiveMenu(null)}
                                      onCloseBoard={(e) => handleCloseBoard(e, board.id)}
                                      menuClassName="absolute right-0 top-8 z-50 w-48 bg-[#282E33] rounded-lg shadow-lg py-1.5"
                                      buttonClassName="p-1 hover:bg-black/20 rounded flex items-center justify-center"
                                    />
                                  )}
                                </div>
                              </div>
                            </button>
                          </div>
                        ))}
                      <button className="w-full flex items-center px-3 py-1.5 text-[#9FADBC] hover:bg-[#A6C5E229] rounded">
                        <span className="text-sm">Views</span>
                      </button>
                      <button className="w-full flex items-center px-3 py-1.5 text-[#9FADBC] hover:bg-[#A6C5E229] rounded">
                        <span className="text-sm">Members</span>
                      </button>
                      <button className="w-full flex items-center px-3 py-1.5 text-[#9FADBC] hover:bg-[#A6C5E229] rounded">
                        <span className="text-sm">Settings</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
