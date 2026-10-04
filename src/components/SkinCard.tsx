import React from 'react';
import { WeaponSkin } from '../types/valorant';
import { soundManager } from '../utils/audio';
import { Sparkles, Check, Play, Eye, ShoppingCart, Heart, Volume2 } from 'lucide-react';

interface SkinCardProps {
  skin: WeaponSkin;
  isEquipped: boolean;
  isOwned?: boolean;
  isFavorite?: boolean;
  onInspect: (skin: WeaponSkin) => void;
  onEquip: (skin: WeaponSkin) => void;
  onUnlock?: (skin: WeaponSkin) => void;
  onToggleFavorite?: (skinId: string) => void;
  onSimulateFinisher?: (skin: WeaponSkin) => void;
}

export const SkinCard: React.FC<SkinCardProps> = ({
  skin,
  isEquipped,
  isOwned = true,
  isFavorite = false,
  onInspect,
  onEquip,
  onUnlock,
  onToggleFavorite,
  onSimulateFinisher
}) => {
  const handleQuickFire = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playGunshot(skin.soundProfile);
  };

  const handlePreviewEquipSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playEquip();
    setTimeout(() => soundManager.playInspect(), 120);
  };

  const handleEquipClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playEquip();
    onEquip(skin);
  };

  const handleUnlockClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUnlock) {
      onUnlock(skin);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    if (onToggleFavorite) {
      onToggleFavorite(skin.id);
    }
  };

  const handleFinisherClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSimulateFinisher) {
      onSimulateFinisher(skin);
    }
  };

  const handleInspectClick = () => {
    soundManager.playInspect();
    onInspect(skin);
  };

  return (
    <div
      onClick={handleInspectClick}
      className={`group relative bg-[#121820] border transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden hover:-translate-y-1 ${
        isEquipped
          ? 'border-[#ff4655] shadow-[0_0_20px_rgba(255,70,85,0.2)]'
          : isOwned
          ? 'border-white/10 hover:border-white/30 hover:bg-[#161f2a]'
          : 'border-white/5 hover:border-[#ff4655]/40 hover:bg-[#151c25]'
      }`}
      style={{
        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
      }}
    >
      {/* Top tier color stripe */}
      <div
        className="h-1 w-full"
        style={{ backgroundColor: skin.tierColor }}
      />

      {/* Card Header */}
      <div className="p-3.5 pb-1 flex items-start justify-between">
        <div className="min-w-0 pr-2">
          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
            {skin.weaponCategory} · {skin.weaponName}
          </div>
          <h3 className="text-base font-bold text-white tracking-wide group-hover:text-[#ff4655] transition-colors truncate">
            {skin.name}
          </h3>
        </div>

        {/* Favorite & Edition Indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Favorite Toggle Button */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            className={`p-1 transition-transform active:scale-90 hover:scale-110 cursor-pointer ${
              isFavorite
                ? 'text-[#ff4655]'
                : 'text-slate-500 hover:text-white'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? 'fill-[#ff4655]' : 'fill-transparent'}`}
            />
          </button>

          <span
            className="text-[10px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 border"
            style={{
              color: skin.tierColor,
              borderColor: `${skin.tierColor}40`,
              backgroundColor: `${skin.tierColor}15`
            }}
          >
            {skin.tier}
          </span>
        </div>
      </div>

      {/* Finisher Banner if available */}
      {skin.hasFinisher && (
        <div className="px-3.5 pt-0.5 flex justify-end">
          <button
            type="button"
            onClick={handleFinisherClick}
            title="Simulate In-App Finisher Sequence"
            className="flex items-center gap-1 text-[9px] text-amber-400 font-mono tracking-wider hover:text-amber-300 hover:underline bg-amber-950/20 px-1.5 py-0.5 border border-amber-500/20 cursor-pointer"
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>FINISHER SIM</span>
          </button>
        </div>
      )}

      {/* Weapon Visual Presentation */}
      <div className="relative h-32 px-4 py-2 flex items-center justify-center overflow-hidden">
        {/* Subtle radial backdrop glow matching tier */}
        <div
          className="absolute inset-0 opacity-15 transition-opacity group-hover:opacity-30 blur-2xl"
          style={{
            background: `radial-gradient(circle, ${skin.tierColor} 0%, transparent 70%)`
          }}
        />

        {/* Tactical Crosshair watermark subtle */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="w-28 h-28 border border-white rotate-45" />
        </div>

        {/* Weapon Image with fallback container */}
        <img
          src={skin.chromas[0]?.displayIcon || skin.displayIcon}
          alt={skin.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="relative max-h-24 w-auto max-w-[92%] object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {/* Card Footer: Chromas & Action Bar */}
      <div className="p-3.5 pt-2 bg-black/25 border-t border-white/5 flex items-center justify-between">
        {/* Chroma swatches preview */}
        <div className="flex items-center gap-1.5" title={`${skin.chromas.length} Chroma Variants`}>
          {skin.chromas.slice(0, 3).map((c, i) => (
            <div
              key={c.id || i}
              className="w-2.5 h-2.5 border border-white/30 rotate-45"
              style={{ backgroundColor: c.swatchHex }}
              title={c.name}
            />
          ))}
          {skin.chromas.length > 3 && (
            <span className="text-[10px] text-slate-400 font-mono ml-0.5">
              +{skin.chromas.length - 3}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          {/* Dedicated Equip SFX Preview Button */}
          <button
            type="button"
            onClick={handlePreviewEquipSound}
            title="Preview Equip & Inspect SFX"
            className="p-1.5 text-amber-400 hover:text-amber-300 bg-amber-950/30 hover:bg-amber-950/50 border border-amber-500/40 transition-colors cursor-pointer"
          >
            <Volume2 className="w-3 h-3" />
          </button>

          {/* Quick Sound Test */}
          <button
            type="button"
            onClick={handleQuickFire}
            title="Test Gunfire SFX"
            className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-colors cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current" />
          </button>

          {/* Inspect Button */}
          <button
            type="button"
            onClick={handleInspectClick}
            title="Inspect Skin 3D & Upgrades"
            className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-colors cursor-pointer"
          >
            <Eye className="w-3 h-3" />
          </button>

          {/* Equip / Unlock Button */}
          {isOwned ? (
            <button
              type="button"
              onClick={handleEquipClick}
              title={isEquipped ? 'Equipped in Locker' : 'Equip Skin'}
              className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                isEquipped
                  ? 'bg-[#10b981] text-black font-semibold'
                  : 'bg-white/10 hover:bg-[#ff4655] text-white'
              }`}
            >
              {isEquipped ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Equipped</span>
                </>
              ) : (
                <span>Equip</span>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleUnlockClick}
              title={`Unlock skin for ${skin.costVp} VP`}
              className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-[#ff4655] hover:bg-[#e03b49] text-white transition-all flex items-center gap-1 cursor-pointer"
            >
              <ShoppingCart className="w-3 h-3" />
              <span>{skin.costVp.toLocaleString()} VP</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
