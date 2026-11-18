import React, { useState } from 'react';
import { Volume2, Droplets, X, ShieldCheck } from 'lucide-react';

interface GoaHomeProps {
  onOpenWinGo: () => void;
  onOpenWallet: () => void;
  onOpenAdmin: () => void;
  onOpenActivity: () => void;
  onOpenPromotion: () => void;
  onOpenAccount: () => void;
}

export const GoaHome: React.FC<GoaHomeProps> = ({
  onOpenWinGo,
  onOpenWallet,
  onOpenAdmin,
  onOpenActivity,
  onOpenPromotion,
  onOpenAccount,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('LOTTERY');
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [showAppPill, setShowAppPill] = useState<boolean>(true);

  return (
    <div className="w-full max-w-[430px] mx-auto bg-[#f4f7fc] min-h-screen text-slate-800 pb-24 shadow-2xl relative select-none font-sans overflow-x-hidden">
      
      {/* 1. TOP HEADER (EXACT REPLICATED FROM REFERENCE) */}
      <header className="bg-[#2979ff] px-3.5 py-2.5 flex items-center justify-between text-white sticky top-0 z-40 shadow-sm">
        {/* Goagames Logo */}
        <div 
          onClick={() => setSelectedCategory('LOTTERY')}
          className="flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
        >
          <img 
            src="/assets/sliced/header.png" 
            alt="Goagames" 
            className="h-7 w-auto object-contain object-left pointer-events-none"
          />
        </div>

        {/* Right Action Icons (Envelope & App Download from header crop) */}
        <div className="flex items-center gap-2">
          {/* Subtle Admin toggle trigger */}
          <button
            onClick={onOpenAdmin}
            title="Admin Control"
            className="w-2 h-2 rounded-full bg-blue-300 opacity-40 hover:opacity-100 transition-opacity"
          />

          {/* Messages Button */}
          <button 
            onClick={() => setShowDetailModal(true)}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all active:scale-90"
            title="Notice & Messages"
          >
            <div className="w-5 h-4 border-2 border-white rounded flex items-center justify-center">
              <span className="text-[10px] leading-none font-bold">⌄</span>
            </div>
          </button>

          {/* Download App Button */}
          <button 
            onClick={() => alert("Downloading Goa Games Official Android APK...")}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all active:scale-90 text-white"
            title="Download App"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v13m0 0l-4-4m4 4l4-4" />
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
            </svg>
          </button>
        </div>
      </header>

      {/* 2. HERO CAROUSEL BANNER (EXACT BANNER FROM REFERENCE) */}
      <div className="px-3 pt-2.5">
        <div className="relative rounded-2xl overflow-hidden shadow-sm active:scale-[0.99] transition-transform cursor-pointer">
          <img 
            src="/assets/sliced/banner.png" 
            alt="Goa India's Largest Entertainment Platform" 
            className="w-full h-auto object-cover rounded-2xl block"
          />
        </div>
      </div>

      {/* 3. MARQUEE ANNOUNCEMENT BAR */}
      <div className="px-3 pt-2.5">
        <div className="bg-white rounded-full py-1.5 px-3 flex items-center gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/80">
          <Volume2 className="w-4 h-4 text-[#2979ff] shrink-0" />
          
          <div className="flex-1 overflow-hidden whitespace-nowrap text-[11px] text-slate-600 font-medium">
            <div className="inline-block animate-[marquee_18s_linear_infinite]">
              Thank you for being a member of the GOA GAMES platform, we provide many industry leading lottery and casino games!
            </div>
          </div>

          <button 
            onClick={() => setShowDetailModal(true)}
            className="bg-[#2979ff] hover:bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm shrink-0 active:scale-95 transition-all"
          >
            <Droplets className="w-3 h-3 fill-current" />
            <span>Detail</span>
          </button>
        </div>
      </div>

      {/* 4. GAME CATEGORY TILES (EXACT 8 SLICED ASSETS FROM SCREENSHOT) */}
      <div className="px-3 pt-3 space-y-2.5 relative">
        
        {/* ROW 1: Popular | Lottery | Slots */}
        <div className="grid grid-cols-3 gap-2">
          {/* Popular */}
          <div 
            onClick={() => setSelectedCategory('POPULAR')}
            className={`rounded-2xl overflow-hidden shadow-sm cursor-pointer transition-all active:scale-95 ${
              selectedCategory === 'POPULAR' ? 'ring-2 ring-[#2979ff]' : ''
            }`}
          >
            <img 
              src="/assets/sliced/popular.png" 
              alt="Popular" 
              className="w-full h-auto object-cover rounded-2xl block"
            />
          </div>

          {/* Lottery */}
          <div 
            onClick={() => {
              setSelectedCategory('LOTTERY');
              onOpenWinGo();
            }}
            className={`rounded-2xl overflow-hidden shadow-sm cursor-pointer transition-all active:scale-95 ${
              selectedCategory === 'LOTTERY' ? 'ring-2 ring-purple-600' : ''
            }`}
          >
            <img 
              src="/assets/sliced/lottery.png" 
              alt="Lottery" 
              className="w-full h-auto object-cover rounded-2xl block"
            />
          </div>

          {/* Slots */}
          <div 
            onClick={() => setSelectedCategory('SLOTS')}
            className={`rounded-2xl overflow-hidden shadow-sm cursor-pointer transition-all active:scale-95 ${
              selectedCategory === 'SLOTS' ? 'ring-2 ring-cyan-500' : ''
            }`}
          >
            <img 
              src="/assets/sliced/slots.png" 
              alt="Slots" 
              className="w-full h-auto object-cover rounded-2xl block"
            />
          </div>
        </div>

        {/* ROW 2: Sports | Casino | PVC */}
        <div className="grid grid-cols-3 gap-2">
          {/* Sports */}
          <div 
            onClick={() => setSelectedCategory('SPORTS')}
            className={`rounded-2xl overflow-hidden shadow-sm cursor-pointer transition-all active:scale-95 ${
              selectedCategory === 'SPORTS' ? 'ring-2 ring-rose-500' : ''
            }`}
          >
            <img 
              src="/assets/sliced/sports.png" 
              alt="Sports" 
              className="w-full h-auto object-cover rounded-2xl block"
            />
          </div>

          {/* Casino */}
          <div 
            onClick={() => setSelectedCategory('CASINO')}
            className={`rounded-2xl overflow-hidden shadow-sm cursor-pointer transition-all active:scale-95 ${
              selectedCategory === 'CASINO' ? 'ring-2 ring-rose-400' : ''
            }`}
          >
            <img 
              src="/assets/sliced/casino.png" 
              alt="Casino" 
              className="w-full h-auto object-cover rounded-2xl block"
            />
          </div>

          {/* PVC */}
          <div 
            onClick={() => setSelectedCategory('PVC')}
            className={`rounded-2xl overflow-hidden shadow-sm cursor-pointer transition-all active:scale-95 ${
              selectedCategory === 'PVC' ? 'ring-2 ring-amber-500' : ''
            }`}
          >
            <img 
              src="/assets/sliced/pvc.png" 
              alt="PVC" 
              className="w-full h-auto object-cover rounded-2xl block"
            />
          </div>
        </div>

        {/* ROW 3: Fishing | Mini games */}
        <div className="grid grid-cols-2 gap-2 relative">
          {/* Fishing */}
          <div 
            onClick={() => setSelectedCategory('FISHING')}
            className={`rounded-2xl overflow-hidden shadow-sm cursor-pointer transition-all active:scale-95 ${
              selectedCategory === 'FISHING' ? 'ring-2 ring-amber-500' : ''
            }`}
          >
            <img 
              src="/assets/sliced/fishing.png" 
              alt="Fishing" 
              className="w-full h-auto object-cover rounded-2xl block"
            />
          </div>

          {/* Mini games */}
          <div 
            onClick={() => setSelectedCategory('MINI')}
            className={`rounded-2xl overflow-hidden shadow-sm cursor-pointer transition-all active:scale-95 ${
              selectedCategory === 'MINI' ? 'ring-2 ring-pink-500' : ''
            }`}
          >
            <img 
              src="/assets/sliced/minigames.png" 
              alt="Mini games" 
              className="w-full h-auto object-cover rounded-2xl block"
            />
          </div>

          {/* FLOATING DRAGON VIP BADGE (EXACT OVERLAY AS IN SCREENSHOT) */}
          <div 
            onClick={() => alert("VIP Dragon Club & 24/7 Agent Support active!")}
            className="absolute -right-1.5 -bottom-3.5 z-30 w-16 h-16 cursor-pointer active:scale-95 transition-transform"
            title="VIP Dragon"
          >
            <img 
              src="/assets/sliced/dragon.png" 
              alt="Dragon Badge" 
              className="w-full h-full object-contain drop-shadow-md rounded-full"
            />
          </div>
        </div>
      </div>

      {/* 5. SECTION HEADER: "| Lottery" */}
      {/* 5. SECTION HEADER: "| Lottery" */}
      <div className="px-3.5 pt-3.5 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-4 bg-[#2979ff] rounded-full inline-block"></span>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight font-display flex items-center gap-1.5">
            Lottery
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Live
            </span>
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-semibold">Win Go · K3 · 5D · Trx</span>
      </div>

      {/* 6. FEATURED "WIN GO" LOTTO BANNER CARD (EXACT ASSET) */}
      <div className="px-3 space-y-2.5">
        <div 
          onClick={onOpenWinGo}
          className="rounded-2xl overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-transform hover:shadow-md border border-sky-200/80 relative group"
        >
          <img 
            src="/assets/sliced/wingo.png" 
            alt="Win Go - Guess Number Green/Red/Purple" 
            className="w-full h-auto object-cover rounded-2xl block"
          />
          <div className="absolute right-3 bottom-2.5 opacity-90 group-hover:opacity-100 transition-opacity">
            <span className="px-3 py-1 rounded-full bg-white text-[#2575fc] text-[10px] font-black shadow-md uppercase tracking-wider flex items-center gap-1">
              PLAY NOW ▶
            </span>
          </div>
        </div>

        {/* Additional Lottery Modes (K3 & 5D Lotre) */}
        <div className="grid grid-cols-2 gap-2">
          <div 
            onClick={onOpenWinGo}
            className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm cursor-pointer active:scale-95 transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-black uppercase tracking-tight block">K3 Lotre</span>
              <span className="text-[10px] text-purple-200">Guess 3-Dice Sum</span>
            </div>
            <span className="text-sm">🎲</span>
          </div>

          <div 
            onClick={onOpenWinGo}
            className="p-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm cursor-pointer active:scale-95 transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-black uppercase tracking-tight block">5D Lotre</span>
              <span className="text-[10px] text-cyan-200">5-Digit Digital</span>
            </div>
            <span className="text-sm">🎯</span>
          </div>
        </div>
      </div>

      {/* 7. POPUP DETAIL MODAL */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xs p-5 text-slate-800 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-bold text-sm text-slate-900 font-display flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-[#2979ff]" />
                Platform Notice
              </h4>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Official <strong>GOA GAMES</strong> platform. 
              <br /><br />
              • Instant UPI / IMPS Recharge &amp; Withdrawals.<br />
              • Provably Fair SHA-256 Color Prediction (Win Go).<br />
              • 24/7 VIP Customer Support.
            </p>

            <button 
              onClick={() => setShowDetailModal(false)}
              className="w-full py-2 rounded-xl bg-[#2979ff] text-white font-bold text-xs shadow-md"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* 8. EXACT BOTTOM NAVIGATION BAR FROM SCREENSHOT */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-40 bg-white">
        <div className="relative">
          <img 
            src="/assets/sliced/bottom_nav.png" 
            alt="Navigation Bar" 
            className="w-full h-auto object-cover block pointer-events-none"
          />

          {/* Transparent Clickable Action Zones for each tab */}
          <div className="absolute inset-0 flex justify-between">
            {/* 1. Home */}
            <button 
              onClick={() => setSelectedCategory('LOTTERY')}
              className="flex-1 h-full"
              title="Home"
            />
            {/* 2. Activity */}
            <button 
              onClick={onOpenActivity}
              className="flex-1 h-full"
              title="Activity"
            />
            {/* 3. Center Promotion Diamond */}
            <button 
              onClick={onOpenPromotion}
              className="flex-1 h-full -mt-4"
              title="Promotion"
            />
            {/* 4. Wallet */}
            <button 
              onClick={onOpenWallet}
              className="flex-1 h-full"
              title="Wallet"
            />
            {/* 5. Account */}
            <button 
              onClick={onOpenAccount}
              className="flex-1 h-full"
              title="Account"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
