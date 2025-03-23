import { useRef, useState } from 'react';

interface CommentInputProps {
  onSubmit: (content: string) => void;
  onTextareaInput: (e: React.FormEvent<HTMLTextAreaElement>) => void;
}

export default function CommentInput({ onSubmit, onTextareaInput }: CommentInputProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
      if (textareaRef.current) {
        textareaRef.current.style.height = '36px';
      }
    }
  };

  return (
    <div className="flex items-start">
      <div className="w-8 flex-shrink-0 -ml-8">
        <div className="h-6 w-6 rounded-full bg-[#579DFF] flex items-center justify-center">
          <span className="text-white text-xs font-medium">A</span>
        </div>
      </div>
      <div className="ml-4 flex-1">
        <form onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onInput={onTextareaInput}
            placeholder="Write a comment..."
            className="w-full bg-[#22272B] rounded-lg p-3 text-sm text-white placeholder-[#9FADBC] focus:outline-none focus:ring-1 focus:ring-[#579DFF] resize-none min-h-[36px]"
          />
          {content.trim() && (
            <div className="mt-2">
              <button type="submit" className="px-3 py-1.5 bg-[#579DFF] text-white rounded text-sm hover:bg-[#4B8BE0]">
                Save
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
