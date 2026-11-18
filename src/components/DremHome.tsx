import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  ChevronRight,
  X,
  ShieldCheck,
  Sliders,
  Terminal,
  Sparkles,
  Flame,
  Shirt,
} from 'lucide-react';
import { UserBet } from '../types/game';
import { FantasyPage } from './FantasyPage';
import { VipPage } from './VipPage';
import {
  TopbarBell3D,
  TopbarMascot3D,
  CategoryExplore3D,
  CategoryFantasy3D,
  CategoryCasino3D,
  CategoryGames3D,
  CategorySports3D,
  NavVipDiamond3D,
  NavEarnRupee3D,
  NavRaceTrophy3D,
  NavPromosGift3D,
} from './Silver3DIcons';

interface DremHomeProps {
  userBalance: number;
  currentRoundBets: UserBet[];
  onOpenColorGame: () => void;
  onOpenWallet: () => void;
  onOpenAdmin: () => void;
  onOpenJiliApi: () => void;
  onOpenBottomTab: (tab: 'VIP' | 'EARN' | 'RACE' | 'PROMOS') => void;
}

type TopCategory = 'Explore' | 'Fantasy' | 'Casino' | 'Games' | 'Sports';
type BetsTab = 'Casino' | 'Fantasy' | 'Games';

interface LiveWinItem {
  uid: string;
  user: string;
  amount: string;
  img: string;
  highlight?: boolean;
}

interface LiveBetRow {
  uid: string;
  game: string;
  icon: string;
  player: string;
  incognito?: boolean;
  payout: string;
  tab: BetsTab;
}

const HERO_SLIDES = [
  {
    id: 'welcome401',
    img: '/assets/drem/hero_welcome401.png',
    alt: 'Up To 401% Welcome Bonus',
    action: 'WALLET' as const,
  },
  {
    id: 'rtp99',
    img: '/assets/drem/hero_99rtp.png',
    alt: '99% RTP Originals - Fair Play',
    action: 'GAME' as const,
  },
  {
    id: 'dailyrace',
    img: '/assets/drem/hero_dailyrace.png',
    alt: 'Daily Race ₹3,000,000 Prize Pool',
    action: 'RACE' as const,
  },
  {
    id: 'cricket',
    img: '/assets/drem/hero_cricket.png',
    alt: '6 Lakhs Top Prize - PS-W vs AS-W',
    action: 'GAME' as const,
  },
];

const LIVE_WINS_MARQUEE: LiveWinItem[] = [
  {
    uid: 'lw-1',
    user: 'User3164...',
    amount: '₹3,600',
    img: '/assets/drem/live_icefishing.png',
  },
  {
    uid: 'lw-2',
    user: 'User6265...',
    amount: '₹6,375',
    img: '/assets/drem/live_garuda.png',
  },
  {
    uid: 'lw-3',
    user: 'User1489...',
    amount: '₹3,000',
    img: '/assets/drem/live_pappu.png',
  },
  {
    uid: 'lw-4',
    user: 'User704181',
    amount: '₹5,000',
    img: '/assets/drem/live_jhandi.png',
  },
  {
    uid: 'lw-5',
    user: 'User6937...',
    amount: '₹26,600',
    img: '/assets/drem/live_mines.png',
    highlight: true,
  },
  {
    uid: 'lw-6',
    user: 'User6285...',
    amount: '₹4,800',
    img: '/assets/drem/live_dragon.png',
  },
  {
    uid: 'lw-7',
    user: 'User8466...',
    amount: '₹3,600',
    img: '/assets/drem/live_icefishing.png',
  },
  {
    uid: 'lw-8',
    user: 'User6441...',
    amount: '₹4,090.61',
    img: '/assets/drem/live_mines.png',
  },
];

const INITIAL_ORIGINALS = [
  { id: 'mines', title: 'MINES', img: '/assets/drem/orig_mines.png', playing: 816 },
  { id: 'chicken', title: 'CHICKEN', img: '/assets/drem/orig_chicken.png', playing: 516 },
  { id: 'aviator', title: 'AVIATOR', img: '/assets/drem/orig_aviator.png', playing: 630 },
  { id: 'dice', title: 'DICE', img: '/assets/drem/orig_dice.png', playing: 435 },
  { id: 'limbo', title: 'LIMBO', img: '/assets/drem/orig_limbo.png', playing: 370 },
  { id: 'wheel', title: 'WHEEL', img: '/assets/drem/orig_wheel.png', playing: 403 },
];

const EXTRA_ORIGINALS = [
  {
    id: 'color',
    title: 'WIN GO 30s',
    subtitle: 'Jili Color Live',
    playing: 942,
    gradient: 'from-[#1ad16b] via-[#0ea854] to-[#066d37]',
  },
  {
    id: 'plinko',
    title: 'PLINKO',
    subtitle: 'Originals',
    playing: 418,
    gradient: 'from-[#f43f5e] via-[#db2777] to-[#881337]',
  },
  {
    id: 'keno',
    title: 'KENO',
    subtitle: 'Originals',
    playing: 274,
    gradient: 'from-[#8b5cf6] via-[#7c3aed] to-[#4c1d95]',
  },
];

const INITIAL_HOT_PICKS = [
  { id: 'hot_aviator', title: 'AVIATOR', img: '/assets/drem/hot_aviator.png', playing: 1920 },
  { id: 'hot_garuda', title: 'FORTUNE GARUDA 1000', img: '/assets/drem/hot_garuda.png', playing: 2152 },
  { id: 'hot_chicken2', title: 'CHICKEN ROAD2', img: '/assets/drem/hot_chicken2.png', playing: 1120 },
  { id: 'hot_ludo', title: 'LUDO', img: '/assets/drem/hot_ludo.png', playing: 3240 },
  { id: 'hot_fortunegems', title: 'FORTUNE GEMS 500', img: '/assets/drem/hot_fortunegems.png', playing: 733 },
  { id: 'hot_7up7down', title: '7UP 7DOWN', img: '/assets/drem/hot_7up7down.png', playing: 916 },
];

const EXTRA_HOT_PICKS = [
  { id: 'hot_mines', title: 'MINES PRO', img: '/assets/drem/orig_mines.png', playing: 1410 },
  { id: 'hot_dragon', title: 'DRAGON TIGER', img: '/assets/drem/live_dragon.png', playing: 1840 },
  { id: 'hot_jhandi', title: 'JHANDI MUNDA', img: '/assets/drem/live_jhandi.png', playing: 965 },
];

const FANTASY_MATCHES = [
  {
    id: 'wbbl-1',
    league: "Women's Big Bash League, 2026",
    team1Code: 'HB-W',
    team1Name: 'Hobart Hurricanes ...',
    team1Bg: 'from-purple-600 to-indigo-900',
    team1Tag: 'HH',
    team2Code: 'BH-W',
    team2Name: 'Brisbane Heat Wom...',
    team2Bg: 'from-cyan-400 to-teal-700',
    team2Tag: 'BH',
    day: 'Today',
    time: '10:10 AM',
    countdownSeconds: 3122,
    prize: '₹6.11M',
  },
  {
    id: 'u19-asia',
    league: 'Under-19 Asia Cup, 2026',
    team1Code: 'PAK-U19',
    team1Name: 'Pakistan Under-19',
    team1Flag: 'PK' as const,
    team2Code: 'IND-U19',
    team2Name: 'India Under-19',
    team2Flag: 'IN' as const,
    day: 'Today',
    time: '10:30 AM',
    prize: '₹2.06M',
  },
  {
    id: 'wbbl-2',
    league: "Women's Big Bash League, 2026",
    team1Code: 'PS-W',
    team1Name: 'Perth Scorchers Wo...',
    team1Bg: 'from-orange-400 to-red-600',
    team1Tag: 'S',
    team2Code: 'AS-W',
    team2Name: 'Adelaide Strikers Wo...',
    team2Bg: 'from-sky-400 to-blue-700',
    team2Tag: 'S',
    day: 'Today',
    time: '1:40 PM',
    prize: '₹5.17M',
  },
];

