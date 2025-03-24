import { Fragment, useState, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  XMarkIcon,
  EyeIcon,
  UserIcon,
  TagIcon,
  ClockIcon,
  PaperClipIcon,
  MapPinIcon,
  Bars3Icon,
  ComputerDesktopIcon,
  DocumentDuplicateIcon,
  ArrowRightIcon,
  LinkIcon,
  DocumentIcon,
  ArchiveBoxIcon,
  PlusIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useBoardStore } from '../store/boardStore';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  listId: string;
  cardId: string;
}

interface Card {
  id: string;
  title: string;
  isCompleted?: boolean;
  description?: string;
  createdAt: number;
  activities?: Activity[];
  comments?: Comment[];
}

interface Activity {
  id: string;
  userName: string;
  createdAt: number;
  type: string;
  data?: any;
}

interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: number;
  updatedAt?: number;
}

const getActivityText = (activity: Activity) => {
  switch (activity.type) {
    case 'add':
      return `added this card to ${activity.data.to}`;
    case 'move':
      return `moved this card from ${activity.data.from} to ${activity.data.to}`;
    case 'complete':
      return activity.data.value === 'true' ? 'marked this card as complete' : 'marked this card as incomplete';
    case 'description':
      return activity.data.value ? 'updated the description' : 'removed the description';
    case 'title':
      return 'updated the title';
    default:
      return '';
  }
};

