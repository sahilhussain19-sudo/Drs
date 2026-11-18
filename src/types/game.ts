export type BetTargetType = 'COLOR' | 'NUMBER' | 'SIZE';

export type BetTarget = 
  | 'GREEN' 
  | 'VIOLET' 
  | 'RED' 
  | 'BIG' 
  | 'SMALL' 
  | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type ColorResult = 'GREEN' | 'VIOLET' | 'RED' | 'GREEN_VIOLET' | 'RED_VIOLET';

export interface GamePeriod {
  periodId: string;
  startTime: number;
  endTime: number;
  durationSeconds: number;
  status: 'BETTING' | 'LOCKED' | 'SETTLING' | 'COMPLETED';
  resultNumber?: number;
  resultColor?: ColorResult;
  resultSize?: 'BIG' | 'SMALL';
  hash: string;
  seed: string;
  totalBetsAmount: number;
  totalPayout: number;
}

export interface UserBet {
  id: string;
  userId: string;
  userName: string;
  isBot?: boolean;
  periodId: string;
  target: BetTarget;
  targetType: BetTargetType;
  amount: number;
  multiplier: number;
  payout: number;
  status: 'PENDING' | 'WON' | 'LOST';
  createdAt: number;
  jiliTransId: string;
}

export type AdminResultMode = 'FAIR_RNG' | 'LOWEST_PAYOUT' | 'MANUAL_OVERRIDE';

export interface AdminSettings {
  mode: AdminResultMode;
  manualOverrideNumber: number | null;
  botBetting: boolean;
  botVolume: 'LOW' | 'MEDIUM' | 'HIGH';
  roundDuration: number; // 30, 60, etc.
  houseMarginPercent: number; // e.g. 5%
  isPaused: boolean;
}

export interface JiliApiLog {
  id: string;
  timestamp: string;
  endpoint: string;
  method: 'POST' | 'GET';
  requestPayload: any;
  responsePayload: any;
  status: number;
  executionMs: number;
}

export interface JiliApiConfig {
  agentId: string;
  agentKey: string;
  merchantCode: string;
  currency: string;
  environment: 'SANDBOX' | 'PRODUCTION';
  webhookUrl: string;
}

export interface UserAccount {
  id: string;
  name: string;
  role: 'PLAYER' | 'ADMIN';
  balance: number;
  vipLevel: number;
  totalWagered: number;
  totalWon: number;
  avatarSeed: string;
}
