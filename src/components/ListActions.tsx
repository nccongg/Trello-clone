import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useBoardStore } from '../store/boardStore';

interface ListActionsProps {
  onClose: () => void;
  boardId: string;
  listId: string;
}

interface MenuItemProps {
  active: boolean;
}

export default function ListActions({ onClose, boardId, listId }: ListActionsProps) {
  const { boards, updateListBackground } = useBoardStore();
  const board = boards.find((b) => b.id === boardId);
  const list = board?.lists.find((l) => l.id === listId);
  const currentBackground = list?.background || '#101204';

  const handleColorChange = (color: string) => {
    updateListBackground(boardId, listId, color);
  };

  const colors = [
    '#1D4B2C', // Dark green
    '#A67A02', // Dark yellow
    '#974F01', // Dark orange
    '#8E2A19', // Dark red
    '#5F2AB0', // Dark purple
    '#0055CC', // Dark blue
    '#206B74', // Dark teal
    '#4C6B1F', // Dark lime
    '#943D73', // Dark pink
    '#596773', // Dark gray
  ];

  const images = [
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606',
    'https://images.unsplash.com/photo-1526749837599-b4eba9fd855e',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    'https://images.unsplash.com/photo-1471922694854-ff1b63b20054',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    'https://images.unsplash.com/photo-1682686580003-82838abaa108',
    'https://images.unsplash.com/photo-1682686580186-b55d2a91053c',
    'https://images.unsplash.com/photo-1682685797507-d44d838b0ac7',
    'https://images.unsplash.com/photo-1682685797365-6f57bbebf107',
    'https://images.unsplash.com/photo-1682685796766-0fddd3e480de',
  ];

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="p-1.5 text-[#9FADBC] hover:bg-[#A6C5E229] rounded-lg">
        <EllipsisHorizontalIcon className="w-3.5 h-3.5" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-full top-full z-50 w-[280px] bg-[#282E33] rounded-lg shadow-lg mt-1 -translate-x-8">
          <div className="flex items-center justify-between p-3 border-b border-[#A6C5E229]">
            <div className="w-8"></div>
            <h3 className="text-[#B6C2CF] text-sm flex-1 text-center">List actions</h3>
            <Menu.Item>
              {({ active }: MenuItemProps) => (
                <button onClick={onClose} className="p-1.5 text-[#9FADBC] hover:bg-[#A6C5E229] rounded-lg">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </Menu.Item>
          </div>

          <Menu.Item>
            {({ active }: MenuItemProps) => (
              <button className={`${active ? 'bg-[#A6C5E229]' : ''} w-full px-4 py-2 text-left text-sm text-[#B6C2CF]`}>
                Add card
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }: MenuItemProps) => (
              <button className={`${active ? 'bg-[#A6C5E229]' : ''} w-full px-4 py-2 text-left text-sm text-[#B6C2CF]`}>
                Copy list
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }: MenuItemProps) => (
              <button className={`${active ? 'bg-[#A6C5E229]' : ''} w-full px-4 py-2 text-left text-sm text-[#B6C2CF]`}>
                Move list
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }: MenuItemProps) => (
              <button className={`${active ? 'bg-[#A6C5E229]' : ''} w-full px-4 py-2 text-left text-sm text-[#B6C2CF]`}>
                Move all cards in this list
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }: MenuItemProps) => (
              <button className={`${active ? 'bg-[#A6C5E229]' : ''} w-full px-4 py-2 text-left text-sm text-[#B6C2CF]`}>
                Sort by...
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }: MenuItemProps) => (
              <button className={`${active ? 'bg-[#A6C5E229]' : ''} w-full px-4 py-2 text-left text-sm text-[#B6C2CF]`}>
                Watch
              </button>
            )}
          </Menu.Item>

          <div className="border-t border-[#A6C5E229] mt-1">
            <div className="px-4 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#B6C2CF]">Colors</span>
              </div>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    className={`w-10 h-7 rounded ${color === currentBackground ? 'ring-2 ring-white' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-[#B6C2CF]">Photos</span>
              </div>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`w-10 h-7 rounded bg-cover bg-center ${
                      image === currentBackground ? 'ring-2 ring-white' : ''
                    }`}
                    style={{ backgroundImage: `url(${image}?auto=format&fit=crop&w=40&h=28&q=80)` }}
                    onClick={() => handleColorChange(image)}
                  />
                ))}
              </div>

              <button
                className={`w-full mt-4 py-1 text-sm text-[#B6C2CF] hover:bg-[#A6C5E229] rounded ${
                  currentBackground === '#101204' ? 'bg-[#A6C5E229]' : ''
                }`}
                onClick={() => handleColorChange('#101204')}
              >
                × Remove background
              </button>
            </div>
          </div>

          <Menu.Item>
            {({ active }: MenuItemProps) => (
              <div className="px-4 py-2">
                <div className="text-sm text-[#B6C2CF] mb-2">Automation</div>
                <button className={`${active ? 'bg-[#A6C5E229]' : ''} w-full text-left text-sm text-[#B6C2CF] py-1`}>
                  When a card is added to the list...
                </button>
                <button className={`${active ? 'bg-[#A6C5E229]' : ''} w-full text-left text-sm text-[#B6C2CF] py-1`}>
                  Every day, sort list by...
                </button>
                <button className={`${active ? 'bg-[#A6C5E229]' : ''} w-full text-left text-sm text-[#B6C2CF] py-1`}>
                  Every Monday, sort list by...
                </button>
                <button className={`${active ? 'bg-[#A6C5E229]' : ''} w-full text-left text-sm text-[#B6C2CF] py-1`}>
                  Create a rule
                </button>
              </div>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }: MenuItemProps) => (
              <button className={`${active ? 'bg-[#A6C5E229]' : ''} w-full px-4 py-2 text-left text-sm text-[#B6C2CF]`}>
                Archive this list
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }: MenuItemProps) => (
              <button className={`${active ? 'bg-[#A6C5E229]' : ''} w-full px-4 py-2 text-left text-sm text-[#B6C2CF]`}>
                Archive all cards in this list
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
