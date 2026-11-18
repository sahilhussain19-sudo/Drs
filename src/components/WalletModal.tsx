import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, CheckCircle2, Flame } from 'lucide-react';
import { gameEngine } from '../services/gameEngine';
import { DepositInrPage } from './DepositInrPage';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
}

type WalletStep = 'MENU' | 'INR' | 'CRYPTO' | 'WITHDRAW';

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, balance }) => {
  const [step, setStep] = useState<WalletStep>('MENU');
  const [amount, setAmount] = useState<number>(1000);
  const [cryptoNet, setCryptoNet] = useState<'BSC (BEP20)' | 'ETH (ERC20)' | 'TRC20'>('TRC20');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('MENU');
      setStatusMsg(null);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (step === 'CRYPTO') {
      const inrValue = amount;
      gameEngine.adjustUserBalance(inrValue);
      setStatusMsg(`₹${inrValue.toLocaleString('en-IN')} USDT (${cryptoNet}) credited`);
    } else if (step === 'WITHDRAW') {
      if (amount > balance) {
        setStatusMsg('Insufficient wallet balance.');
        return;
      }
      gameEngine.adjustUserBalance(-amount);
      setStatusMsg(`₹${amount.toLocaleString('en-IN')} withdrawal initiated`);
    }

    setTimeout(() => {
      setStatusMsg(null);
      onClose();
    }, 1100);
  };

  return (
    <AnimatePresence>
      {isOpen && step === 'INR' && (
        <DepositInrPage
          key="deposit-inr"
          balance={balance}
          onBack={() => setStep('MENU')}
          onSuccessClose={onClose}
        />
      )}

      {isOpen && step !== 'INR' && (
        <div
          key="wallet-sheet"
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/75"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="w-full max-w-[430px] rounded-t-[24px] bg-gradient-to-b from-[#1a293e] via-[#172130] to-[#141a24] border-t border-white/[0.08] px-4 pt-5 pb-7 shadow-[0_-12px_40px_rgba(0,0,0,0.75)]"
          >
            {/* Header Bar */}
            <div className="relative flex items-center justify-center mb-5">
              {step !== 'MENU' && (
                <button
                  onClick={() => {
                    setStep('MENU');
                    setStatusMsg(null);
                  }}
                  className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white active:scale-90 transition-all"
                  aria-label="Back"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              <h3 className="text-[18px] font-bold text-white tracking-tight">
                {step === 'MENU'
                  ? 'Wallet'
                  : step === 'CRYPTO'
                    ? 'Deposit Crypto'
                    : 'Withdraw'}
              </h3>

              <button
                onClick={onClose}
                className="absolute right-0 w-8 h-8 rounded-full flex items-center justify-center text-[#94a3b8] hover:text-white active:scale-90 transition-all"
                aria-label="Close Wallet"
              >
                <X className="w-5 h-5 stroke-[2.4]" />
              </button>
            </div>

            {/* STEP 1: EXACT REFERENCE WALLET POPUP MENU */}
            {step === 'MENU' && (
              <div className="space-y-3.5">
                {/* 1. Deposit INR Card */}
                <button
                  type="button"
                  onClick={() => setStep('INR')}
                  className="w-full relative overflow-hidden rounded-xl bg-gradient-to-b from-[#422325] via-[#2f1f26] to-[#201e26] border border-[#613436]/75 pt-6 pb-4 px-3 text-center shadow-lg active:scale-[0.985] transition-transform"
                >
                  {/* Welcome Bonus Orange Top-Left Ribbon */}
                  <div className="absolute top-0 left-0 flex items-center gap-1 px-2.5 py-0.5 rounded-br-xl bg-gradient-to-r from-[#f6782d] via-[#e26124] to-[#c94a18] shadow-[0_2px_10px_rgba(246,120,45,0.35)]">
                    <Flame className="w-3 h-3 text-white fill-white" />
                    <span className="text-[11px] font-bold text-white tracking-tight">
                      Welcome Bonus
                    </span>
                  </div>

                  <div className="text-[15px] font-bold text-white leading-tight mb-3">
                    Deposit INR
                  </div>

                  {/* Payment Method Logos Single Row */}
                  <div className="flex flex-nowrap items-center justify-between gap-1 text-[10px] sm:text-[11px] font-medium text-[#d4dae3] whitespace-nowrap">
                    {/* PayTM */}
                    <span className="inline-flex items-center gap-1 shrink-0">
                      <span className="w-3.5 h-3 rounded-[2.5px] bg-[#0ea5e9] flex items-center justify-end pr-0.5 shrink-0">
                        <span className="w-1 h-1 rounded-full bg-white" />
                      </span>
                      <span>PayTM</span>
                    </span>

                    {/* QRcode */}
                    <span className="inline-flex items-center gap-1 shrink-0">
                      <svg className="w-3 h-3 text-[#00b4ff] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" strokeLinecap="round" />
                        <line x1="7" y1="12" x2="17" y2="12" strokeLinecap="round" />
                      </svg>
                      <span>QRcode</span>
                    </span>

                    {/* Googlepay */}
                    <span className="inline-flex items-center gap-1 shrink-0">
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                        <path d="M12 4L4 12l4 4 8-8-4-4z" fill="#fbbc04" />
                        <path d="M12 4l8 8-4 4-8-8 4-4z" fill="#ea4335" />
                        <path d="M4 12l4 4 4-4-4-4-4 4z" fill="#34a853" />
                        <path d="M16 8l4 4-4 4-4-4 4-4z" fill="#4285f4" />
                      </svg>
                      <span>Googlepay</span>
                    </span>

                    {/* UPI */}
                    <span className="inline-flex items-center gap-1 shrink-0">
                      <span className="w-3.5 h-2.5 rounded-[2px] bg-[#00a6ff] flex flex-col justify-between p-[2px] shrink-0">
                        <span className="w-full h-[1.5px] bg-white/90 rounded-full" />
                        <span className="w-2/3 h-[1.5px] bg-white/70 rounded-full" />
                      </span>
                      <span>UPI</span>
                    </span>

                    {/* phonepe */}
                    <span className="inline-flex items-center gap-1 shrink-0">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#6739b7] text-white text-[8px] font-black flex items-center justify-center shrink-0">
                        पे
                      </span>
                      <span>phonepe</span>
                    </span>
                  </div>
                </button>

                {/* 2. Deposit Crypto Card */}
                <button
                  type="button"
                  onClick={() => setStep('CRYPTO')}
                  className="w-full rounded-xl bg-gradient-to-b from-[#1b462d] via-[#193529] to-[#172526] border border-[#28603f]/75 py-4 px-3 flex flex-col items-center justify-center gap-2 shadow-lg active:scale-[0.985] transition-transform"
                >
                  <span className="text-[15px] font-bold text-white leading-tight">
                    Deposit Crypto
                  </span>
                  <span className="w-6 h-6 rounded-full bg-[#26a17b] text-white text-[13px] font-black flex items-center justify-center shadow-[0_0_10px_rgba(38,161,123,0.45)]">
                    ₮
                  </span>
                </button>

                {/* 3. Withdraw Card */}
                <button
                  type="button"
                  onClick={() => setStep('WITHDRAW')}
                  className="w-full rounded-xl bg-gradient-to-b from-[#193c53] via-[#163044] to-[#152736] border border-[#255270]/75 py-4 px-3 flex flex-col items-center justify-center gap-1.5 shadow-lg active:scale-[0.985] transition-transform"
                >
                  <span className="text-[15px] font-bold text-white leading-tight">
                    Withdraw
                  </span>
                  <span className="text-[12px] text-[#9aa8ba] font-medium">
                    Quick, secure withdrawals
                  </span>
                </button>
              </div>
            )}

            {/* STEP 2: INTERACTIVE DEPOSIT / WITHDRAW SUB-VIEW */}
            {step !== 'MENU' && (
              <div className="space-y-4">
                <div className="rounded-xl bg-[#111924] border border-white/[0.06] px-3.5 py-2.5 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Available Balance</span>
                  <span className="text-sm font-bold text-white font-mono">
                    ₹{balance.toLocaleString('en-IN')}
                  </span>
                </div>

                {step === 'CRYPTO' && (
                  <div className="grid grid-cols-3 gap-2">
                    {(['BSC (BEP20)', 'ETH (ERC20)', 'TRC20'] as const).map((net) => (
                      <button
                        key={net}
                        type="button"
                        onClick={() => setCryptoNet(net)}
                        className={`py-2 px-2 rounded-lg text-[11px] font-bold border transition-all ${
                          cryptoNet === net
                            ? 'bg-[#26a17b]/25 border-[#26a17b] text-emerald-300'
                            : 'bg-[#121a26] border-white/[0.06] text-slate-400'
                        }`}
                      >
                        {net}
                      </button>
                    ))}
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Select Amount (₹)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[500, 1000, 2500, 5000, 10000, 25000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(val)}
                        className={`py-2 px-2 rounded-lg border text-xs font-bold font-mono transition-all ${
                          amount === val
                            ? 'border-[#00a6ff] bg-[#00a6ff]/20 text-white'
                            : 'border-white/[0.06] bg-[#121a26] text-slate-300'
                        }`}
                      >
                        ₹{val.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>

                {statusMsg && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/35 flex items-center gap-2 text-emerald-300 text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{statusMsg}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleConfirm}
                  className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg active:scale-[0.98] transition-all ${
                    step === 'CRYPTO'
                      ? 'bg-gradient-to-r from-[#26a17b] to-[#167a5b]'
                      : 'bg-gradient-to-r from-[#00a6ff] to-[#0278c7]'
                  }`}
                >
                  {step === 'WITHDRAW'
                    ? `Withdraw ₹${amount.toLocaleString('en-IN')}`
                    : `Deposit ₹${amount.toLocaleString('en-IN')} Now`}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
