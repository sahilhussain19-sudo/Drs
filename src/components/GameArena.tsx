import React, { useState } from 'react';
import { 
  Clock, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  History, 
  Users, 
  TrendingUp, 
  ShieldCheck,
  ChevronRight,
  Flame,
  Award,
  Wallet
} from 'lucide-react';
import { BetTarget, GamePeriod, UserAccount, UserBet } from '../types/game';
import { getNumberDetails } from '../services/gameEngine';
import { BetConfirmModal } from './BetConfirmModal';

interface GameArenaProps {
  currentPeriod: GamePeriod;
  remainingSeconds: number;
  history: GamePeriod[];
  currentRoundBets: UserBet[];
  myBetHistory: UserBet[];
  user: UserAccount;
  onPlaceBet: (target: BetTarget, amount: number) => Promise<{ success: boolean; message: string }>;
  onOpenRules: () => void;
  onOpenWallet: () => void;
}

export const GameArena: React.FC<GameArenaProps> = ({
  currentPeriod,
  remainingSeconds,
  history,
  currentRoundBets,
  myBetHistory,
  user,
  onPlaceBet,
  onOpenRules,
  onOpenWallet,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<BetTarget | null>(null);
  const [activeBottomTab, setActiveBottomTab] = useState<'MY_BETS' | 'LIVE_BETS' | 'TRENDS'>('MY_BETS');
  const [betSuccessToast, setBetSuccessToast] = useState<string | null>(null);

  const isLocked = currentPeriod.status === 'LOCKED' || remainingSeconds <= 5;
  const isSettling = currentPeriod.status === 'SETTLING';

  // Stats from recent 24 rounds
  const recentRounds = history.slice(0, 20);
  const totalRoundsCount = recentRounds.length || 1;
  const greenCount = recentRounds.filter(r => r.resultColor === 'GREEN' || r.resultColor === 'GREEN_VIOLET').length;
  const redCount = recentRounds.filter(r => r.resultColor === 'RED' || r.resultColor === 'RED_VIOLET').length;
  const violetCount = recentRounds.filter(r => r.resultColor === 'VIOLET' || r.resultColor === 'GREEN_VIOLET' || r.resultColor === 'RED_VIOLET').length;

  const greenPct = Math.round((greenCount / totalRoundsCount) * 100);
  const redPct = Math.round((redCount / totalRoundsCount) * 100);
  const violetPct = Math.round((violetCount / totalRoundsCount) * 100);

  const handleBetClick = (target: BetTarget) => {
    if (isLocked) return;
    setSelectedTarget(target);
  };

  const handleConfirmBet = async (target: BetTarget, amount: number) => {
    const res = await onPlaceBet(target, amount);
    if (res.success) {
      setBetSuccessToast(`Bet of ₹${amount.toLocaleString('en-IN')} placed on ${target}!`);
      setTimeout(() => setBetSuccessToast(null), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-5 space-y-5">
      {/* Toast Notification */}
      {betSuccessToast && (
        <div className="fixed top-20 right-4 z-50 p-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-xl shadow-emerald-500/20 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{betSuccessToast}</span>
        </div>
      )}

      {/* Hero Banner with Period & Countdown Timer */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-5 md:p-6 shadow-2xl">
        <img 
          src="/src/assets/images/jili_casino_banner_1793196511825.jpg" 
          alt="Jili Casino Royale Banner" 
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none mix-blend-luminosity" 
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Period Details */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                Win Go 30s · Jili Live
              </span>
              <button
                onClick={onOpenRules}
                className="text-[11px] text-slate-400 hover:text-slate-200 underline font-mono"
              >
                How to Play
              </button>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white font-display tracking-tight flex items-center gap-2">
              Period <span className="font-mono text-amber-400">{currentPeriod.periodId}</span>
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Provably Fair Hash: </span>
              <span className="text-slate-300 truncate max-w-[160px] md:max-w-xs">{currentPeriod.hash}</span>
            </p>
          </div>

          {/* Countdown Clock Indicator */}
          <div className="flex items-center gap-4 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 shrink-0">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                {isSettling ? 'Settling...' : isLocked ? 'Bets Locked' : 'Time Remaining'}
              </span>
              <span className="text-xs font-semibold text-slate-300">
                {isLocked ? 'Wait for next round' : 'Place your prediction'}
              </span>
            </div>

            {/* Visual Digital Timer Gauge */}
            <div className={`relative flex items-center justify-center w-16 h-16 rounded-2xl font-mono text-2xl font-black transition-all ${
              isSettling
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/40 animate-pulse'
                : isLocked
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            }`}>
              {isLocked ? (
                <div className="flex flex-col items-center">
                  <span className="text-lg leading-tight">{remainingSeconds}s</span>
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                </div>
              ) : (
                <span>00:{String(remainingSeconds).padStart(2, '0')}</span>
              )}
            </div>
          </div>
        </div>

        {/* Progress bar countdown */}
        <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-5">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${
              remainingSeconds <= 5 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-400 to-emerald-400'
            }`}
            style={{ width: `${(remainingSeconds / currentPeriod.durationSeconds) * 100}%` }}
          />
        </div>
      </div>

      {/* Parity & Bead Plate Trend Roadmap */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Recent Period Trend &amp; Bead Plate
            </h3>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="text-emerald-400">Green: {greenPct}%</span>
            <span className="text-purple-400">Violet: {violetPct}%</span>
            <span className="text-rose-400">Red: {redPct}%</span>
          </div>
        </div>

        {/* History Balls Row */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {recentRounds.map((rnd) => {
            const num = rnd.resultNumber ?? 0;
            const details = getNumberDetails(num);
            return (
              <div 
                key={rnd.periodId}
                className="flex flex-col items-center gap-1 shrink-0 p-1 rounded-xl bg-slate-950/60 border border-slate-800/80 min-w-[46px]"
                title={`Period: ${rnd.periodId} · Number: ${num} · ${details.colorName} · ${details.size}`}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white font-mono shadow-md"
                  style={{ background: details.badgeBg }}
                >
                  {num}
                </div>
                <span className="text-[9px] font-bold text-slate-400 font-mono">
                  {details.size}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Betting Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl space-y-6">
        {/* Row 1: Primary Colors */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              1. Color Prediction Contracts
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Click to select amount
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* GREEN */}
            <button
              onClick={() => handleBetClick('GREEN')}
              disabled={isLocked}
              className={`py-4 px-3 rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white font-display font-extrabold shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center`}
            >
              <span className="text-base md:text-lg tracking-wide uppercase drop-shadow">
                Join Green
              </span>
              <span className="text-xs font-mono font-medium text-emerald-100 drop-shadow-sm">
                2.0x Multiplier
              </span>
            </button>

            {/* VIOLET */}
            <button
              onClick={() => handleBetClick('VIOLET')}
              disabled={isLocked}
              className={`py-4 px-3 rounded-2xl bg-gradient-to-b from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-display font-extrabold shadow-lg shadow-purple-600/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center`}
            >
              <span className="text-base md:text-lg tracking-wide uppercase drop-shadow">
                Join Violet
              </span>
              <span className="text-xs font-mono font-medium text-purple-100 drop-shadow-sm">
                4.5x Multiplier
              </span>
            </button>

            {/* RED */}
            <button
              onClick={() => handleBetClick('RED')}
              disabled={isLocked}
              className={`py-4 px-3 rounded-2xl bg-gradient-to-b from-rose-500 to-rose-700 hover:from-rose-400 hover:to-rose-600 text-white font-display font-extrabold shadow-lg shadow-rose-500/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center`}
            >
              <span className="text-base md:text-lg tracking-wide uppercase drop-shadow">
                Join Red
              </span>
              <span className="text-xs font-mono font-medium text-rose-100 drop-shadow-sm">
                2.0x Multiplier
              </span>
            </button>
          </div>
        </div>

        {/* Row 2: Numbers Matrix 0 - 9 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              2. Single Digit Prediction (9.0x Payout)
            </span>
            <span className="text-[11px] text-amber-400 font-mono font-bold">
              Hit exact number for 9x!
            </span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {Array.from({ length: 10 }, (_, num) => {
              const details = getNumberDetails(num);
              return (
                <button
                  key={num}
                  onClick={() => handleBetClick(num as BetTarget)}
                  disabled={isLocked}
                  className="h-16 rounded-2xl flex flex-col items-center justify-center text-white font-mono transition-all transform hover:scale-105 active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
                  style={{ background: details.badgeBg }}
                >
                  <span className="text-xl font-black drop-shadow">{num}</span>
                  <span className="text-[9px] font-semibold tracking-tight text-white/90 drop-shadow-sm">
                    9x
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Big / Small Contracts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              3. Big / Small Contracts (2.0x)
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Big (5-9) · Small (0-4)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleBetClick('BIG')}
              disabled={isLocked}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-display font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
            >
              <div className="text-left">
                <span className="text-base uppercase block">BIG</span>
                <span className="text-[11px] font-mono text-amber-200">Numbers 5, 6, 7, 8, 9</span>
              </div>
              <span className="text-xs font-mono font-extrabold px-2 py-1 rounded bg-black/20">
                2.0x
              </span>
            </button>

            <button
              onClick={() => handleBetClick('SMALL')}
              disabled={isLocked}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-display font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
            >
              <div className="text-left">
                <span className="text-base uppercase block">SMALL</span>
                <span className="text-[11px] font-mono text-cyan-200">Numbers 0, 1, 2, 3, 4</span>
              </div>
              <span className="text-xs font-mono font-extrabold px-2 py-1 rounded bg-black/20">
                2.0x
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Tabs: My Bets & Live Room Activity */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="flex border-b border-slate-800 bg-slate-950/70 p-1 gap-1">
          <button
            onClick={() => setActiveBottomTab('MY_BETS')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeBottomTab === 'MY_BETS'
                ? 'bg-slate-800 text-amber-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            My Bets History ({myBetHistory.length})
          </button>

          <button
            onClick={() => setActiveBottomTab('LIVE_BETS')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeBottomTab === 'LIVE_BETS'
                ? 'bg-slate-800 text-amber-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Live Room Bets ({currentRoundBets.length})
          </button>
        </div>

        <div className="p-4 max-h-80 overflow-y-auto">
          {activeBottomTab === 'MY_BETS' ? (
            myBetHistory.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No bets placed yet. Join Green, Violet, Red, or choose a number above!
              </div>
            ) : (
              <div className="space-y-2">
                {myBetHistory.map((bet) => (
                  <div
                    key={bet.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center font-bold text-white border border-slate-700">
                        {bet.target}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">Period {bet.periodId}</span>
                          <span className="text-[10px] text-slate-500">{bet.jiliTransId}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          Contract: ₹{bet.amount.toLocaleString('en-IN')} (Target: {bet.target})
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      {bet.status === 'PENDING' ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                          PENDING
                        </span>
                      ) : bet.status === 'WON' ? (
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-emerald-400 block">WINNER</span>
                          <span className="font-bold text-emerald-400">+₹{bet.payout.toLocaleString('en-IN')}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          MISSED
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-2">
              {currentRoundBets.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No bets placed in this round yet. Be the first to bet!
                </div>
              ) : (
                currentRoundBets.map((bet) => (
                  <div
                    key={bet.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 font-semibold truncate max-w-[120px]">
                        {bet.userName}
                      </span>
                      <span className="text-slate-500">placed</span>
                      <span className="font-bold text-amber-400">₹{bet.amount}</span>
                      <span className="text-slate-500">on</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-bold">
                        {bet.target}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-500">
                      {new Date(bet.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bet Confirm Modal */}
      <BetConfirmModal
        target={selectedTarget}
        onClose={() => setSelectedTarget(null)}
        onConfirm={handleConfirmBet}
        userBalance={user.balance}
      />
    </div>
  );
};
