import React from 'react';
import { WeaponSkin, WeaponCategory, InventoryItem, UserWallet } from '../types/valorant';
import { CategoryDropdown } from './CategoryDropdown';
import { SkinCard } from './SkinCard';
import { ShieldCheck, Sparkles, Package, ShoppingBag } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface InventoryViewProps {
  inventory: Record<string, InventoryItem>;
  allSkins: WeaponSkin[];
  selectedCategory: WeaponCategory;
  onSelectCategory: (category: WeaponCategory) => void;
  categoryCounts: Record<WeaponCategory, number>;
  wallet: UserWallet;
  isEquipped: (skin: WeaponSkin) => boolean;
  onInspect: (skin: WeaponSkin) => void;
  onEquip: (skin: WeaponSkin) => void;
  onNavigateStore: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  inventory,
  allSkins,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  wallet,
  isEquipped,
  onInspect,
  onEquip,
  onNavigateStore
}) => {
  // Filter owned skins
  const ownedSkins = allSkins.filter(skin => inventory[skin.id]);

  // Compute category counts for owned items
  const ownedCategoryCounts: Record<WeaponCategory, number> = {
    All: ownedSkins.length,
    Rifles: ownedSkins.filter(s => s.weaponCategory === 'Rifles').length,
    Pistols: ownedSkins.filter(s => s.weaponCategory === 'Pistols').length,
    Snipers: ownedSkins.filter(s => s.weaponCategory === 'Snipers').length,
    SMGs: ownedSkins.filter(s => s.weaponCategory === 'SMGs').length,
    Shotguns: ownedSkins.filter(s => s.weaponCategory === 'Shotguns').length,
    Heavy: ownedSkins.filter(s => s.weaponCategory === 'Heavy').length,
    Melee: ownedSkins.filter(s => s.weaponCategory === 'Melee').length,
  };

  // Filter by category
  const filteredOwned = selectedCategory === 'All'
    ? ownedSkins
    : ownedSkins.filter(s => s.weaponCategory === selectedCategory);

  const totalValueVp = ownedSkins.reduce((acc, s) => acc + (s.costVp || 1775), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner: Inventory Overview & 100% Safe Local Guarantee */}
      <div className="bg-[#0f151c] border border-white/10 p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Safe Local Inventory · 0% Ban Risk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white uppercase">
              Player Collection & Locker
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl text-balance">
              Inspect your unlocked skins, manage loadouts, and switch chromas. All inventory is safely stored in your local browser sandbox without touching live game files.
            </p>
          </div>

          {/* Inventory Stats */}
          <div className="flex items-center gap-4 bg-black/40 border border-white/10 px-4 py-2.5 self-start md:self-end">
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Collection Worth</div>
              <div className="text-base font-bold font-mono text-white tabular-nums flex items-center gap-1">
                <span>{totalValueVp.toLocaleString()}</span>
                <span className="text-xs text-[#ff4655]">VP</span>
              </div>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Skins Owned</div>
              <div className="text-base font-bold font-mono text-white tabular-nums">
                {ownedSkins.length} <span className="text-xs text-slate-500 font-normal">items</span>
              </div>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Available VP</div>
              <div className="text-base font-bold font-mono text-[#ff4655] tabular-nums">
                {wallet.vp.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Filter controls row */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="w-full sm:w-72">
            <CategoryDropdown
              selectedCategory={selectedCategory}
              onSelectCategory={onSelectCategory}
              categoryCounts={ownedCategoryCounts}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onNavigateStore();
              }}
              className="px-4 py-2 bg-[#ff4655] hover:bg-[#e03b49] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Spend VP in Store</span>
            </button>
          </div>
        </div>
      </div>

      {/* Owned Skins Grid */}
      {filteredOwned.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredOwned.map((skin) => (
            <SkinCard
              key={skin.id}
              skin={skin}
              isEquipped={isEquipped(skin)}
              onInspect={onInspect}
              onEquip={onEquip}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#0f151c] border border-white/10">
          <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-white/5 rounded-full text-slate-400">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            No {selectedCategory === 'All' ? 'skins' : selectedCategory} in your local inventory
          </h3>
          <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
            You have <span className="text-[#ff4655] font-bold font-mono">{wallet.vp.toLocaleString()} VP</span> ready to spend. Browse the Store & Gallery to unlock your favorite weapon skins!
          </p>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onNavigateStore();
            }}
            className="px-5 py-2.5 bg-[#ff4655] hover:bg-[#e03b49] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Browse Store & Unlock Skins</span>
          </button>
        </div>
      )}
    </div>
  );
};
