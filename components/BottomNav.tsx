import React from 'react';
import { CartIcon, HistoryIcon, SettingsIcon } from './Icons';
import type { View } from '../types';

interface BottomNavProps {
  currentView: View;
  setView: (view: View) => void;
}

const NavItem: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ label, isActive, onClick, children }) => {
  const activeClasses = 'accent-text';
  const inactiveClasses = 'text-muted hover:text-primary';
  
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full transition-colors duration-200 p-2 rounded-lg ${isActive ? activeClasses : inactiveClasses}`}
    >
      {children}
      <span className="text-xs font-medium mt-1">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-backdrop backdrop-blur-sm border-t border-color">
      <div className="flex justify-around items-stretch h-full container mx-auto max-w-lg">
        <NavItem label="Nuova Spesa" isActive={currentView === 'new'} onClick={() => setView('new')}>
          <CartIcon className="h-6 w-6" />
        </NavItem>
        <NavItem label="Storico" isActive={currentView === 'history'} onClick={() => setView('history')}>
          <HistoryIcon className="h-6 w-6" />
        </NavItem>
        <NavItem label="Impostazioni" isActive={currentView === 'settings'} onClick={() => setView('settings')}>
          <SettingsIcon className="h-6 w-6" />
        </NavItem>
      </div>
    </nav>
  );
};

export default BottomNav;
