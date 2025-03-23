import { PlusIcon } from '@heroicons/react/24/outline';
import { useBoardStore } from '../store/boardStore';
import { useNavigate } from 'react-router-dom';

export default function BoardList() {
  const { boards } = useBoardStore();
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex flex-wrap gap-4">
        {/* Create New Board */}
        <button
          onClick={() => navigate('/board/new')}
          className="w-[180px] h-[96px] bg-[#282E33] rounded-xl hover:bg-[#A6C5E229] transition-colors"
        >
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[#9FADBC] hover:text-[#B6C2CF] text-sm">
              {boards.length === 0 ? 'Create new board' : 'Create another board'}
            </span>
          </div>
        </button>

        {/* Existing Boards */}
        {boards.map((board) => (
          <button
            key={board.id}
            onClick={() => navigate(`/board/${board.id}`)}
            className="w-[180px] h-[96px] rounded-xl p-3 flex flex-col items-start justify-between hover:opacity-90 transition-colors group relative overflow-hidden"
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: board.background.startsWith('http') ? undefined : board.background,
                backgroundImage: board.background.startsWith('http') ? `url(${board.background})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="relative z-10 w-full">
              <h3 className="text-white text-sm font-medium">{board.title}</h3>
            </div>
            <div className="relative z-10 flex items-center space-x-2">
              <div className="flex -space-x-2">
                {board.members?.slice(0, 3).map((member, index) => (
                  <div
                    key={index}
                    className="h-5 w-5 rounded-full bg-[#579DFF] flex items-center justify-center text-white text-xs font-semibold border-2 border-[#22272B]"
                  >
                    {member.charAt(0).toUpperCase()}
                  </div>
                ))}
                {board.members && board.members.length > 3 && (
                  <div className="h-5 w-5 rounded-full bg-[#2C353D] flex items-center justify-center text-gray-400 text-xs font-semibold border-2 border-[#22272B]">
                    +{board.members.length - 3}
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
