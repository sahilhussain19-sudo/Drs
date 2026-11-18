import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronRight,
  BellPlus,
  BellRing,
  ExternalLink,
  X,
  Trophy,
  Sparkles,
  CheckCircle2,
  Gamepad2,
  Coins,
  Headphones,
  Home,
  Target,
  Award,
  Gift,
  Users,
} from 'lucide-react';

interface FantasyPageProps {
  userBalance: number;
  onOpenColorGame: () => void;
  onOpenWallet: () => void;
}

type SportTab = 'Cricket' | 'Football' | 'Kabaddi';
type FilterTab = 'Recommended' | 'Starting Soon' | 'Popular';
type FantasyBottomTab = 'Home' | 'Predictions' | 'My Matches' | 'Rewards';

interface FantasyMatchItem {
  id: string;
  sport: SportTab;
  league: string;
  lineupTag?: string;
  team1Code: string;
  team1Name: string;
  team1Color: string;
  team1Text: string;
  team1Type?: 'PK' | 'IN' | 'NZ' | 'ENG' | 'AUS' | 'CREST';
  team2Code: string;
  team2Name: string;
  team2Color: string;
  team2Text: string;
  team2Type?: 'PK' | 'IN' | 'NZ' | 'ENG' | 'AUS' | 'CREST';
  countdownSeconds?: number;
  countdownLabel?: string;
  dayLabel?: string;
  timeLabel: string;
  prize: string;
  popularRank: number;
  soonRank: number;
}

const FANTASY_HERO_BANNERS = [
  {
    id: 'champions',
    img: '/assets/drem/fantasy_champions.png',
    alt: 'Champions Club - Tap to View Your Benefits',
    target: 'REWARDS' as const,
  },
  {
    id: 'nz-ind',
    img: '/assets/drem/fantasy_nz_ind.png',
    alt: '14 Lakhs Top Prize - NZ vs IND',
    target: 'MATCH' as const,
  },
];

