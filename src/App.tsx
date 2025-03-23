import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BoardPage from './pages/BoardPage';

function App() {
  return (
    <Router>
      <div className="w-full h-screen overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/boards" replace />} />
          <Route path="/boards" element={<HomePage />} />
          <Route path="/templates" element={<HomePage />} />
          <Route path="/board/:id" element={<BoardPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
