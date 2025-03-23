import { useState } from 'react';
import type { Comment } from '../types';

interface CommentItemProps {
  comment: Comment;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onTextareaInput: (e: React.FormEvent<HTMLTextAreaElement>) => void;
}

export default function CommentItem({ comment, onEdit, onDelete, onTextareaInput }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleSave = () => {
    if (editContent.trim()) {
      onEdit(comment.id, editContent.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-start group">
      <div className="w-8 flex-shrink-0 -ml-8">
        <div className="h-6 w-6 rounded-full bg-[#579DFF] flex items-center justify-center">
          <span className="text-white text-xs font-medium">{comment.userName.charAt(0)}</span>
        </div>
      </div>
      <div className="ml-4 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <span className="font-medium text-[#B6C2CF]">{comment.userName}</span>
            <span className="text-xs text-[#9FADBC] ml-2">
              {new Date(comment.createdAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              })}
              {comment.updatedAt && ' (edited)'}
            </span>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
            <button onClick={() => setIsEditing(true)} className="text-xs text-[#9FADBC] hover:text-[#B6C2CF]">
              Edit
            </button>
            <span className="text-[#9FADBC]">•</span>
            <button onClick={() => onDelete(comment.id)} className="text-xs text-[#9FADBC] hover:text-[#B6C2CF]">
              Delete
            </button>
          </div>
        </div>
        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onInput={onTextareaInput}
              className="w-full bg-[#22272B] rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#579DFF] resize-none min-h-[36px]"
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={handleSave}
                className="px-3 py-1.5 bg-[#579DFF] text-white rounded text-sm hover:bg-[#4B8BE0]"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
                className="px-3 py-1.5 hover:bg-[#A6C5E229] text-[#B6C2CF] rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-1 text-sm text-[#B6C2CF] whitespace-pre-wrap">{comment.content}</div>
        )}
      </div>
    </div>
  );
}