const FANTASY_MATCH_LIST: FantasyMatchItem[] = [
  {
    id: 't10-aba-eme',
    sport: 'Cricket',
    league: 'T10 • Abu Dhabi T10 ...',
    lineupTag: 'EME Bowl first',
    team1Code: 'ABA',
    team1Name: 'Arabian Aces',
    team1Color: 'from-[#6b1d2f] to-[#3c0f1b]',
    team1Text: 'AA',
    team2Code: 'EME',
    team2Name: 'Emirates Eagles',
    team2Color: 'from-[#b91c1c] to-[#1e3a8a]',
    team2Text: 'EE',
    countdownSeconds: 667, // 11m : 7s
    timeLabel: '7:15 PM',
    prize: '₹24.76 Lakhs+',
    popularRank: 2,
    soonRank: 1,
  },
  {
    id: 't10-yls-uab',
    sport: 'Cricket',
    league: 'T10 • Abu Dhabi T10 League, 20...',
    team1Code: 'YLS',
    team1Name: 'Yas Lions',
    team1Color: 'from-[#eab308] to-[#713f12]',
    team1Text: 'YL',
    team2Code: 'UAB',
    team2Name: 'UAE Bulls',
    team2Color: 'from-[#1d4ed8] to-[#dc2626]',
    team2Text: 'UB',
    countdownLabel: '2h : 26m',
    timeLabel: '9:30 PM',
    prize: '₹20.66 Lakhs+',
    popularRank: 3,
    soonRank: 2,
  },
  {
    id: 't20-ssw-mrw',
    sport: 'Cricket',
    league: 'T20 • WBBL, 2026',
    team1Code: 'SS-W',
    team1Name: 'Sydney Sixers ...',
    team1Color: 'from-[#ec4899] to-[#9d174d]',
    team1Text: 'SS',
    team2Code: 'MR-W',
    team2Name: 'Melbourne Re...',
    team2Color: 'from-[#ef4444] to-[#111827]',
    team2Text: 'MR',
    dayLabel: 'Tomorrow',
    timeLabel: '5:30 AM',
    prize: '₹15.45 Lakhs+',
    popularRank: 5,
    soonRank: 3,
  },
  {
    id: 'odi-nz-ind',
    sport: 'Cricket',
    league: 'ODI • IND in NZ, 5 ODIs, 2026',
    team1Code: 'NZ',
    team1Name: 'New Zealand',
    team1Color: 'from-[#1f2937] to-[#030712]',
    team1Text: 'NZ',
    team1Type: 'NZ',
    team2Code: 'IND',
    team2Name: 'India',
    team2Color: 'from-[#ff9933] to-[#138808]',
    team2Text: 'IN',
    team2Type: 'IN',
    dayLabel: 'Tomorrow',
    timeLabel: '7:30 AM',
    prize: '₹1.23 Crores+',
    popularRank: 1,
    soonRank: 4,
  },
  {
    id: 'odi-aus-eng',
    sport: 'Cricket',
    league: 'ODI • ENG in AUS, 3 ODIs, 2026',
    team1Code: 'AUS',
    team1Name: 'Australia',
    team1Color: 'from-[#15803d] to-[#eab308]',
    team1Text: 'AUS',
    team1Type: 'AUS',
    team2Code: 'ENG',
    team2Name: 'England',
    team2Color: 'from-[#ffffff] to-[#e2e8f0]',
    team2Text: 'ENG',
    team2Type: 'ENG',
    dayLabel: 'Tomorrow',
    timeLabel: '9:00 AM',
    prize: '₹20.66 Lakhs+',
    popularRank: 4,
    soonRank: 5,
  },
  {
    id: 't20-psw-asw',
    sport: 'Cricket',
    league: 'T20 • WBBL, 2026',
    team1Code: 'PS-W',
    team1Name: 'Perth Scorchers',
    team1Color: 'from-[#f97316] to-[#b91c1c]',
    team1Text: 'PS',
    team2Code: 'AS-W',
    team2Name: 'Adelaide Strikers',
    team2Color: 'from-[#0ea5e9] to-[#1d4ed8]',
    team2Text: 'AS',
    dayLabel: 'Tomorrow',
    timeLabel: '1:40 PM',
    prize: '₹18.20 Lakhs+',
    popularRank: 6,
    soonRank: 6,
  },
  // Football matches
  {
    id: 'fb-ars-mci',
    sport: 'Football',
    league: 'EPL • English Premier League',
    lineupTag: 'Lineups Out',
    team1Code: 'ARS',
    team1Name: 'Arsenal FC',
    team1Color: 'from-[#dc2626] to-[#7f1d1d]',
    team1Text: 'AFC',
    team2Code: 'MCI',
    team2Name: 'Manchester City',
    team2Color: 'from-[#38bdf8] to-[#0284c7]',
    team2Text: 'MC',
    countdownSeconds: 1845,
    timeLabel: '8:30 PM',
    prize: '₹12.50 Lakhs+',
    popularRank: 1,
    soonRank: 1,
  },
  {
    id: 'fb-mbs-kbf',
    sport: 'Football',
    league: 'ISL • Indian Super League',
    team1Code: 'MBSG',
    team1Name: 'Mohun Bagan SG',
    team1Color: 'from-[#15803d] to-[#991b1b]',
    team1Text: 'MB',
    team2Code: 'KBFC',
    team2Name: 'Kerala Blasters',
    team2Color: 'from-[#facc15] to-[#1d4ed8]',
    team2Text: 'KB',
    dayLabel: 'Today',
    timeLabel: '7:30 PM',
    prize: '₹8.40 Lakhs+',
    popularRank: 2,
    soonRank: 2,
  },
  // Kabaddi matches
  {
    id: 'kb-pat-pun',
    sport: 'Kabaddi',
    league: 'PKL • Pro Kabaddi League',
    lineupTag: 'Starting 7',
    team1Code: 'PAT',
    team1Name: 'Patna Pirates',
    team1Color: 'from-[#16a34a] to-[#065f46]',
    team1Text: 'PP',
    team2Code: 'PUN',
    team2Name: 'Puneri Paltan',
    team2Color: 'from-[#f97316] to-[#9a3412]',
    team2Text: 'PU',
    countdownSeconds: 940,
    timeLabel: '8:00 PM',
    prize: '₹10.25 Lakhs+',
    popularRank: 1,
    soonRank: 1,
  },
  {
    id: 'kb-jpr-mum',
    sport: 'Kabaddi',
    league: 'PKL • Pro Kabaddi League',
    team1Code: 'JPP',
    team1Name: 'Jaipur Pink Panthers',
    team1Color: 'from-[#ec4899] to-[#831843]',
    team1Text: 'JP',
    team2Code: 'MUM',
    team2Name: 'U Mumba',
    team2Color: 'from-[#ea580c] to-[#111827]',
    team2Text: 'UM',
    dayLabel: 'Today',
    timeLabel: '9:00 PM',
    prize: '₹7.80 Lakhs+',
    popularRank: 2,
    soonRank: 2,
  },
];