export default function CardModal({ isOpen, onClose, boardId, listId, cardId }: CardModalProps) {
  const {
    boards,
    toggleCardComplete,
    toggleCardWatching,
    updateCardDescription,
    addComment,
    updateComment,
    deleteComment,
  } = useBoardStore();
  const board = boards.find((b) => b.id === boardId);
  const list = board?.lists.find((l) => l.id === listId);
  const card = list?.cards.find((c) => c.id === cardId);

  if (!card) return null;

  const sideButtons = [
    { icon: UserIcon, label: 'Join' },
    { icon: UserIcon, label: 'Members' },
    { icon: TagIcon, label: 'Labels' },
    { icon: Bars3Icon, label: 'Checklist' },
    { icon: ClockIcon, label: 'Dates' },
    { icon: PaperClipIcon, label: 'Attachment' },
    { icon: MapPinIcon, label: 'Location' },
    { icon: DocumentDuplicateIcon, label: 'Cover' },
    { icon: DocumentIcon, label: 'Custom Fields' },
  ];

  const actions = [
    { icon: ArrowRightIcon, label: 'Move' },
    { icon: DocumentDuplicateIcon, label: 'Copy' },
    { icon: DocumentDuplicateIcon, label: 'Mirror' },
    { icon: DocumentIcon, label: 'Make template' },
    { icon: ArchiveBoxIcon, label: 'Archive' },
    { icon: LinkIcon, label: 'Share' },
  ];

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [description, setDescription] = useState(card.description || '');
  const [showDetails, setShowDetails] = useState(false);
  const [comment, setComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  const handleCommentSubmit = (content: string) => {
    addComment(boardId, listId, cardId, content);
  };

  const handleCommentEdit = (commentId: string, content: string) => {
    updateComment(boardId, listId, cardId, commentId, content);
  };

  const handleCommentDelete = (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteComment(boardId, listId, cardId, commentId);
    }
  };

  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    textarea.style.height = '36px';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-[768px] transform overflow-hidden rounded-2xl bg-[#282E33] shadow-xl transition-all">
                <div className="relative pt-2">
                  <button
                    onClick={onClose}
                    className="absolute right-2 top-2 p-1 text-[#9FADBC] hover:bg-[#A6C5E229] rounded"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>

                  <div className="flex">
                    <div className="flex-1 p-6 pr-4">
                      <div className="flex mb-6">
                        <div className="w-8 flex-shrink-0">
                          <div className="group/check relative">
                            <CheckCircleIcon
                              onClick={() => toggleCardComplete(boardId, listId, cardId)}
                              className={`w-6 h-6 cursor-pointer ${
                                card.isCompleted ? 'text-[#4CAF50]' : 'text-[#A6C5E229] hover:text-[#4CAF50]'
                              }`}
                            />
                            <div className="absolute left-1/2 -translate-x-1/2 -top-8 hidden group-hover/check:block bg-[#1D2125] text-[#B6C2CF] text-xs px-2 py-1 rounded whitespace-nowrap z-50">
                              {card.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <h2 className="text-xl font-semibold text-white mb-2">{card.title}</h2>
                          <div className="text-sm text-[#9FADBC]">
                            in list <span className="underline">{list?.title}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div>
                          <div className="ml-12 mb-2">
                            <h3 className="text-xs font-medium text-[#9FADBC] uppercase">Notifications</h3>
                          </div>
                          <div className="flex">
                            <div className="w-8 flex-shrink-0">
                              <EyeIcon className="h-6 w-6 text-[#9FADBC]" />
                            </div>
                            <div className="ml-4">
                              <button
                                onClick={() => toggleCardWatching(boardId, listId, cardId)}
                                className={`flex items-center gap-2 px-2 py-1.5 ${
                                  card.isWatching
                                    ? 'bg-[#A6C5E240] text-[#9FADBC]'
                                    : 'bg-[#A6C5E229] hover:bg-[#A6C5E240] text-[#9FADBC]'
                                } rounded text-sm`}
                              >
                                {card.isWatching ? 'Watching ✓' : 'Watch'}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="w-8 flex-shrink-0">
                                <Bars3Icon className="h-6 w-6 text-white" />
                              </div>
                              <div className="ml-4">
                                <h3 className="text-sm font-medium text-white">Description</h3>
                              </div>
                            </div>
                            {card.description && !isEditingDesc && (
                              <button
                                onClick={() => {
                                  setDescription(card.description || '');
                                  setIsEditingDesc(true);
                                }}
                                className="px-2.5 py-1.5 hover:bg-[#A6C5E229] text-[#9FADBC] rounded text-sm"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                          <div className="ml-12">
                            {isEditingDesc ? (
                              <div className="space-y-2">
                                <textarea
                                  value={description}
                                  onChange={(e) => setDescription(e.target.value)}
                                  placeholder="Add a more detailed description..."
                                  className="w-full min-h-[100px] bg-[#22272B] text-[#B6C2CF] placeholder-[#9FADBC] rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#579DFF]"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      updateCardDescription(boardId, listId, cardId, description);
                                      setIsEditingDesc(false);
                                    }}
                                    className="px-3 py-1.5 bg-[#579DFF] text-white rounded text-sm hover:bg-[#4B8BE0]"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDescription(card.description || '');
                                      setIsEditingDesc(false);
                                    }}
                                    className="px-3 py-1.5 hover:bg-[#A6C5E229] text-[#B6C2CF] rounded text-sm"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                {card.description ? (
                                  <div className="text-sm text-[#B6C2CF] break-words whitespace-pre-wrap">
                                    {card.description}
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setDescription('');
                                      setIsEditingDesc(true);
                                    }}
                                    className="w-full text-left px-3 py-2.5 bg-[#22272B] hover:bg-[#454F59] rounded-lg text-sm text-[#9FADBC]"
                                  >
                                    Add a more detailed description...
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center mb-2">
                            <div className="w-8 flex-shrink-0">
                              <ChatBubbleLeftIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                              <h3 className="text-sm font-medium text-white">Comments</h3>
                            </div>
                          </div>
                          <div className="ml-8 mt-5">
                            <CommentInput onSubmit={handleCommentSubmit} onTextareaInput={handleTextareaInput} />

                            {card.comments && card.comments.length > 0 && (
                              <div className="mt-4 space-y-4">
                                {card.comments.map((comment) => (
                                  <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                    onEdit={handleCommentEdit}
                                    onDelete={handleCommentDelete}
                                    onTextareaInput={handleTextareaInput}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="w-8 flex-shrink-0">
                                <Bars3Icon className="h-6 w-6 text-white" />
                              </div>
                              <div className="ml-4">
                                <h3 className="text-sm font-medium text-white">Activity</h3>
                              </div>
                            </div>
                            <button
                              onClick={() => setShowDetails(!showDetails)}
                              className="px-2.5 py-1.5 hover:bg-[#A6C5E229] text-[#9FADBC] rounded text-sm"
                            >
                              {showDetails ? 'Hide details' : 'Show details'}
                            </button>
                          </div>
                          <div className="ml-12">
                            {showDetails && card.activities && card.activities.length > 0 && (
                              <div className="mt-4 space-y-4 border-t border-[#A6C5E229] pt-4">
                                {[...card.activities]
                                  .sort((a, b) => b.createdAt - a.createdAt)
                                  .map((activity) => (
                                    <div key={activity.id} className="flex items-start">
                                      <div className="w-8 flex-shrink-0 -ml-8">
                                        <div className="h-6 w-6 rounded-full bg-[#A6C5E229] flex items-center justify-center">
                                          <span className="text-white text-xs font-medium">
                                            {activity.userName.charAt(0)}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="ml-4 text-sm text-[#9FADBC]">
                                        <span className="font-medium text-[#B6C2CF]">{activity.userName}</span>{' '}
                                        {getActivityText(activity)}
                                        <div className="text-xs mt-0.5">
                                          {new Date(activity.createdAt).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true,
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-[192px] bg-[#22272B] p-4 space-y-4">
                      <div>
                        <h4 className="text-xs font-medium text-[#9FADBC] uppercase mb-2">Add to card</h4>
                        <div className="space-y-1">
                          {sideButtons.map((button) => (
                            <button
                              key={button.label}
                              className="w-full flex items-center px-3 py-1.5 text-[#9FADBC] hover:bg-[#A6C5E229] rounded text-sm"
                            >
                              <button.icon className="h-4 w-4 mr-2" />
                              {button.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-medium text-[#9FADBC] uppercase mb-2">Power-Ups</h4>
                        <button className="w-full flex items-center px-3 py-1.5 text-[#9FADBC] hover:bg-[#A6C5E229] rounded text-sm">
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Add Power-Ups
                        </button>
                      </div>

                      <div>
                        <h4 className="text-xs font-medium text-[#9FADBC] uppercase mb-2">Automation</h4>
                        <button className="w-full flex items-center px-3 py-1.5 text-[#9FADBC] hover:bg-[#A6C5E229] rounded text-sm">
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Add button
                        </button>
                      </div>

                      <div>
                        <h4 className="text-xs font-medium text-[#9FADBC] uppercase mb-2">Actions</h4>
                        <div className="space-y-1">
                          {actions.map((action) => (
                            <button
                              key={action.label}
                              className="w-full flex items-center px-3 py-1.5 text-[#9FADBC] hover:bg-[#A6C5E229] rounded text-sm"
                            >
                              <action.icon className="h-4 w-4 mr-2" />
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
