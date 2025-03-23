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
} from '@heroicons/react/24/outline';

interface CardActionsProps {
  onClose: () => void;
  boardId: string;
  listId: string;
  cardId: string;
}

export default function CardActions(_props: CardActionsProps) {
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
  ];

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button className="ml-auto opacity-0 group-hover:opacity-100 p-1 hover:bg-[#A6C5E229] rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-3.5 h-3.5 text-[#9FADBC]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
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
              className="absolute right-0 mt-1 w-[304px] origin-top-right rounded-lg bg-[#282E33] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 py-2"
            >
              {menuItems.map((item) => (
                <Menu.Item key={item.label}>
                  {({ active }) => (
                    <button
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