/* Isolated 1s ticking red countdown matching "11m : 7s" -> "11m : 6s" in video */
const RedCountdownClock: React.FC<{ initialSeconds: number }> = React.memo(({ initialSeconds }) => {
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
    <span className="block text-[12px] font-bold text-[#dc2626] font-mono tabular-nums tracking-tight">
      {mins}m : {rem}s
    </span>
  );
});

const TeamBadge: React.FC<{
  code: string;
  color: string;
  text: string;
  type?: FantasyMatchItem['team1Type'];
}> = React.memo(({ color, text, type }) => {
  if (type === 'IN') {
    return (
      <div className="w-[26px] h-[26px] rounded-full overflow-hidden border border-slate-200 shadow-sm shrink-0 flex flex-col">
        <span className="h-1/3 w-full bg-[#ff9933] block" />
        <span className="h-1/3 w-full bg-white flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full border border-[#000080]" />
        </span>
        <span className="h-1/3 w-full bg-[#138808] block" />
      </div>
    );
  }
  if (type === 'ENG') {
    return (
      <div className="w-[26px] h-[26px] rounded-full overflow-hidden border border-slate-200 shadow-sm shrink-0 bg-white relative flex items-center justify-center">
        <span className="absolute inset-y-0 w-[4px] bg-[#dc2626]" />
        <span className="absolute inset-x-0 h-[4px] bg-[#dc2626]" />
      </div>
    );
  }
  if (type === 'NZ') {
    return (
      <div className="w-[26px] h-[26px] rounded-full bg-[#111827] border border-slate-300 shadow-sm shrink-0 flex items-center justify-center text-[9px] font-black text-white">
        🌿
      </div>
    );
  }
  return (
    <div
      className={`w-[26px] h-[26px] rounded-full bg-gradient-to-br ${color} border border-black/10 shadow-sm shrink-0 flex items-center justify-center text-[9px] font-black text-white tracking-tighter`}
    >
      {text}
    </div>
  );
});

