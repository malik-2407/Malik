import React from 'react';
import { WeaponInfo, WeaponCategory } from '../types/valorant';
import { CategoryDropdown } from './CategoryDropdown';

interface WeaponsSpecsViewProps {
  weapons: WeaponInfo[];
  selectedCategory: WeaponCategory;
  onSelectCategory: (cat: WeaponCategory) => void;
  categoryCounts: Record<WeaponCategory, number>;
}

export const WeaponsSpecsView: React.FC<WeaponsSpecsViewProps> = ({
  weapons,
  selectedCategory,
  onSelectCategory,
  categoryCounts
}) => {
  const filtered = selectedCategory === 'All'
    ? weapons
    : weapons.filter(w => w.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-wide text-white">
            Arsenal Weapon Specifications
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Competitive weapon telemetry, damage thresholds, penetration, and magazine stats.
          </p>
        </div>

        {/* Category Dropdown filter */}
        <div className="shrink-0">
          <CategoryDropdown
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
            categoryCounts={categoryCounts}
          />
        </div>
      </div>

      {/* Specifications Table */}
      <div className="border border-white/10 bg-[#121820] overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#18212c] text-slate-400 uppercase tracking-wider text-[11px] border-b border-white/10">
            <tr>
              <th className="py-3 px-4">Weapon</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-right">Cost (¤)</th>
              <th className="py-3 px-4 text-right">Mag Size</th>
              <th className="py-3 px-4 text-right">Fire Rate</th>
              <th className="py-3 px-4">Wall Pen</th>
              <th className="py-3 px-4 text-right">Reload (s)</th>
              <th className="py-3 px-4">Damage (Head / Body / Leg)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {filtered.map((w) => {
              const primaryDmg = w.damageRanges[0] || { head: 0, body: 0, leg: 0, range: '' };
              return (
                <tr key={w.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-3">
                    <img
                      src={w.defaultIcon}
                      alt={w.name}
                      referrerPolicy="no-referrer"
                      className="h-6 w-12 object-contain"
                    />
                    <span>{w.name}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{w.category}</td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    {w.cost === 0 ? 'FREE' : `${w.cost} ¤`}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums">{w.magazineSize}</td>
                  <td className="py-3 px-4 text-right tabular-nums">{w.fireRate}/s</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold ${
                        w.wallPenetration === 'High'
                          ? 'text-rose-400 bg-rose-950/30'
                          : w.wallPenetration === 'Medium'
                          ? 'text-amber-400 bg-amber-950/30'
                          : 'text-slate-400 bg-slate-800/30'
                      }`}
                    >
                      {w.wallPenetration}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums">{w.reloadTime}s</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[#ff4655] font-bold">{primaryDmg.head}</span>
                      <span className="text-slate-500">/</span>
                      <span className="text-white font-medium">{primaryDmg.body}</span>
                      <span className="text-slate-500">/</span>
                      <span className="text-slate-400">{primaryDmg.leg}</span>
                      <span className="text-[10px] text-slate-500 ml-1">({primaryDmg.range})</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
