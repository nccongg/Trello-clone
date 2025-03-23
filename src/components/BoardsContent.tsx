import { useState } from 'react';
import { StarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useBoardStore } from '../store/boardStore';
import CreateBoardModal from './CreateBoardModal';
import { useNavigate } from 'react-router-dom';

export default function BoardsContent() {
  const { boards, toggleStar } = useBoardStore();
  const navigate = useNavigate();
  const recentBoard = boards[0];
  const starredBoards = boards.filter((board) => board.isStarred);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleStarClick = (e: React.MouseEvent, boardId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleStar(boardId);
  };

  const handleBoardClick = (boardId: string) => {
    navigate(`/board/${boardId}`);
  };

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
              <div
                key={board.id}
                onClick={() => handleBoardClick(board.id)}
                className="w-[180px] h-[96px] rounded-lg p-4 relative group cursor-pointer"
              >
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    backgroundColor: board.background.startsWith('http') ? undefined : board.background,
                    backgroundImage: board.background.startsWith('http') ? `url(${board.background})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    imageRendering: '-webkit-optimize-contrast',
                  }}
                />
                <div className="absolute inset-0 bg-black/25 rounded-lg group-hover:bg-black/40 transition-colors" />
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <h3 className="text-white text-sm font-medium">{board.title}</h3>
                  <button
                    onClick={(e) => handleStarClick(e, board.id)}
                    className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-all p-0 bg-transparent hover:bg-transparent border-none"
                  >
                    <StarIcon className={`w-5 h-5 stroke-2 ${board.isStarred ? 'hidden' : 'text-white'}`} />
                    <StarIconSolid className={`w-5 h-5 ${board.isStarred ? 'text-yellow-400' : 'hidden'}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex items-center gap-2 text-sm font-medium text-[#9FADBC] mb-4">
        <ClockIcon className="w-4 h-4" />
        <h2>Recently viewed</h2>
      </div>
      <div className="flex flex-wrap gap-4 mb-8">
        {recentBoard && (
          <div
            onClick={() => handleBoardClick(recentBoard.id)}
            className="w-[180px] h-[96px] rounded-lg p-4 relative group cursor-pointer"
          >
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                backgroundColor: recentBoard.background.startsWith('http') ? undefined : recentBoard.background,
                backgroundImage: recentBoard.background.startsWith('http')
                  ? `url(${recentBoard.background})`
                  : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                imageRendering: '-webkit-optimize-contrast',
              }}
            />
            <div className="absolute inset-0 bg-black/25 rounded-lg group-hover:bg-black/40 transition-colors" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <h3 className="text-white text-sm font-medium">{recentBoard.title}</h3>
              <button
                onClick={(e) => handleStarClick(e, recentBoard.id)}
                className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-all p-0 bg-transparent hover:bg-transparent border-none"
              >
                <StarIcon className={`w-5 h-5 stroke-2 ${recentBoard.isStarred ? 'hidden' : 'text-white'}`} />
                <StarIconSolid className={`w-5 h-5 ${recentBoard.isStarred ? 'text-yellow-400' : 'hidden'}`} />
              </button>
            </div>
          </div>
        )}
      </div>

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
        {boards.map((board) => (
          <div
            key={board.id}
            onClick={() => handleBoardClick(board.id)}
            className="w-[180px] h-[96px] rounded-lg p-4 relative group cursor-pointer"
          >
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                backgroundColor: board.background.startsWith('http') ? undefined : board.background,
                backgroundImage: board.background.startsWith('http') ? `url(${board.background})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                imageRendering: '-webkit-optimize-contrast',
              }}
            />
            <div className="absolute inset-0 bg-black/25 rounded-lg group-hover:bg-black/40 transition-colors" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <h3 className="text-white text-sm font-medium">{board.title}</h3>
              <button
                onClick={(e) => handleStarClick(e, board.id)}
                className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-all p-0 bg-transparent hover:bg-transparent border-none"
              >
                <StarIcon className={`w-5 h-5 stroke-2 ${board.isStarred ? 'hidden' : 'text-white'}`} />
                <StarIconSolid className={`w-5 h-5 ${board.isStarred ? 'text-yellow-400' : 'hidden'}`} />
              </button>
            </div>
          </div>
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

      <button className="mt-8 text-[#9FADBC] hover:text-[#B6C2CF] text-sm">View all closed boards</button>

      <CreateBoardModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}