/* Smooth GPU Carousel inside Fantasy Dark Header Strip */
const FantasyHeroCarousel: React.FC<{
  onTapChampions: () => void;
  onTapMatchBanner: () => void;
}> = React.memo(({ onTapChampions, onTapMatchBanner }) => {
  const [index, setIndex] = useState(0);
  const [dragDelta, setDragDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAuto = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % FANTASY_HERO_BANNERS.length);
    }, 4500);
  }, []);

  useEffect(() => {
    startAuto();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAuto]);

  const onTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setIsDragging(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startXRef.current === null) return;
    setDragDelta(e.touches[0].clientX - startXRef.current);
  };

  const onTouchEnd = () => {
    if (startXRef.current !== null) {
      if (dragDelta < -36) setIndex((prev) => (prev + 1) % FANTASY_HERO_BANNERS.length);
      else if (dragDelta > 36) {
        setIndex((prev) => (prev - 1 + FANTASY_HERO_BANNERS.length) % FANTASY_HERO_BANNERS.length);
      }
    }
    startXRef.current = null;
    setDragDelta(0);
    setIsDragging(false);
    startAuto();
  };

  return (
    <div className="bg-[#0c1117] px-3 pt-2 pb-3">
      <div
        className="relative rounded-2xl overflow-hidden gpu-layer"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative aspect-[656/146] w-full overflow-hidden rounded-2xl">
          <div
            className="flex h-full w-full gpu-layer"
            style={{
              transform: `translate3d(calc(-${index * 100}% + ${dragDelta}px), 0, 0)`,
              transition: isDragging
                ? 'none'
                : 'transform 480ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {FANTASY_HERO_BANNERS.map((banner) => (
              <div
                key={banner.id}
                onClick={() => {
                  if (Math.abs(dragDelta) > 8) return;
                  if (banner.target === 'REWARDS') onTapChampions();
                  else onTapMatchBanner();
                }}
                className="w-full h-full shrink-0 cursor-pointer"
              >
                <img
                  src={banner.img}
                  alt={banner.alt}
                  draggable={false}
                  decoding="async"
                  className="w-full h-full object-cover block"
                />
              </div>
            ))}
          </div>

          {/* 2 Small Round Dots at Bottom-Right (matches reference video) */}
          <div className="absolute bottom-2 right-2.5 z-20 flex items-center gap-1.5">
            {FANTASY_HERO_BANNERS.map((b, idx) => (
              <button
                key={b.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(idx);
                  startAuto();
                }}
                aria-label={`Fantasy slide ${idx + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  idx === index
                    ? 'w-2 h-2 bg-white shadow-[0_0_5px_rgba(255,255,255,0.85)]'
                    : 'w-1.5 h-1.5 bg-white/45 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export const FantasyPage: React.FC<FantasyPageProps> = ({
  userBalance,
  onOpenColorGame,
  onOpenWallet,
}) => {
  const [sportTab, setSportTab] = useState<SportTab>('Cricket');
  const [filterTab, setFilterTab] = useState<FilterTab>('Recommended');
  const [bottomTab, setBottomTab] = useState<FantasyBottomTab>('Home');
  const [showAllMatches, setShowAllMatches] = useState(false);
  const [remindedIds, setRemindedIds] = useState<Record<string, boolean>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<FantasyMatchItem | null>(null);
  const [joinedContests, setJoinedContests] = useState<
    { id: string; match: string; entry: string; prize: string }[]
  >([]);
  const [helpTopic, setHelpTopic] = useState<
    'How to Play' | 'Points System' | 'Help and Support' | null
  >(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2400);
  };

  const toggleReminder = (e: React.MouseEvent, match: FantasyMatchItem) => {
    e.stopPropagation();
    const next = !remindedIds[match.id];
    setRemindedIds((prev) => ({ ...prev, [match.id]: next }));
    showToast(
      next
        ? `Reminder set for ${match.team1Code} vs ${match.team2Code}`
        : `Reminder removed for ${match.team1Code} vs ${match.team2Code}`
    );
  };

  const filteredMatches = React.useMemo(() => {
    const bySport = FANTASY_MATCH_LIST.filter((m) => m.sport === sportTab);
    const sorted = [...bySport].sort((a, b) => {
      if (filterTab === 'Starting Soon') return a.soonRank - b.soonRank;
      if (filterTab === 'Popular') return a.popularRank - b.popularRank;
      return 0;
    });
    if (sportTab === 'Cricket' && !showAllMatches) {
      return sorted.slice(0, 5);
    }
    return sorted;
  }, [sportTab, filterTab, showAllMatches]);

  const handleJoinContest = (match: FantasyMatchItem, entryLabel: string) => {
    setJoinedContests((prev) => [
      {
        id: `${match.id}-${Date.now()}`,
        match: `${match.team1Code} vs ${match.team2Code}`,
        entry: entryLabel,
        prize: match.prize,
      },
      ...prev,
    ]);
    setSelectedMatch(null);
    showToast(`Joined ${match.team1Code} vs ${match.team2Code} (${entryLabel})!`);
  };

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-[#f3f4f6] text-[#111827] pb-20 relative font-sans">
      {/* 1. FANTASY DARK HERO CAROUSEL */}
      <FantasyHeroCarousel
        onTapChampions={() => setBottomTab('Rewards')}
        onTapMatchBanner={() => setSelectedMatch(FANTASY_MATCH_LIST[3])}
      />

      {/* 2. ROUNDED WHITE CONTENT SHEET (Sport Tabs + Matches + Help) */}
      <div className="bg-[#f3f4f6] -mt-1.5 rounded-t-2xl overflow-hidden">
        {bottomTab === 'Home' && (
          <>
            {/* Sport Tabs: Cricket | Football | Kabaddi */}
            <div className="bg-white border-b border-[#e5e7eb] px-4 pt-2.5 flex items-center gap-6">
              {(
                [
                  { id: 'Cricket' as SportTab, label: 'Cricket' },
                  { id: 'Football' as SportTab, label: 'Football' },
                  { id: 'Kabaddi' as SportTab, label: 'Kabaddi' },
                ] as const
              ).map((tab) => {
                const isActive = sportTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSportTab(tab.id);
                      setShowAllMatches(false);
                    }}
                    className="relative pb-2.5 flex items-center gap-1.5 active:scale-95 transition-transform"
                  >
                    {tab.id === 'Cricket' && (
                      <span className="w-4 h-4 rounded-full bg-gradient-to-br from-[#dc2626] to-[#991b1b] flex items-center justify-center shadow-sm">
                        <span className="w-2.5 h-[1.5px] bg-white/85 rotate-[-35deg] rounded-full" />
                      </span>
                    )}
                    {tab.id === 'Football' && (
                      <svg className="w-4 h-4 text-[#4b5563]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <circle cx="12" cy="12" r="9" />
                        <polygon points="12,8 15.5,10.5 14,14.5 10,14.5 8.5,10.5" fill="currentColor" />
                      </svg>
                    )}
                    {tab.id === 'Kabaddi' && (
                      <svg className="w-4 h-4 text-[#4b5563]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                        <circle cx="12" cy="6" r="2.2" fill="currentColor" />
                        <path d="M6 12l6-2 6 2M9 19l3-5 3 5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    <span
                      className={`text-[13px] tracking-tight ${
                        isActive ? 'font-bold text-[#111827]' : 'font-medium text-[#4b5563]'
                      }`}
                    >
                      {tab.label}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 inset-x-0 h-[2.5px] rounded-t-full bg-[#e11d48]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sub-filter Strip: Recommended | Starting Soon | Popular */}
            <div className="px-4 pt-3 pb-2.5 flex items-center gap-6">
              {(['Recommended', 'Starting Soon', 'Popular'] as FilterTab[]).map((ft) => {
                const isActive = filterTab === ft;
                return (
                  <button
                    key={ft}
                    onClick={() => setFilterTab(ft)}
                    className={`text-[13px] transition-colors ${
                      isActive ? 'font-bold text-[#111827]' : 'font-medium text-[#6b7280]'
                    }`}
                  >
                    {ft}
                  </button>
                );
              })}
            </div>

            {/* Match Cards List */}
            <div className="px-3.5 space-y-3">
              {filteredMatches.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMatch(m)}
                  className="bg-white rounded-2xl border border-[#e5e7eb] shadow-[0_1px_6px_rgba(15,23,42,0.04)] overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
                >
                  {/* Card Top League Header */}
                  <div className="px-3.5 py-2 border-b border-[#f1f5f9] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[11px] font-medium text-[#6b7280] truncate">
                        {m.league}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#9ca3af] shrink-0" />
                    </div>

                    {m.lineupTag ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#eff6ff] text-[#2563eb] text-[10px] font-semibold shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                        {m.lineupTag}
                      </span>
                    ) : (
                      <ExternalLink className="w-3.5 h-3.5 text-[#9ca3af] shrink-0" />
                    )}
                  </div>

                  {/* Card Middle: Teams + Right Live Countdown */}
                  <div className="px-3.5 py-2.5 flex items-center justify-between">
                    <div className="space-y-2 min-w-0 flex-1 pr-3">
                      <div className="flex items-center gap-2.5">
                        <TeamBadge
                          code={m.team1Code}
                          color={m.team1Color}
                          text={m.team1Text}
                          type={m.team1Type}
                        />
                        <span className="text-[13px] font-bold text-[#111827] w-11 shrink-0">
                          {m.team1Code}
                        </span>
                        <span className="text-[12px] text-[#6b7280] truncate">{m.team1Name}</span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <TeamBadge
                          code={m.team2Code}
                          color={m.team2Color}
                          text={m.team2Text}
                          type={m.team2Type}
                        />
                        <span className="text-[13px] font-bold text-[#111827] w-11 shrink-0">
                          {m.team2Code}
                        </span>
                        <span className="text-[12px] text-[#6b7280] truncate">{m.team2Name}</span>
                      </div>
                    </div>

                    <div className="pl-3 border-l border-[#f1f5f9] text-center shrink-0 min-w-[78px]">
                      {typeof m.countdownSeconds === 'number' ? (
                        <RedCountdownClock initialSeconds={m.countdownSeconds} />
                      ) : m.countdownLabel ? (
                        <span className="block text-[12px] font-bold text-[#dc2626] font-mono">
                          {m.countdownLabel}
                        </span>
                      ) : (
                        <span className="block text-[12px] font-medium text-[#4b5563]">
                          {m.dayLabel}
                        </span>
                      )}
                      <span className="block text-[11px] text-[#6b7280] mt-0.5 font-mono">
                        {m.timeLabel}
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom: Golden Mega Prize Pool + Bell-Plus */}
                  <div className="px-3.5 py-2 bg-gradient-to-r from-[#fefce8] via-[#fffef7] to-white border-t border-[#f3f4f6] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-[18px] h-[18px] rounded-full bg-gradient-to-br from-[#fbbf24] to-[#d97706] text-[#78350f] font-black text-[9px] flex items-center justify-center shadow-sm">
                        M
                      </span>
                      <span className="text-[12.5px] font-bold text-[#111827] tabular-nums">
                        {m.prize}
                      </span>
                    </div>

                    <button
                      onClick={(e) => toggleReminder(e, m)}
                      className="p-1 rounded-full hover:bg-slate-100 active:scale-90 transition-transform"
                      title="Set Match Reminder"
                    >
                      {remindedIds[m.id] ? (
                        <BellRing className="w-4 h-4 text-[#e11d48]" />
                      ) : (
                        <BellPlus className="w-4 h-4 text-[#6b7280]" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* VIEW ALL MATCHES > Outlined Button */}
            {sportTab === 'Cricket' && (
              <div className="pt-4 pb-2 flex justify-center">
                <button
                  onClick={() => setShowAllMatches((v) => !v)}
                  className="bg-white border border-[#d1d5db] rounded-lg px-5 py-2.5 text-[11.5px] font-bold tracking-wider uppercase text-[#111827] shadow-sm hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-1"
                >
                  <span>{showAllMatches ? 'SHOW LESS' : 'VIEW ALL MATCHES'}</span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${showAllMatches ? 'rotate-90' : ''}`}
                  />
                </button>
              </div>
            )}

            {/* Fantasy Help Card Section (matches 00:05-00:06) */}
            <section className="px-3.5 pt-4 pb-4 space-y-2.5">
              <h3 className="text-[15px] font-bold text-[#111827]">Fantasy Help</h3>
              <div className="bg-white rounded-2xl border border-[#e5e7eb] divide-y divide-[#f1f5f9] shadow-[0_1px_6px_rgba(15,23,42,0.03)] overflow-hidden">
                {(
                  [
                    { label: 'How to Play', Icon: Gamepad2 },
                    { label: 'Points System', Icon: Coins },
                    { label: 'Help and Support', Icon: Headphones },
                  ] as const
                ).map(({ label, Icon }) => (
                  <button
                    key={label}
                    onClick={() => setHelpTopic(label)}
                    className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-[18px] h-[18px] text-[#374151]" />
                      <span className="text-[13.5px] font-semibold text-[#111827]">{label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#6b7280]" />
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Predictions Sub-tab */}
        {bottomTab === 'Predictions' && (
          <div className="p-4 space-y-3">
            <div className="bg-white rounded-2xl border border-[#e5e7eb] p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-[#111827] flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#e11d48]" />
                  <span>Live Match &amp; Color Predictions</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-[#e11d48] text-[10px] font-bold">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-[#6b7280]">
                Pick match outcomes or jump straight into fast 30-second Win Go rounds while waiting
                for toss!
              </p>
              <button
                onClick={onOpenColorGame}
                className="w-full py-2.5 rounded-xl bg-[#e11d48] text-white text-xs font-bold shadow-md active:scale-95 transition-transform"
              >
                Play Win Go 30s Instant Prediction
              </button>
            </div>
          </div>
        )}

        {/* My Matches Sub-tab */}
        {bottomTab === 'My Matches' && (
          <div className="p-4 space-y-3">
            <h3 className="text-[15px] font-bold text-[#111827]">
              My Joined Contests ({joinedContests.length})
            </h3>
            {joinedContests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 text-center space-y-2.5">
                <Trophy className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-sm font-bold text-[#111827]">No contests joined yet</p>
                <p className="text-xs text-[#6b7280]">
                  Tap any upcoming match on Home to enter mega prize pools!
                </p>
                <button
                  onClick={() => setBottomTab('Home')}
                  className="px-4 py-2 rounded-lg bg-[#e11d48] text-white text-xs font-bold"
                >
                  Browse Matches
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {joinedContests.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-2xl border border-[#e5e7eb] p-3.5 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-bold text-[#111827]">{c.match}</p>
                      <p className="text-xs text-[#6b7280]">Entry: {c.entry}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      Joined • {c.prize}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rewards Sub-tab */}
        {bottomTab === 'Rewards' && (
          <div className="p-4 space-y-3">
            <div className="bg-gradient-to-br from-[#1f2937] to-[#0f172a] rounded-2xl p-4 text-white space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Champions Club
                </span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-lg font-black">Tap to Claim Bonus Coupons</h3>
              <p className="text-xs text-slate-300">
                Wallet Balance: ₹{userBalance.toLocaleString('en-IN')} • 4X Extra FC &amp; Cash
                Bonus active on Fantasy deposits!
              </p>
              <button
                onClick={onOpenWallet}
                className="mt-1 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff864c] to-[#e44d19] text-white text-xs font-bold shadow-md"
              >
                Deposit &amp; Claim 401% Bonus
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. LIGHT WHITE STICKY BOTTOM NAVIGATION (Home | Predictions | My Matches | Rewards) */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-[#e5e7eb] grid grid-cols-4 py-1.5 px-1 z-40 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] gpu-layer">
        {(
          [
            { id: 'Home' as FantasyBottomTab, Icon: Home },
            { id: 'Predictions' as FantasyBottomTab, Icon: Target },
            { id: 'My Matches' as FantasyBottomTab, Icon: Award },
            { id: 'Rewards' as FantasyBottomTab, Icon: Gift },
          ] as const
        ).map(({ id, Icon }) => {
          const active = bottomTab === id;
          return (
            <button
              key={id}
              onClick={() => setBottomTab(id)}
              className={`flex flex-col items-center gap-0.5 py-0.5 transition-colors ${
                active ? 'text-[#e11d48]' : 'text-[#6b7280] hover:text-[#111827]'
              }`}
            >
              <Icon className="w-[19px] h-[19px]" strokeWidth={active ? 2.2 : 1.8} />
              <span className={`text-[10px] leading-tight ${active ? 'font-bold' : 'font-medium'}`}>
                {id}
              </span>
            </button>
          );
        })}
      </nav>

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 bg-[#111827] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xl flex items-center gap-1.5 whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#1ad96a]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* MATCH CONTEST JOIN MODAL */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-[2px] p-3">
          <div className="w-full max-w-sm bg-white rounded-2xl p-4 space-y-3 shadow-2xl text-[#111827]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h4 className="text-sm font-bold">
                  {selectedMatch.team1Code} vs {selectedMatch.team2Code}
                </h4>
                <p className="text-[11px] text-[#6b7280]">{selectedMatch.league}</p>
              </div>
              <button
                onClick={() => setSelectedMatch(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-xl bg-[#fffbeb] border border-amber-200 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-[11px] text-amber-800 font-semibold">Mega Grand Pool</p>
                  <p className="text-sm font-black text-[#111827]">{selectedMatch.prize}</p>
                </div>
              </div>
              <button
                onClick={() => handleJoinContest(selectedMatch, '₹49 Entry')}
                className="px-3.5 py-1.5 rounded-lg bg-[#16a34a] text-white text-xs font-bold shadow"
              >
                Join ₹49
              </button>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-600" />
                <div>
                  <p className="text-xs font-bold text-[#111827]">Head-to-Head Contest</p>
                  <p className="text-[11px] text-[#6b7280]">Win ₹35 • 2 Spots</p>
                </div>
              </div>
              <button
                onClick={() => handleJoinContest(selectedMatch, '₹19 H2H')}
                className="px-3.5 py-1.5 rounded-lg bg-[#e11d48] text-white text-xs font-bold shadow"
              >
                Join ₹19
              </button>
            </div>

            <button
              onClick={() => {
                setSelectedMatch(null);
                onOpenColorGame();
              }}
              className="w-full py-2.5 rounded-xl bg-[#111827] text-white text-xs font-bold"
            >
              Play 30s Win Go While Waiting
            </button>
          </div>
        </div>
      )}

      {/* FANTASY HELP DETAIL MODAL */}
      {helpTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4">
          <div className="w-full max-w-xs bg-white rounded-2xl p-4 space-y-3 shadow-2xl text-[#111827]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-sm font-bold">{helpTopic}</h4>
              <button
                onClick={() => setHelpTopic(null)}
                className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-[#4b5563] leading-relaxed">
              {helpTopic === 'How to Play' &&
                'Select an upcoming Cricket, Football, or Kabaddi match, create your fantasy XI within 100 credits, pick your Captain (2x) & Vice-Captain (1.5x), and join mega prize pools!'}
              {helpTopic === 'Points System' &&
                'Earn points for every run (+1), boundary (+1), six (+2), wicket (+25), catch (+8), and strike-rate/economy bonuses across T10, T20, and ODI formats.'}
              {helpTopic === 'Help and Support' &&
                '24/7 GGB system Fantasy support is ready for instant contest settlements, lineup queries, and UPI/Crypto wallet assistance.'}
            </p>
            <button
              onClick={() => setHelpTopic(null)}
              className="w-full py-2 rounded-xl bg-[#e11d48] text-white text-xs font-bold"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
