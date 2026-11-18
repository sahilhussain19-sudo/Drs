import React from 'react';
import { Home, Ticket, Gem, Wallet, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 flex justify-between items-end px-3 py-1.5 z-50 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] select-none">
      
      {/* 1. Home */}
      <button
        onClick={() => onTabChange('HOME')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
          currentTab === 'HOME' ? 'text-[#2575fc]' : 'text-[#8896a6] hover:text-slate-600'
        }`}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <span className={`text-[10px] mt-0.5 tracking-tight ${currentTab === 'HOME' ? 'font-bold' : 'font-medium'}`}>
          Home
        </span>
      </button>

      {/* 2. Activity */}
      <button
        onClick={() => onTabChange('ACTIVITY')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
          currentTab === 'ACTIVITY' ? 'text-[#2575fc]' : 'text-[#8896a6] hover:text-slate-600'
        }`}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="3" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <circle cx="8" cy="14" r="1.5" />
            <circle cx="16" cy="14" r="1.5" />
          </svg>
        </div>
        <span className={`text-[10px] mt-0.5 tracking-tight ${currentTab === 'ACTIVITY' ? 'font-bold' : 'font-medium'}`}>
          Activity
        </span>
      </button>

      {/* 3. Promotion (ELEVATED EMBOSSED DIAMOND CIRCLE IN CENTER) */}
      <div className="flex-1 flex flex-col items-center -mt-6">
        <button
          onClick={() => onTabChange('PROMOTION')}
          className="relative w-13 h-13 rounded-full bg-gradient-to-tr from-[#1d4ed8] via-[#2575fc] to-[#60a5fa] p-1 shadow-lg shadow-blue-500/40 border-3 border-white transform active:scale-95 transition-all flex items-center justify-center"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-b from-[#2563eb] to-[#1d4ed8] flex items-center justify-center shadow-inner">
            {/* Diamond inside hexagon/shield */}
            <svg className="w-6 h-6 text-white drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 8.5 12 22 22 8.5 12 2" />
              <polyline points="2 8.5 12 13 22 8.5" />
              <line x1="12" y1="2" x2="12" y2="13" />
            </svg>
          </div>
        </button>
        <span className={`text-[10px] mt-1 tracking-tight ${currentTab === 'PROMOTION' ? 'font-bold text-[#2575fc]' : 'font-medium text-[#8896a6]'}`}>
          Promotion
        </span>
      </div>

      {/* 4. Wallet */}
      <button
        onClick={() => onTabChange('WALLET')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
          currentTab === 'WALLET' ? 'text-[#2575fc]' : 'text-[#8896a6] hover:text-slate-600'
        }`}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
            <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" />
            <circle cx="16" cy="14" r="1.5" />
          </svg>
        </div>
        <span className={`text-[10px] mt-0.5 tracking-tight ${currentTab === 'WALLET' ? 'font-bold' : 'font-medium'}`}>
          Wallet
        </span>
      </button>

      {/* 5. Account */}
      <button
        onClick={() => onTabChange('ACCOUNT')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
          currentTab === 'ACCOUNT' ? 'text-[#2575fc]' : 'text-[#8896a6] hover:text-slate-600'
        }`}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <span className={`text-[10px] mt-0.5 tracking-tight ${currentTab === 'ACCOUNT' ? 'font-bold' : 'font-medium'}`}>
          Account
        </span>
      </button>

    </nav>
  );
};
