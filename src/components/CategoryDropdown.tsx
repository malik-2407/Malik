import React, { useState, useRef, useEffect } from 'react';
import { WeaponCategory } from '../types/valorant';
import { WEAPON_CATEGORIES } from '../data/weaponsData';
import { soundManager } from '../utils/audio';
import { ChevronDown, Crosshair, Target, Shield, Eye, Zap, Flame, Layers, Sword, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CategoryDropdownProps {
  selectedCategory: WeaponCategory;
  onSelectCategory: (category: WeaponCategory) => void;
  categoryCounts: Record<WeaponCategory, number>;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getCategoryIcon = (id: WeaponCategory) => {
    switch (id) {
      case 'Rifles': return <Target className="w-4 h-4 text-[#ff4655]" />;
      case 'Pistols': return <Shield className="w-4 h-4 text-[#06b6d4]" />;
      case 'Snipers': return <Eye className="w-4 h-4 text-[#a855f7]" />;
      case 'SMGs': return <Zap className="w-4 h-4 text-[#eab308]" />;
      case 'Shotguns': return <Flame className="w-4 h-4 text-[#f97316]" />;
      case 'Heavy': return <Layers className="w-4 h-4 text-[#10b981]" />;
      case 'Melee': return <Sword className="w-4 h-4 text-[#ec4899]" />;
      default: return <Crosshair className="w-4 h-4 text-[#ff4655]" />;
    }
  };

  const currentCategoryObj = WEAPON_CATEGORIES.find(c => c.id === selectedCategory) || WEAPON_CATEGORIES[0];

  const handleSelect = (category: WeaponCategory) => {
    soundManager.playClick();
    onSelectCategory(category);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left w-full sm:w-72" ref={dropdownRef}>
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
        <span>Weapon Category</span>
        <span className="text-[10px] text-slate-500 font-mono">
          {categoryCounts[selectedCategory] || 0} skins
        </span>
      </label>

      {/* Main Dropdown Button */}
      <button
        type="button"
        onClick={() => {
          soundManager.playClick();
          setIsOpen(!isOpen);
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-[#141b24] border transition-all text-left group cursor-pointer ${
          isOpen
            ? 'border-[#ff4655] shadow-[0_0_15px_rgba(255,70,85,0.2)] bg-[#19222e]'
            : 'border-white/10 hover:border-white/25 hover:bg-[#18212c]'
        }`}
        style={{
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 flex items-center justify-center bg-black/40 border border-white/10">
            {getCategoryIcon(selectedCategory)}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-white tracking-wide truncate">
              {currentCategoryObj.label}
            </div>
            <div className="text-[10px] text-slate-400 truncate font-mono">
              {currentCategoryObj.countDesc}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 pl-2 shrink-0">
          <span className="text-xs font-mono font-medium text-slate-400 tabular-nums">
            {categoryCounts[selectedCategory] || 0}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 group-hover:text-white ${
              isOpen ? 'rotate-180 text-[#ff4655]' : ''
            }`}
          />
        </div>
      </button>

      {/* Framer Motion Dropdown Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            role="listbox"
            tabIndex={-1}
            className="absolute z-50 left-0 right-0 mt-1.5 bg-[#121922] border border-white/15 shadow-2xl backdrop-blur-md overflow-hidden"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
            }}
          >
            {/* Header indicator inside menu */}
            <div className="px-3 py-1.5 bg-black/40 border-b border-white/5 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
              <span>Select Filter</span>
              <span className="text-slate-500">Valorant Arsenal</span>
            </div>

            <div className="py-1 max-h-80 overflow-y-auto divide-y divide-white/5">
              {WEAPON_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const count = categoryCounts[cat.id] || 0;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(cat.id)}
                    className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-[#ff4655]/15 text-white'
                        : 'hover:bg-white/[0.06] text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-[#ff4655] text-white' : 'bg-black/30 group-hover:bg-black/60'
                        }`}
                      >
                        {getCategoryIcon(cat.id)}
                      </div>
                      <div className="min-w-0">
                        <div className={`text-xs font-semibold tracking-wide ${isSelected ? 'text-[#ff4655]' : 'group-hover:text-white'}`}>
                          {cat.label}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate font-mono">
                          {cat.countDesc}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                        {count}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#ff4655]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
