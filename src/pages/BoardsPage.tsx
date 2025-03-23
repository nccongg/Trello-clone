import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import BoardsContent from '../components/BoardsContent';

export default function BoardsPage() {
  return (
    <div className="w-full h-screen flex flex-col bg-[#1D2125]">
      <div className="w-full">
        <Header />
      </div>
      <div className="flex-1 flex justify-center">
        <div className="w-[60%] flex">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6">
            <BoardsContent />
          </main>
        </div>
      </div>
    </div>
  );
}
