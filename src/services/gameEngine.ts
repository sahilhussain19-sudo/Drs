import {
  AdminSettings,
  BetTarget,
  ColorResult,
  GamePeriod,
  UserAccount,
  UserBet
} from '../types/game';
import { jiliApi } from './jiliApi';
import { soundManager } from './audio';

// Helper to determine color characteristics for any number 0-9
export function getNumberDetails(num: number): {
  color: ColorResult;
  size: 'BIG' | 'SMALL';
  colorName: string;
  badgeBg: string;
} {
  const size: 'BIG' | 'SMALL' = num >= 5 ? 'BIG' : 'SMALL';
  
  if (num === 0) {
    return {
      color: 'RED_VIOLET',
      size,
      colorName: 'Red + Violet',
      badgeBg: 'linear-gradient(135deg, #ef4444 50%, #8b5cf6 50%)'
    };
  }
  if (num === 5) {
    return {
      color: 'GREEN_VIOLET',
      size,
      colorName: 'Green + Violet',
      badgeBg: 'linear-gradient(135deg, #10b981 50%, #8b5cf6 50%)'
    };
  }
  if ([1, 3, 7, 9].includes(num)) {
    return {
      color: 'GREEN',
      size,
      colorName: 'Green',
      badgeBg: '#10b981'
    };
  }
  return {
    color: 'RED',
    size,
    colorName: 'Red',
    badgeBg: '#ef4444'
  };
}

// Bot names for realistic betting room
const BOT_NAMES = [
  'Aarav_VIP', 'Rohit777', 'Kavita_Luck', 'Rajesh_Pro', 
  'Vikram_Win', 'Pooja_Club', 'Deepak99', 'Neha_Royale',
  'JiliKing', 'LuckySpinner', 'Vikas_Gold', 'Sneha_Bet'
];

export class GameEngine {
  public currentPeriod!: GamePeriod;
  public history: GamePeriod[] = [];
  public currentRoundBets: UserBet[] = [];
  public myBetHistory: UserBet[] = [];
  public adminSettings: AdminSettings = {
    mode: 'FAIR_RNG',
    manualOverrideNumber: null,
    botBetting: true,
    botVolume: 'MEDIUM',
    roundDuration: 30,
    houseMarginPercent: 5,
    isPaused: false
  };

  public user: UserAccount = {
    id: 'USR_PLAYER_1001',
    name: 'Sahil Hussain',
    role: 'PLAYER',
    balance: 50000,
    vipLevel: 5,
    totalWagered: 14500,
    totalWon: 22800,
    avatarSeed: 'casino_vip'
  };

  private timerInterval: any = null;
  public remainingSeconds: number = 30;
  private subscribers: (() => void)[] = [];
  public lastResultNotice: { periodId: string; number: number; color: ColorResult; wonAmount: number } | null = null;

  constructor() {
    this.initSavedData();
    this.seedHistory();
    this.startNewPeriod();
    this.startLoop();
  }

  private initSavedData() {
    if (typeof window === 'undefined') return;
    try {
      const savedUser = localStorage.getItem('jili_user_account');
      if (savedUser) {
        this.user = { ...this.user, ...JSON.parse(savedUser) };
      }
      const savedAdmin = localStorage.getItem('jili_admin_settings');
      if (savedAdmin) {
        this.adminSettings = { ...this.adminSettings, ...JSON.parse(savedAdmin) };
      }
    } catch {
      // fallback
    }
  }

