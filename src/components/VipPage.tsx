import React, { useState } from 'react';
import { ChevronRight, X, ShieldCheck, Sparkles } from 'lucide-react';

interface VipPageProps {
  onOpenColorGame: () => void;
  onOpenWallet: () => void;
}

type PrivilegeId =
  | 'levelup'
  | 'daily_loss'
  | 'weekly_bet'
  | 'free_withdraw'
  | 'custom_nick'
  | 'vip_gifts'
  | 'vip_manager'
  | 'deposit_protect'
  | 'exclusive_withdraw';

interface PrivilegeItem {
  id: PrivilegeId;
  title: string;
  iconImg: string;
  goldHighlight?: boolean;
  description: string;
}

interface VipTierGroup {
  id: string;
  label: string;
  items: PrivilegeItem[];
}

const VIP_PRIVILEGE_GROUPS: VipTierGroup[] = [
  {
    id: 'vip1',
    label: 'VIP1',
    items: [
      {
        id: 'levelup',
        title: 'Level-up Bonus',
        iconImg: '/assets/drem/vip/p_levelup.png',
        description: 'Instant cash reward credited automatically whenever your VIP tier upgrades.',
      },
      {
        id: 'daily_loss',
        title: 'Daily Loss Cashback',
        iconImg: '/assets/drem/vip/p_daily_loss.png',
        description: 'Receive daily automatic cashback on net wagering losses every 24 hours.',
      },
      {
        id: 'weekly_bet',
        title: 'Weekly Bet Cashback',
        iconImg: '/assets/drem/vip/p_weekly_bet.png',
        description: 'Earn weekly turnover rebates across Originals, Casino, and Fantasy.',
      },
      {
        id: 'free_withdraw',
        title: 'Free Withdrawal',
        iconImg: '/assets/drem/vip/p_free_withdraw.png',
        description: 'Zero processing fee on instant UPI and USDT withdrawals.',
      },
    ],
  },
  {
    id: 'vip2-8',
    label: 'VIP2 - VIP8',
    items: [
      {
        id: 'levelup',
        title: 'Level-up Bonus',
        iconImg: '/assets/drem/vip/p_levelup.png',
        description: 'Up to ₹15,000 progressive tier-up bonus across VIP2 through VIP8.',
      },
      {
        id: 'daily_loss',
        title: 'Daily Loss Cashback',
        iconImg: '/assets/drem/vip/p_daily_loss.png',
        description: 'Boosted daily cashback percentage up to 4.5% on net losses.',
      },
      {
        id: 'weekly_bet',
        title: 'Weekly Bet Cashback',
        iconImg: '/assets/drem/vip/p_weekly_bet.png',
        description: 'Higher weekly turnover multiplier credited every Monday.',
      },
      {
        id: 'free_withdraw',
        title: 'Free Withdrawal',
        iconImg: '/assets/drem/vip/p_free_withdraw.png',
        description: 'Priority queue zero-fee withdrawals with increased daily limits.',
      },
      {
        id: 'custom_nick',
        title: 'Custom Nickname',
        iconImg: '/assets/drem/vip/p_custom_nick.png',
        description: 'Customize your display handle & badge visible across Live Wins and tables.',
      },
    ],
  },
  {
    id: 'vip9-10',
    label: 'VIP9 - VIP10',
    items: [
      {
        id: 'vip_gifts',
        title: 'Exclusive VIP Gifts',
        iconImg: '/assets/drem/vip/p_vip_gifts.png',
        goldHighlight: true,
        description: 'Curated seasonal hampers, festival bonuses, and luxury VIP drops.',
      },
      {
        id: 'vip_manager',
        title: 'VIP Manager',
        iconImg: '/assets/drem/vip/p_vip_manager.png',
        goldHighlight: true,
        description: 'Dedicated 24/7 personal account host for custom limits and instant support.',
      },
      {
        id: 'levelup',
        title: 'Level-up Bonus',
        iconImg: '/assets/drem/vip/p_levelup.png',
        description: 'High-value tier-up cash rewards unlocked with zero rollover.',
      },
      {
        id: 'daily_loss',
        title: 'Daily Loss Cashback',
        iconImg: '/assets/drem/vip/p_daily_loss.png',
        description: 'Up to 6.5% daily rescue cashback on qualifying play.',
      },
      {
        id: 'weekly_bet',
        title: 'Weekly Bet Cashback',
        iconImg: '/assets/drem/vip/p_weekly_bet.png',
        description: 'Enhanced weekly rebate rate across all platform verticals.',
      },
      {
        id: 'free_withdraw',
        title: 'Free Withdrawal',
        iconImg: '/assets/drem/vip/p_free_withdraw.png',
        description: 'Unlimited zero-fee express payouts processed within minutes.',
      },
    ],
  },
  {
    id: 'vip11-15',
    label: 'VIP11 - VIP15',
    items: [
      {
        id: 'deposit_protect',
        title: 'Deposit Protection',
        iconImg: '/assets/drem/vip/p_deposit_protect.png',
        goldHighlight: true,
        description: 'Guaranteed deposit insurance & instant bonus coverage on top-tier reloads.',
      },
      {
        id: 'exclusive_withdraw',
        title: 'Exclusive Withdrawal',
        iconImg: '/assets/drem/vip/p_exclusive_withdraw.png',
        goldHighlight: true,
        description: 'VIP express lane for ultra-high-limit INR & USDT settlements.',
      },
      {
        id: 'vip_gifts',
        title: 'Exclusive VIP Gifts',
        iconImg: '/assets/drem/vip/p_vip_gifts.png',
        goldHighlight: true,
        description: 'Bespoke luxury gifts, milestone bonuses, and private event invites.',
      },
      {
        id: 'vip_manager',
        title: 'VIP Manager',
        iconImg: '/assets/drem/vip/p_vip_manager.png',
        goldHighlight: true,
        description: 'Direct 1-on-1 concierge line with tailored promotions and cashback.',
      },
      {
        id: 'levelup',
        title: 'Level-up Bonus',
        iconImg: '/assets/drem/vip/p_levelup.png',
        description: 'Elite tier milestone bonuses up to ₹5,00,000 per upgrade.',
      },
      {
        id: 'daily_loss',
        title: 'Daily Loss Cashback',
        iconImg: '/assets/drem/vip/p_daily_loss.png',
        description: 'Maximum 10% daily loss protection credited directly to your wallet.',
      },
    ],
  },
];

