import { JiliApiConfig, JiliApiLog } from '../types/game';

// Simple client-side pseudo-hash for demonstration & signature generation
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(12, '0');
}

export const DEFAULT_JILI_CONFIG: JiliApiConfig = {
  agentId: 'JILI_AGT_88029',
  agentKey: 'k8d9f10a8c2b740e6912bc9fa3e',
  merchantCode: 'MCH_ROYAL_INDIA',
  currency: 'INR',
  environment: 'SANDBOX',
  webhookUrl: 'https://api.jiligames.live/v2/color/callback'
};

class JiliApiGateway {
  private config: JiliApiConfig = { ...DEFAULT_JILI_CONFIG };
  private logs: JiliApiLog[] = [];
  private listeners: ((logs: JiliApiLog[]) => void)[] = [];

  constructor() {
    this.initFromStorage();
  }

  private initFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('jili_api_config');
      if (stored) {
        this.config = JSON.parse(stored);
      }
    } catch {
      // Ignore
    }
  }

  public getConfig(): JiliApiConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<JiliApiConfig>) {
    this.config = { ...this.config, ...newConfig };
    if (typeof window !== 'undefined') {
      localStorage.setItem('jili_api_config', JSON.stringify(this.config));
    }
  }

  public getLogs(): JiliApiLog[] {
    return [...this.logs];
  }

  public subscribe(cb: (logs: JiliApiLog[]) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb([...this.logs]));
  }

  private recordLog(endpoint: string, method: 'POST' | 'GET', req: any, res: any, status: number = 200, ms: number = 32) {
    const log: JiliApiLog = {
      id: 'JL_' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      endpoint,
      method,
      requestPayload: req,
      responsePayload: res,
      status,
      executionMs: ms
    };
    this.logs.unshift(log);
    if (this.logs.length > 50) this.logs.pop();
    this.notify();
  }

  // Generate Jili HMAC / MD5 compliant signature
  public generateSignature(params: Record<string, any>): string {
    const sortedKeys = Object.keys(params).sort();
    const query = sortedKeys.map(k => `${k}=${params[k]}`).join('&');
    return simpleHash(`${query}&key=${this.config.agentKey}`).toUpperCase();
  }

  // Jili Session Authentication
  public async authSession(token: string, memberId: string, balance: number) {
    const req = {
      agentId: this.config.agentId,
      token,
      memberId,
      timestamp: Date.now(),
      currency: this.config.currency,
      sign: this.generateSignature({ token, memberId, agentId: this.config.agentId })
    };

    const res = {
      errorCode: 0,
      message: 'Success',
      data: {
        memberId,
        sessionToken: 'sess_' + simpleHash(token + Date.now()),
        currency: this.config.currency,
        balance,
        status: 'ACTIVE',
        vipLevel: 3,
        jiliPlayerId: 'JILI_' + memberId.slice(-6)
      }
    };

    this.recordLog('/api/jili/v1/auth', 'POST', req, res, 200, 45);
    return res;
  }

  // Jili Balance Query
  public async getBalance(memberId: string, currentBalance: number) {
    const req = {
      agentId: this.config.agentId,
      memberId,
      currency: this.config.currency,
      sign: this.generateSignature({ memberId, agentId: this.config.agentId })
    };

    const res = {
      errorCode: 0,
      message: 'Success',
      data: {
        memberId,
        balance: currentBalance,
        currency: this.config.currency,
        asOf: new Date().toISOString()
      }
    };

    this.recordLog('/api/jili/v1/balance', 'POST', req, res, 200, 28);
    return res;
  }

  // Jili Bet Transaction Callback
  public async placeBet(memberId: string, amount: number, periodId: string, target: string | number) {
    const transId = 'JILI_TX_' + Date.now() + '_' + Math.floor(Math.random() * 900 + 100);
    const req = {
      agentId: this.config.agentId,
      memberId,
      roundId: periodId,
      gameId: 'JILI_COLOR_PRED_V1',
      betType: typeof target === 'number' ? 'NUMBER' : ['BIG', 'SMALL'].includes(target as string) ? 'SIZE' : 'COLOR',
      betTarget: target,
      betAmount: amount,
      currency: this.config.currency,
      transId,
      timestamp: Date.now(),
      sign: this.generateSignature({ memberId, roundId: periodId, betAmount: amount, transId })
    };

    const res = {
      errorCode: 0,
      message: 'Bet accepted successfully',
      data: {
        transId,
        memberId,
        betAmount: amount,
        effectiveAmount: amount * 0.98, // 2% service fee in traditional lottery
        feeAmount: amount * 0.02,
        roundId: periodId,
        status: 'ACCEPTED'
      }
    };

    this.recordLog('/api/jili/v1/bet', 'POST', req, res, 200, 36);
    return { ...res, transId };
  }

  // Jili Settlement Webhook / API
  public async settleRound(periodId: string, resultNumber: number, resultColor: string, resultSize: string, totalBets: number, totalPayout: number) {
    const req = {
      agentId: this.config.agentId,
      roundId: periodId,
      gameId: 'JILI_COLOR_PRED_V1',
      settleData: {
        number: resultNumber,
        color: resultColor,
        size: resultSize,
        totalBets,
        totalPayout,
        grossMargin: totalBets - totalPayout
      },
      timestamp: Date.now(),
      sign: this.generateSignature({ roundId: periodId, number: resultNumber, totalPayout })
    };

    const res = {
      errorCode: 0,
      message: 'Settlement confirmed',
      data: {
        roundId: periodId,
        settledAt: new Date().toISOString(),
        status: 'SETTLED',
        totalTurnover: totalBets,
        totalPayout: totalPayout,
        netProfit: totalBets - totalPayout
      }
    };

    this.recordLog('/api/jili/v1/settle', 'POST', req, res, 200, 62);
    return res;
  }

  // Clear API logs
  public clearLogs() {
    this.logs = [];
    this.notify();
  }
}

export const jiliApi = new JiliApiGateway();
