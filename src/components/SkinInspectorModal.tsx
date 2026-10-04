import React, { useState, useRef, useEffect } from 'react';
import { WeaponSkin, WeaponInfo, SkinChroma, UserWallet } from '../types/valorant';
import { soundManager } from '../utils/audio';
import { X, Sparkles, Check, RotateCcw, Crosshair, ShoppingCart, Heart } from 'lucide-react';

interface SkinInspectorModalProps {
  skin: WeaponSkin | null;
  weapon: WeaponInfo | undefined;
  isEquipped: boolean;
  isOwned?: boolean;
  isFavorite?: boolean;
  wallet?: UserWallet;
  onClose: () => void;
  onEquip: (skin: WeaponSkin) => void;
  onUnlock?: (skin: WeaponSkin) => void;
  onToggleFavorite?: (skinId: string) => void;
  onSimulateFinisher?: (skin: WeaponSkin) => void;
}

export const SkinInspectorModal: React.FC<SkinInspectorModalProps> = ({
  skin,
  weapon,
  isEquipped,
  isOwned = true,
  isFavorite = false,
  wallet,
  onClose,
  onEquip,
  onUnlock,
  onToggleFavorite,
  onSimulateFinisher
}) => {
  if (!skin) return null;

  // Selected Chroma (defaults to first variant)
  const [selectedChroma, setSelectedChroma] = useState<SkinChroma>(skin.chromas[0] || {
    id: 'default',
    name: 'Standard',
    swatchHex: '#ff4655',
    displayIcon: skin.displayIcon
  });

  // Selected Upgrade Level (defaults to highest available level)
  const [selectedLevel, setSelectedLevel] = useState<number>(skin.levels.length || 1);

  // 3D Tilt coordinates
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isFiring, setIsFiring] = useState(false);
  const [isInspecting, setIsInspecting] = useState(false);
  const [ammo, setAmmo] = useState(weapon?.magazineSize || 25);
  const [isReloading, setIsReloading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Update selected chroma when skin changes
  useEffect(() => {
    if (skin && skin.chromas.length > 0) {
      setSelectedChroma(skin.chromas[0]);
      setSelectedLevel(skin.levels.length || 1);
      setAmmo(weapon?.magazineSize || 25);
    }
  }, [skin, weapon]);

  // Handle 3D Mouse Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 20, y: -y * 20 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Firing action
  const handleFire = () => {
    if (ammo <= 0) {
      soundManager.playReload();
      handleReload();
      return;
    }
    soundManager.playGunshot(skin.soundProfile);
    setIsFiring(true);
    setAmmo(prev => Math.max(0, prev - 1));
    setTimeout(() => setIsFiring(false), 120);
  };

  // Reload action
  const handleReload = () => {
    if (isReloading) return;
    setIsReloading(true);
    soundManager.playReload();
    setTimeout(() => {
      setAmmo(weapon?.magazineSize || 25);
      setIsReloading(false);
    }, 800);
  };

  // Inspect flourish
  const handleInspect = () => {
    if (isInspecting) return;
    setIsInspecting(true);
    soundManager.playInspect();
    setTimeout(() => setIsInspecting(false), 1200);
  };

  const handleSelectChroma = (chroma: SkinChroma) => {
    soundManager.playClick();
    setSelectedChroma(chroma);
  };

  const activeLevelObj = skin.levels.find(l => l.level === selectedLevel) || skin.levels[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      {/* Modal Dialog Card */}
      <div
        className="relative w-full max-w-5xl bg-[#0f151c] border border-white/20 shadow-2xl text-white overflow-hidden my-auto"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))'
        }}
      >
        {/* Top Accent Bar */}
        <div
          className="h-1.5 w-full"
          style={{ backgroundColor: skin.tierColor }}
        />

        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 pb-2 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rotate-45 border"
              style={{ backgroundColor: skin.tierColor, borderColor: '#ffffff' }}
            />
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-slate-400">
                {skin.weaponCategory} · {skin.weaponName} · {skin.tier} Edition
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display tracking-wide text-white">
                {skin.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Equip or Unlock Button */}
            {isOwned ? (
              <button
                type="button"
                onClick={() => onEquip(skin)}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isEquipped
                    ? 'bg-[#10b981] text-black font-semibold'
                    : 'bg-[#ff4655] hover:bg-[#e03b49] text-white'
                }`}
              >
                {isEquipped ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Equipped</span>
                  </>
                ) : (
                  <span>Equip to Locker</span>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onUnlock && onUnlock(skin)}
                className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#ff4655] hover:bg-[#e03b49] text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-lg"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Unlock for {skin.costVp.toLocaleString()} VP</span>
              </button>
            )}

            {/* Favorite Button */}
            <button
              type="button"
              onClick={() => onToggleFavorite && onToggleFavorite(skin.id)}
              title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              className={`p-1.5 transition-colors border cursor-pointer ${
                isFavorite
                  ? 'border-[#ff4655] text-[#ff4655] bg-[#ff4655]/10'
                  : 'border-white/10 text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#ff4655]' : 'fill-transparent'}`} />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6">
          {/* Left/Center: Interactive 3D Weapon Canvas (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {/* 3D Inspect Viewport */}
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative h-72 sm:h-96 w-full bg-[#131b24] border border-white/10 flex items-center justify-center overflow-hidden cursor-crosshair group"
            >
              {/* Radial glow background */}
              <div
                className="absolute inset-0 opacity-25 blur-3xl pointer-events-none transition-all duration-300"
                style={{
                  background: `radial-gradient(circle, ${skin.tierColor} 0%, transparent 70%)`
                }}
              />

              {/* Grid overlay */}
              <div className="absolute inset-0 tactical-grid opacity-15 pointer-events-none" />

              {/* Range Crosshair lines */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/40" />
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/40" />
              </div>

              {/* Muzzle Flash VFX when firing */}
              {isFiring && (
                <div className="absolute z-30 left-16 sm:left-24 top-1/2 -translate-y-1/2 pointer-events-none animate-ping">
                  <div
                    className="w-16 h-16 rounded-full blur-sm"
                    style={{
                      backgroundColor: skin.tierColor || '#ff4655',
                      boxShadow: `0 0 40px ${skin.tierColor}`
                    }}
                  />
                </div>
              )}

              {/* 3D Weapon Image with Transform */}
              <div
                className={`relative z-10 transition-transform duration-75 flex items-center justify-center ${
                  isFiring ? '-translate-x-3 scale-95' : ''
                } ${isInspecting ? 'rotate-[-10deg] scale-110' : ''}`}
                style={{
                  transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) ${
                    isFiring ? 'translateX(-8px)' : ''
                  }`,
                }}
              >
                <img
                  src={selectedChroma.displayIcon || skin.displayIcon}
                  alt={`${skin.name} - ${selectedChroma.name}`}
                  referrerPolicy="no-referrer"
                  className="max-h-52 sm:max-h-64 max-w-[95%] object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.8)] select-none pointer-events-none"
                  onError={(e) => {
                    e.currentTarget.src = skin.displayIcon;
                  }}
                />
              </div>

              {/* Hover inspect hint */}
              <div className="absolute bottom-3 left-4 text-[10px] font-mono text-slate-400 flex items-center gap-1.5 pointer-events-none">
                <Crosshair className="w-3 h-3 text-[#ff4655]" />
                <span>Move cursor to 3D tilt & inspect model</span>
              </div>

              {/* Current Variant Label badge */}
              <div className="absolute top-3 left-4 text-[11px] font-mono text-white/80 bg-black/50 px-2 py-0.5 border border-white/10">
                {selectedChroma.name}
              </div>
            </div>

            {/* Firing & Sound Testing Controls */}
            <div className="bg-[#141c26] border border-white/10 p-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleFire}
                  disabled={isReloading}
                  className="px-5 py-2 bg-[#ff4655] hover:bg-[#e03b49] active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  <Crosshair className="w-4 h-4" />
                  <span>Test Fire</span>
                </button>

                <button
                  type="button"
                  onClick={handleReload}
                  disabled={isReloading}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 active:scale-95 text-slate-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin' : ''}`} />
                  <span>{isReloading ? 'Reloading...' : 'Reload'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleInspect}
                  disabled={isInspecting}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 active:scale-95 text-slate-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Inspect</span>
                </button>
              </div>

              {/* Ammo Counter */}
              <div className="flex items-center gap-2 font-mono">
                <span className="text-xs text-slate-400">AMMO:</span>
                <span className="text-lg font-bold text-white tabular-nums">
                  {ammo} <span className="text-xs text-slate-500 font-normal">/ {weapon?.magazineSize || 25}</span>
                </span>
              </div>
            </div>

            {/* Chroma Variations Swatches */}
            <div className="bg-[#141c26] border border-white/10 p-3.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                <span>Color Chromas & Variants ({skin.chromas.length})</span>
                <span className="text-white font-mono text-[10px]">{selectedChroma.name}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {skin.chromas.map((chroma) => {
                  const isSelected = selectedChroma.id === chroma.id;
                  return (
                    <button
                      key={chroma.id}
                      type="button"
                      onClick={() => handleSelectChroma(chroma)}
                      className={`p-2 flex items-center gap-2.5 border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#ff4655] bg-[#ff4655]/10 shadow-[0_0_10px_rgba(255,70,85,0.2)]'
                          : 'border-white/10 bg-black/20 hover:border-white/25 hover:bg-black/40'
                      }`}
                    >
                      <div
                        className="w-4 h-4 shrink-0 rotate-45 border border-white/40 shadow-sm"
                        style={{ backgroundColor: chroma.swatchHex }}
                      />
                      <span className="text-xs font-medium text-slate-200 truncate">
                        {chroma.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Upgrade Progression & Weapon Specs (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Level Upgrades Explorer */}
            <div className="bg-[#141c26] border border-white/10 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Skin Level Upgrades
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Level {selectedLevel} of {skin.levels.length}
                </span>
              </div>

              {/* Level Tabs */}
              <div className="grid grid-cols-4 gap-1.5 mb-3">
                {skin.levels.map((lvl) => {
                  const isSelected = selectedLevel === lvl.level;
                  return (
                    <button
                      key={lvl.level}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setSelectedLevel(lvl.level);
                      }}
                      className={`py-1.5 text-xs font-bold font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#ff4655] border-[#ff4655] text-white'
                          : 'bg-black/30 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      LVL {lvl.level}
                    </button>
                  );
                })}
              </div>

              {/* Active Level Card */}
              <div className="bg-black/40 border border-white/5 p-3">
                <div className="text-xs font-bold text-white mb-1 flex items-center justify-between">
                  <span>{activeLevelObj.name}</span>
                  {selectedLevel === 4 && skin.hasFinisher && (
                    <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      FINISHER UNLOCKED
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeLevelObj.description}
                </p>

                {/* Video Preview if official stream is available */}
                {activeLevelObj.streamedVideo && (
                  <div className="mt-3 overflow-hidden border border-white/10">
                    <video
                      src={activeLevelObj.streamedVideo}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-36 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Combat Specs & Damage Profile */}
            {weapon && (
              <div className="bg-[#141c26] border border-white/10 p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center justify-between">
                  <span>Combat Performance</span>
                  <span className="text-[10px] font-mono text-slate-400 font-normal">
                    Creds: {weapon.cost > 0 ? `${weapon.cost} ¤` : 'FREE'}
                  </span>
                </div>

                {/* Quick stats grid */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-black/30 p-2 border border-white/5">
                    <div className="text-[10px] text-slate-400 font-mono">FIRE RATE</div>
                    <div className="text-sm font-bold font-mono text-white">
                      {weapon.fireRate} rds/sec
                    </div>
                  </div>
                  <div className="bg-black/30 p-2 border border-white/5">
                    <div className="text-[10px] text-slate-400 font-mono">MAGAZINE</div>
                    <div className="text-sm font-bold font-mono text-white">
                      {weapon.magazineSize} rounds
                    </div>
                  </div>
                  <div className="bg-black/30 p-2 border border-white/5">
                    <div className="text-[10px] text-slate-400 font-mono">WALL PENETRATION</div>
                    <div className="text-sm font-bold font-mono text-white">
                      {weapon.wallPenetration}
                    </div>
                  </div>
                  <div className="bg-black/30 p-2 border border-white/5">
                    <div className="text-[10px] text-slate-400 font-mono">RELOAD TIME</div>
                    <div className="text-sm font-bold font-mono text-white">
                      {weapon.reloadTime}s
                    </div>
                  </div>
                </div>

                {/* Damage table */}
                <div className="bg-black/40 border border-white/5 p-2.5">
                  <div className="text-[10px] font-mono text-slate-400 uppercase mb-1.5">
                    Damage Ranges (Head / Body / Leg)
                  </div>
                  <div className="space-y-1.5 font-mono text-xs">
                    {weapon.damageRanges.map((dr, idx) => (
                      <div key={idx} className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400">{dr.range}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[#ff4655] font-bold">{dr.head}</span>
                          <span className="text-white font-medium">{dr.body}</span>
                          <span className="text-slate-400">{dr.leg}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
