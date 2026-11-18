import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ChevronLeft,
  Headphones,
  FileClock,
  Flame,
  Zap,
  Timer,
  CheckCircle2,
  X,
} from 'lucide-react';
import { gameEngine } from '../services/gameEngine';

interface DepositInrPageProps {
  balance: number;
  onBack: () => void;
  onSuccessClose: () => void;
}

interface DepositTier {
  amount: number;
  totalExtra: number;
  bonus: number;
  oldBonus: number;
  gullak: number;
  oldGullak: number;
  coupon: number;
}

const DEPOSIT_TIERS: DepositTier[] = [
  { amount: 100, totalExtra: 81, bonus: 17, oldBonus: 11, gullak: 16, oldGullak: 12, coupon: 48 },
  { amount: 200, totalExtra: 101, bonus: 22, oldBonus: 14, gullak: 21, oldGullak: 15, coupon: 58 },
  { amount: 300, totalExtra: 131, bonus: 29, oldBonus: 18, gullak: 27, oldGullak: 19, coupon: 75 },
  { amount: 500, totalExtra: 201, bonus: 45, oldBonus: 28, gullak: 42, oldGullak: 30, coupon: 114 },
  { amount: 1000, totalExtra: 321, bonus: 72, oldBonus: 44, gullak: 68, oldGullak: 46, coupon: 181 },
  { amount: 2000, totalExtra: 541, bonus: 122, oldBonus: 74, gullak: 114, oldGullak: 78, coupon: 305 },
  { amount: 3000, totalExtra: 721, bonus: 164, oldBonus: 98, gullak: 152, oldGullak: 102, coupon: 405 },
  { amount: 5000, totalExtra: 1061, bonus: 241, oldBonus: 145, gullak: 225, oldGullak: 150, coupon: 595 },
];

type PaymentMethodId = 'PayTM' | 'Googlepay' | 'UPI' | 'QRcode' | 'Phonepe';