const CASINO_BETS_SEED: LiveBetRow[] = [
  { uid: 'b1', game: 'Golden Em...', icon: '/assets/drem/icon_golden.png', player: 'Suraj', payout: '73', tab: 'Casino' },
  { uid: 'b2', game: 'Wheel', icon: '/assets/drem/icon_wheel.png', player: 'User97982...', payout: '307.20', tab: 'Casino' },
  { uid: 'b3', game: 'Sic Bo', icon: '/assets/drem/icon_sicbo.png', player: 'Incognito', incognito: true, payout: '340', tab: 'Casino' },
  { uid: 'b4', game: 'Ragnarok_...', icon: '/assets/drem/icon_ragnarok.png', player: 'User627035', payout: '-0.50', tab: 'Casino' },
  { uid: 'b5', game: 'Lucky Cara...', icon: '/assets/drem/icon_lucky.png', player: 'User67956...', payout: '-5', tab: 'Casino' },
  { uid: 'b6', game: 'Raider Jan...', icon: '/assets/drem/icon_raider.png', player: 'User510991', payout: '132', tab: 'Casino' },
];

const STREAM_BET_POOL: Omit<LiveBetRow, 'uid'>[] = [
  { game: 'Chicken', icon: '/assets/drem/icon_chicken.png', player: 'User28503...', payout: '136.91', tab: 'Casino' },
  { game: 'Piggy Bank', icon: '/assets/drem/icon_piggy.png', player: 'User349347', payout: '1,050', tab: 'Casino' },
  { game: 'Golden Em...', icon: '/assets/drem/icon_golden.png', player: 'Suraj', payout: '73', tab: 'Casino' },
  { game: 'Wheel', icon: '/assets/drem/icon_wheel.png', player: 'User97982...', payout: '307.20', tab: 'Casino' },
  { game: 'Sic Bo', icon: '/assets/drem/icon_sicbo.png', player: 'Incognito', incognito: true, payout: '340', tab: 'Casino' },
  { game: 'Ragnarok_...', icon: '/assets/drem/icon_ragnarok.png', player: 'User627035', payout: '-0.50', tab: 'Casino' },
  { game: 'Lucky Cara...', icon: '/assets/drem/icon_lucky.png', player: 'User67956...', payout: '-5', tab: 'Casino' },
  { game: 'Raider Jan...', icon: '/assets/drem/icon_raider.png', player: 'User510991', payout: '132', tab: 'Casino' },
];

const FANTASY_BETS: LiveBetRow[] = [
  { uid: 'fb1', game: 'PS-W vs AS-W', icon: '/assets/drem/icon_golden.png', player: 'Rohit_XI', payout: '4,250', tab: 'Fantasy' },
  { uid: 'fb2', game: 'PAK vs IND U19', icon: '/assets/drem/icon_wheel.png', player: 'Incognito', incognito: true, payout: '1,800', tab: 'Fantasy' },
  { uid: 'fb3', game: 'HB-W vs BH-W', icon: '/assets/drem/icon_sicbo.png', player: 'Vikram99', payout: '640', tab: 'Fantasy' },
  { uid: 'fb4', game: 'PS-W Mega', icon: '/assets/drem/icon_chicken.png', player: 'User441209', payout: '9,120', tab: 'Fantasy' },
  { uid: 'fb5', game: 'U19 H2H', icon: '/assets/drem/icon_piggy.png', player: 'Aarav_Pro', payout: '520', tab: 'Fantasy' },
  { uid: 'fb6', game: 'WBBL Grand', icon: '/assets/drem/icon_raider.png', player: 'User88213...', payout: '2,400', tab: 'Fantasy' },
];

const GAMES_BETS: LiveBetRow[] = [
  { uid: 'gb1', game: 'Win Go 30s', icon: '/assets/drem/icon_wheel.png', player: 'User510991', payout: '1,960', tab: 'Games' },
  { uid: 'gb2', game: 'Mines', icon: '/assets/drem/icon_sicbo.png', player: 'Incognito', incognito: true, payout: '485', tab: 'Games' },
  { uid: 'gb3', game: 'Chicken', icon: '/assets/drem/icon_chicken.png', player: 'User28503...', payout: '312.40', tab: 'Games' },
  { uid: 'gb4', game: 'Aviator', icon: '/assets/drem/icon_raider.png', player: 'Sahil_99', payout: '2,250', tab: 'Games' },
  { uid: 'gb5', game: 'Dice', icon: '/assets/drem/icon_piggy.png', player: 'User627035', payout: '198', tab: 'Games' },
  { uid: 'gb6', game: '7UP 7DOWN', icon: '/assets/drem/icon_golden.png', player: 'User349347', payout: '890', tab: 'Games' },
];

const IndianFlagCircle: React.FC<{ size?: 'sm' | 'md' }> = React.memo(({ size = 'md' }) => {
  const cls = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
  return (
    <div
      className={`${cls} rounded-full overflow-hidden shrink-0 border border-white/15 flex flex-col`}
      title="INR"
    >
      <span className="h-1/3 w-full bg-[#ff9933] block" />
      <span className="h-1/3 w-full bg-white flex items-center justify-center">
        <span className="w-1 h-1 rounded-full border border-[#000080]" />
      </span>
      <span className="h-1/3 w-full bg-[#138808] block" />
    </div>
  );
});

const TetherUsdtCircle: React.FC = React.memo(() => (
  <div
    className="w-6 h-6 rounded-full bg-[#26a17b] shrink-0 border border-emerald-300/30 shadow-[0_0_8px_rgba(38,161,123,0.45)] flex items-center justify-center"
    title="USDT (Tether)"
  >
    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6h12v2.4H13.4v2.75c3.42.2 6 .96 6 1.85 0 .9-2.58 1.65-6 1.85V19h-2.8v-4.15c-3.42-.2-6-.95-6-1.85 0-.89 2.58-1.65 6-1.85V8.4H6V6zm6 8.15c3.05 0 5.1-.54 5.1-1.15 0-.55-1.67-1.02-4.25-1.12v2.1c-.28.02-.57.03-.85.03s-.57-.01-.85-.03v-2.1C8.57 11.98 6.9 12.45 6.9 13c0 .61 2.05 1.15 5.1 1.15z" />
    </svg>
  </div>
));

