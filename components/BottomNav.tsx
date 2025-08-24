
import React from 'react';
import { View } from '../types';
import { HomeIcon, UserGroupIcon, MagnifyingGlassIcon, Cog6ToothIcon } from './Icons';

interface BottomNavProps {
  activeView: View;
  setView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  const activeClass = isActive ? 'text-red-500' : 'text-gray-400';
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${activeClass} hover:text-red-400`}>
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setView }) => {
  return (
    <nav className="flex-shrink-0 flex justify-around items-center bg-black border-t border-gray-800">
      <NavItem
        icon={<HomeIcon className="w-6 h-6" />}
        label="Home"
        isActive={activeView === View.HOME}
        onClick={() => setView(View.HOME)}
      />
      <NavItem
        icon={<UserGroupIcon className="w-6 h-6" />}
        label="My Contacts"
        isActive={activeView === View.CONTACTS}
        onClick={() => setView(View.CONTACTS)}
      />
      <NavItem
        icon={<MagnifyingGlassIcon className="w-6 h-6" />}
        label="Resources"
        isActive={activeView === View.RESOURCES}
        onClick={() => setView(View.RESOURCES)}
      />
      <NavItem
        icon={<Cog6ToothIcon className="w-6 h-6" />}
        label="Settings"
        isActive={activeView === View.SETTINGS}
        onClick={() => setView(View.SETTINGS)}
      />
    </nav>
  );
};

export default BottomNav;