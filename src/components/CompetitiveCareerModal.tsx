import React from 'react';
import { UserRank } from '../types/valorant';
import { RankProgressionChart } from './RankProgressionChart';
import { RankBadge } from './RankBadge';
import { X, Trophy, Swords, Zap, Shield, Target, Calendar } from 'lucide-react';

interface CompetitiveCareerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRank: UserRank;
  onSimulateMatch: (won: boolean) => void;
  onResetHistory: () => void;
}

export const CompetitiveCareerModal: React.FC<CompetitiveCareerModalProps> = ({
  isOpen,
  onClose,
  userRank,
  onSimulateMatch,
  onResetHistory,
}) => {
  if (!isOpen) return null;

  const history = userRank.history || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0b1016] border border-white/20 shadow-2xl overflow-hidden text-white"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))'
        }}
      >
        {/* Top Modal Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0e141c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ff4655]/15 border border-[#ff4655]/40 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#ff4655]" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#ff4655]">
                Player Career & Analytics
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-wide">
                Competitive Standing & RR History
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RankBadge rank={userRank} size="md" showDetails />
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/15 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* 1. D3 Line Chart Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#ff4655]" />
                <span>D3.js Rank Rating (RR) Line Chart</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Interactive: hover data points for combat K/D
              </span>
            </div>

            <RankProgressionChart
              userRank={userRank}
              onSimulateMatch={onSimulateMatch}
              onResetHistory={onResetHistory}
            />
          </div>

          {/* 2. Career Performance Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="p-3 bg-[#121922] border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase">Season Record</div>
              <div className="text-lg font-bold text-white mt-0.5">
                <span className="text-emerald-400">{userRank.wins}W</span>
                <span className="text-slate-500"> - </span>
                <span className="text-rose-400">{userRank.losses}L</span>
              </div>
            </div>

            <div className="p-3 bg-[#121922] border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase">Win Ratio</div>
              <div className="text-lg font-bold text-white mt-0.5">
                {userRank.wins + userRank.losses > 0
                  ? `${Math.round((userRank.wins / (userRank.wins + userRank.losses)) * 100)}%`
                  : '0%'}
              </div>
            </div>

            <div className="p-3 bg-[#121922] border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase">Peak Standing</div>
              <div className="text-lg font-bold text-amber-300 mt-0.5">
                {userRank.peakTier || 'Diamond 3'}
              </div>
            </div>

            <div className="p-3 bg-[#121922] border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase">Matches Tracked</div>
              <div className="text-lg font-bold text-cyan-300 mt-0.5">
                {history.length} Matches
              </div>
            </div>
          </div>

          {/* 3. Detailed Match History Table */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#ff4655]" />
              <span>Recent Competitive Matches Log</span>
            </h4>

            <div className="border border-white/10 overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#121922] text-slate-400 uppercase text-[10px] border-b border-white/10">
                  <tr>
                    <th className="py-2.5 px-3">Result</th>
                    <th className="py-2.5 px-3">Map</th>
                    <th className="py-2.5 px-3">Score</th>
                    <th className="py-2.5 px-3">RR Change</th>
                    <th className="py-2.5 px-3">Standing After</th>
                    <th className="py-2.5 px-3">Agent</th>
                    <th className="py-2.5 px-3">Combat K/D/A</th>
                    <th className="py-2.5 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {history.slice().reverse().map((match) => (
                    <tr
                      key={match.id}
                      className={`hover:bg-white/5 transition-colors ${
                        match.result === 'win'
                          ? 'bg-emerald-950/10'
                          : match.result === 'draw'
                          ? 'bg-amber-950/10'
                          : 'bg-rose-950/10'
                      }`}
                    >
                      <td className="py-2 px-3 font-bold">
                        <span
                          className={
                            match.result === 'win'
                              ? 'text-emerald-400'
                              : match.result === 'draw'
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }
                        >
                          {match.result.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-semibold text-white">{match.map}</td>
                      <td className="py-2 px-3 text-slate-300">{match.score}</td>
                      <td className="py-2 px-3 font-bold">
                        <span className={match.rrChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {match.rrChange >= 0 ? `+${match.rrChange}` : match.rrChange} RR
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-300">
                        {match.tier} {match.subTier} ({match.rr} RR)
                      </td>
                      <td className="py-2 px-3 text-white">{match.agent}</td>
                      <td className="py-2 px-3 text-amber-300 font-bold">
                        {match.kills}/{match.deaths}/{match.assists}
                      </td>
                      <td className="py-2 px-3 text-slate-500 text-[10px]">{match.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