/* Isolated Wallet CTA Button — only this 42x29 button re-renders on burst intervals */
const WalletCtaButton: React.FC<{ onClick: () => void }> = React.memo(({ onClick }) => {
  const [walletBurst, setWalletBurst] = useState(false);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    const burst = () => {
      setWalletBurst(true);
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setWalletBurst(false), 1250);
    };
    const first = setTimeout(burst, 1000);
    const id = setInterval(burst, 4800);
    return () => {
      clearTimeout(first);
      clearInterval(id);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="relative">
      <AnimatePresence>
        {walletBurst && (
          <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: [0, 0.9, 0.65, 0], scale: [0.98, 1.1, 1.2, 1.28] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.05, ease: 'easeOut' }}
              className="absolute -inset-0.5 rounded-[11px] border-[1.5px] border-[#facc15]/90 shadow-[0_0_12px_rgba(250,204,21,0.65)]"
            />
            {[
              { x: -15, y: -15, rot: -55, cls: 'from-cyan-200 via-cyan-400 to-transparent' },
              { x: 18, y: -11, rot: 25, cls: 'from-amber-200 via-yellow-400 to-transparent' },
              { x: -17, y: 12, rot: 140, cls: 'from-pink-200 via-rose-400 to-transparent' },
              { x: 16, y: 14, rot: -140, cls: 'from-emerald-200 via-emerald-400 to-transparent' },
            ].map((streak, i) => (
              <motion.span
                key={`streak-${i}`}
                initial={{ opacity: 0, x: 0, y: 0, scaleX: 0.3 }}
                animate={{
                  opacity: [0, 0.95, 0],
                  x: [0, streak.x * 0.65, streak.x],
                  y: [0, streak.y * 0.65, streak.y],
                  scaleX: [0.3, 1, 0.2],
                }}
                transition={{ duration: 0.5, delay: 0.04 * i, ease: 'easeOut' }}
                style={{ rotate: streak.rot }}
                className={`absolute w-2.5 h-[1.5px] rounded-full bg-gradient-to-r ${streak.cls}`}
              />
            ))}
            {[
              {
                x: 2,
                y: -18,
                size: 7,
                delay: 0.04,
                spin: 225,
                cls: 'bg-gradient-to-br from-cyan-200 via-sky-400 to-blue-500 shadow-[0_0_7px_rgba(56,189,248,0.95)]',
              },
              {
                x: 20,
                y: -9,
                size: 6,
                delay: 0.08,
                spin: -180,
                cls: 'bg-gradient-to-br from-emerald-200 via-[#1ad96a] to-teal-500 shadow-[0_0_7px_rgba(26,217,106,0.95)]',
              },
              {
                x: -20,
                y: -6,
                size: 6,
                delay: 0.06,
                spin: 190,
                cls: 'bg-gradient-to-br from-pink-200 via-rose-400 to-fuchsia-500 shadow-[0_0_7px_rgba(244,63,94,0.95)]',
              },
              {
                x: -14,
                y: 14,
                size: 5,
                delay: 0.1,
                spin: -210,
                cls: 'bg-gradient-to-br from-amber-100 via-yellow-400 to-orange-500 shadow-[0_0_7px_rgba(250,204,21,0.95)]',
              },
              {
                x: -4,
                y: 16,
                size: 5,
                delay: 0.13,
                spin: 160,
                cls: 'bg-gradient-to-br from-violet-200 via-purple-400 to-indigo-500 shadow-[0_0_7px_rgba(168,85,247,0.95)]',
              },
              {
                x: 16,
                y: 14,
                size: 6,
                delay: 0.09,
                spin: 200,
                cls: 'bg-gradient-to-br from-yellow-200 via-amber-400 to-pink-500 shadow-[0_0_7px_rgba(251,191,36,0.95)]',
              },
            ].map((crystal, idx) => (
              <motion.div
                key={`crystal-${idx}`}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.3, rotate: 45 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  x: [0, crystal.x * 0.65, crystal.x],
                  y: [0, crystal.y * 0.65, crystal.y],
                  scale: [0.4, 1.05, 0.9, 0.45],
                  rotate: [45, 45 + crystal.spin * 0.5, 45 + crystal.spin],
                }}
                transition={{ duration: 0.9, delay: crystal.delay, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: crystal.size, height: crystal.size }}
                className={`absolute rounded-[2px] border border-white/75 ${crystal.cls}`}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <button
        onClick={onClick}
        title="Deposit / Withdraw Wallet"
        className="relative z-10 w-[42px] h-[29px] rounded-[8px] bg-[linear-gradient(180deg,#f7aa8c_0%,#fc894c_34%,#ff7931_76%,#e2420d_100%)] flex items-center justify-center border border-white/40 shadow-[inset_0_2px_3px_rgba(255,255,255,0.6),inset_0_-2.5px_0_#bf2a00,0_3px_10px_rgba(255,110,45,0.35)] active:scale-95 transition-transform overflow-hidden"
      >
        <span className="pointer-events-none absolute inset-x-0.5 top-0 h-[6px] rounded-t-[7px] bg-gradient-to-b from-white/50 to-transparent" />
        <AnimatePresence>
          {walletBurst && (
            <motion.span
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: [0, 0.95, 0], scale: [0.5, 1.35, 1.5] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,#ffffff_0%,#fef08a_45%,rgba(251,191,36,0)_75%)] z-20"
            />
          )}
        </AnimatePresence>
        <svg
          className="relative z-10 w-[20px] h-[20px] text-white drop-shadow-[0_1px_1px_rgba(180,45,0,0.35)]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M9.2 7.5L15.6 5.1C16.3 4.85 17 5.38 17 6.12V7.5H9.2Z" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.2 8.8H17.4C18.5 8.8 19.4 9.7 19.4 10.8V12.2H16.3C14.95 12.2 13.85 13.3 13.85 14.65C13.85 16 14.95 17.1 16.3 17.1H19.4V18.2C19.4 19.3 18.5 20.2 17.4 20.2H6.2C5.1 20.2 4.2 19.3 4.2 18.2V10.8C4.2 9.7 5.1 8.8 6.2 8.8ZM16.4 15.85C17.06 15.85 17.6 15.31 17.6 14.65C17.6 13.99 17.06 13.45 16.4 13.45C15.74 13.45 15.2 13.99 15.2 14.65C15.2 15.31 15.74 15.85 16.4 15.85Z"
          />
          <circle cx="16.4" cy="14.65" r="1.25" />
        </svg>
      </button>
    </div>
  );
});

/* Continuous Horizontal GPU Slide Track Carousel with Swipe + Bottom-Left Dots */
interface HeroCarouselProps {
  onOpenWallet: () => void;
  onOpenColorGame: () => void;
  onOpenBottomTab: (tab: 'VIP' | 'EARN' | 'RACE' | 'PROMOS') => void;
}