export const VipPage: React.FC<VipPageProps> = ({ onOpenColorGame, onOpenWallet }) => {
  const [showTierModal, setShowTierModal] = useState(false);
  const [selectedPrivilege, setSelectedPrivilege] = useState<PrivilegeItem | null>(null);

  return (
    <div className="bg-[#101018] px-3.5 pt-3 pb-6 space-y-4">
      {/* 1. TOP EMERALD VIP STATUS CARD + HANGING SILVER "1" MEDAL */}
      <section className="rounded-2xl bg-[linear-gradient(135deg,#1d4a3e_0%,#16352e_48%,#0f1d20_100%)] border border-white/[0.08] border-t-white/20 px-4 py-4 relative overflow-visible shadow-[0_12px_30px_rgba(0,0,0,0.5)]">
        {/* Right-side emerald glow behind medal */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_84%_45%,rgba(30,115,62,0.58),transparent_56%)]" />

        {/* Exact 3D Silver "1" VIP Medal hanging from top edge */}
        <img
          src="/assets/drem/vip/medal_1.png"
          alt="VIP 1 Silver Medal"
          draggable={false}
          className="pointer-events-none absolute -top-1.5 right-3.5 w-[92px] h-auto select-none drop-shadow-[0_6px_12px_rgba(0,0,0,0.55)] z-20"
        />

        <div className="relative z-10 pr-24 space-y-3">
          {/* Username + Locked Pill */}
          <div className="flex items-center gap-2.5">
            <span className="text-[19px] font-bold tracking-tight text-white leading-none">
              User7...
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#2a4a41]/90 text-[#9dbab0] text-[11px] font-semibold leading-none border border-white/10">
              Locked
            </span>
          </div>

          {/* 0% > + Green-Capped Progress Bar */}
          <div className="space-y-2">
            <button
              onClick={() => setShowTierModal(true)}
              className="flex items-center gap-0.5 text-[15px] font-bold text-white font-mono tabular-nums leading-none group"
            >
              <span>0%</span>
              <ChevronRight className="w-4 h-4 text-[#7c9b92] group-hover:text-white transition-colors" />
            </button>

            <div className="h-[7px] w-full rounded-full bg-[#0d221d]/90 border border-white/[0.05] overflow-hidden relative">
              <div className="h-full w-3 rounded-full bg-gradient-to-r from-[#22c55e] to-[#1ad96a] shadow-[0_0_8px_rgba(26,217,106,0.8)]" />
            </div>

            <p className="text-[12px] text-[#9eb7af] leading-tight">
              Bet <span className="text-[#22c55e] font-bold font-mono">₹1000</span> more to reach VIP1
            </p>
          </div>
        </div>
      </section>

      {/* 2. VIP PRIVILEGES HORIZONTAL SNAP CAROUSEL */}
      <section className="space-y-3">
        <h2 className="text-[16px] font-bold tracking-tight text-white leading-none">
          VIP Privileges
        </h2>

        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-3.5 px-3.5 pb-0.5">
          {VIP_PRIVILEGE_GROUPS.map((group) => (
            <div
              key={group.id}
              className="w-[87%] shrink-0 snap-start rounded-2xl bg-[#181C29] border border-white/[0.06] p-3.5 min-h-[296px] shadow-[0_8px_22px_rgba(0,0,0,0.35)] flex flex-col"
            >
              <h3 className="text-[15.5px] font-bold text-white pb-2.5 mb-3 border-b border-white/[0.07] leading-none">
                {group.label}
              </h3>

              <div className="grid grid-cols-2 gap-2.5">
                {group.items.map((item) => (
                  <button
                    key={`${group.id}-${item.id}`}
                    onClick={() => setSelectedPrivilege(item)}
                    className={`rounded-xl px-2.5 py-2.5 flex items-center gap-2 text-left transition-all active:scale-[0.97] border ${
                      item.goldHighlight
                        ? 'bg-[linear-gradient(135deg,#2a2319_0%,#1e1d1c_100%)] border-[#eab308]/35 shadow-[inset_0_1px_0_rgba(250,204,21,0.14)]'
                        : 'bg-[#1D2432] border-white/[0.06] hover:border-white/15'
                    }`}
                  >
                    <img
                      src={item.iconImg}
                      alt={item.title}
                      decoding="async"
                      className="w-10 h-10 object-contain shrink-0 drop-shadow-[0_3px_5px_rgba(0,0,0,0.45)]"
                    />
                    <span
                      className={`text-[12px] font-medium leading-tight ${
                        item.goldHighlight ? 'text-[#facc15]' : 'text-[#d4dce7]'
                      }`}
                    >
                      {item.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. WIDE GLOSSY SKY-CYAN CTA BUTTON */}
      <button
        onClick={() => setShowTierModal(true)}
        className="w-full py-3 rounded-xl bg-gradient-to-b from-[#36D4FF] to-[#00B9FE] border-b-[3px] border-[#0092d1] text-white font-bold text-[15px] tracking-tight shadow-[0_6px_18px_rgba(0,185,254,0.32),inset_0_1px_0_rgba(255,255,255,0.4)] active:scale-[0.985] transition-transform"
      >
        Unlock Vip Privileges
      </button>

      {/* PRIVILEGE DETAIL POPUP */}
      {selectedPrivilege && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xs bg-[#181C29] border border-white/10 rounded-2xl p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-2.5">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedPrivilege.iconImg}
                  alt={selectedPrivilege.title}
                  className="w-9 h-9 object-contain shrink-0"
                />
                <h4 className="text-sm font-bold text-white">{selectedPrivilege.title}</h4>
              </div>
              <button
                onClick={() => setSelectedPrivilege(null)}
                className="w-6 h-6 rounded-full bg-[#242c38] text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedPrivilege.description}
            </p>
            <button
              onClick={() => {
                setSelectedPrivilege(null);
                onOpenColorGame();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-b from-[#36D4FF] to-[#00B9FE] text-white text-xs font-bold"
            >
              Play Win Go to Unlock Faster
            </button>
          </div>
        </div>
      )}

      {/* UNLOCK VIP PRIVILEGES MODAL */}
      {showTierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xs bg-[#181C29] border border-white/10 rounded-2xl p-4 space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-2.5">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#facc15]" />
                <span>Unlock VIP1 Privileges</span>
              </h4>
              <button
                onClick={() => setShowTierModal(false)}
                className="w-6 h-6 rounded-full bg-[#242c38] text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="rounded-xl bg-[#101018] border border-white/[0.06] p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Level</span>
                <span className="font-bold text-amber-300">Locked (VIP0)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Next Tier</span>
                <span className="font-bold text-[#1ad96a]">VIP1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Required Wager</span>
                <span className="font-bold font-mono text-white">₹1,000</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-[#1ad96a] shrink-0" />
              <span>Every ₹1 bet on Originals, Win Go 30s, or Casino counts 100% toward VIP1.</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  setShowTierModal(false);
                  onOpenWallet();
                }}
                className="py-2.5 rounded-xl bg-[#242d3a] hover:bg-[#2d3847] text-white text-xs font-bold border border-white/10"
              >
                Deposit Now
              </button>
              <button
                onClick={() => {
                  setShowTierModal(false);
                  onOpenColorGame();
                }}
                className="py-2.5 rounded-xl bg-gradient-to-b from-[#36D4FF] to-[#00B9FE] text-white text-xs font-bold"
              >
                Bet ₹1000
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
