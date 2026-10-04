import React, { useState } from 'react';
import { AGENTS_ROSTER, AgentDefinition, AgentAbility } from '../data/agentsData';
import { soundManager } from '../utils/audio';
import { Sparkles, Shield, Zap, Target, Volume2, Info } from 'lucide-react';

interface AgentSelectorProps {
  selectedAgentId: string;
  onSelectAgent: (agentName: string) => void;
  compact?: boolean;
}

export const AgentSelector: React.FC<AgentSelectorProps> = ({
  selectedAgentId,
  onSelectAgent,
  compact = false,
}) => {
  const currentAgent = AGENTS_ROSTER.find(
    a => a.name.toLowerCase() === selectedAgentId.toLowerCase()
  ) || AGENTS_ROSTER[0];

  const [activeAbility, setActiveAbility] = useState<AgentAbility>(currentAgent.abilities[2]); // default to Signature [E]

  const handleSelect = (agent: AgentDefinition) => {
    soundManager.playEquip();
    onSelectAgent(agent.name);
    setActiveAbility(agent.abilities[2]); // default to Signature [E]
  };

  return (
    <div className="w-full bg-[#0c1219] border border-white/10 p-4 sm:p-5 shadow-xl font-mono text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[#ff4655] font-bold">
            Tactical Protocol · Agent Roster
          </div>
          <h3 className="text-sm sm:text-base font-bold uppercase tracking-wide text-white flex items-center gap-2">
            <span>Select Protocol Agent</span>
            <span className="text-xs text-slate-400 font-normal">
              ({currentAgent.name} · {currentAgent.role})
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="text-[11px] text-amber-400 italic">"{currentAgent.voiceLine}"</span>
        </div>
      </div>

      {/* Agent Roster Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
        {AGENTS_ROSTER.map((agent) => {
          const isSelected = currentAgent.id === agent.id;
          return (
            <button
              key={agent.id}
              type="button"
              onClick={() => handleSelect(agent)}
              className={`p-2 border transition-all text-left cursor-pointer flex flex-col items-center relative ${
                isSelected
                  ? 'bg-gradient-to-b from-white/15 to-black border-[#ff4655] shadow-[0_0_15px_rgba(255,70,85,0.25)]'
                  : 'bg-black/30 border-white/10 hover:border-white/25 hover:bg-white/5'
              }`}
            >
              {/* Agent Portrait */}
              <div className="w-12 h-12 mb-1.5 relative flex items-center justify-center">
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain filter drop-shadow"
                />
                <span className="absolute -bottom-1 -right-1 text-xs">
                  {agent.roleIcon}
                </span>
              </div>

              <div className="text-xs font-bold text-white tracking-wider uppercase text-center">
                {agent.name}
              </div>
              <div className="text-[9px] text-slate-400 uppercase">
                {agent.role}
              </div>

              {isSelected && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#ff4655] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Agent Dossier & Abilities Grid [C, Q, E, X] */}
      <div className="bg-[#121922] border border-white/10 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center text-xl shrink-0 border"
              style={{
                backgroundColor: `${currentAgent.accentColor}20`,
                borderColor: currentAgent.accentColor,
              }}
            >
              {currentAgent.roleIcon}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-white uppercase tracking-wider">
                  {currentAgent.name}
                </h4>
                <span className="text-[10px] px-1.5 py-0.2 bg-white/10 text-slate-300 uppercase">
                  {currentAgent.role}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                {currentAgent.tagline}
              </p>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            Click any ability below to preview tactical intel
          </div>
        </div>

        {/* 4 Abilities [C] [Q] [E] [X] */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {currentAgent.abilities.map((ability) => {
            const isActive = activeAbility?.key === ability.key;
            return (
              <button
                key={ability.key}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setActiveAbility(ability);
                }}
                className={`p-2.5 text-left border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white/10 border-[#ff4655] shadow-sm'
                    : 'bg-black/40 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 bg-[#ff4655]/20 border border-[#ff4655]/50 text-[#ff4655] text-[10px] font-bold flex items-center justify-center font-mono">
                      {ability.key}
                    </span>
                    <span className="text-sm">{ability.iconSymbol}</span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400">
                    {ability.type}
                  </span>
                </div>

                <div className="text-xs font-bold text-white truncate">
                  {ability.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {ability.charges > 1 ? `${ability.charges} Charges` : '1 Charge'}
                  {ability.cooldownSeconds ? ` · ${ability.cooldownSeconds}s CD` : ''}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Ability Expanded Description */}
        {activeAbility && (
          <div className="p-3 bg-black/40 border border-white/5 flex items-start gap-3 text-xs">
            <div className="w-6 h-6 rounded bg-[#ff4655]/20 border border-[#ff4655]/40 text-[#ff4655] font-bold flex items-center justify-center shrink-0 font-mono text-xs">
              {activeAbility.key}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-white text-xs uppercase">
                  {activeAbility.name}
                </span>
                <span className="text-[10px] text-slate-400">
                  [{activeAbility.type} Ability]
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {activeAbility.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
