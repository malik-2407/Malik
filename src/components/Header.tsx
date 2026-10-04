import React from 'react';
import { Volume2, VolumeX, Briefcase, Plus, ShieldCheck, DollarSign } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { UserWallet, UserRank } from '../types/valorant';
import { RankBadge } from './RankBadge';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenLoadout: () => void;
  loadoutCount: number;
  inventoryCount: number;
  wallet: UserWallet;
  userRank: UserRank;
  onAddVp: () => void;
  onOpenCurrencyModal: () => void;
  onOpenCareerModal?: () => void;
  activeTab: 'gallery' | 'inventory' | 'game3v3' | 'weapons' | 'loadout';
  onSelectTab: (tab: 'gallery' | 'inventory' | 'game3v3' | 'weapons' | 'loadout') => void;
}

export const Header: React.FC<HeaderProps> = ({
  isMuted,
  onToggleMute,
  onOpenLoadout,
  loadoutCount,
  inventoryCount,
  wallet,
  userRank,
  onAddVp,
  onOpenCurrencyModal,
  onOpenCareerModal,
  activeTab,
  onSelectTab
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b1016]/95 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-2.5 flex items-center justify-between">
      {/* Zone 1: Logo & Competitive Rank */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onSelectTab('gallery')}>
          <div className="w-2.5 h-2.5 bg-[#ff4655] rotate-45 mr-0.5" />
          <span className="text-base md:text-lg font-bold font-display tracking-wider text-white uppercase select-none">
            VALORANT 5v5
          </span>
        </div>

        {/* Competitive Rank Badge in Header - clickable to open Career D3 Chart */}
        <div
          onClick={onOpenCareerModal}
          title="Click to view D3 Rank Progression Line Chart"
          className="hidden lg:flex items-center pl-2 border-l border-white/10 cursor-pointer hover:opacity-85 transition-opacity"
        >
          <RankBadge rank={userRank} size="sm" showDetails />
        </div>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onSelectTab('game3v3');
          }}
          className={`transition-colors pb-0.5 text-xs uppercase tracking-wider font-bold cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'game3v3'
              ? 'text-[#ff4655] border-b-2 border-[#ff4655]'
              : 'text-amber-400 hover:text-white'
          }`}
        >
          <span>🔥 5v5 Arena</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onSelectTab('gallery');
          }}
          className={`transition-colors pb-0.5 text-xs uppercase tracking-wider font-semibold cursor-pointer ${
            activeTab === 'gallery'
              ? 'text-[#ff4655] border-b-2 border-[#ff4655]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Skin Store
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onSelectTab('inventory');
          }}
          className={`transition-colors pb-0.5 text-xs uppercase tracking-wider font-semibold cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'inventory'
              ? 'text-[#ff4655] border-b-2 border-[#ff4655]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Inventory</span>
          <span className="px-1.5 py-0.2 bg-white/10 text-white rounded text-[10px] font-mono tabular-nums">
            {inventoryCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onSelectTab('weapons');
          }}
          className={`transition-colors pb-0.5 text-xs uppercase tracking-wider font-semibold cursor-pointer ${
            activeTab === 'weapons'
              ? 'text-[#ff4655] border-b-2 border-[#ff4655]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Weapons
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onSelectTab('loadout');
          }}
          className={`transition-colors pb-0.5 text-xs uppercase tracking-wider font-semibold cursor-pointer ${
            activeTab === 'loadout'
              ? 'text-[#ff4655] border-b-2 border-[#ff4655]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Locker
        </button>
      </nav>

      {/* Zone 3: $20 Store, VP Balance, Radianite, Mute, and Locker action */}
      <div className="flex items-center gap-2">
        {/* $20 Dollar Store Simulator Button */}
        <button
          type="button"
          onClick={onOpenCurrencyModal}
          title="Open $20 VP Top-Up Store"
          className="px-2.5 py-1.5 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <span>$20 Store</span>
        </button>

        {/* Valorant Points (VP) Balance Badge */}
        <div className="flex items-center gap-1.5 bg-[#141b24] border border-[#ff4655]/40 px-2.5 py-1.5 shadow-sm">
          <div className="w-3.5 h-3.5 bg-[#ff4655] rotate-45 flex items-center justify-center shrink-0">
            <div className="w-1.5 h-1.5 bg-black rotate-45" />
          </div>
          <span className="font-mono text-xs font-bold text-white tabular-nums">
            {wallet.vp.toLocaleString()} <span className="text-[10px] text-[#ff4655] font-semibold">VP</span>
          </span>
          <button
            type="button"
            onClick={onAddVp}
            title="Claim +2,500 Free VP"
            className="ml-1 text-slate-400 hover:text-white hover:bg-white/10 p-0.5 rounded transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3 text-[#ff4655]" />
          </button>
        </div>

        {/* Sound toggle button */}
        <button
          type="button"
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Sound' : 'Mute Tactical SFX'}
          className="p-2 text-slate-400 hover:text-white bg-[#141b24] border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-[#ff4655]" />}
        </button>

        {/* Loadout Locker Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onOpenLoadout();
          }}
          className="flex items-center gap-2 px-3 py-2 bg-[#ff4655] hover:bg-[#e03b49] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
          }}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Locker</span>
          <span className="px-1.5 py-0.2 bg-black/30 font-mono text-[11px] tabular-nums">
            {loadoutCount}
          </span>
        </button>
      </div>
    </header>
  );
};
