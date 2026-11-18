import React, { useState, useEffect } from 'react';
import { DremHome } from './components/DremHome';
import { GameArena } from './components/GameArena';
import { AdminPanel } from './components/AdminPanel';
import { JiliConsole } from './components/JiliConsole';
import { RulesModal } from './components/RulesModal';
import { WalletModal } from './components/WalletModal';
import { ResultOverlay } from './components/ResultOverlay';
import { gameEngine } from './services/gameEngine';
import {
  ChevronLeft,
  Copy,
  Check,
  Trophy,
  Gift,
  Sparkles,
  Award,
} from 'lucide-react';

type ActiveView =
  | 'HOME'
  | 'WINGO'
  | 'ADMIN'
  | 'JILI_API'
  | 'VIP'
  | 'EARN'
  | 'RACE'
  | 'PROMOS';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ActiveView>('HOME');
  const [walletOpen, setWalletOpen] = useState<boolean>(false);
  const [rulesOpen, setRulesOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [, setTick] = useState(0);
  useEffect(() => {
    return gameEngine.subscribe(() => setTick((t) => t + 1));
  }, []);

  const handleCopyInvite = () => {
    navigator.clipboard.writeText('https://ggbsystem.win/r/SAHIL99');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080a0d] text-slate-100 flex justify-center items-start selection:bg-[#ff7338]/30">
      {/* Centered Mobile App Shell (430px) */}
      <div className="w-full max-w-[430px] bg-[#111217] min-h-screen relative shadow-2xl overflow-x-clip flex flex-col">
        {/* 1. EXACT DREM HOME LOBBY */}
        {currentTab === 'HOME' && (
          <DremHome
            userBalance={gameEngine.user.balance}
            currentRoundBets={gameEngine.currentRoundBets}
            onOpenColorGame={() => setCurrentTab('WINGO')}
            onOpenWallet={() => setWalletOpen(true)}
            onOpenAdmin={() => setCurrentTab('ADMIN')}
            onOpenJiliApi={() => setCurrentTab('JILI_API')}
            onOpenBottomTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {/* 2. WIN GO / COLOR PREDICTION ARENA */}
        {currentTab === 'WINGO' && (
          <div className="bg-[#0b101f] text-slate-100 min-h-screen pb-16">
            <div className="bg-[#151920] px-3.5 py-3 border-b border-white/[0.06] flex items-center justify-between sticky top-0 z-40 shadow-md">
              <button
                onClick={() => setCurrentTab('HOME')}
                className="flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white active:scale-95 transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-[#1ad96a]" />
                <span>GGB system</span>
              </button>

              <div className="flex items-center gap-2">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-slate-400 font-mono">Wallet</span>
                  <span className="text-xs font-bold text-[#f5a623] font-mono tabular-nums">
                    ₹{gameEngine.user.balance.toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  onClick={() => setWalletOpen(true)}
                  className="px-2.5 py-1 bg-gradient-to-b from-[#ff8a50] to-[#e24b17] text-white text-[10px] font-bold rounded-lg shadow-sm"
                >
                  Deposit
                </button>
                <button
                  onClick={() => setCurrentTab('ADMIN')}
                  className="px-2 py-1 rounded-lg bg-rose-600/25 text-rose-300 border border-rose-500/40 text-[10px] font-bold"
                >
                  Admin
                </button>
              </div>
            </div>

            <GameArena
              currentPeriod={gameEngine.currentPeriod}
              remainingSeconds={gameEngine.remainingSeconds}
              history={gameEngine.history}
              currentRoundBets={gameEngine.currentRoundBets}
              myBetHistory={gameEngine.myBetHistory}
              user={gameEngine.user}
              onPlaceBet={async (t, a) => await gameEngine.placeUserBet(t, a)}
              onOpenRules={() => setRulesOpen(true)}
              onOpenWallet={() => setWalletOpen(true)}
            />
          </div>
        )}

        {/* 3. VIP TAB */}
        {currentTab === 'VIP' && (
          <div className="min-h-screen bg-[#111217] p-4 space-y-4 pb-20">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <button
                onClick={() => setCurrentTab('HOME')}
                className="flex items-center gap-1 text-xs font-bold text-[#1ad96a]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <h3 className="text-sm font-bold text-white">VIP Club</h3>
              <div className="w-8" />
            </div>

            <div className="bg-gradient-to-br from-[#1d2532] to-[#131820] border border-amber-500/30 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                  VIP Level {gameEngine.user.vipLevel}
                </span>
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-xl font-black text-white font-display">
                {gameEngine.user.name}
              </div>
              <p className="text-xs text-slate-400">
                Total Wagered: ₹{gameEngine.user.totalWagered.toLocaleString('en-IN')} · Weekly Cashback 1.2% Active
              </p>
              <button
                onClick={() => {
                  gameEngine.adjustUserBalance(500);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-b from-[#ff8a50] to-[#e24b17] text-white text-xs font-bold shadow-lg"
              >
                Claim ₹500 VIP Weekly Bonus
              </button>
            </div>
          </div>
        )}

        {/* 4. EARN / REFERRAL TAB */}
        {currentTab === 'EARN' && (
          <div className="min-h-screen bg-[#111217] p-4 space-y-4 pb-20">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <button
                onClick={() => setCurrentTab('HOME')}
                className="flex items-center gap-1 text-xs font-bold text-[#1ad96a]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <h3 className="text-sm font-bold text-white">Earn &amp; Affiliate</h3>
              <div className="w-8" />
            </div>

            <div className="bg-[#151920] border border-white/[0.06] rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-[#f5a623] text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Invite Friends &amp; Earn 1.5% Bet Commission</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://ggbsystem.win/r/SAHIL99"
                  className="flex-1 bg-[#0b0e13] border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300"
                />
                <button
                  onClick={handleCopyInvite}
                  className="px-3 py-2 rounded-xl bg-[#1ad96a] text-slate-950 text-xs font-bold flex items-center gap-1"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. ₹30L RACE TAB */}
        {currentTab === 'RACE' && (
          <div className="min-h-screen bg-[#111217] p-4 space-y-4 pb-20">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <button
                onClick={() => setCurrentTab('HOME')}
                className="flex items-center gap-1 text-xs font-bold text-[#1ad96a]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <h3 className="text-sm font-bold text-white">₹30L Wager Race</h3>
              <div className="w-8" />
            </div>

            <div className="bg-gradient-to-br from-[#192334] to-[#11161f] border border-cyan-500/20 rounded-2xl p-5 text-center space-y-2">
              <Trophy className="w-9 h-9 text-[#f5a623] mx-auto" />
              <div className="text-2xl font-black text-white font-mono">₹30,00,000</div>
              <p className="text-xs text-slate-400">Monthly Leaderboard Prize Pool · Top 100 Players Paid Daily</p>
              <button
                onClick={() => setCurrentTab('WINGO')}
                className="mt-2 px-5 py-2 rounded-xl bg-[#1ad96a] text-slate-950 text-xs font-bold"
              >
                Play Originals to Climb
              </button>
            </div>
          </div>
        )}

        {/* 6. PROMOS TAB */}
        {currentTab === 'PROMOS' && (
          <div className="min-h-screen bg-[#111217] p-4 space-y-4 pb-20">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <button
                onClick={() => setCurrentTab('HOME')}
                className="flex items-center gap-1 text-xs font-bold text-[#1ad96a]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <h3 className="text-sm font-bold text-white">Promotions</h3>
              <div className="w-8" />
            </div>

            <div className="bg-[#151920] border border-white/[0.06] rounded-2xl p-4 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                  <Gift className="w-4 h-4 text-[#ff7338]" />
                  <span>First Crypto / UPI Deposit Bonus</span>
                </div>
                <p className="text-xs text-slate-400">Get +150% bonus on USDT (BSC/ETH/TRC20) deposits</p>
              </div>
              <button
                onClick={() => setWalletOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-b from-[#ff8a50] to-[#e24b17] text-white text-xs font-bold shrink-0"
              >
                Deposit
              </button>
            </div>
          </div>
        )}

        {/* 7. ADMIN CONTROL PANEL */}
        {currentTab === 'ADMIN' && (
          <div className="bg-[#050811] text-slate-100 min-h-screen pb-16">
            <div className="p-3 bg-[#151920] border-b border-slate-800 flex items-center justify-between sticky top-0 z-40">
              <button
                onClick={() => setCurrentTab('HOME')}
                className="text-xs text-[#1ad96a] font-semibold flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to GGB system</span>
              </button>
              <span className="text-xs font-bold text-rose-400 font-mono">ADMIN CONTROL PANEL</span>
            </div>
            <AdminPanel
              currentPeriod={gameEngine.currentPeriod}
              remainingSeconds={gameEngine.remainingSeconds}
              currentBets={gameEngine.currentRoundBets}
              history={gameEngine.history}
              user={gameEngine.user}
            />
          </div>
        )}

        {/* 8. JILI API CONSOLE */}
        {currentTab === 'JILI_API' && (
          <div className="bg-[#050811] text-slate-100 min-h-screen pb-16">
            <div className="p-3 bg-[#151920] border-b border-slate-800 flex items-center justify-between sticky top-0 z-40">
              <button
                onClick={() => setCurrentTab('HOME')}
                className="text-xs text-[#1ad96a] font-semibold flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to GGB system</span>
              </button>
              <span className="text-xs font-bold text-indigo-400 font-mono">JILI API GATEWAY</span>
            </div>
            <JiliConsole userBalance={gameEngine.user.balance} />
          </div>
        )}
      </div>

      <ResultOverlay
        resultNotice={gameEngine.lastResultNotice}
        onDismiss={() => {
          gameEngine.lastResultNotice = null;
          setTick((t) => t + 1);
        }}
      />

      <WalletModal
        isOpen={walletOpen}
        onClose={() => setWalletOpen(false)}
        balance={gameEngine.user.balance}
      />

      <RulesModal
        isOpen={rulesOpen}
        onClose={() => setRulesOpen(false)}
        currentHash={gameEngine.currentPeriod?.hash || ''}
        currentPeriod={gameEngine.currentPeriod?.periodId || ''}
      />
    </div>
  );
}