  public subscribe(cb: () => void) {
    this.subscribers.push(cb);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== cb);
    };
  }

  private notify() {
    this.subscribers.forEach(cb => cb());
  }

  private saveState() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('jili_user_account', JSON.stringify(this.user));
      localStorage.setItem('jili_admin_settings', JSON.stringify(this.adminSettings));
    } catch {
      // fallback
    }
  }

  private seedHistory() {
    const baseTime = Date.now() - 30 * 30 * 1000;
    const initialList: GamePeriod[] = [];
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    for (let i = 1; i <= 24; i++) {
      const periodId = `${dateStr}${String(100 + i).padStart(4, '0')}`;
      const num = Math.floor(Math.random() * 10);
      const details = getNumberDetails(num);
      initialList.push({
        periodId,
        startTime: baseTime + i * 30000,
        endTime: baseTime + (i + 1) * 30000,
        durationSeconds: 30,
        status: 'COMPLETED',
        resultNumber: num,
        resultColor: details.color,
        resultSize: details.size,
        hash: 'SHA256_' + Math.random().toString(36).substring(2, 10),
        seed: 'SEED_' + Math.random().toString(36).substring(2, 8),
        totalBetsAmount: Math.floor(Math.random() * 8000 + 4000),
        totalPayout: Math.floor(Math.random() * 6000 + 3000)
      });
    }
    this.history = initialList;
  }

  public startNewPeriod() {
    const nextIdx = this.history.length + 101;
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const periodId = `${dateStr}${String(nextIdx).padStart(4, '0')}`;
    const duration = this.adminSettings.roundDuration;

    this.currentPeriod = {
      periodId,
      startTime: Date.now(),
      endTime: Date.now() + duration * 1000,
      durationSeconds: duration,
      status: 'BETTING',
      hash: 'H_' + Math.random().toString(36).substring(2, 12).toUpperCase(),
      seed: 'S_' + Math.random().toString(36).substring(2, 10),
      totalBetsAmount: 0,
      totalPayout: 0
    };

    this.remainingSeconds = duration;
    this.currentRoundBets = [];
    this.lastResultNotice = null;
    this.notify();
  }

  private startLoop() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      if (this.adminSettings.isPaused) return;

      if (this.currentPeriod.status === 'BETTING') {
        this.remainingSeconds--;

        // Simulated bot bets during countdown
        if (this.adminSettings.botBetting && this.remainingSeconds > 5 && Math.random() < 0.65) {
          this.generateBotBet();
        }

        // Sound countdown tick on last 5 seconds
        if (this.remainingSeconds <= 5 && this.remainingSeconds > 0) {
          soundManager.playTick();
        }

        // Lock betting at <= 5s
        if (this.remainingSeconds <= 5 && this.currentPeriod.status === 'BETTING') {
          this.currentPeriod.status = 'LOCKED';
          soundManager.playLockWarning();
        }

        if (this.remainingSeconds <= 0) {
          this.settleRound();
        }

        this.notify();
      }
    }, 1000);
  }

  // Generate realistic simulated player bet
  private generateBotBet() {
    const botName = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
    const targets: BetTarget[] = ['GREEN', 'RED', 'VIOLET', 'BIG', 'SMALL', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const pickedTarget = targets[Math.floor(Math.random() * targets.length)];
    const chipValues = [100, 200, 500, 1000, 2000, 5000];
    const amount = chipValues[Math.floor(Math.random() * chipValues.length)];

    const targetType = typeof pickedTarget === 'number' 
      ? 'NUMBER' 
      : ['BIG', 'SMALL'].includes(pickedTarget as string) 
        ? 'SIZE' 
        : 'COLOR';

    const bet: UserBet = {
      id: 'BOT_BET_' + Math.random().toString(36).substring(2, 9),
      userId: 'BOT_' + botName,
      userName: botName,
      isBot: true,
      periodId: this.currentPeriod.periodId,
      target: pickedTarget,
      targetType,
      amount,
      multiplier: targetType === 'NUMBER' ? 9 : (pickedTarget === 'VIOLET' ? 4.5 : 2),
      payout: 0,
      status: 'PENDING',
      createdAt: Date.now(),
      jiliTransId: 'JL_BOT_' + Math.random().toString(36).substring(2, 8)
    };

    this.currentRoundBets.push(bet);
    this.currentPeriod.totalBetsAmount += amount;
  }

  // Place a real User Bet
  public async placeUserBet(target: BetTarget, amount: number): Promise<{ success: boolean; message: string }> {
    if (this.currentPeriod.status !== 'BETTING' || this.remainingSeconds <= 5) {
      return { success: false, message: 'Betting is locked for current round' };
    }

    if (this.user.balance < amount) {
      return { success: false, message: 'Insufficient wallet balance' };
    }

    if (amount <= 0) {
      return { success: false, message: 'Invalid bet amount' };
    }

    // Call Jili API Gateway Bet endpoint
    const jiliRes = await jiliApi.placeBet(this.user.id, amount, this.currentPeriod.periodId, target);
    
    // Deduct user balance
    this.user.balance -= amount;
    this.user.totalWagered += amount;
    this.saveState();

    soundManager.playChip();

    const targetType = typeof target === 'number' 
      ? 'NUMBER' 
      : ['BIG', 'SMALL'].includes(target as string) 
        ? 'SIZE' 
        : 'COLOR';

    const multiplier = targetType === 'NUMBER' ? 9 : (target === 'VIOLET' ? 4.5 : 2);

    const bet: UserBet = {
      id: 'BET_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId: this.user.id,
      userName: this.user.name,
      isBot: false,
      periodId: this.currentPeriod.periodId,
      target,
      targetType,
      amount,
      multiplier,
      payout: 0,
      status: 'PENDING',
      createdAt: Date.now(),
      jiliTransId: jiliRes.transId
    };

    this.currentRoundBets.push(bet);
    this.myBetHistory.unshift(bet);
    this.currentPeriod.totalBetsAmount += amount;
    this.notify();

    return { success: true, message: 'Bet accepted by Jili API!' };
  }

  // Determine winning number based on Admin Mode
  public calculateWinningNumber(): number {
    // 1. Manual Admin Override
    if (this.adminSettings.mode === 'MANUAL_OVERRIDE' && this.adminSettings.manualOverrideNumber !== null) {
      const forced = this.adminSettings.manualOverrideNumber;
      return Math.min(9, Math.max(0, forced));
    }

    // 2. Lowest Payout Mode (Maximum House Profit / Anti-Loss Engine)
    if (this.adminSettings.mode === 'LOWEST_PAYOUT') {
      let lowestPayout = Infinity;
      let bestNumber = 0;

      // Evaluate each number 0 to 9
      for (let testNum = 0; testNum <= 9; testNum++) {
        let testPayout = 0;
        const testDetails = getNumberDetails(testNum);

        for (const bet of this.currentRoundBets) {
          testPayout += this.calculateBetPayoutForNumber(bet, testNum, testDetails.color, testDetails.size);
        }

        if (testPayout < lowestPayout) {
          lowestPayout = testPayout;
          bestNumber = testNum;
        }
      }
      return bestNumber;
    }

    // 3. True Provably Fair RNG
    return Math.floor(Math.random() * 10);
  }

  // Calculate potential payout for any single bet against a tested number
  public calculateBetPayoutForNumber(bet: UserBet, num: number, color: ColorResult, size: 'BIG' | 'SMALL'): number {
    const amt = bet.amount;

    // Exact Number Bet
    if (typeof bet.target === 'number') {
      return bet.target === num ? amt * 9 : 0;
    }

    // Size Bet (Big / Small)
    if (bet.target === 'BIG') {
      return size === 'BIG' ? amt * 2 : 0;
    }
    if (bet.target === 'SMALL') {
      return size === 'SMALL' ? amt * 2 : 0;
    }

    // Color Bet
    if (bet.target === 'GREEN') {
      if (color === 'GREEN') return amt * 2;
      if (color === 'GREEN_VIOLET') return amt * 1.5; // Split payout on 5
      return 0;
    }

    if (bet.target === 'RED') {
      if (color === 'RED') return amt * 2;
      if (color === 'RED_VIOLET') return amt * 1.5; // Split payout on 0
      return 0;
    }

    if (bet.target === 'VIOLET') {
      if (color === 'GREEN_VIOLET' || color === 'RED_VIOLET' || color === 'VIOLET') {
        return amt * 4.5;
      }
      return 0;
    }

    return 0;
  }

  // Execute Settlement
  public async settleRound() {
    this.currentPeriod.status = 'SETTLING';
    soundManager.playReveal();

    const winNumber = this.calculateWinningNumber();
    const details = getNumberDetails(winNumber);

    this.currentPeriod.resultNumber = winNumber;
    this.currentPeriod.resultColor = details.color;
    this.currentPeriod.resultSize = details.size;

    let totalPayout = 0;
    let userWonTotal = 0;

    // Settle all bets
    for (const bet of this.currentRoundBets) {
      const payout = this.calculateBetPayoutForNumber(bet, winNumber, details.color, details.size);
      bet.payout = payout;
      bet.status = payout > 0 ? 'WON' : 'LOST';
      totalPayout += payout;

      if (!bet.isBot && payout > 0) {
        userWonTotal += payout;
        this.user.balance += payout;
        this.user.totalWon += payout;
      }
    }

    this.currentPeriod.totalPayout = totalPayout;
    this.currentPeriod.status = 'COMPLETED';

    // Call Jili Settle endpoint
    await jiliApi.settleRound(
      this.currentPeriod.periodId,
      winNumber,
      details.color,
      details.size,
      this.currentPeriod.totalBetsAmount,
      totalPayout
    );

    // Play win sound if user won anything
    if (userWonTotal > 0) {
      soundManager.playWin();
    }

    this.lastResultNotice = {
      periodId: this.currentPeriod.periodId,
      number: winNumber,
      color: details.color,
      wonAmount: userWonTotal
    };

    // Save history
    this.history.unshift({ ...this.currentPeriod });
    if (this.history.length > 50) this.history.pop();

    this.saveState();
    this.notify();

    // After 4.5 seconds display of result, start next round
    setTimeout(() => {
      this.startNewPeriod();
    }, 4500);
  }

  // Force Instant Settlement from Admin Control Panel
  public forceInstantSettle() {
    if (this.currentPeriod.status === 'BETTING' || this.currentPeriod.status === 'LOCKED') {
      this.remainingSeconds = 0;
      this.settleRound();
    }
  }

  // Update Admin Settings
  public updateAdminSettings(settings: Partial<AdminSettings>) {
    this.adminSettings = { ...this.adminSettings, ...settings };
    this.saveState();
    this.notify();
  }

  // Admin user balance adjustment
  public adjustUserBalance(amount: number) {
    this.user.balance = Math.max(0, this.user.balance + amount);
    this.saveState();
    this.notify();
  }
}

export const gameEngine = new GameEngine();
