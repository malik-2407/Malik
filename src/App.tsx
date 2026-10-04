import { useState, useEffect, useMemo } from 'react';
import { WeaponInfo, WeaponSkin, WeaponCategory, SkinTier, Loadout, UserWallet, InventoryItem, UserRank } from './types/valorant';
import { INITIAL_WEAPONS } from './data/weaponsData';
import { fetchValorantWeapons } from './services/valorantApi';
import { soundManager } from './utils/audio';
import { Header } from './components/Header';
import { CategoryDropdown } from './components/CategoryDropdown';
import { SkinCard } from './components/SkinCard';
import { SkinInspectorModal } from './components/SkinInspectorModal';
import { LoadoutDrawer } from './components/LoadoutDrawer';
import { WeaponsSpecsView } from './components/WeaponsSpecsView';
import { InventoryView } from './components/InventoryView';
import { FinisherModal } from './components/FinisherModal';
import { TacticalGame3v3 } from './components/TacticalGame3v3';
import { CurrencyModal } from './components/CurrencyModal';
import { CompetitiveCareerModal } from './components/CompetitiveCareerModal';
import { FooterAudioControl } from './components/FooterAudioControl';
import { INITIAL_USER_RANK, recordMatchResult } from './data/rankData';
import { Search, Sparkles, Filter, RotateCcw, ShieldCheck, CheckCircle2, Heart, Trophy, Zap, DollarSign } from 'lucide-react';

