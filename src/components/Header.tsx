import React from 'react';
import { Volume2, VolumeX, ShieldCheck, Wallet, PlusCircle } from 'lucide-react';
import { UserAccount } from '../types/game';
import { soundManager } from '../services/audio';

interface HeaderProps {
  currentTab: 'GAME' | 'ADMIN' | 'JILI_API' | 'RULES';
  onTabChange: (tab: 'GAME' | 'ADMIN' | 'JILI_API' | 'RULES') => void;
  user: UserAccount;
  onOpenWallet: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  user,
  onOpenWallet,
}) => {
  const [muted, setMuted] = React.useState(!soundManager.enabled);

  const toggleSound = () => {
    soundManager.enabled = !soundManager.enabled;
    setMuted(!soundManager.enabled);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4 md:gap-8">
      {/* Zone 1: Single Wordmark Brand */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-md shadow-amber-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 text-sm tracking-tighter">
              JILI
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-white font-display flex items-center gap-1.5">
            JILI COLOR ROYALE
            <span className="inline-flex items-center text-[10px] uppercase font-mono px-1.5 py-0.2 text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded">
              VIP API
            </span>
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => onTabChange('GAME')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            currentTab === 'GAME'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
          }`}
        >
          Game Arena
        </button>

        <button
          onClick={() => onTabChange('ADMIN')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            currentTab === 'ADMIN'
              ? 'bg-rose-600 text-white shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
          Admin Control
        </button>

        <button
          onClick={() => onTabChange('JILI_API')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            currentTab === 'JILI_API'
              ? 'bg-indigo-600 text-white shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
          }`}
        >
          Jili API Console
        </button>

        <button
          onClick={() => onTabChange('RULES')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            currentTab === 'RULES'
              ? 'bg-slate-700 text-white shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
          }`}
        >
          Rules &amp; Fair Hash
        </button>
      </nav>

      {/* Zone 3: Primary Action & Wallet Balance */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={toggleSound}
          title={muted ? 'Unmute' : 'Mute'}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800/90 rounded-lg px-2.5 py-1.5">
          <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
            <Wallet className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono text-slate-400 leading-none">Wallet</span>
            <span className="text-sm font-bold text-amber-400 font-mono tabular-nums leading-tight">
              ₹{user.balance.toLocaleString('en-IN')}
            </span>
          </div>
          <button
            onClick={onOpenWallet}
            className="ml-1 p-1 text-slate-400 hover:text-emerald-400 transition-colors"
            title="Deposit or Topup"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Navigation Dropdown Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => {
              const tabs: ('GAME' | 'ADMIN' | 'JILI_API' | 'RULES')[] = ['GAME', 'ADMIN', 'JILI_API', 'RULES'];
              const next = tabs[(tabs.indexOf(currentTab) + 1) % tabs.length];
              onTabChange(next);
            }}
            className="px-2.5 py-1.5 text-xs font-semibold bg-slate-800 rounded-lg text-slate-200 border border-slate-700"
          >
            Tab: {currentTab}
          </button>
        </div>
      </div>
    </header>
  );
};
