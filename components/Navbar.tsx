
import React from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User;
  activeTab: 'feed' | 'communities' | 'profile';
  onTabChange: (tab: 'feed' | 'communities' | 'profile') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, activeTab, onTabChange, onLogout }) => {
  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 cursor-pointer" onClick={() => onTabChange('feed')}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-slate-800">VivaMente</span>
        </div>

        <div className="flex flex-1 justify-around md:flex-none md:gap-8">
          <button 
            onClick={() => onTabChange('feed')}
            className={`flex flex-col md:flex-row items-center gap-1 transition-colors ${activeTab === 'feed' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1h1s0-10 1h1m0 0v10a1h1s0-10 1h1m4-10v10a1h1s0-10 1h1" />
            </svg>
            <span className="text-xs md:text-sm font-medium">Feed</span>
          </button>

          <button 
            onClick={() => onTabChange('communities')}
            className={`flex flex-col md:flex-row items-center gap-1 transition-colors ${activeTab === 'communities' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs md:text-sm font-medium">Grupos</span>
          </button>

          <button 
            onClick={() => onTabChange('profile')}
            className={`flex flex-col md:flex-row items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <img src={user.avatar} alt="Avatar" className="h-6 w-6 rounded-full border border-slate-200" />
            <span className="text-xs md:text-sm font-medium">Perfil</span>
          </button>
        </div>

        <button 
          onClick={onLogout}
          className="hidden md:block text-sm text-slate-500 hover:text-red-600 font-medium"
        >
          Sair
        </button>
      </div>
    </nav>
  );
};
