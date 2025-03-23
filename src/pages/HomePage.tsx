import { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import BoardsContent from '../components/BoardsContent';
import TemplatesContent from '../components/TemplatesContent';
import { useLocation } from 'react-router-dom';

export default function HomePage() {
  const location = useLocation();
  const isTemplatesPage = location.pathname === '/templates';

  return (
    <div className="w-full h-screen flex flex-col bg-[#1D2125]">
      <div className="w-full">
        <Header />
      </div>
      <div className="flex-1 flex justify-center mt-6">
        <div className="w-[60%] flex">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6">
            {isTemplatesPage ? <TemplatesContent /> : <BoardsContent />}
          </main>
        </div>
      </div>
    </div>
  );
}