export default function App() {
  const [weapons, setWeapons] = useState<WeaponInfo[]>(INITIAL_WEAPONS);
  const [, setIsLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<WeaponCategory>('All');
  const [selectedWeaponName, setSelectedWeaponName] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<SkinTier | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'gallery' | 'inventory' | 'game3v3' | 'weapons' | 'loadout'>('gallery');

  // Currency & Career modals state
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 10,000 VP & $20 Wallet state
  const [wallet, setWallet] = useState<UserWallet>(() => {
    try {
      const saved = localStorage.getItem('valorant_wallet');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return { vp: 10000, radianite: 300, dollars: 20 };
  });

  // Competitive Rank state (persisted to localStorage)
  const [userRank, setUserRank] = useState<UserRank>(() => {
    try {
      const saved = localStorage.getItem('valorant_rank');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.history && parsed.history.length > 0) return parsed;
        return { ...parsed, history: INITIAL_USER_RANK.history };
      }
    } catch {
      // Ignore
    }
    return INITIAL_USER_RANK;
  });

  // Favorites state persisted to localStorage
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('valorant_favorites');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return ['vandal-champions-2026', 'vandal-prime', 'vandal-reaver', 'melee-champions-2026'];
  });

  // User Unlocked Inventory state
  const [inventory, setInventory] = useState<Record<string, InventoryItem>>(() => {
    try {
      const saved = localStorage.getItem('valorant_inventory');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    // Default starter unlocked skins in local inventory
    return {
      'vandal-prime': {
        skinId: 'vandal-prime',
        purchasedAt: new Date().toISOString(),
        costVp: 1775,
        unlockedLevels: [1, 2, 3, 4],
        unlockedChromas: ['prime-c1', 'prime-c2']
      },
      'sheriff-neo-frontier': {
        skinId: 'sheriff-neo-frontier',
        purchasedAt: new Date().toISOString(),
        costVp: 2175,
        unlockedLevels: [1, 2, 3, 4],
        unlockedChromas: ['nf-c1']
      },
      'op-reaver': {
        skinId: 'op-reaver',
        purchasedAt: new Date().toISOString(),
        costVp: 1775,
        unlockedLevels: [1, 2, 3, 4],
        unlockedChromas: ['rop-c1']
      },
      'melee-prime-karambit': {
        skinId: 'melee-prime-karambit',
        purchasedAt: new Date().toISOString(),
        costVp: 3550,
        unlockedLevels: [1, 2],
        unlockedChromas: ['pk-c1']
      }
    };
  });

  // Inspection modal state
  const [inspectingSkin, setInspectingSkin] = useState<WeaponSkin | null>(null);

  // Finisher simulator modal state
  const [finisherSkin, setFinisherSkin] = useState<WeaponSkin | null>(null);

  // Loadout state
  const [loadout, setLoadout] = useState<Loadout>(() => {
    try {
      const saved = localStorage.getItem('valorant_loadout');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    // Default equipped loadout
    return {
      Rifles: INITIAL_WEAPONS[0]?.skins[0], // Champions 2026 or Prime
      Pistols: INITIAL_WEAPONS[3]?.skins[0], // Neo Frontier Sheriff
      Snipers: INITIAL_WEAPONS[6]?.skins[0], // Reaver Operator
      Melee: INITIAL_WEAPONS[11]?.skins[0], // Champions 2026 or Prime Karambit
    };
  });

  const [isLoadoutOpen, setIsLoadoutOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Save wallet to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('valorant_wallet', JSON.stringify(wallet));
    } catch {
      // Ignore
    }
  }, [wallet]);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('valorant_favorites', JSON.stringify(favoriteIds));
    } catch {
      // Ignore
    }
  }, [favoriteIds]);

  // Save inventory to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('valorant_inventory', JSON.stringify(inventory));
    } catch {
      // Ignore
    }
  }, [inventory]);

  // Save loadout to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('valorant_loadout', JSON.stringify(loadout));
    } catch {
      // Ignore
    }
  }, [loadout]);

  // Save competitive rank to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('valorant_rank', JSON.stringify(userRank));
    } catch {
      // Ignore
    }
  }, [userRank]);

  // Load live data from valorant-api.com
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await fetchValorantWeapons();
      setWeapons(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Compute category counts for all skins in store
  const categoryCounts = useMemo(() => {
    const counts: Record<WeaponCategory, number> = {
      All: 0,
      Rifles: 0,
      Pistols: 0,
      Snipers: 0,
      SMGs: 0,
      Shotguns: 0,
      Heavy: 0,
      Melee: 0
    };

    weapons.forEach(w => {
      const skinCount = w.skins.length;
      counts.All += skinCount;
      if (counts[w.category] !== undefined) {
        counts[w.category] += skinCount;
      }
    });

    return counts;
  }, [weapons]);

  // Available weapons under selected category for the secondary filter
  const availableWeapons = useMemo(() => {
    if (selectedCategory === 'All') return weapons;
    return weapons.filter(w => w.category === selectedCategory);
  }, [weapons, selectedCategory]);

  // All skins flat list
  const allSkins = useMemo(() => {
    return weapons.flatMap(w => w.skins);
  }, [weapons]);

  // Flattened all skins with current filter predicates (including favorites filter)
  const filteredSkins = useMemo(() => {
    const list: WeaponSkin[] = [];
    weapons.forEach(w => {
      // Category filter
      if (selectedCategory !== 'All' && w.category !== selectedCategory) return;
      // Weapon filter
      if (selectedWeaponName !== 'All' && w.name !== selectedWeaponName) return;

      w.skins.forEach(s => {
        // Favorites filter
        if (showFavoritesOnly && !favoriteIds.includes(s.id)) return;
        // Tier filter
        if (selectedTier !== 'All' && s.tier !== selectedTier) return;
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = s.name.toLowerCase().includes(q);
          const matchWeapon = s.weaponName.toLowerCase().includes(q);
          const matchTheme = s.theme.toLowerCase().includes(q);
          if (!matchName && !matchWeapon && !matchTheme) return;
        }
        list.push(s);
      });
    });
    return list;
  }, [weapons, selectedCategory, selectedWeaponName, selectedTier, searchQuery, showFavoritesOnly, favoriteIds]);

  // Autocomplete search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.trim().length === 0) return [];
    const q = searchQuery.toLowerCase().trim();
    const suggestions = new Set<string>();

    weapons.forEach(w => {
      if (w.name.toLowerCase().includes(q)) suggestions.add(w.name);
      w.skins.forEach(s => {
        if (s.name.toLowerCase().includes(q)) suggestions.add(s.name);
        if (s.weaponName.toLowerCase().includes(q)) suggestions.add(s.weaponName);
        if (s.tier.toLowerCase().includes(q)) suggestions.add(s.tier);
        ['prime', 'reaver', 'champions', 'kuronami', 'sovereign', 'elderflame', 'glitchpop', 'neo frontier', 'rgx'].forEach(theme => {
          if (s.name.toLowerCase().includes(theme) && theme.includes(q)) {
            suggestions.add(theme.charAt(0).toUpperCase() + theme.slice(1));
          }
        });
      });
    });

    return Array.from(suggestions).slice(0, 5);
  }, [searchQuery, weapons]);

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
  };

  // Toggle Favorite
  const handleToggleFavorite = (skinId: string) => {
    setFavoriteIds(prev => {
      const exists = prev.includes(skinId);
      if (exists) {
        showToast('Removed from Favorites');
        return prev.filter(id => id !== skinId);
      } else {
        showToast('Added to Favorites ❤️');
        return [...prev, skinId];
      }
    });
  };

  // Claim +2,500 VP
  const handleAddVp = () => {
    soundManager.playPurchase();
    setWallet(prev => ({ ...prev, vp: prev.vp + 2500 }));
    showToast('Claimed +2,500 VP! Available balance updated.');
  };

  // Reset Wallet to 10,000 VP
  const handleResetWallet = () => {
    soundManager.playClick();
    setWallet({ vp: 10000, radianite: 300, dollars: 20 });
    showToast('Wallet reset to 10,000 VP & $20 USD.');
  };

  // Simulate $20 / cash add funds
  const handleSimulateAddFunds = (dollars: number, vpBonus: number) => {
    soundManager.playPurchase();
    setWallet(prev => ({
      ...prev,
      vp: prev.vp + vpBonus,
      dollars: (prev.dollars || 0) + dollars
    }));
    setIsCurrencyModalOpen(false);
    showToast(`Added +$${dollars} ($${dollars} Pack)! Received +${vpBonus.toLocaleString()} VP.`);
  };

  // Unlock skin with VP into local inventory
  const handleUnlockSkin = (skin: WeaponSkin) => {
    const cost = skin.costVp || 1775;
    if (wallet.vp < cost) {
      soundManager.playClick();
      showToast(`Insufficient VP (${wallet.vp} VP). Click '+' in header to claim +2,500 VP!`);
      return;
    }

    soundManager.playPurchase();
    // Deduct VP
    setWallet(prev => ({
      ...prev,
      vp: prev.vp - cost
    }));

    // Add to inventory
    setInventory(prev => ({
      ...prev,
      [skin.id]: {
        skinId: skin.id,
        purchasedAt: new Date().toISOString(),
        costVp: cost,
        unlockedLevels: skin.levels.map(l => l.level),
        unlockedChromas: skin.chromas.map(c => c.id)
      }
    }));

    showToast(`Unlocked ${skin.name} for ${cost.toLocaleString()} VP! Added to Inventory.`);
  };

  // Unlock full Champions 2026 Bundle
  const handleUnlockChampionsBundle = () => {
    const bundleCost = 6200;
    if (wallet.vp < bundleCost) {
      showToast(`Need ${bundleCost.toLocaleString()} VP for Champions 2026 Bundle. Click '+Claim 2,500 VP' first!`);
      return;
    }

    const champVandal = allSkins.find(s => s.id === 'vandal-champions-2026');
    const champBlade = allSkins.find(s => s.id === 'melee-champions-2026');

    soundManager.playPurchase();
    setWallet(prev => ({ ...prev, vp: prev.vp - bundleCost }));

    setInventory(prev => ({
      ...prev,
      ...(champVandal ? {
        [champVandal.id]: {
          skinId: champVandal.id,
          purchasedAt: new Date().toISOString(),
          costVp: 2675,
          unlockedLevels: [1, 2, 3, 4],
          unlockedChromas: champVandal.chromas.map(c => c.id)
        }
      } : {}),
      ...(champBlade ? {
        [champBlade.id]: {
          skinId: champBlade.id,
          purchasedAt: new Date().toISOString(),
          costVp: 5350,
          unlockedLevels: [1, 2],
          unlockedChromas: champBlade.chromas.map(c => c.id)
        }
      } : {})
    }));

    // Automatically favorite them too!
    setFavoriteIds(prev => Array.from(new Set([...prev, 'vandal-champions-2026', 'melee-champions-2026'])));
    showToast('🏆 Champions 2026 Bundle Unlocked! Vandal & Blade added to Inventory.');
  };

  // Equip skin to category slot in loadout
  const handleEquip = (skin: WeaponSkin) => {
    setLoadout(prev => {
      const current = prev[skin.weaponCategory];
      if (current && current.id === skin.id) {
        // Unequip
        const copy = { ...prev };
        delete copy[skin.weaponCategory];
        return copy;
      }
      return {
        ...prev,
        [skin.weaponCategory]: skin
      };
    });
  };

  const handleUnequip = (category: string) => {
    setLoadout(prev => {
      const copy = { ...prev };
      delete copy[category];
      return copy;
    });
  };

  const handleClearLoadout = () => {
    setLoadout({});
  };

  const handleRandomizeLoadout = () => {
    const newLoadout: Loadout = {};
    const categories: WeaponCategory[] = ['Rifles', 'Pistols', 'Snipers', 'SMGs', 'Shotguns', 'Heavy', 'Melee'];
    
    categories.forEach(cat => {
      const catWeapons = weapons.filter(w => w.category === cat);
      const catSkins = catWeapons.flatMap(w => w.skins);
      if (catSkins.length > 0) {
        const randomSkin = catSkins[Math.floor(Math.random() * catSkins.length)];
        newLoadout[cat] = randomSkin;
      }
    });

    setLoadout(newLoadout);
  };

  // Find weapon info for currently inspecting skin
  const inspectingWeaponInfo = useMemo(() => {
    if (!inspectingSkin) return undefined;
    return weapons.find(w => w.name.toLowerCase() === inspectingSkin.weaponName.toLowerCase());
  }, [weapons, inspectingSkin]);

  // Check if skin is equipped
  const isSkinEquipped = (skin: WeaponSkin) => {
    const equipped = loadout[skin.weaponCategory];
    return !!(equipped && equipped.id === skin.id);
  };

  // Check if skin is owned in local inventory
  const isSkinOwned = (skin: WeaponSkin) => {
    return !!inventory[skin.id];
  };

  const isSkinFavorite = (skinId: string) => {
    return favoriteIds.includes(skinId);
  };

  const resetFilters = () => {
    soundManager.playClick();
    setSelectedCategory('All');
    setSelectedWeaponName('All');
    setSelectedTier('All');
    setSearchQuery('');
    setShowFavoritesOnly(false);
  };

  const isChampBundleOwned = !!(inventory['vandal-champions-2026'] && inventory['melee-champions-2026']);

  return (
    <div className="min-h-screen bg-[#0b1016] text-[#ece8e1] flex flex-col font-sans selection:bg-[#ff4655] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-[#16212d] border border-[#ff4655] text-white px-4 py-2.5 shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#ff4655]" />
          <span className="text-xs font-mono">{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenLoadout={() => setIsLoadoutOpen(true)}
        loadoutCount={Object.values(loadout).filter(Boolean).length}
        inventoryCount={Object.keys(inventory).length}
        wallet={wallet}
        userRank={userRank}
        onAddVp={handleAddVp}
        onOpenCurrencyModal={() => setIsCurrencyModalOpen(true)}
        onOpenCareerModal={() => setIsCareerModalOpen(true)}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'loadout') {
            setIsLoadoutOpen(true);
          }
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Safe Sandbox Assurance Banner */}
        <div className="bg-emerald-950/20 border border-emerald-500/25 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="font-mono">
              <strong>100% Safe Local Inventory:</strong> Client-side simulator. No memory injection or anti-cheat tampering. 0% ban risk.
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono text-slate-400 text-[11px]">
              Wallet: <span className="text-white font-bold">{wallet.vp.toLocaleString()} VP</span>
            </span>
            <button
              type="button"
              onClick={handleAddVp}
              className="text-[#ff4655] hover:text-white hover:underline font-mono text-[11px] cursor-pointer"
            >
              +Claim 2,500 VP
            </button>
            <span className="text-slate-600">·</span>
            <button
              type="button"
              onClick={handleResetWallet}
              className="text-slate-400 hover:text-white hover:underline font-mono text-[11px] cursor-pointer"
            >
              Reset 10,000 VP
            </button>
          </div>
        </div>

        {/* Gallery / Store Tab View */}
        {activeTab === 'gallery' && (
          <>
            {/* FEATURED: 2026 CHAMPIONS BUNDLE SPOTLIGHT */}
            <div
              className="relative p-5 sm:p-7 bg-gradient-to-r from-amber-950/40 via-[#141b24] to-black border border-amber-500/30 overflow-hidden shadow-2xl"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
              }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Exclusive Tour Event Bundle</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-wide text-white">
                    CHAMPIONS 2026 BUNDLE
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                    Featuring the <span className="text-amber-300 font-semibold">Champions 2026 Vandal</span> with dynamic top-frag aura & trophy finisher, and the handcrafted <span className="text-amber-300 font-semibold">Champions 2026 Blade</span> with anthem inspect flourish.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Play with 2026 Champions in 3v3 Match */}
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playEquip();
                      setActiveTab('game3v3');
                    }}
                    className="px-4 py-2 bg-[#ff4655] hover:bg-[#e03b49] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shadow-lg"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Play in 3v3 Match</span>
                  </button>

                  {/* Inspect Champions Vandal */}
                  <button
                    type="button"
                    onClick={() => {
                      const v = allSkins.find(s => s.id === 'vandal-champions-2026');
                      if (v) {
                        soundManager.playInspect();
                        setInspectingSkin(v);
                      }
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-white/10"
                  >
                    Inspect Vandal
                  </button>

                  {/* Simulate Champions Finisher */}
                  <button
                    type="button"
                    onClick={() => {
                      const v = allSkins.find(s => s.id === 'vandal-champions-2026');
                      if (v) {
                        setFinisherSkin(v);
                      }
                    }}
                    className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-amber-500/40 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Finisher Demo</span>
                  </button>

                  {/* Unlock Bundle with VP */}
                  {isChampBundleOwned ? (
                    <div className="px-4 py-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Bundle In Inventory</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleUnlockChampionsBundle}
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-lg flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Unlock Bundle (6,200 VP)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Filter Section */}
            <div className="bg-[#0f151c] border border-white/10 p-4 sm:p-6 shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ff4655] mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Live Arsenal Inspector & Favorites</span>
                  </div>
                  <h1 className="text-xl sm:text-3xl font-extrabold font-display tracking-tight text-white uppercase">
                    Weapon Skin Preview Gallery
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl text-balance">
                    Select weapon categories, preview high-fidelity skin editions, inspect 3D tilt models, and unlock skins into your local inventory with your 10,000 VP balance.
                  </p>
                </div>

                {/* Quick Stats Banner */}
                <div className="flex items-center gap-4 bg-black/40 border border-white/5 px-4 py-2 self-start lg:self-end">
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Available</div>
                    <div className="text-base font-bold font-mono text-white tabular-nums">
                      {filteredSkins.length} <span className="text-xs text-slate-500 font-normal">/ {categoryCounts.All}</span>
                    </div>
                  </div>
                  <div className="w-[1px] h-7 bg-white/10" />
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Favorites</div>
                    <div className="text-base font-bold font-mono text-[#ff4655] tabular-nums">
                      {favoriteIds.length}
                    </div>
                  </div>
                  <div className="w-[1px] h-7 bg-white/10" />
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Owned</div>
                    <div className="text-base font-bold font-mono text-emerald-400 tabular-nums">
                      {Object.keys(inventory).length}
                    </div>
                  </div>
                </div>
              </div>

              {/* FILTER CONTROLS BAR (Features the prominent Dropdown Menu requested by user) */}
              <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
                {/* 1. Category Dropdown Menu (PRIMARY FOCUS) */}
                <div className="lg:col-span-4">
                  <CategoryDropdown
                    selectedCategory={selectedCategory}
                    onSelectCategory={(cat) => {
                      setSelectedCategory(cat);
                      setSelectedWeaponName('All');
                    }}
                    categoryCounts={categoryCounts}
                  />
                </div>

                {/* 2. Specific Weapon Selector */}
                <div className="lg:col-span-3">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>Specific Model</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {availableWeapons.length} models
                    </span>
                  </label>
                  <select
                    value={selectedWeaponName}
                    onChange={(e) => {
                      soundManager.playClick();
                      setSelectedWeaponName(e.target.value);
                    }}
                    className="w-full px-3.5 py-2.5 bg-[#141b24] border border-white/10 hover:border-white/25 focus:border-[#ff4655] text-sm text-white focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="All">All {selectedCategory === 'All' ? 'Weapons' : selectedCategory}</option>
                    {availableWeapons.map(w => (
                      <option key={w.id} value={w.name}>{w.name} ({w.skins.length} skins)</option>
                    ))}
                  </select>
                </div>

                {/* 3. Skin Tier Filter */}
                <div className="lg:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>Tier Edition</span>
                    <Filter className="w-3 h-3 text-slate-500" />
                  </label>
                  <select
                    value={selectedTier}
                    onChange={(e) => {
                      soundManager.playClick();
                      setSelectedTier(e.target.value as any);
                    }}
                    className="w-full px-3 py-2.5 bg-[#141b24] border border-white/10 hover:border-white/25 focus:border-[#ff4655] text-sm text-white focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="All">All Tiers</option>
                    <option value="Ultra">Ultra Edition</option>
                    <option value="Exclusive">Exclusive Edition</option>
                    <option value="Premium">Premium Edition</option>
                    <option value="Deluxe">Deluxe Edition</option>
                    <option value="Select">Select Edition</option>
                  </select>
                </div>

                {/* 4. Real-time Search Input with Autocomplete */}
                <div className="lg:col-span-3 relative">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>Search Skins</span>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-[10px] text-[#ff4655] hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. Champions 2026, Prime, Reaver..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#141b24] border border-white/10 hover:border-white/25 focus:border-[#ff4655] text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />

                    {/* Autocomplete Dropdown Suggestions */}
                    {isSearchFocused && searchSuggestions.length > 0 && (
                      <div className="absolute z-50 left-0 right-0 mt-1 bg-[#121922] border border-white/20 shadow-2xl py-1 divide-y divide-white/5 font-mono text-xs">
                        <div className="px-3 py-1 text-[9px] uppercase tracking-wider text-slate-500 bg-black/30">
                          Autocomplete Suggestions
                        </div>
                        {searchSuggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onMouseDown={() => {
                              soundManager.playClick();
                              setSearchQuery(suggestion);
                              setIsSearchFocused(false);
                            }}
                            className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-between cursor-pointer"
                          >
                            <span>{suggestion}</span>
                            <span className="text-[10px] text-[#ff4655]">Select</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Category Action Pills + Favorites Filter Toggle */}
              <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mr-1.5 shrink-0">
                    Quick Filter:
                  </span>
                  {(['All', 'Rifles', 'Pistols', 'Snipers', 'SMGs', 'Shotguns', 'Heavy', 'Melee'] as WeaponCategory[]).map(cat => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          setSelectedCategory(cat);
                          setSelectedWeaponName('All');
                        }}
                        className={`px-2.5 py-1 text-xs font-semibold whitespace-nowrap uppercase tracking-wider transition-colors cursor-pointer border ${
                          isSelected
                            ? 'bg-[#ff4655] text-white border-[#ff4655]'
                            : 'bg-black/30 text-slate-400 border-white/10 hover:border-white/25 hover:text-white'
                        }`}
                      >
                        {cat} ({categoryCounts[cat] || 0})
                      </button>
                    );
                  })}
                </div>

                {/* Favorites Only Toggle Button */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setShowFavoritesOnly(!showFavoritesOnly);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border ${
                      showFavoritesOnly
                        ? 'bg-[#ff4655] text-white border-[#ff4655] shadow-[0_0_12px_rgba(255,70,85,0.4)]'
                        : 'bg-white/5 text-slate-300 border-white/15 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-white' : 'text-[#ff4655]'}`} />
                    <span>Favorites ({favoriteIds.length})</span>
                  </button>

                  {(selectedCategory !== 'All' || selectedWeaponName !== 'All' || selectedTier !== 'All' || searchQuery || showFavoritesOnly) && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-xs text-slate-400 hover:text-[#ff4655] flex items-center gap-1 px-2 py-1 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Skins Grid */}
            {filteredSkins.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredSkins.map((skin) => (
                  <SkinCard
                    key={skin.id}
                    skin={skin}
                    isEquipped={isSkinEquipped(skin)}
                    isOwned={isSkinOwned(skin)}
                    isFavorite={isSkinFavorite(skin.id)}
                    onInspect={(s) => setInspectingSkin(s)}
                    onEquip={(s) => handleEquip(s)}
                    onUnlock={(s) => handleUnlockSkin(s)}
                    onToggleFavorite={(id) => handleToggleFavorite(id)}
                    onSimulateFinisher={(s) => setFinisherSkin(s)}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="p-12 text-center bg-[#0f151c] border border-white/10">
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-white/5 rounded-full text-slate-500">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  {showFavoritesOnly ? 'No favorite skins match your current filter' : 'No weapon skins match your filter criteria'}
                </h3>
                <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
                  {showFavoritesOnly ? 'Click the heart icon on any skin card to save it to your personal favorites list.' : 'Try adjusting the weapon category dropdown or clearing search filters.'}
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#ff4655] hover:bg-[#e03b49] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </>
        )}

        {/* My Inventory Tab View */}
        {activeTab === 'inventory' && (
          <InventoryView
            inventory={inventory}
            allSkins={allSkins}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            categoryCounts={categoryCounts}
            wallet={wallet}
            isEquipped={isSkinEquipped}
            onInspect={(s) => setInspectingSkin(s)}
            onEquip={(s) => handleEquip(s)}
            onNavigateStore={() => setActiveTab('gallery')}
          />
        )}

        {/* 5v5 Tactical Arena Online Game View */}
        {activeTab === 'game3v3' && (
          <TacticalGame3v3
            equippedSkin={loadout.Rifles || allSkins.find(s => s.id === 'vandal-champions-2026') || null}
            userRank={userRank}
            onUpdateRank={setUserRank}
            onExitGame={() => setActiveTab('gallery')}
          />
        )}

        {/* Weapons Telemetry Specs Tab View */}
        {activeTab === 'weapons' && (
          <WeaponsSpecsView
            weapons={weapons}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            categoryCounts={categoryCounts}
          />
        )}
      </main>

      {/* Footer with Audio Feedback Controls */}
      <footer className="mt-auto border-t border-white/10 bg-[#0a0e14] py-4 px-4 md:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
          {/* Dedicated Volume Slider & Mute Toggle */}
          <FooterAudioControl
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />

          <div className="text-center md:text-right space-y-1">
            <div className="text-slate-400">
              VALORANT Tactical Arsenal · Educational & Fan Simulator
            </div>
            <div className="text-[11px] text-slate-600">
              Assets © Riot Games · 100% Client-Side Sandbox (No Ban Risk)
            </div>
          </div>
        </div>
      </footer>

      {/* 3D Tilt Skin Inspector Modal */}
      <SkinInspectorModal
        skin={inspectingSkin}
        weapon={inspectingWeaponInfo}
        isEquipped={inspectingSkin ? isSkinEquipped(inspectingSkin) : false}
        isOwned={inspectingSkin ? isSkinOwned(inspectingSkin) : true}
        isFavorite={inspectingSkin ? isSkinFavorite(inspectingSkin.id) : false}
        wallet={wallet}
        onClose={() => setInspectingSkin(null)}
        onEquip={(s) => handleEquip(s)}
        onUnlock={(s) => handleUnlockSkin(s)}
        onToggleFavorite={(id) => handleToggleFavorite(id)}
        onSimulateFinisher={(s) => setFinisherSkin(s)}
      />

      {/* Finisher Simulator Modal */}
      <FinisherModal
        skin={finisherSkin}
        onClose={() => setFinisherSkin(null)}
      />

      {/* Loadout Drawer */}
      <LoadoutDrawer
        isOpen={isLoadoutOpen}
        onClose={() => setIsLoadoutOpen(false)}
        loadout={loadout}
        onUnequip={handleUnequip}
        onClear={handleClearLoadout}
        onRandomize={handleRandomizeLoadout}
        onInspect={(s) => {
          setIsLoadoutOpen(false);
          setInspectingSkin(s);
        }}
      />

      {/* $20 Store Currency Modal */}
      <CurrencyModal
        isOpen={isCurrencyModalOpen}
        onClose={() => setIsCurrencyModalOpen(false)}
        wallet={wallet}
        onAddFunds={handleSimulateAddFunds}
      />

      {/* D3 Rank Progression & Competitive Career Modal */}
      <CompetitiveCareerModal
        isOpen={isCareerModalOpen}
        onClose={() => setIsCareerModalOpen(false)}
        userRank={userRank}
        onSimulateMatch={(won) => setUserRank(prev => recordMatchResult(prev, won, 'Ascent', 'Jett'))}
        onResetHistory={() => setUserRank(INITIAL_USER_RANK)}
      />
    </div>
  );
}
