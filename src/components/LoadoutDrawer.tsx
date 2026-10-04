import React from 'react';
import { Loadout, WeaponSkin } from '../types/valorant';
import { soundManager } from '../utils/audio';
import { X, Trash2, Shuffle, Check, Eye } from 'lucide-react';

interface LoadoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  loadout: Loadout;
  onUnequip: (category: string) => void;
  onClear: () => void;
  onRandomize: () => void;
  onInspect: (skin: WeaponSkin) => void;
}

export const LoadoutDrawer: React.FC<LoadoutDrawerProps> = ({
  isOpen,
  onClose,
  loadout,
  onUnequip,
  onClear,
  onRandomize,
  onInspect
}) => {
  if (!isOpen) return null;

  const categories = [
    { key: 'Rifles', label: 'Primary Rifle', placeholder: 'No Rifle equipped' },
    { key: 'Pistols', label: 'Sidearm', placeholder: 'No Sidearm equipped' },
    { key: 'Snipers', label: 'Sniper Rifle', placeholder: 'No Sniper equipped' },
    { key: 'SMGs', label: 'SMG', placeholder: 'No SMG equipped' },
    { key: 'Shotguns', label: 'Shotgun', placeholder: 'No Shotgun equipped' },
    { key: 'Heavy', label: 'Heavy Gun', placeholder: 'No Heavy gun equipped' },
    { key: 'Melee', label: 'Melee Weapon', placeholder: 'No Melee knife equipped' },
  ];

  const totalEquipped = Object.values(loadout).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0e141b] border-l border-white/10 h-full flex flex-col justify-between shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#121922]">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#ff4655]">
              Active Loadout Locker
            </div>
            <h2 className="text-lg font-bold font-display uppercase tracking-wide text-white">
              Tactical Equipment ({totalEquipped}/7)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {categories.map((cat) => {
            const skin = loadout[cat.key];

            return (
              <div
                key={cat.key}
                className={`p-3 border transition-all ${
                  skin
                    ? 'bg-[#141b24] border-white/15'
                    : 'bg-black/20 border-dashed border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    {cat.label}
                  </span>
                  {skin && (
                    <span
                      className="text-[9px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.2 border"
                      style={{
                        color: skin.tierColor,
                        borderColor: `${skin.tierColor}40`,
                        backgroundColor: `${skin.tierColor}15`
                      }}
                    >
                      {skin.tier}
                    </span>
                  )}
                </div>

                {skin ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={skin.displayIcon}
                        alt={skin.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-10 object-contain drop-shadow"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white truncate">
                          {skin.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {skin.weaponName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playInspect();
                          onInspect(skin);
                        }}
                        title="Inspect Skin"
                        className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/15 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          onUnequip(cat.key);
                        }}
                        title="Unequip"
                        className="p-1.5 text-rose-400 hover:text-rose-300 bg-white/5 hover:bg-white/15 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-2 text-center text-xs text-slate-500 font-mono italic">
                    {cat.placeholder}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/10 bg-[#121922] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              soundManager.playEquip();
              onRandomize();
            }}
            className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Randomize</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onClear();
            }}
            disabled={totalEquipped === 0}
            className="py-2 px-3 bg-white/5 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 disabled:opacity-30"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
};
