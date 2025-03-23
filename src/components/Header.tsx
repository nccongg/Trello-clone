import { useState, useEffect, useRef } from 'react';
import {
  Squares2X2Icon,
  StarIcon,
  DocumentDuplicateIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import DropdownMenu from './DropdownMenu';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { workspaces } = useWorkspaceStore();
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (e: React.MouseEvent, menuName: string) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  return (
    <header
      ref={headerRef}
      className="h-11 bg-[#1D2125] border-b border-[#2C3338] px-4 flex items-center justify-between"
    >
      <div className="flex items-center">
        <button
          onClick={() => navigate('/boards')}
          className="text-[#B6C2CF] hover:text-white font-bold text-base flex items-center px-2 py-1.5"
        >
          <svg className="h-4 w-4 mr-2 text-[#2684FF]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5zM4 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4z" />
          </svg>
          Trello
        </button>

        {/* Left side menus */}
        <div className="flex items-center ml-4">
          <button className="p-2 text-gray-400 hover:bg-[#22272B] rounded">
            <Squares2X2Icon className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-1">
            <div className="relative">
              <button
                onClick={(e) => handleMenuClick(e, 'workspaces')}
                className="px-3 py-2 text-[13px] text-gray-400 hover:bg-[#22272B] rounded flex items-center"
              >
                <span>Workspaces</span>
                <ChevronDownIcon className="h-3.5 w-3.5 ml-1" />
              </button>
              <DropdownMenu
                isOpen={activeMenu === 'workspaces'}
                onClose={() => setActiveMenu(null)}
                title="Your Workspaces"
                items={workspaces.map((workspace) => ({
                  label: workspace.name,
                  icon: (
                    <div
                      className={`w-8 h-8 bg-${workspace.backgroundColor}-500 rounded flex items-center justify-center text-white font-semibold`}
                    >
                      {workspace.icon}
                    </div>
                  ),
                  onClick: () => {
                    window.location.href = `/workspace/${workspace.id}`;
                  },
                }))}
              />
            </div>

            <div className="relative">
              <button
                onClick={(e) => handleMenuClick(e, 'recent')}
                className="px-3 py-2 text-[13px] text-gray-400 hover:bg-[#22272B] rounded flex items-center"
              >
                <span>Recent</span>
                <ChevronDownIcon className="h-3.5 w-3.5 ml-1" />
              </button>
              <DropdownMenu
                isOpen={activeMenu === 'recent'}
                onClose={() => setActiveMenu(null)}
                items={[{ label: 'Recent boards' }, { label: 'Recent templates' }, { label: 'Recent views' }]}
              />
            </div>

            <div className="relative">
              <button
                onClick={(e) => handleMenuClick(e, 'starred')}
                className="px-3 py-2 text-[13px] text-gray-400 hover:bg-[#22272B] rounded flex items-center"
              >
                <span>Starred</span>
                <ChevronDownIcon className="h-3.5 w-3.5 ml-1" />
              </button>
              <DropdownMenu
                isOpen={activeMenu === 'starred'}
                onClose={() => setActiveMenu(null)}
                items={[{ label: 'Starred boards' }, { label: 'Starred templates' }, { label: 'Starred views' }]}
              />
            </div>

            <div className="relative">
              <button
                onClick={(e) => handleMenuClick(e, 'templates')}
                className="px-3 py-2 text-[13px] text-gray-400 hover:bg-[#22272B] rounded flex items-center"
              >
                <span>Templates</span>
                <ChevronDownIcon className="h-3.5 w-3.5 ml-1" />
              </button>
              <DropdownMenu
                isOpen={activeMenu === 'templates'}
                onClose={() => setActiveMenu(null)}
                items={[
                  { label: 'Project management' },
                  { label: 'Marketing' },
                  { label: 'Sales' },
                  { label: 'Design' },
                  { label: 'Engineering' },
                ]}
              />
            </div>
          </div>

          <div className="relative">
            <button
              onClick={(e) => handleMenuClick(e, 'create')}
              className="ml-2 px-3 py-1.5 bg-[#579DFF] text-white rounded hover:bg-blue-600 flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Create
            </button>
            <DropdownMenu
              isOpen={activeMenu === 'create'}
              onClose={() => setActiveMenu(null)}
              items={[
                { label: 'Create board', icon: <Squares2X2Icon className="h-4 w-4" /> },
                { label: 'Start with a template', icon: <DocumentDuplicateIcon className="h-4 w-4" /> },
                { label: 'Create workspace', icon: <Squares2X2Icon className="h-4 w-4" /> },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            type="search"
            placeholder="Search..."
            className="bg-[#22272B] text-white placeholder-gray-400 text-sm rounded px-3 py-1.5 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>
        <button className="p-2 text-gray-400 hover:bg-[#22272B] rounded">
          <BellIcon className="h-5 w-5" />
        </button>
        <div className="relative">
          <button onClick={(e) => handleMenuClick(e, 'help')} className="p-2 text-gray-400 hover:bg-[#22272B] rounded">
            <QuestionMarkCircleIcon className="h-5 w-5" />
          </button>
          <DropdownMenu
            isOpen={activeMenu === 'help'}
            onClose={() => setActiveMenu(null)}
            position="right"
            items={[
              { label: 'Get a new tip', icon: <BookOpenIcon className="h-4 w-4" /> },
              { label: 'Pricing', icon: <CreditCardIcon className="h-4 w-4" /> },
              { label: 'Apps', icon: <DocumentTextIcon className="h-4 w-4" /> },
              { label: 'Blog', icon: <BookOpenIcon className="h-4 w-4" /> },
              { label: 'Privacy', icon: <ShieldCheckIcon className="h-4 w-4" /> },
              { label: 'Notice at collection', icon: <DocumentTextIcon className="h-4 w-4" /> },
              { label: 'More...', icon: <EllipsisHorizontalIcon className="h-4 w-4" /> },
            ]}
          />
        </div>
        <div className="relative">
          <button onClick={(e) => handleMenuClick(e, 'user')} className="p-2 text-gray-400 hover:bg-[#22272B] rounded">
            <div className="h-8 w-8 rounded-full bg-[#579DFF] flex items-center justify-center text-white font-semibold">
              A
            </div>
          </button>
          <DropdownMenu
            isOpen={activeMenu === 'user'}
            onClose={() => setActiveMenu(null)}
            position="right"
            items={[
              { label: 'Profile and visibility' },
              { label: 'Activity' },
              { label: 'Cards' },
              { label: 'Settings' },
              { label: 'Help' },
              { label: 'Shortcuts' },
              { label: 'Log out' },
            ]}
          />
        </div>
      </div>
    </header>
  );
}
