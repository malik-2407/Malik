import React, { useEffect, useState } from 'react';
import { WeaponSkin } from '../types/valorant';
import { soundManager } from '../utils/audio';
import { Sparkles, X } from 'lucide-react';

interface FinisherModalProps {
  skin: WeaponSkin | null;
  onClose: () => void;
}

export const FinisherModal: React.FC<FinisherModalProps> = ({ skin, onClose }) => {
  const [stage, setStage] = useState<'charging' | 'strike' | 'aftermath'>('charging');

  useEffect(() => {
    if (!skin) return;

    // Trigger audio sequence
    soundManager.playGunshot(skin.soundProfile);
    setTimeout(() => {
      soundManager.playFinisher();
    }, 400);

    // Sequence stages
    setStage('charging');
    const t1 = setTimeout(() => setStage('strike'), 600);
    const t2 = setTimeout(() => setStage('aftermath'), 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [skin]);

  if (!skin) return null;

  // Custom finisher visuals based on skin theme
  const getFinisherVisuals = () => {
    const theme = (skin.theme || '').toLowerCase();
    if (theme.includes('champions')) {
      return {
        title: 'CHAMPIONS 2026 VICTORY TROPHY',
        subtitle: 'The golden VCT 2026 champions trophy ascends with stadium fireworks and official championship anthem.',
        bgGradient: 'from-amber-950/90 via-black to-slate-950',
        accentColor: '#f59e0b',
        iconSymbol: '🏆'
      };
    } else if (theme.includes('frontier') || theme.includes('sheriff')) {
      return {
        title: 'NEO FRONTIER WESTERN STANDOFF',
        subtitle: 'Dramatic sunset duelist wanted poster frames the eliminated target with acoustic whistling fanfare.',
        bgGradient: 'from-orange-950/90 via-black to-slate-950',
        accentColor: '#f97316',
        iconSymbol: '🤠'
      };
    } else if (theme.includes('reaver')) {
      return {
        title: 'UNDERWORLD ABYSS SEALS',
        subtitle: 'Spectral chains erupt from the void, pulling defeated foes into the shadows.',
        bgGradient: 'from-purple-950/90 via-black to-slate-950',
        accentColor: '#9333ea',
        iconSymbol: '⛓️'
      };
    } else if (theme.includes('prime')) {
      return {
        title: 'RADIANT GOLDEN WOLF',
        subtitle: 'A colossal luminescent golden wolf materializes and devours target in radiant energy.',
        bgGradient: 'from-amber-950/90 via-black to-slate-950',
        accentColor: '#f59e0b',
        iconSymbol: '🐺'
      };
    } else if (theme.includes('kuronami')) {
      return {
        title: 'TEMPEST WATER PRISON',
        subtitle: 'Pressurized water spheres trap the enemy, freezing before exploding in ice rain.',
        bgGradient: 'from-sky-950/90 via-black to-slate-950',
        accentColor: '#0ea5e9',
        iconSymbol: '🌊'
      };
    } else if (theme.includes('elderflame')) {
      return {
        title: 'COLOSSAL INFERNAL DRAGON',
        subtitle: 'A massive fire dragon descends from stormy skies to incinerate the area in brimstone.',
        bgGradient: 'from-red-950/90 via-black to-slate-950',
        accentColor: '#ef4444',
        iconSymbol: '🐉'
      };
    } else if (theme.includes('sovereign')) {
      return {
        title: 'CELESTIAL DIVINE SWORD',
        subtitle: 'A heavenly beam of light strikes as a towering holy broadsword impales the target.',
        bgGradient: 'from-amber-950/70 via-black to-blue-950/80',
        accentColor: '#eab308',
        iconSymbol: '⚔️'
      };
    } else if (theme.includes('glitchpop')) {
      return {
        title: 'HOLOGRAM POP DETONATION',
        subtitle: 'Animated neon anime billboards explode into an overwhelming digital confetti burst.',
        bgGradient: 'from-fuchsia-950/90 via-black to-cyan-950/90',
        accentColor: '#d946ef',
        iconSymbol: '💥'
      };
    } else {
      return {
        title: `${skin.name.toUpperCase()} FINISHER`,
        subtitle: 'High-tier cosmetic finisher animation with cinematic kill banner and audio sting.',
        bgGradient: 'from-rose-950/90 via-black to-slate-950',
        accentColor: skin.tierColor || '#ff4655',
        iconSymbol: '✨'
      };
    }
  };

  const visuals = getFinisherVisuals();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-in fade-in duration-200">
      {/* Background Animated Atmosphere */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${visuals.bgGradient} opacity-90 pointer-events-none transition-all duration-700`}
      />

      {/* Radial Blast Flash */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 flex items-center justify-center ${
          stage === 'strike' ? 'opacity-80' : 'opacity-20'
        }`}
        style={{
          background: `radial-gradient(circle, ${visuals.accentColor} 0%, transparent 65%)`
        }}
      />

      {/* Modal Dialog */}
      <div
        className="relative z-10 w-full max-w-2xl bg-[#0e141c]/90 border border-white/20 shadow-2xl p-6 sm:p-8 text-center text-white overflow-hidden"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))'
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 text-xs font-mono uppercase tracking-widest text-amber-400 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>In-App Cinematic Finisher Simulator</span>
        </div>

        {/* Dynamic Center Animation Stage */}
        <div className="my-6 relative h-48 flex items-center justify-center">
          {/* Pulsing shockwaves */}
          <div
            className={`absolute w-44 h-44 rounded-full border border-white/30 transition-transform duration-700 ${
              stage === 'strike' ? 'scale-150 opacity-0' : 'scale-75 opacity-80 animate-ping'
            }`}
            style={{ borderColor: visuals.accentColor }}
          />

          {/* Weapon / Finisher Avatar */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`text-6xl mb-3 transition-transform duration-500 ${
                stage === 'strike' ? 'scale-125 rotate-12' : 'scale-100'
              }`}
            >
              {visuals.iconSymbol}
            </div>

            <img
              src={skin.displayIcon}
              alt={skin.name}
              referrerPolicy="no-referrer"
              className={`max-h-24 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-all duration-300 ${
                stage === 'strike' ? 'scale-110 filter brightness-125' : ''
              }`}
            />
          </div>
        </div>

        {/* Finisher Name & Story */}
        <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-wider text-white mb-2">
          {visuals.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed mb-6 font-sans">
          {visuals.subtitle}
        </p>

        {/* Simulation Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              soundManager.playGunshot(skin.soundProfile);
              setTimeout(() => soundManager.playFinisher(), 400);
              setStage('charging');
              setTimeout(() => setStage('strike'), 600);
              setTimeout(() => setStage('aftermath'), 1800);
            }}
            className="px-5 py-2.5 bg-[#ff4655] hover:bg-[#e03b49] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-lg flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Replay Finisher Sequence</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
