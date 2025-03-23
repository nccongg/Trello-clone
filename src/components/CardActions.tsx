import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  ComputerDesktopIcon,
  TagIcon,
  UserIcon,
  DocumentDuplicateIcon,
  ArrowRightIcon,
  LinkIcon,
  DocumentIcon,
  ArchiveBoxIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import { useBoardStore } from '../store/boardStore';

interface CardActionsProps {
  onClose: () => void;
  boardId: string;
  listId: string;
  cardId: string;
}

export default function CardActions({ onClose, boardId, listId, cardId }: CardActionsProps) {
  const { removeCard } = useBoardStore();

  const menuItems = [
    { icon: ComputerDesktopIcon, label: 'Open card' },
    { icon: TagIcon, label: 'Edit labels' },
    { icon: UserIcon, label: 'Change members' },
    { icon: DocumentDuplicateIcon, label: 'Change cover' },
    { icon: DocumentIcon, label: 'Edit dates' },
    { icon: ArrowRightIcon, label: 'Move' },
    { icon: DocumentDuplicateIcon, label: 'Copy card' },
    { icon: LinkIcon, label: 'Copy link' },
    { icon: DocumentDuplicateIcon, label: 'Mirror' },
    { icon: ArchiveBoxIcon, label: 'Archive' },
    {
      icon: ArchiveBoxIcon,
      label: 'Delete',
      onClick: () => {
        removeCard(boardId, listId, cardId);
        onClose();
      },
    },
  ];

  return (
    <Menu as="div" className="relative ml-auto">
      {({ open }) => (
        <>
          <Menu.Button
            onClick={(e) => e.stopPropagation()}
            className="p-1 hover:bg-[#A6C5E229] rounded opacity-0 group-hover:opacity-100"
          >
            <EllipsisHorizontalIcon className="w-3.5 h-3.5 text-[#9FADBC]" />
          </Menu.Button>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              onClick={(e) => e.stopPropagation()}
              className="absolute left-full top-0 ml-1 w-[304px] origin-top-left rounded-lg bg-[#282E33] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 py-2"
            >
              {menuItems.map((item) => (
                <Menu.Item key={item.label}>
                  {({ active }) => (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        item.onClick?.();
                      }}
                      className={`${
                        active ? 'bg-[#A6C5E229]' : ''
                      } group flex w-full items-center px-3 py-1.5 text-sm text-[#B6C2CF]`}
                    >
                      <item.icon className="mr-2 h-4 w-4" aria-hidden="true" />
                      {item.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
