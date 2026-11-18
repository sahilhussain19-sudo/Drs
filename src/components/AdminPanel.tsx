import React, { useState } from 'react';
import {
  ShieldAlert,
  Play,
  Pause,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  DollarSign,
  Users,
  TrendingUp,
  Cpu,
  Eye,
  Check
} from 'lucide-react';
import { gameEngine, getNumberDetails } from '../services/gameEngine';
import { AdminResultMode, ColorResult, GamePeriod, UserAccount, UserBet } from '../types/game';

interface AdminPanelProps {
  currentPeriod: GamePeriod;
  remainingSeconds: number;
  currentBets: UserBet[];
  history: GamePeriod[];
  user: UserAccount;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentPeriod,
  remainingSeconds,
  currentBets,
  history,
  user,
}) => {
  const adminSettings = gameEngine.adminSettings;
  const [selectedForceNumber, setSelectedForceNumber] = useState<number | null>(
    adminSettings.manualOverrideNumber
  );
  const [customCredit, setCustomCredit] = useState<string>('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Calculate live pool totals for current period
  const totalWagered = currentBets.reduce((acc, b) => acc + b.amount, 0);
  const greenPool = currentBets.filter(b => b.target === 'GREEN').reduce((acc, b) => acc + b.amount, 0);
  const redPool = currentBets.filter(b => b.target === 'RED').reduce((acc, b) => acc + b.amount, 0);
  const violetPool = currentBets.filter(b => b.target === 'VIOLET').reduce((acc, b) => acc + b.amount, 0);
  const bigPool = currentBets.filter(b => b.target === 'BIG').reduce((acc, b) => acc + b.amount, 0);
  const smallPool = currentBets.filter(b => b.target === 'SMALL').reduce((acc, b) => acc + b.amount, 0);

  // Numbers 0-9 pool
  const numbersPool: number[] = Array(10).fill(0);
  currentBets.forEach(b => {
    if (typeof b.target === 'number' && b.target >= 0 && b.target <= 9) {
      numbersPool[b.target] += b.amount;
    }
  });

  // Calculate simulated payout for each possible number (0-9) to see House Profit/Loss
  const outcomeSimulations = Array.from({ length: 10 }, (_, num) => {
    const details = getNumberDetails(num);
    let simulatedPayout = 0;
    currentBets.forEach(b => {
      simulatedPayout += gameEngine.calculateBetPayoutForNumber(b, num, details.color, details.size);
    });
    const houseProfit = totalWagered - simulatedPayout;
    return {
      num,
      color: details.colorName,
      badgeBg: details.badgeBg,
      size: details.size,
      betsOnNumber: numbersPool[num],
      simulatedPayout,
      houseProfit
    };
  });

  // Find lowest payout outcome (smart profit)
  const lowestPayoutSim = [...outcomeSimulations].sort((a, b) => a.simulatedPayout - b.simulatedPayout)[0];

  // Aggregated house statistics from history
  const totalTurnoverAll = history.reduce((acc, h) => acc + h.totalBetsAmount, 0) + totalWagered;
  const totalPayoutAll = history.reduce((acc, h) => acc + h.totalPayout, 0);
  const netHouseProfitAll = totalTurnoverAll - totalPayoutAll;
  const overallRtp = totalTurnoverAll > 0 ? ((totalPayoutAll / totalTurnoverAll) * 100).toFixed(1) : '95.0';

  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Change Admin Mode
  const handleModeChange = (mode: AdminResultMode) => {
    if (mode === 'MANUAL_OVERRIDE' && selectedForceNumber === null) {
      setSelectedForceNumber(0);
      gameEngine.updateAdminSettings({ mode, manualOverrideNumber: 0 });
    } else {
      gameEngine.updateAdminSettings({ mode });
    }
    triggerNotice(`Result control switched to ${mode.replace('_', ' ')}`);
  };

  // Set Manual Override Number
  const handleSelectForceNumber = (num: number) => {
    setSelectedForceNumber(num);
    gameEngine.updateAdminSettings({
      mode: 'MANUAL_OVERRIDE',
      manualOverrideNumber: num
    });
    const details = getNumberDetails(num);
    triggerNotice(`Override Set! Round ${currentPeriod.periodId} will result in Number ${num} (${details.colorName})`);
  };

  const handleClearOverride = () => {
    setSelectedForceNumber(null);
    gameEngine.updateAdminSettings({
      mode: 'FAIR_RNG',
      manualOverrideNumber: null
    });
    triggerNotice('Manual override cleared. Reverted to Fair RNG.');
  };

  const handleInstantSettle = () => {
    gameEngine.forceInstantSettle();
    triggerNotice('Round settled instantly!');
  };

  const handleTogglePause = () => {
    const isPaused = !adminSettings.isPaused;
    gameEngine.updateAdminSettings({ isPaused });
    triggerNotice(isPaused ? 'Game Timer Paused' : 'Game Timer Resumed');
  };

  const handleAdjustBalance = (amt: number) => {
    gameEngine.adjustUserBalance(amt);
    triggerNotice(`₹${amt > 0 ? '+' : ''}${amt.toLocaleString('en-IN')} updated to player wallet`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Admin Notice Bar */}
      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-amber-300 text-xs font-semibold animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Header Overview Card */}
      <div className="bg-slate-900 border border-rose-900/50 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                Real-Time Admin Control &amp; Result Manager
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  REAL-TIME OVERRIDE ACTIVE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Period {currentPeriod.periodId} · Status: <span className="font-mono text-amber-400 font-bold">{currentPeriod.status}</span> · Countdown: <span className="font-mono text-white font-bold">{remainingSeconds}s</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTogglePause}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                adminSettings.isPaused
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {adminSettings.isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{adminSettings.isPaused ? 'Resume Timer' : 'Pause Timer'}</span>
            </button>

            <button
              onClick={handleInstantSettle}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Instant Settle Round</span>
            </button>
          </div>
        </div>

        {/* Global House Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Total House Turnover</span>
            <span className="text-sm font-bold text-white font-mono">₹{totalTurnoverAll.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Player Payout</span>
            <span className="text-sm font-bold text-amber-400 font-mono">₹{totalPayoutAll.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Net House Profit (GGR)</span>
            <span className={`text-sm font-bold font-mono ${netHouseProfitAll >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ₹{netHouseProfitAll.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">RTP (Player Return)</span>
            <span className="text-sm font-bold text-indigo-400 font-mono">{overallRtp}%</span>
          </div>
        </div>
      </div>

      {/* Real-time Result Rigging & Strategy Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Result Decider */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Cpu className="w-4 h-4 text-rose-400" />
              Game Result Automation &amp; Manual Override
            </h3>
            {adminSettings.mode === 'MANUAL_OVERRIDE' && (
              <button
                onClick={handleClearOverride}
                className="text-xs text-rose-400 hover:text-rose-300 underline font-mono flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Override
              </button>
            )}
          </div>

          {/* Mode Switcher Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => handleModeChange('MANUAL_OVERRIDE')}
              className={`p-3 rounded-xl border text-left transition-all ${
                adminSettings.mode === 'MANUAL_OVERRIDE'
                  ? 'border-rose-500 bg-rose-500/15 shadow-md shadow-rose-500/10'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-rose-400">1. Manual Override</span>
                {adminSettings.mode === 'MANUAL_OVERRIDE' && <Check className="w-3.5 h-3.5 text-rose-400" />}
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Force exact winning number (0-9) chosen by admin.
              </p>
            </button>

            <button
              onClick={() => handleModeChange('LOWEST_PAYOUT')}
              className={`p-3 rounded-xl border text-left transition-all ${
                adminSettings.mode === 'LOWEST_PAYOUT'
                  ? 'border-emerald-500 bg-emerald-500/15 shadow-md shadow-emerald-500/10'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-emerald-400">2. Smart Profit Mode</span>
                {adminSettings.mode === 'LOWEST_PAYOUT' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                House win algorithm: Auto-forces lowest player payout!
              </p>
            </button>

            <button
              onClick={() => handleModeChange('FAIR_RNG')}
              className={`p-3 rounded-xl border text-left transition-all ${
                adminSettings.mode === 'FAIR_RNG'
                  ? 'border-indigo-500 bg-indigo-500/15 shadow-md shadow-indigo-500/10'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-indigo-400">3. Provably Fair RNG</span>
                {adminSettings.mode === 'FAIR_RNG' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Natural unbiased random outcome with SHA256 seed.
              </p>
            </button>
          </div>

          {/* Quick Select Override Grid */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Click any Number to Force Result for Period {currentPeriod.periodId}:
              </label>
              {adminSettings.mode === 'LOWEST_PAYOUT' && (
                <span className="text-[11px] text-emerald-400 font-mono font-bold">
                  Recommended: Number {lowestPayoutSim.num} (+₹{lowestPayoutSim.houseProfit.toLocaleString('en-IN')})
                </span>
              )}
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {Array.from({ length: 10 }, (_, num) => {
                const details = getNumberDetails(num);
                const isSelected = selectedForceNumber === num && adminSettings.mode === 'MANUAL_OVERRIDE';
                const isSmartPick = adminSettings.mode === 'LOWEST_PAYOUT' && lowestPayoutSim.num === num;

                return (
                  <button
                    key={num}
                    onClick={() => handleSelectForceNumber(num)}
                    className={`h-14 rounded-xl flex flex-col items-center justify-center relative transition-all border ${
                      isSelected
                        ? 'ring-2 ring-rose-500 ring-offset-2 ring-offset-slate-900 border-white scale-105'
                        : isSmartPick
                          ? 'ring-2 ring-emerald-500 ring-offset-1 ring-offset-slate-900 border-emerald-400'
                          : 'border-slate-800/80 hover:border-slate-600'
                    }`}
                    style={{ background: details.badgeBg }}
                  >
                    <span className="text-lg font-black text-white font-mono drop-shadow">
                      {num}
                    </span>
                    <span className="text-[9px] font-bold text-white/90 uppercase tracking-tighter drop-shadow-sm">
                      {details.size}
                    </span>
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-[10px] text-white">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Status Banner */}
            {adminSettings.mode === 'MANUAL_OVERRIDE' && selectedForceNumber !== null && (
              <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300 font-mono">
                <span>
                  FORCED RESULT ACTIVE: <strong>Number {selectedForceNumber}</strong> ({getNumberDetails(selectedForceNumber).colorName})
                </span>
                <span className="text-[10px] uppercase px-2 py-0.5 bg-rose-500 text-white rounded font-bold">
                  Guaranteed Win
                </span>
              </div>
            )}

            {adminSettings.mode === 'LOWEST_PAYOUT' && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 font-mono">
                <span>
                  SMART ANTI-LOSS ENGINE: Will settle on <strong>Number {lowestPayoutSim.num}</strong> to maximize house profit by <strong>+₹{lowestPayoutSim.houseProfit.toLocaleString('en-IN')}</strong>.
                </span>
                <span className="text-[10px] uppercase px-2 py-0.5 bg-emerald-500 text-slate-950 rounded font-bold">
                  Auto House Win
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Live Current Round Pool Breakdown */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white font-display flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              Live Bets Breakdown
            </span>
            <span className="text-xs font-mono font-bold text-amber-400">
              Pool: ₹{totalWagered.toLocaleString('en-IN')}
            </span>
          </h3>

          {/* Color Breakdown Chips */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-xl">
              <span className="text-[10px] text-emerald-400 font-bold block uppercase">Green Bets</span>
              <span className="text-sm font-bold text-emerald-300">₹{greenPool.toLocaleString('en-IN')}</span>
            </div>

            <div className="bg-purple-950/40 border border-purple-800/40 p-2.5 rounded-xl">
              <span className="text-[10px] text-purple-400 font-bold block uppercase">Violet Bets</span>
              <span className="text-sm font-bold text-purple-300">₹{violetPool.toLocaleString('en-IN')}</span>
            </div>

            <div className="bg-rose-950/40 border border-rose-800/40 p-2.5 rounded-xl">
              <span className="text-[10px] text-rose-400 font-bold block uppercase">Red Bets</span>
              <span className="text-sm font-bold text-rose-300">₹{redPool.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Big / Small Breakdown */}
          <div className="grid grid-cols-2 gap-2 text-center font-mono">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-amber-400 font-bold block uppercase">Big (5-9)</span>
              <span className="text-sm font-bold text-slate-200">₹{bigPool.toLocaleString('en-IN')}</span>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-cyan-400 font-bold block uppercase">Small (0-4)</span>
              <span className="text-sm font-bold text-slate-200">₹{smallPool.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Room Settings Controls */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              Room Simulation &amp; Speed
            </span>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Simulated Players Betting:</span>
              <button
                onClick={() => gameEngine.updateAdminSettings({ botBetting: !adminSettings.botBetting })}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                  adminSettings.botBetting
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {adminSettings.botBetting ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Round Duration:</span>
              <div className="flex gap-1">
                {[15, 30, 60].map((dur) => (
                  <button
                    key={dur}
                    onClick={() => gameEngine.updateAdminSettings({ roundDuration: dur })}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold ${
                      adminSettings.roundDuration === dur
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {dur}s
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payout Simulation Matrix (All 10 outcomes) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white font-display flex items-center justify-between">
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Live Outcome Payout Simulator (Current Round {currentPeriod.periodId})
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Analyzes house profit across all 10 outcomes
          </span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Outcome</th>
                <th className="py-2.5 px-3">Color</th>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Bets on #</th>
                <th className="py-2.5 px-3">Player Payout</th>
                <th className="py-2.5 px-3">House Profit</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {outcomeSimulations.map((sim) => {
                const isProfitable = sim.houseProfit >= 0;
                const isSelected = selectedForceNumber === sim.num && adminSettings.mode === 'MANUAL_OVERRIDE';
                return (
                  <tr
                    key={sim.num}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-rose-950/40'
                        : sim.num === lowestPayoutSim.num
                          ? 'bg-emerald-950/20'
                          : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white"
                        style={{ background: sim.badgeBg }}
                      >
                        {sim.num}
                      </span>
                      <span>#{sim.num}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{sim.color}</td>
                    <td className="py-2.5 px-3 text-slate-400">{sim.size}</td>
                    <td className="py-2.5 px-3 text-slate-300">₹{sim.betsOnNumber.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-amber-400 font-bold">₹{sim.simulatedPayout.toLocaleString('en-IN')}</td>
                    <td className={`py-2.5 px-3 font-bold ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isProfitable ? '+' : ''}₹{sim.houseProfit.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleSelectForceNumber(sim.num)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                          isSelected
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {isSelected ? 'Forced ✓' : 'Force Win'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Balance & Account Management */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-amber-400" />
          Player Account &amp; Wallet Management
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Player:</span>
              <span className="font-bold text-white font-mono">{user.name} ({user.id})</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Current Balance:</span>
              <span className="text-base font-bold text-emerald-400 font-mono">
                ₹{user.balance.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Wagered / Won:</span>
              <span className="text-slate-300 font-mono">
                ₹{user.totalWagered.toLocaleString('en-IN')} / ₹{user.totalWon.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              Quick Credit / Debit
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleAdjustBalance(1000)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold transition-colors"
              >
                +₹1,000
              </button>
              <button
                onClick={() => handleAdjustBalance(5000)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold transition-colors"
              >
                +₹5,000
              </button>
              <button
                onClick={() => handleAdjustBalance(25000)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold transition-colors"
              >
                +₹25,000
              </button>
              <button
                onClick={() => handleAdjustBalance(-5000)}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold transition-colors"
              >
                -₹5,000
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
