import React from 'react';
import { X, ShieldCheck, HelpCircle, Check, Terminal, ExternalLink } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHash: string;
  currentPeriod: string;
}

export const RulesModal: React.FC<RulesModalProps> = ({
  isOpen,
  onClose,
  currentHash,
  currentPeriod,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Rules &amp; Provably Fair Algorithm
              </h3>
              <p className="text-xs text-slate-400">
                Official Jili Color Prediction Game Contract
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed">
          {/* Provably Fair Commitment */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              Active Round Provably Fair Commitment
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">CURRENT PERIOD</span>
                <span className="text-white font-semibold">{currentPeriod}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">PRE-GENERATED SHA256 HASH</span>
                <span className="text-emerald-400 font-semibold truncate block" title={currentHash}>{currentHash}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Before bets open, the winning seed is cryptographically committed with SHA-256. Once the round ends, the seed is published for independent player audit.
            </p>
          </div>

          {/* Color Rules */}
          <div>
            <h4 className="text-sm font-bold text-white font-display mb-2">
              1. Color Prediction Rules &amp; Multipliers
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40">
                <span className="font-bold text-emerald-400 text-sm block">GREEN (2.0x)</span>
                <p className="text-[11px] text-slate-300 mt-1">
                  If 1, 3, 7, 9 lands: You receive <strong>2x</strong> payout. If 5 lands, you receive <strong>1.5x</strong> (split with violet).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40">
                <span className="font-bold text-rose-400 text-sm block">RED (2.0x)</span>
                <p className="text-[11px] text-slate-300 mt-1">
                  If 2, 4, 6, 8 lands: You receive <strong>2x</strong> payout. If 0 lands, you receive <strong>1.5x</strong> (split with violet).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40">
                <span className="font-bold text-purple-400 text-sm block">VIOLET (4.5x)</span>
                <p className="text-[11px] text-slate-300 mt-1">
                  If 0 or 5 lands: You receive <strong>4.5x</strong> payout. (High risk, high multiplier jackpot).
                </p>
              </div>
            </div>
          </div>

          {/* Number & Big/Small Rules */}
          <div>
            <h4 className="text-sm font-bold text-white font-display mb-2">
              2. Number &amp; Big / Small Betting
            </h4>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">
                  9x
                </div>
                <div>
                  <span className="font-bold text-white text-xs block">Exact Number (0 - 9)</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Bet on any specific digit from 0 to 9. If your exact chosen number hits, you win <strong>9.0x</strong> your contract amount!
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0">
                  2x
                </div>
                <div>
                  <span className="font-bold text-white text-xs block">Big / Small Contract</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    <strong>Big:</strong> 5, 6, 7, 8, 9 (Payout 2.0x) · <strong>Small:</strong> 0, 1, 2, 3, 4 (Payout 2.0x).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Jili Integration Note */}
          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/40 space-y-1">
            <span className="font-bold text-indigo-300 text-xs block">
              Jili API Architecture &amp; Admin Real-time Control
            </span>
            <p className="text-[11px] text-slate-400">
              This system connects with Jili Games protocol. In the Admin Panel, operators can monitor active user bets, switch between provably fair RNG, house profit optimization, or force manual results in real time before the round closes.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close Rules
          </button>
        </div>
      </div>
    </div>
  );
};
