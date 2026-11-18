import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { BetTarget } from '../types/game';
import { getNumberDetails } from '../services/gameEngine';

interface BetConfirmModalProps {
  target: BetTarget | null;
  onClose: () => void;
  onConfirm: (target: BetTarget, amount: number) => Promise<void>;
  userBalance: number;
}

const CHIP_PRESETS = [10, 50, 100, 500, 1000, 5000];
const MULTIPLIERS = [1, 2, 5, 10, 20];

export const BetConfirmModal: React.FC<BetConfirmModalProps> = ({
  target,
  onClose,
  onConfirm,
  userBalance,
}) => {
  const [baseChip, setBaseChip] = useState<number>(100);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (target === null) return null;

  const totalAmount = customAmount ? Math.max(1, parseInt(customAmount, 10) || 0) : baseChip * multiplier;

  const getTargetTitle = () => {
    if (typeof target === 'number') {
      const details = getNumberDetails(target);
      return {
        label: `Number ${target}`,
        sub: `Payout: 9.0x (${details.colorName})`,
        colorBg: details.badgeBg
      };
    }
    if (target === 'GREEN') return { label: 'Green', sub: 'Payout: 2.0x (1.5x on 5)', colorBg: '#10b981' };
    if (target === 'RED') return { label: 'Red', sub: 'Payout: 2.0x (1.5x on 0)', colorBg: '#ef4444' };
    if (target === 'VIOLET') return { label: 'Violet', sub: 'Payout: 4.5x (Lands on 0 or 5)', colorBg: '#8b5cf6' };
    if (target === 'BIG') return { label: 'Big (5-9)', sub: 'Payout: 2.0x', colorBg: '#f59e0b' };
    return { label: 'Small (0-4)', sub: 'Payout: 2.0x', colorBg: '#06b6d4' };
  };

  const info = getTargetTitle();
  const maxPossiblePayout = typeof target === 'number' 
    ? totalAmount * 9 
    : target === 'VIOLET' 
      ? totalAmount * 4.5 
      : totalAmount * 2;

  const handlePlace = async () => {
    if (totalAmount <= 0) {
      setError('Please select a valid bet amount');
      return;
    }
    if (totalAmount > userBalance) {
      setError('Insufficient wallet balance');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onConfirm(target, totalAmount);
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Failed to place bet');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header with target color banner */}
        <div 
          className="p-5 text-white flex items-center justify-between"
          style={{ background: typeof info.colorBg === 'string' && info.colorBg.startsWith('linear') ? info.colorBg : undefined, backgroundColor: !info.colorBg.startsWith('linear') ? info.colorBg : undefined }}
        >
          <div>
            <h3 className="text-xl font-bold font-display drop-shadow">
              Bet on {info.label}
            </h3>
            <p className="text-xs font-medium text-white/90 drop-shadow-sm">
              {info.sub}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Base Chip Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Select Chip Unit
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CHIP_PRESETS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setBaseChip(chip);
                    setCustomAmount('');
                  }}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold font-mono transition-all ${
                    baseChip === chip && !customAmount
                      ? 'border-amber-500 bg-amber-500/15 text-amber-300 shadow-sm'
                      : 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  ₹{chip}
                </button>
              ))}
            </div>
          </div>

          {/* Multiplier Selection */}
          {!customAmount && (
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Quantity Multiplier
              </label>
              <div className="flex gap-2">
                {MULTIPLIERS.map((mul) => (
                  <button
                    key={mul}
                    type="button"
                    onClick={() => setMultiplier(mul)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold font-mono transition-all ${
                      multiplier === mul
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                        : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    x{mul}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Amount Option */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Or Custom Amount (₹)
            </label>
            <input
              type="number"
              placeholder="Enter custom rupees..."
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Summary Box */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Total Contract Amount:</span>
              <span className="text-sm font-bold text-amber-400 font-mono tabular-nums">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Potential Return:</span>
              <span className="text-sm font-bold text-emerald-400 font-mono tabular-nums">
                ₹{maxPossiblePayout.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Current Balance:</span>
              <span className="text-xs font-medium text-slate-300 font-mono">
                ₹{userBalance.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePlace}
              disabled={submitting || totalAmount > userBalance}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{submitting ? 'Confirming...' : `Confirm ₹${totalAmount}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