const HeroCarousel: React.FC<HeroCarouselProps> = React.memo(
  ({ onOpenWallet, onOpenColorGame, onOpenBottomTab }) => {
    const [heroIndex, setHeroIndex] = useState(0);
    const [dragDelta, setDragDelta] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const touchStartX = useRef<number | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startAutoSlide = useCallback(() => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
      }, 4200);
    }, []);

    useEffect(() => {
      startAutoSlide();
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }, [startAutoSlide]);

    const goToSlide = (idx: number) => {
      setHeroIndex(idx);
      startAutoSlide();
    };

    const handleSlideAction = (action: (typeof HERO_SLIDES)[number]['action']) => {
      if (Math.abs(dragDelta) > 8) return;
      if (action === 'WALLET') onOpenWallet();
      else if (action === 'RACE') onOpenBottomTab('RACE');
      else onOpenColorGame();
    };

    const onTouchStart = (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      setIsDragging(true);
      if (timerRef.current) clearInterval(timerRef.current);
    };

    const onTouchMove = (e: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      setDragDelta(e.touches[0].clientX - touchStartX.current);
    };

    const onTouchEnd = () => {
      if (touchStartX.current !== null) {
        if (dragDelta < -42) {
          setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
        } else if (dragDelta > 42) {
          setHeroIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
        }
      }
      touchStartX.current = null;
      setDragDelta(0);
      setIsDragging(false);
      startAutoSlide();
    };

    return (
      <div className="px-3.5 pt-2">
        <div
          className="relative rounded-2xl overflow-hidden gpu-layer"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative aspect-[1196/554] w-full overflow-hidden rounded-2xl">
            <div
              className="flex h-full w-full gpu-layer"
              style={{
                transform: `translate3d(calc(-${heroIndex * 100}% + ${dragDelta}px), 0, 0)`,
                transition: isDragging
                  ? 'none'
                  : 'transform 520ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {HERO_SLIDES.map((slide) => (
                <div
                  key={slide.id}
                  onClick={() => handleSlideAction(slide.action)}
                  className="w-full h-full shrink-0 cursor-pointer"
                >
                  <img
                    src={slide.img}
                    alt={slide.alt}
                    draggable={false}
                    decoding="async"
                    className="w-full h-full object-cover block"
                  />
                </div>
              ))}
            </div>

            {/* Small Round 4-Dot Carousel Indicator at Bottom-Left */}
            <div className="absolute bottom-2.5 left-3.5 z-20 flex items-center gap-1.5">
              {HERO_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(idx);
                  }}
                  aria-label={`Slide ${idx + 1}`}
                  className={`rounded-full shrink-0 transition-all duration-300 ${
                    idx === heroIndex
                      ? 'w-[7px] h-[7px] bg-[#1ad96a] shadow-[0_0_6px_rgba(26,217,106,0.9)]'
                      : 'w-[6px] h-[6px] border border-white/50 bg-black/30 hover:border-white'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

/* Isolated Live Wins Marquee */
const LiveWinsMarquee: React.FC<{
  onOpenColorGame: () => void;
  onOpenAllBets: () => void;
}> = React.memo(({ onOpenColorGame, onOpenAllBets }) => (
  <section className="px-3.5 pt-3.5 space-y-2.5">
    <div className="flex items-center justify-between">
      <h2 className="text-[19px] font-bold tracking-tight text-white leading-none">
        <span className="text-[#f5a623]">L</span>ive wins
      </h2>
      <button
        onClick={onOpenAllBets}
        className="text-[13px] font-semibold text-[#0ea5e9] hover:text-sky-300 transition-colors"
      >
        All bets
      </button>
    </div>

    <div className="overflow-hidden -mx-0.5 px-0.5 contain-feed">
      <div className="animate-live-wins-marquee">
        {[0, 1].map((dupIdx) => (
          <div key={dupIdx} className="flex gap-2 pr-2 shrink-0">
            {LIVE_WINS_MARQUEE.map((item) => (
              <div
                key={`${dupIdx}-${item.uid}`}
                onClick={onOpenColorGame}
                className="w-[90px] shrink-0 rounded-xl overflow-hidden bg-[#1a1f28] border border-white/[0.04] cursor-pointer active:scale-95 transition-transform flex flex-col"
              >
                <div className="aspect-[1/0.88] w-full bg-[#242a34] relative overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.user}
                    decoding="async"
                    className="w-full h-full object-cover block"
                  />
                </div>
                <div className="px-1.5 py-2 text-center bg-[#151920]">
                  <span className="block text-[10px] text-[#7a8291] truncate leading-tight">
                    {item.user}
                  </span>
                  <span
                    className={`block text-[12px] font-bold font-mono tabular-nums mt-0.5 leading-tight ${
                      item.highlight ? 'text-[#f5b428]' : 'text-white'
                    }`}
                  >
                    {item.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </section>
));

/* Isolated Single-Text-Node Playing Counter */
const LivePlayingCount: React.FC<{ base: number; seed: number }> = React.memo(({ base, seed }) => {
  const [count, setCount] = useState(base);

  useEffect(() => {
    const intervalMs = 4200 + (seed % 5) * 650;
    const id = setInterval(() => {
      setCount((prev) => {
        const delta = ((prev + seed) % 3) - 1;
        return Math.max(100, prev + (delta === 0 ? 1 : delta));
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [seed]);

  return (
    <span className="text-[11px] font-semibold text-[#9aa3b2] tabular-nums">
      {count.toLocaleString('en-IN')}{' '}
      <span className="font-normal text-[#757f8f]">playing</span>
    </span>
  );
});

/* Isolated Originals Grid */
const OriginalsSection: React.FC<{
  sectionRef: React.RefObject<HTMLElement | null>;
  onOpenColorGame: () => void;
}> = React.memo(({ sectionRef, onOpenColorGame }) => {
  const [expandOriginals, setExpandOriginals] = useState(false);

  return (
    <section ref={sectionRef} className="px-3.5 pt-6 space-y-3 scroll-mt-32">
      <div className="flex items-center justify-between">
        <h2 className="text-[19px] font-bold tracking-tight text-white leading-none">
          <span className="text-[#f5a623]">O</span>riginals - 99%RTP (9)
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {INITIAL_ORIGINALS.map((game, idx) => (
          <div
            key={game.id}
            onClick={onOpenColorGame}
            className="cursor-pointer active:scale-95 transition-transform space-y-1.5"
          >
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
              <img
                src={game.img}
                alt={game.title}
                decoding="async"
                className="w-full h-auto block object-cover"
              />
            </div>
            <div className="flex items-center gap-1.5 px-0.5">
              <span className="w-2 h-2 rounded-full bg-[#1ad96a] shrink-0" />
              <LivePlayingCount base={game.playing} seed={idx + 1} />
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence initial={false}>
        {expandOriginals && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-3 gap-2.5 pt-1 overflow-hidden"
          >
            {EXTRA_ORIGINALS.map((game, idx) => (
              <div
                key={game.id}
                onClick={onOpenColorGame}
                className="cursor-pointer active:scale-95 transition-transform space-y-1.5"
              >
                <div
                  className={`aspect-[209/280] rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-gradient-to-b ${game.gradient} p-2.5 flex flex-col justify-between items-center text-center relative`}
                >
                  {game.id === 'color' && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/45 text-[9px] font-black text-emerald-300 border border-emerald-400/30">
                      LIVE
                    </span>
                  )}
                  <div className="flex-1 flex items-center justify-center w-full pt-2">
                    {game.id === 'color' && (
                      <div className="relative flex items-center justify-center">
                        <div className="w-9 h-9 rounded-full bg-emerald-400 border-2 border-white/80 shadow-lg -mr-2.5 flex items-center justify-center font-black text-xs text-emerald-950">
                          5
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 border-2 border-white shadow-xl z-10 flex items-center justify-center font-black text-sm text-white">
                          0
                        </div>
                        <div className="w-9 h-9 rounded-full bg-rose-500 border-2 border-white/80 shadow-lg -ml-2.5 flex items-center justify-center font-black text-xs text-white">
                          8
                        </div>
                      </div>
                    )}
                    {game.id === 'plinko' && (
                      <div className="space-y-1.5">
                        <div className="flex justify-center">
                          <span className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <div className="flex justify-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-white/80" />
                          <span className="w-2 h-2 rounded-full bg-white/80" />
                        </div>
                        <div className="flex justify-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-white/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fcd34d]" />
                          <span className="w-2 h-2 rounded-full bg-white/80" />
                        </div>
                      </div>
                    )}
                    {game.id === 'keno' && (
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="w-6 h-6 rounded-lg bg-white/20 border border-white/40 flex items-center justify-center text-xs font-black">
                          7
                        </div>
                        <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center text-xs font-black">
                          19
                        </div>
                        <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center text-xs font-black">
                          24
                        </div>
                        <div className="w-6 h-6 rounded-lg bg-white/20 border border-white/40 flex items-center justify-center text-xs font-black">
                          42
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="w-full pb-1">
                    <span className="block text-[14px] font-black tracking-tight text-white drop-shadow leading-none">
                      {game.title}
                    </span>
                    <span className="block text-[10px] font-semibold text-white/85 mt-1">
                      {game.subtitle}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#1ad96a] shrink-0" />
                  <LivePlayingCount base={game.playing} seed={idx + 7} />
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center pt-1">
        <button
          onClick={() => setExpandOriginals((v) => !v)}
          className="flex items-center gap-1 text-[13px] font-semibold text-[#c9d1dc] hover:text-white transition-colors py-1"
        >
          <span>{expandOriginals ? 'Show Less' : 'Load More'}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${expandOriginals ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
    </section>
  );
});

/* Isolated Hot Picks Grid */
const HotPicksSection: React.FC<{
  sectionRef: React.RefObject<HTMLElement | null>;
  onOpenColorGame: () => void;
}> = React.memo(({ sectionRef, onOpenColorGame }) => {
  const [expandHotPicks, setExpandHotPicks] = useState(false);

  return (
    <section ref={sectionRef} className="px-3.5 pt-5 space-y-3 scroll-mt-32">
      <div className="flex items-center justify-between">
        <h2 className="text-[19px] font-bold tracking-tight text-white leading-none">
          <span className="text-[#f5a623]">H</span>ot Picks (52)
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {INITIAL_HOT_PICKS.map((game, idx) => (
          <div
            key={game.id}
            onClick={onOpenColorGame}
            className="cursor-pointer active:scale-95 transition-transform space-y-1.5"
          >
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
              <img
                src={game.img}
                alt={game.title}
                decoding="async"
                className="w-full h-auto block object-cover"
              />
            </div>
            <div className="flex items-center gap-1.5 px-0.5">
              <span className="w-2 h-2 rounded-full bg-[#1ad96a] shrink-0" />
              <LivePlayingCount base={game.playing} seed={idx + 12} />
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence initial={false}>
        {expandHotPicks && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-3 gap-2.5 pt-1 overflow-hidden"
          >
            {EXTRA_HOT_PICKS.map((game, idx) => (
              <div
                key={game.id}
                onClick={onOpenColorGame}
                className="cursor-pointer active:scale-95 transition-transform space-y-1.5"
              >
                <div className="aspect-[209/280] rounded-2xl overflow-hidden border border-white/10 shadow-lg relative">
                  <img
                    src={game.img}
                    alt={game.title}
                    decoding="async"
                    className="w-full h-full object-cover block"
                  />
                </div>
                <div className="flex items-center gap-1.5 px-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#1ad96a] shrink-0" />
                  <LivePlayingCount base={game.playing} seed={idx + 20} />
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center pt-1">
        <button
          onClick={() => setExpandHotPicks((v) => !v)}
          className="flex items-center gap-1 text-[13px] font-semibold text-[#c9d1dc] hover:text-white transition-colors py-1"
        >
          <span>{expandHotPicks ? 'Show Less' : 'Load More'}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${expandHotPicks ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
    </section>
  );
});

/* Isolated Live Fantasy Countdown (ticks 1s without re-rendering FantasySection or page) */
const MatchCountdown: React.FC<{ initialSeconds: number }> = React.memo(({ initialSeconds }) => {
  const [secs, setSecs] = useState(initialSeconds);

  useEffect(() => {
    const id = setInterval(() => {
      setSecs((prev) => (prev > 1 ? prev - 1 : initialSeconds));
    }, 1000);
    return () => clearInterval(id);
  }, [initialSeconds]);

  const mins = Math.floor(secs / 60);
  const rem = secs % 60;
  return (
    <span className="block text-[12px] font-bold text-[#ef4444] font-mono tabular-nums tracking-tight">
      {String(mins).padStart(2, '0')}m {String(rem).padStart(2, '0')}s
    </span>
  );
});

/* Isolated Fantasy Section */
const FantasySection: React.FC<{
  sectionRef: React.RefObject<HTMLElement | null>;
  onSelectMatch: (match: (typeof FANTASY_MATCHES)[number]) => void;
  onViewAllFantasy: () => void;
}> = React.memo(({ sectionRef, onSelectMatch, onViewAllFantasy }) => (
  <section ref={sectionRef} className="px-3.5 pt-5 space-y-3 scroll-mt-32">
    <div className="flex items-center justify-between">
      <h2 className="text-[19px] font-bold tracking-tight text-white leading-none">
        <span className="text-[#0ea5e9]">F</span>antasy
      </h2>
      <button
        onClick={onViewAllFantasy}
        className="text-[13px] font-semibold text-[#0ea5e9] hover:text-sky-300 transition-colors"
      >
        View All
      </button>
    </div>

    <div className="space-y-3">
      {FANTASY_MATCHES.map((m) => (
        <div
          key={m.id}
          onClick={() => onSelectMatch(m)}
          className="rounded-2xl bg-[#161c25] border border-white/[0.04] p-3 space-y-2.5 cursor-pointer hover:border-sky-400/25 active:scale-[0.99] transition-all shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[12px] font-medium text-[#8e98a8]">
              <span className="w-4 h-4 rounded-full bg-white text-slate-900 flex items-center justify-center text-[9px] font-black">
                🏏
              </span>
              <span>{m.league}</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#8e98a8]" />
            </div>
            <Shirt className="w-4 h-4 text-[#6d7787]" />
          </div>

          <div className="rounded-xl bg-[#1a212b] border border-white/[0.03] px-3 py-2.5 flex items-center justify-between">
            <div className="space-y-2 min-w-0 flex-1 pr-2">
              <div className="flex items-center gap-2.5">
                {'team1Flag' in m && m.team1Flag === 'PK' ? (
                  <div className="w-6 h-6 rounded-full bg-[#01411c] border border-white/20 flex items-center justify-center text-[11px] shrink-0">
                    🌙
                  </div>
                ) : (
                  <div
                    className={`w-6 h-6 rounded-full bg-gradient-to-br ${m.team1Bg} border border-white/20 flex items-center justify-center text-[9px] font-black text-white shrink-0`}
                  >
                    {m.team1Tag}
                  </div>
                )}
                <span className="text-[13px] font-bold text-white shrink-0 w-16">
                  {m.team1Code}
                </span>
                <span className="text-[12px] text-[#7c8798] truncate">{m.team1Name}</span>
              </div>

              <div className="flex items-center gap-2.5">
                {'team2Flag' in m && m.team2Flag === 'IN' ? (
                  <IndianFlagCircle size="md" />
                ) : (
                  <div
                    className={`w-6 h-6 rounded-full bg-gradient-to-br ${m.team2Bg} border border-white/20 flex items-center justify-center text-[9px] font-black text-white shrink-0`}
                  >
                    {m.team2Tag}
                  </div>
                )}
                <span className="text-[13px] font-bold text-white shrink-0 w-16">
                  {m.team2Code}
                </span>
                <span className="text-[12px] text-[#7c8798] truncate">{m.team2Name}</span>
              </div>
            </div>

            <div className="pl-3 border-l border-white/[0.06] text-right shrink-0 min-w-[68px]">
              {'countdownSeconds' in m && typeof m.countdownSeconds === 'number' ? (
                <>
                  <MatchCountdown initialSeconds={m.countdownSeconds} />
                  <span className="block text-[10px] text-[#7d8797] mt-0.5 font-mono">
                    {m.time}
                  </span>
                </>
              ) : (
                <>
                  <span className="block text-[12px] font-semibold text-white">{m.day}</span>
                  <span className="block text-[11px] text-[#7d8797] mt-0.5 font-mono">
                    {m.time}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="w-4 h-4 rounded-full bg-[#f5b428] text-slate-950 font-black text-[9px] flex items-center justify-center">
              M
            </span>
            <span className="text-[13px] font-bold text-[#f5b428] font-mono">{m.prize}</span>
          </div>
        </div>
      ))}
    </div>
  </section>
));

/* Isolated Live Bets Feed — zero layout reflow outside fixed 264px contain-feed box */
const LiveBetsFeed: React.FC<{
  currentRoundBets: UserBet[];
  onOpenColorGame: () => void;
}> = React.memo(({ currentRoundBets, onOpenColorGame }) => {
  const [betsTab, setBetsTab] = useState<BetsTab>('Casino');
  const [streamingBets, setStreamingBets] = useState<LiveBetRow[]>(CASINO_BETS_SEED);
  const betCounter = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      const pool =
        betsTab === 'Casino'
          ? STREAM_BET_POOL
          : betsTab === 'Fantasy'
            ? FANTASY_BETS
            : GAMES_BETS;
      const next = pool[betCounter.current % pool.length];
      betCounter.current += 1;
      setStreamingBets((prev) => [
        { ...next, uid: `bet-${Date.now()}-${betCounter.current}` },
        ...prev.slice(0, 5),
      ]);
    }, 1450);
    return () => clearInterval(id);
  }, [betsTab]);

  const handleBetsTabChange = (tab: BetsTab) => {
    setBetsTab(tab);
    if (tab === 'Casino') setStreamingBets(CASINO_BETS_SEED);
    else if (tab === 'Fantasy') setStreamingBets(FANTASY_BETS);
    else {
      const userConverted: LiveBetRow[] = currentRoundBets.slice(0, 3).map((b) => ({
        uid: `user-${b.id}`,
        game: 'Win Go 30s',
        icon: '/assets/drem/icon_wheel.png',
        player: b.userName,
        payout: b.payout > 0 ? b.payout.toLocaleString('en-IN') : b.amount.toLocaleString('en-IN'),
        tab: 'Games',
      }));
      setStreamingBets([...userConverted, ...GAMES_BETS].slice(0, 6));
    }
  };

  return (
    <section className="px-3.5 pt-6 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[19px] font-bold tracking-tight text-white leading-none">
          <span className="text-[#0ea5e9]">B</span>ets
        </h2>
      </div>

      <div className="rounded-2xl bg-[#161b23] border border-white/[0.04] p-3 space-y-3 shadow-lg">
        <div className="bg-[#10141a] p-1 rounded-xl grid grid-cols-3">
          {(['Casino', 'Fantasy', 'Games'] as BetsTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleBetsTabChange(tab)}
              className={`py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
                betsTab === tab
                  ? 'bg-[#00a6ff] text-white shadow-[0_2px_12px_rgba(0,166,255,0.4)]'
                  : 'text-[#8792a3] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-12 px-1 text-[12px] font-medium text-[#8a94a6]">
          <span className="col-span-5">Game</span>
          <span className="col-span-4">Player</span>
          <span className="col-span-3 text-right">Payout</span>
        </div>

        {/* Fixed height + contain: layout paint keeps new-row glide 100% isolated from page scroll */}
        <div className="h-[264px] overflow-hidden contain-feed">
          <AnimatePresence initial={false}>
            {streamingBets.map((row) => (
              <motion.div
                key={row.uid}
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: 44, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                onClick={onOpenColorGame}
                className="grid grid-cols-12 items-center px-1 cursor-pointer hover:bg-white/[0.02] rounded-lg overflow-hidden gpu-layer"
              >
                <div className="col-span-5 flex items-center gap-2 min-w-0 pr-1">
                  <img
                    src={row.icon}
                    alt={row.game}
                    decoding="async"
                    className="w-7 h-7 rounded-md object-cover shrink-0 border border-white/10"
                  />
                  <span className="text-[12px] font-semibold text-[#00a6ff] truncate">
                    {row.game}
                  </span>
                </div>

                <div className="col-span-4 flex items-center gap-1 min-w-0 pr-1 text-[12px] text-[#8f99a8]">
                  {row.incognito && (
                    <span className="text-[11px] shrink-0" title="Incognito">
                      🕵️
                    </span>
                  )}
                  <span className="truncate">{row.player}</span>
                </div>

                <div className="col-span-3 flex items-center justify-end gap-1.5">
                  <span className="text-[12px] font-bold font-mono tabular-nums text-white">
                    {row.payout}
                  </span>
                  <IndianFlagCircle size="sm" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
});

/* Isolated Footer with smooth animated Accordions + crisp inline Vector Social SVGs */
const FooterSection: React.FC<{ onOpenNotice: () => void }> = React.memo(({ onOpenNotice }) => {
  const [openAccordion, setOpenAccordion] = useState<'Features' | 'Help' | 'FAQ' | null>(null);

  return (
    <footer className="px-3.5 pt-6 pb-4 space-y-5">
      <div className="border-t border-white/[0.06] divide-y divide-white/[0.06]">
        {(
          [
            {
              key: 'Features',
              content:
                'Win Go 30s Color Prediction (99% RTP), Originals (Mines, Chicken, Aviator, Dice, Limbo, Wheel), Real-Time Jili API Settlement & Instant USDT/UPI Wallet.',
            },
            {
              key: 'Help',
              content:
                '24/7 Instant UPI & Crypto (BSC/ETH/TRC20) deposits & withdrawals. Contact VIP support anytime via the notification or profile menu.',
            },
            {
              key: 'FAQ',
              content:
                'Every Win Go round settles every 30s with SHA-256 verifiable hashes. Tap the top-right cyan mascot avatar to open Color Prediction, Admin Panel, or Jili API Console.',
            },
          ] as const
        ).map((item) => {
          const isOpen = openAccordion === item.key;
          return (
            <div key={item.key}>
              <button
                onClick={() => setOpenAccordion(isOpen ? null : item.key)}
                className="w-full py-3.5 flex items-center justify-between text-[14px] font-medium text-[#b5becb] hover:text-white transition-colors"
              >
                <span>{item.key}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#8a94a6] transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-3.5 text-[12px] text-[#7f8a99] leading-relaxed">
                      {item.content}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Crisp Vector Social Icons */}
      <div className="grid grid-cols-7 gap-2 pt-1">
        {/* Telegram */}
        <button
          onClick={onOpenNotice}
          title="Telegram"
          className="aspect-square rounded-xl bg-[#1a2029] border border-white/[0.05] flex items-center justify-center hover:bg-[#232b36] active:scale-95 transition-all"
        >
          <svg className="w-[18px] h-[18px] text-[#29a9eb]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.9 4.6c.3-1.2-.8-2.2-1.9-1.7L2.6 10.2c-1.1.5-1.1 2 .1 2.4l4.4 1.4 1.7 5.3c.3.9 1.4 1.2 2.1.6l2.6-2.4 4.8 3.5c.9.7 2.2.2 2.5-.9L21.9 4.6zM8.5 13.5l9.4-6c.2-.1.4.1.2.3l-7.7 7.1-.4 3.1-1.5-4.5z" />
          </svg>
        </button>

        {/* Discord */}
        <button
          onClick={onOpenNotice}
          title="Discord"
          className="aspect-square rounded-xl bg-[#1a2029] border border-white/[0.05] flex items-center justify-center hover:bg-[#232b36] active:scale-95 transition-all"
        >
          <svg className="w-[18px] h-[18px] text-[#5865f2]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.3 5.4A15.9 15.9 0 0 0 15.4 4c-.2.3-.4.8-.5 1.1a14.7 14.7 0 0 0-5.8 0C9 4.8 8.8 4.3 8.6 4A15.9 15.9 0 0 0 4.7 5.4C2.2 9.2 1.5 12.9 1.8 16.5A16 16 0 0 0 6.6 19c.4-.5.7-1.1 1-1.7-.5-.2-1.1-.5-1.6-.8l.4-.3c3.1 1.4 6.5 1.4 9.6 0l.4.3c-.5.3-1 .6-1.6.8.3.6.6 1.2 1 1.7a16 16 0 0 0 4.8-2.5c.4-4.2-.7-7.8-1.3-11.1zM9.2 14.2c-.9 0-1.7-.9-1.7-1.9s.7-1.9 1.7-1.9 1.7.9 1.7 1.9-.7 1.9-1.7 1.9zm5.6 0c-.9 0-1.7-.9-1.7-1.9s.7-1.9 1.7-1.9 1.7.9 1.7 1.9-.7 1.9-1.7 1.9z" />
          </svg>
        </button>

        {/* X */}
        <button
          onClick={onOpenNotice}
          title="X"
          className="aspect-square rounded-xl bg-[#1a2029] border border-white/[0.05] flex items-center justify-center hover:bg-[#232b36] active:scale-95 transition-all"
        >
          <svg className="w-[16px] h-[16px] text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.2 3H21l-6.5 7.4L22 21h-6l-4.7-6.1L6 21H3.2l6.9-7.9L2 3h6.1l4.2 5.6L18.2 3zm-1 16.2h1.6L7.1 4.7H5.4l11.8 14.5z" />
          </svg>
        </button>

        {/* WhatsApp */}
        <button
          onClick={onOpenNotice}
          title="WhatsApp"
          className="aspect-square rounded-xl bg-[#1a2029] border border-white/[0.05] flex items-center justify-center hover:bg-[#232b36] active:scale-95 transition-all"
        >
          <svg className="w-[18px] h-[18px] text-[#25d366]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a9.9 9.9 0 0 0-8.5 15L2.4 21.6l4.7-1.2A9.9 9.9 0 1 0 12 2zm5.6 14c-.2.7-1.3 1.2-1.9 1.3-.5.1-1.1.1-1.8-.1a14 14 0 0 1-5.8-3.8c-1.7-1.7-2.8-3.7-3.1-4.8-.2-.7 0-1.6.5-2.1.4-.4.9-.5 1.2-.5h.8c.3 0 .6.1.8.6l.9 2.2c.1.3.1.6-.1.8l-.6.7c-.2.2-.3.5-.1.8.5.9 1.2 1.8 2.1 2.5.9.7 1.7 1.1 2.5 1.3.3.1.6 0 .8-.2l.7-.8c.2-.3.5-.3.8-.2l2.1 1c.4.2.6.5.5.8z" />
          </svg>
        </button>

        {/* Facebook */}
        <button
          onClick={onOpenNotice}
          title="Facebook"
          className="aspect-square rounded-xl bg-[#1a2029] border border-white/[0.05] flex items-center justify-center hover:bg-[#232b36] active:scale-95 transition-all"
        >
          <svg className="w-[18px] h-[18px] text-[#1877f2]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 13.5h2.5l1-4H14v-2c0-1 .3-2 2-2h1.5V2.1c-.3 0-1.5-.1-2.8-.1-2.8 0-4.7 1.7-4.7 4.8v2.7H7v4h3V22h4v-8.5z" />
          </svg>
        </button>

        {/* YouTube */}
        <button
          onClick={onOpenNotice}
          title="YouTube"
          className="aspect-square rounded-xl bg-[#1a2029] border border-white/[0.05] flex items-center justify-center hover:bg-[#232b36] active:scale-95 transition-all"
        >
          <svg className="w-[19px] h-[19px] text-[#ff0000]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5a2.7 2.7 0 0 0-1.9 1.9C2 8.9 2 12 2 12s0 3.1.4 4.8a2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9c.4-1.7.4-4.8.4-4.8s0-3.1-.4-4.8zM10 15V9l5.2 3L10 15z" />
          </svg>
        </button>

        {/* Instagram */}
        <button
          onClick={onOpenNotice}
          title="Instagram"
          className="aspect-square rounded-xl bg-[#1a2029] border border-white/[0.05] flex items-center justify-center hover:bg-[#232b36] active:scale-95 transition-all"
        >
          <svg
            className="w-[17px] h-[17px] text-[#e1306c]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
        </button>
      </div>
    </footer>
  );
});

export const DremHome: React.FC<DremHomeProps> = ({
  userBalance,
  currentRoundBets,
  onOpenColorGame,
  onOpenWallet,
  onOpenAdmin,
  onOpenJiliApi,
  onOpenBottomTab,
}) => {
  const [activeCategory, setActiveCategory] = useState<TopCategory>('Explore');
  const [isVipView, setIsVipView] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<(typeof FANTASY_MATCHES)[number] | null>(null);
  const [showAllBetsModal, setShowAllBetsModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);

  const originalsRef = useRef<HTMLElement>(null);
  const hotPicksRef = useRef<HTMLElement>(null);
  const fantasyRef = useRef<HTMLElement>(null);

  const handleCategoryClick = useCallback((cat: TopCategory) => {
    setIsVipView(false);
    setActiveCategory(cat);
    if (cat === 'Explore' || cat === 'Fantasy') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (cat === 'Sports') {
      requestAnimationFrame(() =>
        fantasyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      );
    } else if (cat === 'Casino') {
      requestAnimationFrame(() =>
        hotPicksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      );
    } else if (cat === 'Games') {
      requestAnimationFrame(() =>
        originalsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      );
    }
  }, []);

  const openFantasyPage = useCallback(() => {
    setIsVipView(false);
    setActiveCategory('Fantasy');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openVipPage = useCallback(() => {
    setActiveCategory('Explore');
    setIsVipView(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openAllBets = useCallback(() => setShowAllBetsModal(true), []);
  const openNotice = useCallback(() => setShowNotifModal(true), []);

  const isFantasyView = activeCategory === 'Fantasy';

  return (
    <div
      className={`w-full max-w-[430px] mx-auto min-h-screen relative select-none font-sans shadow-2xl ${
        isFantasyView
          ? 'bg-[#f3f4f6] text-[#111827]'
          : isVipView
            ? 'bg-[#101018] text-slate-100 pb-[72px]'
            : 'bg-[#111217] text-slate-100 pb-[72px]'
      }`}
    >
      {/* 1. STICKY HEADER + CATEGORY STRIP (GPU promoted layer for zero-jank scrolling) */}
      <div className="sticky top-0 z-40 bg-[#151920] shadow-[0_6px_20px_rgba(0,0,0,0.45)] gpu-layer">
        <header className="px-3.5 py-1.5 flex items-center justify-between gap-2">
          <button
            onClick={() => handleCategoryClick('Explore')}
            className="flex items-center gap-1.5 shrink-0 group active:scale-95 transition-transform text-left"
          >
            <span className="w-[3px] h-[23px] rounded-full bg-gradient-to-b from-[#1ad96a] via-[#22d3ee] to-[#00a6ff] shadow-[0_0_8px_rgba(26,217,106,0.55)]" />
            <span className="flex flex-col leading-none">
              <span className="text-[17px] font-black italic tracking-tight font-display bg-gradient-to-r from-white via-emerald-200 to-[#1ad96a] bg-clip-text text-transparent">
                GGB
              </span>
              <span className="text-[8px] font-extrabold tracking-[0.26em] uppercase text-[#38bdf8] mt-[1.5px]">
                system
              </span>
            </span>
          </button>

          <div className="flex items-center bg-[#212730] rounded-xl pl-2 pr-0.5 py-0.5 gap-1.5 border border-white/[0.06] shadow-inner relative">
            <div onClick={onOpenWallet} className="cursor-pointer">
              <TetherUsdtCircle />
            </div>

            <button
              onClick={onOpenWallet}
              className="flex items-center gap-1 text-[13.5px] font-bold text-white font-mono tabular-nums pr-0.5"
            >
              <span>
                {(userBalance / 85).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-[10px] font-extrabold text-[#26a17b] tracking-tight">USDT</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <WalletCtaButton onClick={onOpenWallet} />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={openNotice}
              className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-b from-[#252c38] to-[#171b23] border border-white/[0.09] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_2px_6px_rgba(0,0,0,0.45)] flex items-center justify-center relative hover:brightness-110 active:scale-95 transition-all"
              title="Notifications"
            >
              <TopbarBell3D className="w-[21px] h-[21px] drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)]" />
              <span className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-1.5 rounded-full bg-[#fb923c]/50 blur-[3px]" />
            </button>

            <button
              onClick={() => setShowProfileMenu((v) => !v)}
              className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-b from-[#2c384a] to-[#1a202c] border border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_2px_6px_rgba(0,0,0,0.45)] flex items-center justify-center relative hover:brightness-110 active:scale-95 transition-all"
              title="Profile & Admin Menu"
            >
              <TopbarMascot3D className="w-[25px] h-[25px] drop-shadow-[0_2px_4px_rgba(14,165,233,0.45)]" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#ff3b30] border-2 border-[#151920]" />
            </button>
          </div>
        </header>

        {showProfileMenu && (
          <div className="absolute right-3.5 top-12 z-50 w-60 bg-[#1b222c] border border-slate-700/80 rounded-2xl shadow-2xl p-2 space-y-1">
            <button
              onClick={() => {
                setShowProfileMenu(false);
                onOpenColorGame();
              }}
              className="w-full px-3 py-2.5 rounded-xl hover:bg-white/5 text-left text-xs font-semibold text-emerald-400 flex items-center gap-2.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Play Color Prediction (Win Go)</span>
            </button>
            <button
              onClick={() => {
                setShowProfileMenu(false);
                onOpenAdmin();
              }}
              className="w-full px-3 py-2.5 rounded-xl hover:bg-white/5 text-left text-xs font-semibold text-rose-400 flex items-center gap-2.5"
            >
              <Sliders className="w-4 h-4" />
              <span>Admin Control Panel</span>
            </button>
            <button
              onClick={() => {
                setShowProfileMenu(false);
                onOpenJiliApi();
              }}
              className="w-full px-3 py-2.5 rounded-xl hover:bg-white/5 text-left text-xs font-semibold text-sky-400 flex items-center gap-2.5"
            >
              <Terminal className="w-4 h-4" />
              <span>Jili API Console</span>
            </button>
          </div>
        )}

        {/* 2. SECONDARY CATEGORY STRIP */}
        <nav className="border-b border-white/[0.06] px-2 pt-1.5 pb-2 grid grid-cols-5 text-center">
          <button
            onClick={() => handleCategoryClick('Explore')}
            className="flex flex-col items-center gap-1 py-0.5 rounded-lg group"
          >
            <CategoryExplore3D
              active={activeCategory === 'Explore'}
              className="w-[26px] h-[26px] transition-transform group-active:scale-90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
            />
            <span
              className={`text-[11px] leading-tight font-semibold ${
                activeCategory === 'Explore' ? 'text-white' : 'text-[#8c96a5]'
              }`}
            >
              Explore
            </span>
          </button>

          <button
            onClick={() => handleCategoryClick('Fantasy')}
            className="flex flex-col items-center gap-1 py-0.5 rounded-lg group"
          >
            <CategoryFantasy3D
              active={activeCategory === 'Fantasy'}
              className="w-[26px] h-[26px] transition-transform group-active:scale-90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
            />
            <span
              className={`text-[11px] leading-tight font-semibold ${
                activeCategory === 'Fantasy' ? 'text-white' : 'text-[#8c96a5]'
              }`}
            >
              Fantasy
            </span>
          </button>

          <button
            onClick={() => handleCategoryClick('Casino')}
            className="flex flex-col items-center gap-1 py-0.5 rounded-lg group"
          >
            <CategoryCasino3D
              active={activeCategory === 'Casino'}
              className="w-[26px] h-[26px] transition-transform group-active:scale-90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
            />
            <span
              className={`text-[11px] leading-tight font-semibold ${
                activeCategory === 'Casino' ? 'text-white' : 'text-[#8c96a5]'
              }`}
            >
              Casino
            </span>
          </button>

          <button
            onClick={() => handleCategoryClick('Games')}
            className="flex flex-col items-center gap-1 py-0.5 rounded-lg group"
          >
            <CategoryGames3D
              active={activeCategory === 'Games'}
              className="w-[26px] h-[26px] transition-transform group-active:scale-90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
            />
            <span
              className={`text-[11px] leading-tight font-semibold ${
                activeCategory === 'Games' ? 'text-white' : 'text-[#8c96a5]'
              }`}
            >
              Games
            </span>
          </button>

          <button
            onClick={() => handleCategoryClick('Sports')}
            className="flex flex-col items-center gap-1 py-0.5 rounded-lg group"
          >
            <CategorySports3D
              active={activeCategory === 'Sports'}
              className="w-[26px] h-[26px] transition-transform group-active:scale-90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
            />
            <span
              className={`text-[11px] leading-tight font-semibold ${
                activeCategory === 'Sports' ? 'text-white' : 'text-[#8c96a5]'
              }`}
            >
              Sports
            </span>
          </button>
        </nav>
      </div>

      {isFantasyView ? (
        <FantasyPage
          userBalance={userBalance}
          onOpenColorGame={onOpenColorGame}
          onOpenWallet={onOpenWallet}
        />
      ) : (
        <>
          {isVipView ? (
            <VipPage onOpenColorGame={onOpenColorGame} onOpenWallet={onOpenWallet} />
          ) : (
            <>
              {/* 3. CONTINUOUS GPU HERO CAROUSEL */}
              <HeroCarousel
                onOpenWallet={onOpenWallet}
                onOpenColorGame={onOpenColorGame}
                onOpenBottomTab={onOpenBottomTab}
              />

              {/* 4. CONTINUOUS MARQUEE LIVE WINS */}
              <LiveWinsMarquee onOpenColorGame={onOpenColorGame} onOpenAllBets={openAllBets} />

              {/* 5. ORIGINALS - 99%RTP (9) */}
              <OriginalsSection sectionRef={originalsRef} onOpenColorGame={onOpenColorGame} />

              {/* 6. HOT PICKS (52) */}
              <HotPicksSection sectionRef={hotPicksRef} onOpenColorGame={onOpenColorGame} />

              {/* 7. FANTASY SECTION */}
              <FantasySection
                sectionRef={fantasyRef}
                onSelectMatch={setSelectedMatch}
                onViewAllFantasy={openFantasyPage}
              />

              {/* 8. LIVE STREAMING BETS TABLE */}
              <LiveBetsFeed currentRoundBets={currentRoundBets} onOpenColorGame={onOpenColorGame} />

              {/* 9. COME TO WIN SECTION */}
              <section className="px-3.5 pt-6 space-y-3">
                <h2 className="text-[19px] font-bold tracking-tight text-white leading-none uppercase">
                  <span className="text-[#f5a623]">C</span>OME TO WIN
                </h2>

                <div
                  onClick={onOpenColorGame}
                  className="rounded-2xl overflow-hidden border border-white/[0.06] shadow-lg cursor-pointer active:scale-[0.99] transition-transform"
                >
                  <img
                    src="/assets/drem/banner_ipl_payout.png"
                    alt="IPL Total Verified Payout ₹497 Cr+ Paid Out"
                    decoding="async"
                    className="w-full h-auto block object-cover"
                  />
                </div>

                <div
                  onClick={openNotice}
                  className="rounded-2xl overflow-hidden border border-white/[0.06] shadow-lg cursor-pointer active:scale-[0.99] transition-transform"
                >
                  <img
                    src="/assets/drem/banner_responsible.png"
                    alt="Responsible Gaming - Play Responsibly"
                    decoding="async"
                    className="w-full h-auto block object-cover"
                  />
                </div>
              </section>

              {/* 10. FOOTER ACCORDIONS & VECTOR SOCIAL ICONS */}
              <FooterSection onOpenNotice={openNotice} />
            </>
          )}

          {/* 11. FIXED BOTTOM NAVIGATION BAR (GPU promoted layer) */}
          <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto rounded-t-[18px] bg-[#1e232e]/95 backdrop-blur-md border-t border-white/[0.08] grid grid-cols-4 py-2 px-1.5 z-40 shadow-[0_-10px_28px_rgba(0,0,0,0.72)] gpu-layer">
            <button
              onClick={openVipPage}
              className={`relative flex flex-col items-center gap-1 py-0.5 rounded-xl active:scale-95 transition-all group ${
                isVipView ? 'text-[#fef08a]' : 'text-[#8c96a5] hover:text-white'
              }`}
            >
              {isVipView && (
                <>
                  <span className="pointer-events-none absolute -top-[9px] left-1/2 -translate-x-1/2 w-8 h-[3.5px] rounded-full bg-gradient-to-r from-[#fde047] via-[#ffd84d] to-[#f59e0b] shadow-[0_0_14px_4px_rgba(250,204,21,0.78)]" />
                  <span className="pointer-events-none absolute -top-2 inset-x-1 bottom-0 rounded-b-xl bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.3),transparent_68%)]" />
                </>
              )}
              <NavVipDiamond3D
                active={isVipView}
                className={`relative z-10 w-[26px] h-[26px] group-hover:brightness-110 transition-all ${
                  isVipView
                    ? 'drop-shadow-[0_0_10px_rgba(250,204,21,0.7)]'
                    : 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.65)]'
                }`}
              />
              <span className="relative z-10 text-[11px] leading-tight font-semibold">VIP</span>
            </button>

            <button
              onClick={() => onOpenBottomTab('EARN')}
              className="flex flex-col items-center gap-1 py-0.5 rounded-xl text-[#8c96a5] hover:text-white active:scale-95 transition-all group"
            >
              <NavEarnRupee3D className="w-[26px] h-[26px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.65)] group-hover:brightness-110 transition-all" />
              <span className="text-[11px] leading-tight font-semibold">Earn</span>
            </button>

            <button
              onClick={() => onOpenBottomTab('RACE')}
              className="flex flex-col items-center gap-1 py-0.5 rounded-xl text-[#8c96a5] hover:text-white active:scale-95 transition-all group"
            >
              <NavRaceTrophy3D className="w-[26px] h-[26px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.65)] group-hover:brightness-110 transition-all" />
              <span className="text-[11px] leading-tight font-semibold">₹30L Race</span>
            </button>

            <button
              onClick={() => onOpenBottomTab('PROMOS')}
              className="flex flex-col items-center gap-1 py-0.5 rounded-xl text-[#8c96a5] hover:text-white active:scale-95 transition-all group"
            >
              <NavPromosGift3D className="w-[26px] h-[26px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.65)] group-hover:brightness-110 transition-all" />
              <span className="text-[11px] leading-tight font-semibold">Promos</span>
            </button>
          </nav>
        </>
      )}

      {/* FANTASY CONTEST QUICK MODAL */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xs bg-[#151920] border border-slate-700/80 rounded-2xl p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-sm font-bold text-white">
                {selectedMatch.team1Code} vs {selectedMatch.team2Code}
              </h4>
              <button
                onClick={() => setSelectedMatch(null)}
                className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              {selectedMatch.league} • {selectedMatch.day} {selectedMatch.time}
            </p>
            <div className="rounded-xl bg-[#0e1218] border border-amber-500/20 p-3 flex items-center justify-between">
              <span className="text-xs text-slate-300">Mega Contest Pool</span>
              <span className="text-base font-black text-[#f5b428] font-mono">
                {selectedMatch.prize}
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedMatch(null);
                onOpenColorGame();
              }}
              className="w-full py-2.5 rounded-xl bg-[#00a6ff] text-white text-xs font-bold shadow-lg"
            >
              Play Live 30s Prediction While Waiting
            </button>
          </div>
        </div>
      )}

      {/* ALL BETS LIVE FEED MODAL */}
      {showAllBetsModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-3">
          <div className="w-full max-w-md bg-[#151920] border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#f5a623]" />
                <span>Live Bets Feed ({currentRoundBets.length})</span>
              </h3>
              <button
                onClick={() => setShowAllBetsModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 max-h-80 overflow-y-auto space-y-2 text-xs font-mono">
              {currentRoundBets.length === 0 ? (
                <p className="text-center py-6 text-slate-500">
                  Waiting for live bets in current round...
                </p>
              ) : (
                currentRoundBets.slice(0, 15).map((bet) => (
                  <div
                    key={bet.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#0e1218] border border-slate-800/80"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 font-semibold">{bet.userName}</span>
                      <span className="text-slate-500">on</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-bold">
                        {bet.target}
                      </span>
                    </div>
                    <span className="text-[#f5a623] font-bold">
                      ₹{bet.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS MODAL */}
      {showNotifModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xs bg-[#151920] border border-slate-700/80 rounded-2xl p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1ad96a]" />
                <span>GGB system Official Notice</span>
              </h4>
              <button
                onClick={() => setShowNotifModal(false)}
                className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Instant USDT (BSC · ETH · TRC20) &amp; UPI deposits available 24/7. Win Go 30s Color
              Prediction (99% RTP) is live!
            </p>
            <button
              onClick={() => setShowNotifModal(false)}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-[#ff864c] to-[#e44d19] text-white text-xs font-bold"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
