import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Header from '../components/Header';
import BoardHeader from '../components/BoardHeader';
import BoardSidebar from '../components/BoardSidebar';
import List from '../components/List';
import { useBoardStore } from '../store/boardStore';

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const { boards, addList } = useBoardStore();
  const board = boards.find((b) => b.id === id);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

  if (!board) return null;

  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListTitle.trim()) {
      addList(id!, newListTitle.trim());
      setNewListTitle('');
      setIsAddingList(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <BoardSidebar boardId={id!} />
        <div
          className="flex-1 flex flex-col"
          style={{
            backgroundColor: board.background.startsWith('http') ? undefined : board.background,
            backgroundImage: board.background.startsWith('http') ? `url(${board.background})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <BoardHeader boardId={id!} />
          <div className="flex-1 p-6">
            <div className="flex gap-3">
              {board.lists.map((list) => (
                <List key={list.id} boardId={id!} list={list} />
              ))}

              {isAddingList ? (
                <div className="w-[272px] bg-[#22272B] rounded-lg shrink-0">
                  <form onSubmit={handleAddList} className="p-2">
                    <input
                      type="text"
                      value={newListTitle}
                      onChange={(e) => setNewListTitle(e.target.value)}
                      placeholder="Enter list title..."
                      className="w-full bg-[#22272B] border border-[#579DFF] rounded px-3 py-2 text-sm text-white placeholder-[#A6C5E2] focus:outline-none"
                      autoFocus
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-[#579DFF] text-white rounded text-sm hover:bg-[#4B8BE0]"
                      >
                        Add list
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingList(false)}
                        className="p-1.5 text-[#9FADBC] hover:text-[#B6C2CF]"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingList(true)}
                  className="w-[272px] h-10 px-3 bg-[#ffffff26] hover:bg-[#ffffff33] text-[#ffffff] rounded text-sm text-left shrink-0"
                >
                  + {board.lists.length > 0 ? 'Add another list' : 'Add a list'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
