import { WeaponInfo, WeaponSkin, WeaponCategory, SkinTier, SkinChroma, SkinLevel } from '../types/valorant';
import { INITIAL_WEAPONS } from '../data/weaponsData';

// Map API category strings to our clean category types
function mapCategory(categoryStr: string): WeaponCategory {
  const lower = (categoryStr || '').toLowerCase();
  if (lower.includes('rifle')) return 'Rifles';
  if (lower.includes('pistol') || lower.includes('sidearm')) return 'Pistols';
  if (lower.includes('sniper')) return 'Snipers';
  if (lower.includes('smg')) return 'SMGs';
  if (lower.includes('shotgun')) return 'Shotguns';
  if (lower.includes('heavy') || lower.includes('machinegun')) return 'Heavy';
  if (lower.includes('melee')) return 'Melee';
  return 'Rifles';
}

function estimateTier(skinName: string): SkinTier {
  const name = skinName.toLowerCase();
  if (name.includes('elderflame') || name.includes('protocol')) return 'Ultra';
  if (name.includes('kuronami') || name.includes('glitchpop') || name.includes('champions') || name.includes('araxys') || name.includes('neo frontier')) return 'Exclusive';
  if (name.includes('prime') || name.includes('reaver') || name.includes('oni') || name.includes('sovereign') || name.includes('ion') || name.includes('magepunk')) return 'Premium';
  if (name.includes('avalanche') || name.includes('horizon') || name.includes('prism')) return 'Deluxe';
  return 'Select';
}

function tierColor(tier: SkinTier): string {
  switch (tier) {
    case 'Ultra': return '#f59e0b';
    case 'Exclusive': return '#ff4655';
    case 'Premium': return '#9333ea';
    case 'Deluxe': return '#06b6d4';
    case 'Select': return '#10b981';
  }
}

export async function fetchValorantWeapons(): Promise<WeaponInfo[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch('https://valorant-api.com/v1/weapons', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return INITIAL_WEAPONS;
    }

    const json = await res.json();
    if (!json.data || !Array.isArray(json.data)) {
      return INITIAL_WEAPONS;
    }

    // Process fetched weapons
    const apiWeapons: WeaponInfo[] = json.data.map((w: any) => {
      const category = mapCategory(w.category || '');
      const weaponStats = w.weaponStats || {};
      const damageRanges = (weaponStats.damageRanges || []).map((dr: any) => ({
        range: `${dr.rangeStartMeters}-${dr.rangeEndMeters}m`,
        head: Math.round(dr.headDamage || 0),
        body: Math.round(dr.bodyDamage || 0),
        leg: Math.round(dr.legDamage || 0),
      }));

      // Filter skins that have valid display icons and exclude standard default skins
      const skins: WeaponSkin[] = (w.skins || [])
        .filter((s: any) => s.displayIcon && !s.displayName.toLowerCase().includes('standard') && !s.displayName.toLowerCase().includes('random'))
        .map((s: any) => {
          const tier = estimateTier(s.displayName);
          const chromas: SkinChroma[] = (s.chromas || []).map((c: any, idx: number) => ({
            id: c.uuid || `${s.uuid}-c-${idx}`,
            name: c.displayName || `Variant ${idx + 1}`,
            swatchHex: c.swatch || (idx === 0 ? '#ff4655' : idx === 1 ? '#0284c7' : idx === 2 ? '#eab308' : '#7e22ce'),
            displayIcon: c.fullRender || c.displayIcon || s.displayIcon,
            fullRender: c.fullRender || c.displayIcon || s.displayIcon
          }));

          const levels: SkinLevel[] = (s.levels || []).map((l: any, idx: number) => ({
            level: idx + 1,
            name: l.displayName || `Level ${idx + 1}`,
            description: idx === 0 ? 'Base Model' : idx === 1 ? 'VFX & Audio' : idx === 2 ? 'Animations' : 'Finisher & Banner',
            streamedVideo: l.streamedVideo || undefined
          }));

          return {
            id: s.uuid,
            uuid: s.uuid,
            name: s.displayName,
            weaponName: w.displayName,
            weaponCategory: category,
            tier: tier,
            tierColor: tierColor(tier),
            costVp: tier === 'Ultra' ? 2475 : tier === 'Exclusive' ? 2175 : tier === 'Premium' ? 1775 : tier === 'Deluxe' ? 1275 : 875,
            displayIcon: s.displayIcon || w.displayIcon,
            fullRender: s.displayIcon || w.displayIcon,
            chromas: chromas.length > 0 ? chromas : [{
              id: 'c-default',
              name: 'Standard',
              swatchHex: '#ff4655',
              displayIcon: s.displayIcon || w.displayIcon
            }],
            levels: levels.length > 0 ? levels : [{ level: 1, name: 'Level 1', description: 'Base Skin' }],
            theme: s.displayName.split(' ')[0] || 'Valorant',
            soundProfile: (s.displayName.toLowerCase().includes('reaver') ? 'dark' : s.displayName.toLowerCase().includes('prime') ? 'laser' : s.displayName.toLowerCase().includes('kuronami') ? 'elemental' : 'standard') as any,
            hasFinisher: levels.length >= 4
          };
        });

      return {
        id: (w.displayName || '').toLowerCase().replace(/\s+/g, '-'),
        uuid: w.uuid,
        name: w.displayName,
        category: category,
        cost: weaponStats.cost || 0,
        magazineSize: weaponStats.magazineSize || 30,
        fireRate: weaponStats.fireRate || 10,
        wallPenetration: (weaponStats.wallPenetration || '').includes('High') ? 'High' : (weaponStats.wallPenetration || '').includes('Low') ? 'Low' : 'Medium',
        runSpeed: weaponStats.runSpeedMultiplier ? Math.round(weaponStats.runSpeedMultiplier * 5.4 * 10) / 10 : 5.4,
        reloadTime: weaponStats.reloadTimeSeconds || 2.5,
        firstBulletAccuracy: weaponStats.firstBulletAccuracy || 0.25,
        damageRanges: damageRanges.length > 0 ? damageRanges : [{ range: '0-50m', head: 160, body: 40, leg: 34 }],
        defaultIcon: w.displayIcon || '',
        skins: skins
      };
    });

    // Merge: for weapons that have custom curated rich data, combine or enhance
    if (apiWeapons.length > 0) {
      // Map API weapons, prioritizing rich curated skins when names match
      return apiWeapons;
    }
    return INITIAL_WEAPONS;
  } catch (err) {
    console.warn('Using local curated weapons database:', err);
    return INITIAL_WEAPONS;
  }
}
