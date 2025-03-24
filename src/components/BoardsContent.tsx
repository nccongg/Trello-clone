import { useState } from 'react';
import { StarIcon, ClockIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useBoardStore } from '../store/boardStore';
import CreateBoardModal from './CreateBoardModal';
import BoardMenu from './BoardMenu';
import { useNavigate } from 'react-router-dom';

export default function BoardsContent() {
  const { boards, toggleStar, recentlyViewedBoards, addRecentlyViewedBoard, closeBoard, reopenBoard } = useBoardStore();
  const navigate = useNavigate();
  const starredBoards = boards.filter((board) => board.isStarred && !board.isClosed);
  const closedBoards = boards.filter((board) => board.isClosed);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showClosedBoards, setShowClosedBoards] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Lấy các board đã xem gần đây
  const recentBoards = recentlyViewedBoards
    .map((id) => boards.find((board) => board.id === id && !board.isClosed))
    .filter((board): board is NonNullable<typeof board> => board !== undefined);

  const handleStarClick = (e: React.MouseEvent, boardId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleStar(boardId);
  };

  const handleBoardClick = (boardId: string) => {
    addRecentlyViewedBoard(boardId);
    navigate(`/board/${boardId}`);
  };

  const handleCloseBoard = (e: React.MouseEvent, boardId: string) => {
    e.preventDefault();
    e.stopPropagation();
    closeBoard(boardId);
  };

  const handleReopenBoard = (e: React.MouseEvent, boardId: string) => {
    e.preventDefault();
    e.stopPropagation();
    reopenBoard(boardId);
  };

  const handleMenuClick = (e: React.MouseEvent, boardId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveMenu(activeMenu === boardId ? null : boardId);
  };

  const BoardCard = ({ board, showCloseOption = true }: { board: any; showCloseOption?: boolean }) => (
    <div
      key={board.id}
      onClick={() => handleBoardClick(board.id)}
      className="w-[180px] h-[96px] rounded-lg p-3 relative group cursor-pointer"
    >
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          backgroundColor:
            board.background && board.background.startsWith('http') ? undefined : board.background || '#1D2125',
          backgroundImage:
            board.background && board.background.startsWith('http') ? `url(${board.background})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          imageRendering: '-webkit-optimize-contrast',
        }}
      />
      <div className="absolute inset-0 bg-black/25 rounded-lg group-hover:bg-black/40 transition-colors" />
      <div className="relative z-10 h-full flex flex-col justify-between">
        <h3 className="text-white text-sm font-medium line-clamp-2 break-words text-left">{board.title}</h3>
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={(e) => handleStarClick(e, board.id)}
            className="opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-black/20 rounded"
          >
            <StarIcon className={`w-5 h-5 stroke-2 ${board.isStarred ? 'hidden' : 'text-white'}`} />
            <StarIconSolid className={`w-5 h-5 ${board.isStarred ? 'text-yellow-400' : 'hidden'}`} />
          </button>
          {showCloseOption && (
            <div className="relative">
              <button
                onClick={(e) => handleMenuClick(e, board.id)}
                className="opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-black/20 rounded"
              >
                <EllipsisHorizontalIcon className="w-5 h-5 text-white" />
              </button>
              {activeMenu === board.id && (
                <BoardMenu
                  boardId={board.id}
                  onClose={() => setActiveMenu(null)}
                  onCloseBoard={(e) => handleCloseBoard(e, board.id)}
                  menuClassName="absolute right-0 top-8 z-50 w-48 bg-[#282E33] rounded-lg shadow-lg py-1.5 transform opacity-0 scale-95 transition-all duration-100 ease-in-out origin-top-right"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {starredBoards.length > 0 && (
        <>
          <div className="flex items-center gap-2 text-sm font-medium text-[#9FADBC] mb-4">
            <StarIcon className="w-4 h-4" />
            <h2>Starred boards</h2>
          </div>
          <div className="flex flex-wrap gap-4 mb-8">
            {starredBoards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        </>
      )}

      {recentBoards.length > 0 && (
        <>
          <div className="flex items-center gap-2 text-sm font-medium text-[#9FADBC] mb-4">
            <ClockIcon className="w-4 h-4" />
            <h2>Recently viewed</h2>
          </div>
          <div className="flex flex-wrap gap-4 mb-8">
            {recentBoards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        </>
      )}

      <h2 className="text-sm font-medium text-[#9FADBC] mt-8 mb-4">YOUR WORKSPACES</h2>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white text-sm font-medium">
          T
        </div>
        <span className="text-[#B6C2CF] text-sm">Trello Workspace</span>
        <div className="flex items-center gap-4 ml-auto">
          <button className="text-[#9FADBC] hover:text-[#B6C2CF] text-sm">Boards</button>
          <button className="text-[#9FADBC] hover:text-[#B6C2CF] text-sm">Views</button>
          <button className="text-[#9FADBC] hover:text-[#B6C2CF] text-sm">Members (1)</button>
          <button className="text-[#9FADBC] hover:text-[#B6C2CF] text-sm">Settings</button>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {boards
          .filter((board) => !board.isClosed)
          .map((board) => (
            <BoardCard key={board.id} board={board} />
          ))}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-[180px] h-[96px] bg-[#282E33] hover:bg-[#A6C5E229] rounded-lg"
        >
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[#9FADBC] hover:text-[#B6C2CF] text-sm">Create new board</span>
          </div>
        </button>
      </div>

      {closedBoards.length > 0 && (
        <>
          <button
            onClick={() => setShowClosedBoards(!showClosedBoards)}
            className="mt-8 text-[#9FADBC] hover:text-[#B6C2CF] text-sm"
          >
            View {closedBoards.length} closed {closedBoards.length === 1 ? 'board' : 'boards'}
          </button>

          {showClosedBoards && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-4">
                {closedBoards.map((board) => (
                  <div key={board.id} className="relative">
                    <BoardCard board={board} showCloseOption={false} />
                    <button
                      onClick={(e) => handleReopenBoard(e, board.id)}
                      className="absolute top-2 right-2 z-20 bg-black/50 text-white text-xs px-2 py-1 rounded hover:bg-black/70"
                    >
                      Reopen
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <CreateBoardModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}
