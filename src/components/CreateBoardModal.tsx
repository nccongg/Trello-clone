import { useState, useRef, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useBoardStore } from '../store/boardStore';
import { useNavigate } from 'react-router-dom';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BackgroundOption {
  id: string;
  type: 'color' | 'image';
  color?: string;
  url?: string;
}

const backgroundOptions: BackgroundOption[] = [
  {
    id: 'mountain',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2000&auto=format&fit=crop',
    type: 'image',
  },
  {
    id: 'snow',
    url: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=2000&auto=format&fit=crop',
    type: 'image',
  },
  {
    id: 'sunset',
    url: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=2000&auto=format&fit=crop',
    type: 'image',
  },
  {
    id: 'wave',
    url: 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=2000&auto=format&fit=crop',
    type: 'image',
  },
  { id: 'sky', color: '#B8E4F9', type: 'color' },
  { id: 'blue1', color: '#2193B0', type: 'color' },
  { id: 'blue2', color: '#0079BF', type: 'color' },
  { id: 'purple', color: '#A33E92', type: 'color' },
  { id: 'pink', color: '#CF5AC8', type: 'color' },
];

export default function CreateBoardModal({ isOpen, onClose }: CreateBoardModalProps) {
  const [title, setTitle] = useState('');
  const [selectedBackground, setSelectedBackground] = useState<BackgroundOption>(backgroundOptions[0]);
  const [error, setError] = useState(false);
  const { addBoard } = useBoardStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!title.trim()) {
      setError(true);
      return;
    }

    const background =
      selectedBackground.type === 'color'
        ? selectedBackground.color ?? '#A33E92'
        : selectedBackground.url ?? '/backgrounds/mountain.jpg';

    const newBoard = {
      id: crypto.randomUUID(),
      title: title.trim(),
      background,
      members: [],
      lists: [],
    };

    addBoard(newBoard);
    onClose();
    setTitle('');
    setError(false);
    navigate(`/board/${newBoard.id}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-[#282E33] rounded-lg w-[400px] p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#B6C2CF] text-base font-medium">Create board</h2>
          <button onClick={onClose} className="text-[#9FADBC] hover:text-[#B6C2CF]">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="relative h-[120px] mb-4 rounded overflow-hidden">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundColor: selectedBackground.type === 'color' ? selectedBackground.color : undefined,
              backgroundImage: selectedBackground.type === 'image' ? `url(${selectedBackground.url})` : undefined,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[70%] h-[80%] bg-white/30 backdrop-blur-sm rounded" />
              <div className="w-[60%] h-[80%] bg-white/30 backdrop-blur-sm rounded absolute left-[20%]" />
              <div className="w-[50%] h-[80%] bg-white/30 backdrop-blur-sm rounded absolute right-4" />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-[#9FADBC] text-sm mb-2">Background</h3>
          <div className="grid grid-cols-5 gap-2">
            {backgroundOptions.map((bg) => (
              <button
                key={bg.id}
                onClick={() => setSelectedBackground(bg)}
                className={`w-full aspect-square rounded overflow-hidden border-2 ${
                  selectedBackground.id === bg.id ? 'border-white' : 'border-transparent'
                }`}
              >
                {bg.type === 'color' ? (
                  <div className="w-full h-full" style={{ backgroundColor: bg.color }} />
                ) : (
                  <img src={bg.url} alt={bg.id} className="w-full h-full object-cover" />
                )}
              </button>
            ))}
            <button className="w-full aspect-square rounded bg-[#A6C5E229] text-[#9FADBC] hover:bg-[#A6C5E240] flex items-center justify-center">
              ...
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="flex items-center text-[#9FADBC] text-sm mb-1">
            Board title
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError(false);
            }}
            className={`w-full bg-[#22272B] rounded border ${
              error ? 'border-red-500' : 'border-[#A6C5E229]'
            } px-3 py-1.5 text-[#B6C2CF] focus:outline-none focus:border-[#579DFF]`}
          />
          {error && (
            <p className="flex items-center text-red-500 text-sm mt-1">
              <span className="mr-1">🔥</span>
              Board title is required
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="text-[#9FADBC] text-sm mb-1">Visibility</label>
          <button className="w-full bg-[#22272B] rounded px-3 py-1.5 text-[#B6C2CF] text-left">Workspace</button>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleCreate}
            disabled={!title.trim()}
            className={`px-4 py-1.5 rounded ${
              title.trim()
                ? 'bg-[#579DFF] text-white hover:bg-[#579DFF]/90'
                : 'bg-[#579DFF]/50 text-white/50 cursor-not-allowed'
            }`}
          >
            Create
          </button>
          <button className="text-[#9FADBC] hover:text-[#B6C2CF] text-sm">Start with a template</button>
        </div>

        <p className="text-[#9FADBC] text-xs mt-4">
          By using images from Unsplash, you agree to their license and Terms of Service
        </p>
      </div>
    </div>
  );
}
