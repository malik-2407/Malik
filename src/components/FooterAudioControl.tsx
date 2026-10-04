import React, { useState, useEffect } from 'react';
import { Volume2, Volume1, VolumeX, Play, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface FooterAudioControlProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

export const FooterAudioControl: React.FC<FooterAudioControlProps> = ({
  isMuted,
  onToggleMute,
}) => {
  const [volume, setVolumeState] = useState<number>(() => {
    return Math.round(soundManager.getVolume() * 100);
  });
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  // Sync initial volume
  useEffect(() => {
    setVolumeState(Math.round(soundManager.getVolume() * 100));
  }, []);

  const handleVolumeChange = (newVal: number) => {
    const clamped = Math.max(0, Math.min(100, newVal));
    setVolumeState(clamped);
    soundManager.setVolume(clamped / 100);

    // If muted and volume moved above 0, unmute
    if (isMuted && clamped > 0) {
      onToggleMute();
    }
  };

  const handleTestSfx = () => {
    soundManager.playEquip();
    setIsPlayingTest(true);
    setTimeout(() => {
      soundManager.playGunshot('laser');
      setIsPlayingTest(false);
    }, 180);
  };

  const effectiveVolume = isMuted ? 0 : volume;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 bg-[#0f151c] border border-white/10 px-4 py-2.5 shadow-lg font-mono">
      {/* Mute Toggle and Icon */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onToggleMute();
          }}
          title={isMuted ? 'Unmute Audio' : 'Mute Tactical SFX'}
          className={`p-2 border transition-colors cursor-pointer flex items-center justify-center ${
            isMuted
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-400 hover:bg-rose-900/50'
              : 'bg-[#141b24] border-white/15 text-[#ff4655] hover:bg-white/10'
          }`}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-400" />
          ) : volume < 40 ? (
            <Volume1 className="w-4 h-4 text-[#ff4655]" />
          ) : (
            <Volume2 className="w-4 h-4 text-[#ff4655]" />
          )}
        </button>

        <div className="text-left">
          <div className="text-[9px] uppercase tracking-widest text-slate-400">
            Audio Feedback
          </div>
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <span className={isMuted ? 'text-rose-400' : 'text-emerald-400'}>
              {isMuted ? 'MUTED' : `${volume}%`}
            </span>
          </div>
        </div>
      </div>

      {/* Dedicated Slider Control */}
      <div className="flex items-center gap-2.5 w-full sm:w-48 md:w-56">
        <span className="text-[10px] text-slate-500 select-none">0%</span>
        <div className="relative flex-1 flex items-center">
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={effectiveVolume}
            onChange={(e) => handleVolumeChange(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-[#141b24] rounded-none appearance-none cursor-pointer accent-[#ff4655] focus:outline-none"
            aria-label="Master audio volume"
          />
        </div>
        <span className="text-[10px] text-slate-400 select-none w-8 text-right font-bold">
          {effectiveVolume}%
        </span>
      </div>

      {/* Quick Volume Preset Steps */}
      <div className="flex items-center gap-1 text-[10px] text-slate-400">
        {[25, 50, 80, 100].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => {
              soundManager.playClick();
              handleVolumeChange(preset);
            }}
            className={`px-1.5 py-0.5 border transition-colors cursor-pointer ${
              !isMuted && volume === preset
                ? 'bg-[#ff4655] border-[#ff4655] text-white font-bold'
                : 'bg-black/30 border-white/10 hover:bg-white/10 text-slate-400'
            }`}
          >
            {preset}%
          </button>
        ))}
      </div>

      {/* Test Audio Feedback Button */}
      <button
        type="button"
        onClick={handleTestSfx}
        title="Play sound test to verify audio level"
        disabled={isMuted || volume === 0}
        className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider border transition-all flex items-center gap-1.5 cursor-pointer ${
          isMuted || volume === 0
            ? 'opacity-40 bg-black/30 border-white/10 text-slate-500 cursor-not-allowed'
            : isPlayingTest
            ? 'bg-[#ff4655] border-[#ff4655] text-white'
            : 'bg-white/5 border-white/15 text-slate-300 hover:text-white hover:bg-white/10'
        }`}
      >
        <Play className="w-3 h-3 text-[#ff4655]" />
        <span>Test SFX</span>
      </button>
    </div>
  );
};