/* Isolated 1s Gift Timer so only the timer digits re-render */
const GiftCountdown: React.FC = React.memo(() => {
  const [secs, setSecs] = useState(187); // 00 : 03 : 07

  useEffect(() => {
    const id = setInterval(() => {
      setSecs((prev) => (prev > 1 ? prev - 1 : 187));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const hrs = Math.floor(secs / 3600);
  const mins = Math.floor((secs % 3600) / 60);
  const rem = secs % 60;

  return (
    <div className="flex items-center gap-1 text-[13px] font-bold text-[#ff4d4f] font-mono tabular-nums">
      <Timer className="w-3.5 h-3.5 stroke-[2.4]" />
      <span>
        {String(hrs).padStart(2, '0')} : {String(mins).padStart(2, '0')} :{' '}
        {String(rem).padStart(2, '0')}
      </span>
    </div>
  );
});

export const DepositInrPage: React.FC<DepositInrPageProps> = ({
  balance,
  onBack,
  onSuccessClose,
}) => {
  const [selectedTier, setSelectedTier] = useState<DepositTier>(DEPOSIT_TIERS[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('PayTM');
  const [processing, setProcessing] = useState(false);
  const [paidMessage, setPaidMessage] = useState<string | null>(null);
  const [infoModal, setInfoModal] = useState<'SUPPORT' | 'HISTORY' | null>(null);

  const handleProceed = () => {
    if (processing) return;
    setProcessing(true);
    const totalCredit = selectedTier.amount + selectedTier.bonus;
    setTimeout(() => {
      gameEngine.adjustUserBalance(totalCredit);
      setProcessing(false);
      setPaidMessage(
        `₹${selectedTier.amount.toLocaleString('en-IN')} + ₹${selectedTier.bonus} Bonus credited via ${paymentMethod}!`
      );
      setTimeout(() => {
        setPaidMessage(null);
        onSuccessClose();
      }, 1250);
    }, 550);
  };

  const totalReceive = selectedTier.amount + selectedTier.totalExtra;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex justify-center bg-black/80"
    >
      <div className="w-full max-w-[430px] h-full bg-[#0d1117] text-white flex flex-col relative shadow-2xl">
        {/* 1. STICKY HEADER */}
        <header className="px-3.5 py-3 bg-[#10151d] border-b border-white/[0.04] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/10 active:scale-90 transition-all"
            aria-label="Back to Wallet"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.4]" />
          </button>

          <h2 className="text-[17px] font-bold tracking-tight text-white">Deposit INR</h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setInfoModal('SUPPORT')}
              className="w-8 h-8 rounded-full bg-[#1a222d] border border-white/[0.06] flex items-center justify-center text-[#9aa5b5] hover:text-white active:scale-90 transition-all"
              title="24/7 Deposit Help"
            >
              <Headphones className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setInfoModal('HISTORY')}
              className="w-8 h-8 rounded-full bg-[#1a222d] border border-white/[0.06] flex items-center justify-center text-[#9aa5b5] hover:text-white active:scale-90 transition-all"
              title="Deposit History"
            >
              <FileClock className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* 2. SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto px-3.5 pt-3.5 pb-6 space-y-5">
          {/* Deposit Currency & Green Balance Card */}
          <section className="space-y-2">
            <h3 className="text-[12px] font-medium text-[#8a94a6]">Deposit Currency</h3>
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#1c4a30] via-[#172925] to-[#131922] border border-[#2c6243]/60 shadow-lg">
              <div className="px-3.5 py-2.5 border-b border-white/[0.07] flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-white/20 flex flex-col">
                  <span className="h-1/3 w-full bg-[#ff9933] block" />
                  <span className="h-1/3 w-full bg-white flex items-center justify-center">
                    <span className="w-1 h-1 rounded-full border border-[#000080]" />
                  </span>
                  <span className="h-1/3 w-full bg-[#138808] block" />
                </div>
                <span className="text-[14px] font-bold text-white">INR</span>
              </div>

              <div className="grid grid-cols-2 divide-x divide-white/[0.07] py-3.5 text-center">
                <div>
                  <div className="text-[20px] font-black text-white font-mono tabular-nums leading-tight">
                    ₹{balance.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-[#8f9aa8] mt-0.5 font-medium">Balance</div>
                </div>
                <div>
                  <div className="text-[20px] font-black text-white font-mono tabular-nums leading-tight">
                    ₹{Math.floor(balance * 0.95).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-[#8f9aa8] mt-0.5 font-medium">Withdrawable</div>
                </div>
              </div>
            </div>
          </section>

          {/* Deposit Amount 4x2 Grid */}
          <section className="space-y-3">
            <h3 className="text-[12px] font-medium text-[#8a94a6]">Deposit Amount</h3>
            <div className="grid grid-cols-4 gap-2 pt-1">
              {DEPOSIT_TIERS.map((tier) => {
                const isSelected = selectedTier.amount === tier.amount;
                return (
                  <button
                    key={tier.amount}
                    type="button"
                    onClick={() => setSelectedTier(tier)}
                    className={`relative rounded-xl pt-3.5 pb-2.5 px-1 text-center transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-[#12263f] border-[1.5px] border-[#0095ff] shadow-[0_0_12px_rgba(0,149,255,0.22)]'
                        : 'bg-[#161c26] border border-white/[0.06] hover:border-white/15'
                    }`}
                  >
                    {/* Top Floating Bonus Pill */}
                    <span
                      className={`absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-[1px] rounded-full text-[9px] font-bold flex items-center gap-0.5 whitespace-nowrap ${
                        isSelected
                          ? 'bg-[#0095ff] text-white shadow-[0_2px_8px_rgba(0,149,255,0.4)]'
                          : 'bg-[#222a38] text-[#e2e8f0] border border-white/[0.08]'
                      }`}
                    >
                      <Zap
                        className={`w-2.5 h-2.5 ${
                          isSelected ? 'text-white fill-white' : 'text-[#fbbf24] fill-[#fbbf24]'
                        }`}
                      />
                      <span>+₹{tier.totalExtra.toLocaleString('en-IN')}</span>
                    </span>

                    <span className="block text-[14.5px] font-bold text-white font-mono tabular-nums">
                      ₹{tier.amount}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Limited Time Gift Card (Welcome Bonus Lv.1) */}
          <section className="space-y-2">
            <h3 className="text-[12px] font-medium text-[#8a94a6]">Limited Time Gift</h3>
            <div className="rounded-2xl bg-[#161b24] border border-white/[0.06] overflow-hidden shadow-lg relative">
              {/* Top-left Orange Boosting Ribbon */}
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-br-xl bg-gradient-to-r from-[#ff6b2c] to-[#d94111]">
                <Flame className="w-3 h-3 text-white fill-white" />
                <span className="text-[10.5px] font-bold text-white tracking-tight">Boosting</span>
              </div>

              {/* Card Header: Title + Live Red Countdown */}
              <div className="px-3.5 pt-2 pb-3 flex items-center justify-between">
                <span className="text-[15px] font-bold text-white">Welcome Bonus Lv.1</span>
                <GiftCountdown />
              </div>

              {/* Deposit Cash Row */}
              <div className="mx-3 rounded-xl bg-[#1d232f] px-3.5 py-3 flex items-center justify-between border border-white/[0.04]">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ff9838] to-[#e24912] flex items-center justify-center text-white text-sm shadow">
                    💼
                  </span>
                  <span className="text-[13px] font-semibold text-white">Deposit Cash</span>
                </div>
                <span className="text-[15px] font-black text-white font-mono tabular-nums">
                  ₹{selectedTier.amount.toLocaleString('en-IN')}
                </span>
              </div>

              {/* +Extra Gift Divider */}
              <div className="flex items-center gap-3 px-4 py-2.5 text-[11px] font-medium text-[#8a94a6]">
                <span className="h-[1px] flex-1 bg-white/[0.06]" />
                <span>+Extra Gift</span>
                <span className="h-[1px] flex-1 bg-white/[0.06]" />
              </div>

              {/* 3 Extra Gift Rows: Bonus, Gullak Cash, Discount coupons */}
              <div className="mx-3 mb-3 rounded-xl bg-[#1d232f] border border-white/[0.04] divide-y divide-white/[0.05]">
                {/* Bonus */}
                <div className="px-3.5 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#fde047] to-[#d97706] flex items-center justify-center text-xs shadow">
                      🪙
                    </span>
                    <span className="text-[13px] font-medium text-[#d8dee9]">Bonus</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono tabular-nums">
                    <span className="text-[11px] text-[#64748b] line-through">
                      ₹{selectedTier.oldBonus}
                    </span>
                    <span className="text-[14px] font-bold text-white">₹{selectedTier.bonus}</span>
                  </div>
                </div>

                {/* Gullak Cash */}
                <div className="px-3.5 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#b45309] flex items-center justify-center text-xs shadow">
                      🍯
                    </span>
                    <span className="text-[13px] font-medium text-[#d8dee9]">Gullak Cash</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono tabular-nums">
                    <span className="text-[11px] text-[#64748b] line-through">
                      ₹{selectedTier.oldGullak}
                    </span>
                    <span className="text-[14px] font-bold text-white">₹{selectedTier.gullak}</span>
                  </div>
                </div>

                {/* Discount coupons */}
                <div className="px-3.5 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#fde047] to-[#ea580c] flex items-center justify-center text-xs shadow">
                      🎟️
                    </span>
                    <span className="text-[13px] font-medium text-[#d8dee9]">Discount coupons</span>
                  </div>
                  <span className="text-[14px] font-bold text-white font-mono tabular-nums">
                    ₹{selectedTier.coupon}*1
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Method 2-Column Grid */}
          <section className="space-y-2.5">
            <h3 className="text-[12px] font-medium text-[#8a94a6]">Payment Method</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {/* PayTM */}
              <button
                type="button"
                onClick={() => setPaymentMethod('PayTM')}
                className={`h-[46px] rounded-xl px-3 flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  paymentMethod === 'PayTM'
                    ? 'bg-[#12263f] border-[1.5px] border-[#0095ff] shadow-[0_0_12px_rgba(0,149,255,0.2)]'
                    : 'bg-[#161c26] border border-white/[0.06] hover:border-white/15'
                }`}
              >
                <span className="w-5 h-4 rounded-[3px] bg-[#0ea5e9] flex items-center justify-end pr-0.5 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                <span className="text-[13px] font-semibold text-white">PayTM</span>
              </button>

              {/* Googlepay */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Googlepay')}
                className={`h-[46px] rounded-xl px-3 flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  paymentMethod === 'Googlepay'
                    ? 'bg-[#12263f] border-[1.5px] border-[#0095ff] shadow-[0_0_12px_rgba(0,149,255,0.2)]'
                    : 'bg-[#161c26] border border-white/[0.06] hover:border-white/15'
                }`}
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path d="M12 4L4 12l4 4 8-8-4-4z" fill="#fbbc04" />
                  <path d="M12 4l8 8-4 4-8-8 4-4z" fill="#ea4335" />
                  <path d="M4 12l4 4 4-4-4-4-4 4z" fill="#34a853" />
                  <path d="M16 8l4 4-4 4-4-4 4-4z" fill="#4285f4" />
                </svg>
                <span className="text-[13px] font-semibold text-white">Googlepay</span>
              </button>

              {/* UPI */}
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`h-[46px] rounded-xl px-3 flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  paymentMethod === 'UPI'
                    ? 'bg-[#12263f] border-[1.5px] border-[#0095ff] shadow-[0_0_12px_rgba(0,149,255,0.2)]'
                    : 'bg-[#161c26] border border-white/[0.06] hover:border-white/15'
                }`}
              >
                <span className="w-5 h-3.5 rounded-[2.5px] bg-[#00a6ff] flex flex-col justify-between p-[2.5px] shrink-0">
                  <span className="w-full h-[2px] bg-white/95 rounded-full" />
                  <span className="w-2/3 h-[2px] bg-white/75 rounded-full" />
                </span>
                <span className="text-[13px] font-semibold text-white">UPI</span>
              </button>

              {/* QRcode */}
              <button
                type="button"
                onClick={() => setPaymentMethod('QRcode')}
                className={`h-[46px] rounded-xl px-3 flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  paymentMethod === 'QRcode'
                    ? 'bg-[#12263f] border-[1.5px] border-[#0095ff] shadow-[0_0_12px_rgba(0,149,255,0.2)]'
                    : 'bg-[#161c26] border border-white/[0.06] hover:border-white/15'
                }`}
              >
                <svg
                  className="w-4 h-4 text-[#00b4ff] shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path
                    d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"
                    strokeLinecap="round"
                  />
                  <line x1="7" y1="12" x2="17" y2="12" strokeLinecap="round" />
                </svg>
                <span className="text-[13px] font-semibold text-white">QRcode</span>
              </button>

              {/* Phonepe */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Phonepe')}
                className={`h-[46px] rounded-xl px-3 flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  paymentMethod === 'Phonepe'
                    ? 'bg-[#12263f] border-[1.5px] border-[#0095ff] shadow-[0_0_12px_rgba(0,149,255,0.2)]'
                    : 'bg-[#161c26] border border-white/[0.06] hover:border-white/15'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-[#6739b7] text-white text-[10px] font-black flex items-center justify-center shrink-0">
                  पे
                </span>
                <span className="text-[13px] font-semibold text-white">Phonepe</span>
              </button>
            </div>
          </section>
        </div>

        {/* 3. FIXED YELLOW PROCEED TO PAYMENT FOOTER */}
        <footer className="bg-[#10151d] border-t border-white/[0.06] px-3.5 pt-2.5 pb-3.5 shrink-0 space-y-2">
          {paidMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center gap-2 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{paidMessage}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleProceed}
            disabled={processing}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#facc15] via-[#f5c418] to-[#eab308] text-[#111827] font-extrabold text-[15px] tracking-tight shadow-[0_4px_18px_rgba(250,204,21,0.3)] active:scale-[0.985] transition-transform disabled:opacity-70"
          >
            {processing
              ? 'Processing Payment...'
              : `Proceed to Payment ₹${selectedTier.amount.toLocaleString('en-IN')}`}
          </button>

          <p className="text-center text-[11px] text-[#9aa5b5] font-medium">
            Receive{' '}
            <span className="text-[#facc15] font-bold">
              ₹{totalReceive.toLocaleString('en-IN')} ({selectedTier.amount}+
              {selectedTier.totalExtra})
            </span>{' '}
            after successful payment.
          </p>
        </footer>

        {/* Support / History Info Modal */}
        {infoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
            <div className="w-full max-w-xs bg-[#161c26] border border-slate-700/80 rounded-2xl p-4 space-y-3 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-2">
                <h4 className="text-sm font-bold text-white">
                  {infoModal === 'SUPPORT' ? '24/7 Deposit Help' : 'Recent INR Deposits'}
                </h4>
                <button
                  onClick={() => setInfoModal(null)}
                  className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {infoModal === 'SUPPORT'
                  ? 'PayTM, Googlepay, UPI, QRcode, and Phonepe deposits credit instantly within 10 seconds with full Welcome Bonus.'
                  : 'All recent UPI & PayTM deposits are settled automatically. Select an amount above to make a new instant deposit.'}
              </p>
              <button
                onClick={() => setInfoModal(null)}
                className="w-full py-2 rounded-xl bg-[#facc15] text-[#111827] text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
