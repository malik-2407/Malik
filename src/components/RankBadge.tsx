import React from 'react';
import { UserRank, RankTier } from '../types/valorant';
import { Trophy, TrendingUp, ShieldAlert, Sparkles, Award } from 'lucide-react';

interface RankBadgeProps {
  rank: UserRank;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const RANK_COLORS: Record<RankTier, { bg: string; border: string; text: string; glow: string }> = {
  Iron: { bg: '#374151', border: '#6b7280', text: '#9ca3af', glow: 'rgba(107, 114, 128, 0.3)' },
  Bronze: { bg: '#78350f', border: '#b45309', text: '#d97706', glow: 'rgba(180, 83, 9, 0.4)' },
  Silver: { bg: '#475569', border: '#94a3b8', text: '#cbd5e1', glow: 'rgba(148, 163, 184, 0.4)' },
  Gold: { bg: '#854d0e', border: '#eab308', text: '#fde047', glow: 'rgba(234, 179, 8, 0.4)' },
  Platinum: { bg: '#0e7490', border: '#06b6d4', text: '#67e8f9', glow: 'rgba(6, 182, 212, 0.4)' },
  Diamond: { bg: '#6b21a8', border: '#a855f7', text: '#d8b4fe', glow: 'rgba(168, 85, 247, 0.4)' },
  Ascendant: { bg: '#065f46', border: '#10b981', text: '#6ee7b7', glow: 'rgba(16, 185, 129, 0.4)' },
  Immortal: { bg: '#9f1239', border: '#f43f5e', text: '#fda4af', glow: 'rgba(244, 63, 94, 0.4)' },
  Radiant: { bg: '#854d0e', border: '#facc15', text: '#fef08a', glow: 'rgba(250, 204, 21, 0.6)' },
};

export const RankBadge: React.FC<RankBadgeProps> = ({ rank, size = 'md', showDetails = false }) => {
  const conf = RANK_COLORS[rank.tier] || RANK_COLORS.Silver;

  return (
    <div className="flex items-center gap-2 font-mono">
      {/* Rank Icon Emblem */}
      <div
        className={`relative flex items-center justify-center shrink-0 border rotate-45 transition-transform ${
          size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-10 h-10' : 'w-7 h-7'
        }`}
        style={{
          backgroundColor: conf.bg,
          borderColor: conf.border,
          boxShadow: `0 0 12px ${conf.glow}`
        }}
      >
        {/* Inner core diamond */}
        <div
          className={`rotate-45 ${
            size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'
          }`}
          style={{ backgroundColor: conf.border }}
        />

        {rank.tier === 'Radiant' && (
          <Sparkles className="absolute -top-1.5 -right-1.5 w-3 h-3 text-amber-300 animate-spin" />
        )}
      </div>

      {/* Rank text & RR */}
      <div>
        <div className="flex items-center gap-1.5">
          <span className="font-bold uppercase tracking-wider text-xs" style={{ color: conf.text }}>
            {rank.tier} {rank.tier !== 'Radiant' ? rank.subTier : ''}
          </span>
          <span className="text-[10px] text-slate-400">
            {rank.rr} RR
          </span>
        </div>

        {showDetails && (
          <div className="w-24 bg-black/40 h-1 mt-0.5 overflow-hidden border border-white/10">
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${rank.rr}%`, backgroundColor: conf.border }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
