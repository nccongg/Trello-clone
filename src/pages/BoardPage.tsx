import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import BoardHeader from '../components/BoardHeader';
import BoardSidebar from '../components/BoardSidebar';
import Board from '../components/Board';
import { useBoardStore } from '../store/boardStore';

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const { boards } = useBoardStore();
  const board = boards.find((b) => b.id === id);

  if (!board) return null;

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
          <Board id={id!} />
        </div>
      </div>
    </div>
  );
}
