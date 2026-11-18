import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Send, 
  CheckCircle, 
  Copy, 
  Trash2, 
  Key, 
  Server, 
  RefreshCw,
  Code2,
  FileText
} from 'lucide-react';
import { jiliApi, DEFAULT_JILI_CONFIG } from '../services/jiliApi';
import { JiliApiConfig, JiliApiLog } from '../types/game';

interface JiliConsoleProps {
  userBalance: number;
}

export const JiliConsole: React.FC<JiliConsoleProps> = ({ userBalance }) => {
  const [config, setConfig] = useState<JiliApiConfig>(jiliApi.getConfig());
  const [logs, setLogs] = useState<JiliApiLog[]>(jiliApi.getLogs());
  const [selectedLog, setSelectedLog] = useState<JiliApiLog | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [testEndpoint, setTestEndpoint] = useState<string>('auth');
  const [testAmount, setTestAmount] = useState<number>(500);
  const [executing, setExecuting] = useState<boolean>(false);

  useEffect(() => {
    const unsub = jiliApi.subscribe((newLogs) => {
      setLogs(newLogs);
      if (!selectedLog && newLogs.length > 0) {
        setSelectedLog(newLogs[0]);
      }
    });
    return unsub;
  }, [selectedLog]);

  const handleCopyCurl = (log: JiliApiLog) => {
    const curl = `curl -X ${log.method} "https://api.jiligames.live${log.endpoint}" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(log.requestPayload, null, 2)}'`;
    navigator.clipboard.writeText(curl);
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExecuteTest = async () => {
    setExecuting(true);
    try {
      if (testEndpoint === 'auth') {
        await jiliApi.authSession('tok_' + Math.random().toString(36).substring(2), 'USR_TEST_88', userBalance);
      } else if (testEndpoint === 'balance') {
        await jiliApi.getBalance('USR_TEST_88', userBalance);
      } else if (testEndpoint === 'bet') {
        await jiliApi.placeBet('USR_TEST_88', testAmount, '202610289999', 'GREEN');
      } else if (testEndpoint === 'settle') {
        await jiliApi.settleRound('202610289999', 7, 'GREEN', 'BIG', 25000, 18000);
      }
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Title & Agent Credential Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                Jili Games API Gateway &amp; Sandbox Inspector
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  CONNECTED · V4.2
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Live seamless wallet protocol integration with cryptographic HMAC signature verification
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                jiliApi.clearLogs();
                setSelectedLog(null);
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-300 text-xs font-medium hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Logs
            </button>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
            <span className="text-[10px] text-slate-500 uppercase block font-mono">AGENT ID</span>
            <span className="text-xs font-mono font-bold text-amber-400">{config.agentId}</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
            <span className="text-[10px] text-slate-500 uppercase block font-mono">MERCHANT CODE</span>
            <span className="text-xs font-mono font-bold text-slate-200">{config.merchantCode}</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
            <span className="text-[10px] text-slate-500 uppercase block font-mono">CURRENCY</span>
            <span className="text-xs font-mono font-bold text-emerald-400">{config.currency} (₹)</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
            <span className="text-[10px] text-slate-500 uppercase block font-mono">SECRET KEY</span>
            <span className="text-xs font-mono text-slate-400 truncate block">•••••••••••••{config.agentKey.slice(-6)}</span>
          </div>
        </div>
      </div>

      {/* Interactive API Tester Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
          <Send className="w-4 h-4 text-indigo-400" />
          Interactive Jili API Dispatcher
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Target Endpoint</label>
            <select
              value={testEndpoint}
              onChange={(e) => setTestEndpoint(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
            >
              <option value="auth">POST /api/jili/v1/auth (Session Auth)</option>
              <option value="balance">POST /api/jili/v1/balance (Query Balance)</option>
              <option value="bet">POST /api/jili/v1/bet (Place Bet Transaction)</option>
              <option value="settle">POST /api/jili/v1/settle (Settle Webhook Callback)</option>
            </select>
          </div>

          {testEndpoint === 'bet' && (
            <div className="w-36">
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Bet Amount (₹)</label>
              <input
                type="number"
                value={testAmount}
                onChange={(e) => setTestAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}

          <div className="pt-5">
            <button
              onClick={handleExecuteTest}
              disabled={executing}
              className="py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${executing ? 'animate-spin' : ''}`} />
              <span>{executing ? 'Executing...' : 'Send API Call'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Logs & Payload Inspector Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Log List */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[520px]">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Live Transaction Logs ({logs.length})
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {logs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No API calls recorded yet. Place a bet in the Game Arena or send a test call above.
              </div>
            ) : (
              logs.map((log) => {
                const isSelected = selectedLog?.id === log.id;
                return (
                  <button
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`w-full text-left p-3 transition-colors flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-indigo-950/40 border-l-2 border-indigo-500'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="space-y-1 truncate pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {log.method}
                        </span>
                        <span className="font-mono text-slate-200 truncate">{log.endpoint}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {log.timestamp} · {log.executionMs}ms
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-[11px] font-bold text-emerald-400">
                        {log.status}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Payload Inspector */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[520px]">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono truncate">
                {selectedLog ? `${selectedLog.method} ${selectedLog.endpoint}` : 'Payload Inspector'}
              </span>
            </div>

            {selectedLog && (
              <button
                onClick={() => handleCopyCurl(selectedLog)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 transition-colors flex items-center gap-1"
              >
                {copiedId === selectedLog.id ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy cURL</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
            {selectedLog ? (
              <>
                {/* Request */}
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block mb-1.5">
                    REQUEST BODY JSON:
                  </span>
                  <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-indigo-300 overflow-x-auto text-[11px] leading-relaxed">
                    {JSON.stringify(selectedLog.requestPayload, null, 2)}
                  </pre>
                </div>

                {/* Response */}
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block mb-1.5">
                    RESPONSE BODY JSON:
                  </span>
                  <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-emerald-300 overflow-x-auto text-[11px] leading-relaxed">
                    {JSON.stringify(selectedLog.responsePayload, null, 2)}
                  </pre>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                Select a transaction log from the left to inspect its full payload.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hindi & English Protocol Note */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" />
          Jili API Integration Guide (हिंदी / English)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="font-bold text-amber-400 block mb-1">Hindi (हिंदी में निर्देश)</span>
            <p>
              1. <strong>Betting Call</strong>: Jab user Color ya Number par bet lagata hai, frontend Jili ke <code className="text-amber-300">/api/jili/v1/bet</code> par call bhejta hai.
              <br />
              2. <strong>Admin Result Control</strong>: Admin Panel se aap kisi bhi round ka winning number pehle se set kar sakte hain, ya Smart Profit mode me house ka maximum profit auto-calculate kar sakte hain.
              <br />
              3. <strong>Instant Settlement</strong>: Timer 0 par pahunchte hi <code className="text-emerald-300">/api/jili/v1/settle</code> webhook execute hota hai aur user wallet me win amount credit ho jata hai.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="font-bold text-indigo-400 block mb-1">English Protocol Details</span>
            <p>
              1. <strong>HMAC Signature Security</strong>: Every request includes an MD5/SHA256 signature generated using your secret merchant key to prevent tampering.
              <br />
              2. <strong>Real-time State Machine</strong>: Countdown triggers locks at &le;5s, followed by provably fair calculation and automatic player credit distribution.
              <br />
              3. <strong>Production Ready</strong>: Export raw cURL commands anytime to connect with external Node.js, PHP, or Python backend servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
