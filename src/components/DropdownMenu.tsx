import { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface DropdownMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  subItems?: {
    label: string;
    icon?: React.ReactNode;
  }[];
}

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: DropdownMenuItem[];
  position?: 'left' | 'right';
  title?: string;
}

export default function DropdownMenu({ isOpen, onClose, items, position = 'left', title }: DropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
        setActiveSubMenu(null);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute top-full mt-1 w-64 bg-[#22272B] rounded-lg shadow-lg py-1 z-50"
      style={{ [position]: 0 }}
    >
      {title && <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">{title}</div>}
      {items.map((item, index) => (
        <div key={index} className="relative">
          <button
            onClick={() => {
              if (item.subItems) {
                setActiveSubMenu(activeSubMenu === item.label ? null : item.label);
              } else {
                item.onClick?.();
                onClose();
              }
            }}
            className="w-full flex items-center justify-between px-4 py-2 text-sm text-white hover:bg-[#2C353D]"
          >
            <div className="flex items-center">
              {item.icon && <span className="mr-2">{item.icon}</span>}
              <span>{item.label}</span>
            </div>
            {item.subItems && (
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${activeSubMenu === item.label ? 'transform rotate-180' : ''}`}
              />
            )}
          </button>
          {item.subItems && activeSubMenu === item.label && (
            <div className="absolute left-full top-0 w-64 bg-[#22272B] rounded-lg shadow-lg py-1">
              {item.subItems.map((subItem, subIndex) => (
                <button
                  key={subIndex}
                  onClick={() => {
                    onClose();
                    setActiveSubMenu(null);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-white hover:bg-[#2C353D]"
                >
                  {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
                  <span>{subItem.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
