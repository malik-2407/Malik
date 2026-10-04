import React from 'react';
import { UserWallet } from '../types/valorant';
import { soundManager } from '../utils/audio';
import { X, Check, DollarSign, Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: UserWallet;
  onAddFunds: (dollars: number, vpBonus: number) => void;
}

export const CurrencyModal: React.FC<CurrencyModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onAddFunds,
}) => {
  if (!isOpen) return null;

  const packs = [
    {
      price: 20,
      vp: 2500,
      bonusVp: 300,
      rp: 50,
      title: 'Popular: $20 Tactical Pack',
      tag: 'BEST VALUE',
      featured: true,
    },
    {
      price: 10,
      vp: 1100,
      bonusVp: 100,
      rp: 20,
      title: '$10 Sidearm Tier',
      tag: null,
      featured: false,
    },
    {
      price: 35,
      vp: 4800,
      bonusVp: 550,
      rp: 120,
      title: '$35 Champions Collector',
      tag: 'BUNDLE SPECIAL',
      featured: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-[#0e141c] border border-white/20 shadow-2xl p-6 text-white"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))'
        }}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#ff4655]">
              Virtual Economy Store
            </div>
            <h2 className="text-xl font-bold font-display uppercase tracking-wide">
              $20 VP Top-Up & Purchase Simulator
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/15 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free sandbox reassurance banner */}
        <div className="bg-emerald-950/30 border border-emerald-500/30 p-2.5 mb-5 flex items-center gap-2 text-xs font-mono text-emerald-400">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>100% Free Sandbox Simulator: All $20 packs are virtual. No real money required!</span>
        </div>

        {/* Current Balances */}
        <div className="grid grid-cols-2 gap-3 mb-5 font-mono text-xs">
          <div className="bg-black/30 p-3 border border-white/10 flex items-center justify-between">
            <span className="text-slate-400">Available VP:</span>
            <span className="font-bold text-base text-[#ff4655]">{wallet.vp.toLocaleString()} VP</span>
          </div>
          <div className="bg-black/30 p-3 border border-white/10 flex items-center justify-between">
            <span className="text-slate-400">Virtual USD:</span>
            <span className="font-bold text-base text-emerald-400">${wallet.dollars || 20} USD</span>
          </div>
        </div>

        {/* Packs list */}
        <div className="space-y-3 mb-6">
          {packs.map((pack) => (
            <div
              key={pack.price}
              className={`p-3.5 border transition-all flex items-center justify-between ${
                pack.featured
                  ? 'bg-gradient-to-r from-amber-950/30 to-[#141c24] border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                  : 'bg-[#141b24] border-white/10'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{pack.title}</span>
                  {pack.tag && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-amber-500 text-black">
                      {pack.tag}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-300 font-mono mt-0.5">
                  <span className="text-[#ff4655] font-bold">{(pack.vp + pack.bonusVp).toLocaleString()} VP</span>
                  <span className="text-slate-500"> · </span>
                  <span className="text-amber-300">+{pack.rp} RP Bonus</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundManager.playPurchase();
                  onAddFunds(pack.price, pack.vp + pack.bonusVp);
                }}
                className={`px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow ${
                  pack.featured
                    ? 'bg-amber-500 hover:bg-amber-400 text-black'
                    : 'bg-[#ff4655] hover:bg-[#e03b49] text-white'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Simulate ${pack.price} Buy</span>
              </button>
            </div>
          ))}
        </div>

        {/* Quick instant $20 recharge button */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              soundManager.playPurchase();
              onAddFunds(20, 2800);
            }}
            className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Instant Free +$20 Recharge (+2,800 VP)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
