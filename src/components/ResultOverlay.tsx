import React from 'react';
import { Award, Trophy, Frown, Sparkles } from 'lucide-react';
import { ColorResult } from '../types/game';
import { getNumberDetails } from '../services/gameEngine';

interface ResultOverlayProps {
  resultNotice: {
    periodId: string;
    number: number;
    color: ColorResult;
    wonAmount: number;
  } | null;
  onDismiss: () => void;
}

export const ResultOverlay: React.FC<ResultOverlayProps> = ({ resultNotice, onDismiss }) => {
  if (!resultNotice) return null;

  const details = getNumberDetails(resultNotice.number);
  const isWinner = resultNotice.wonAmount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 blur-3xl pointer-events-none rounded-full"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-mono">
            <Sparkles className="w-4 h-4" />
            <span>PERIOD {resultNotice.periodId} SETTLED</span>
          </div>

          {/* Winning Number Orb */}
          <div className="flex justify-center my-2">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-extrabold text-white shadow-2xl border-4 border-white/20 transform scale-105"
              style={{ background: details.badgeBg }}
            >
              {resultNotice.number}
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-xl font-bold font-display text-white">
              {details.colorName} · {details.size}
            </h4>
            <p className="text-xs text-slate-400">
              Verified by Provably Fair Cryptographic Seed
            </p>
          </div>

          {/* User Result Status */}
          <div className={`p-4 rounded-2xl border ${
            isWinner 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : 'bg-slate-800/60 border-slate-700 text-slate-300'
          }`}>
            {isWinner ? (
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-sm">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span>CONGRATULATIONS! YOU WON</span>
                </div>
                <div className="text-2xl font-black font-mono text-emerald-400">
                  +₹{resultNotice.wonAmount.toLocaleString('en-IN')}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <Award className="w-4 h-4 text-slate-500" />
                <span>Round Completed. Next round begins in moments!</span>
              </div>
            )}
          </div>

          <button
            onClick={onDismiss}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Continue Playing
          </button>
        </div>
      </div>
    </div>
  );
};
