export type WeaponCategory = 
  | 'All'
  | 'Rifles'
  | 'Pistols'
  | 'Snipers'
  | 'SMGs'
  | 'Shotguns'
  | 'Heavy'
  | 'Melee';

export type SkinTier = 'Select' | 'Deluxe' | 'Premium' | 'Exclusive' | 'Ultra';

export interface SkinChroma {
  id: string;
  name: string;
  swatchHex: string;
  accentHex?: string;
  displayIcon: string;
  fullRender?: string;
}

export interface SkinLevel {
  level: number;
  name: string;
  description: string;
  streamedVideo?: string;
}

export interface WeaponSkin {
  id: string;
  uuid?: string;
  name: string;
  weaponName: string;
  weaponCategory: WeaponCategory;
  tier: SkinTier;
  tierColor: string;
  costVp: number;
  displayIcon: string;
  fullRender?: string;
  chromas: SkinChroma[];
  levels: SkinLevel[];
  theme: string;
  soundProfile: 'laser' | 'dark' | 'elemental' | 'heavy' | 'cyber' | 'standard';
  hasFinisher?: boolean;
}

export interface DamageRange {
  range: string;
  head: number;
  body: number;
  leg: number;
}

export interface WeaponInfo {
  id: string;
  uuid?: string;
  name: string;
  category: WeaponCategory;
  cost: number;
  magazineSize: number;
  fireRate: number;
  wallPenetration: 'Low' | 'Medium' | 'High';
  runSpeed: number;
  reloadTime: number;
  firstBulletAccuracy: number;
  damageRanges: DamageRange[];
  defaultIcon: string;
  skins: WeaponSkin[];
}

export interface Loadout {
  Pistols?: WeaponSkin;
  Rifles?: WeaponSkin;
  Snipers?: WeaponSkin;
  SMGs?: WeaponSkin;
  Shotguns?: WeaponSkin;
  Heavy?: WeaponSkin;
  Melee?: WeaponSkin;
  [key: string]: WeaponSkin | undefined;
}

export interface UserWallet {
  vp: number; // Valorant Points (defaults to 10,000)
  radianite: number; // Radianite Points (defaults to 300)
  dollars: number; // Simulated USD balance (defaults to 20)
}

export interface InventoryItem {
  skinId: string;
  purchasedAt: string;
  costVp: number;
  unlockedLevels: number[];
  unlockedChromas: string[];
}

export type RankTier = 'Iron' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Ascendant' | 'Immortal' | 'Radiant';

export interface RankHistoryPoint {
  id: string;
  matchIndex: number;
  timestamp: string; // ISO date or time string
  map: 'Ascent' | 'Bind' | 'Haven' | 'Split' | 'Breeze';
  tier: RankTier;
  subTier: 1 | 2 | 3;
  rr: number; // 0 - 100 RR
  rrChange: number; // e.g. +24, -18
  score: string; // e.g. '13 - 9'
  result: 'win' | 'loss' | 'draw';
  agent: string;
  kills: number;
  deaths: number;
  assists: number;
}

export interface UserRank {
  tier: RankTier;
  subTier: 1 | 2 | 3;
  rr: number; // 0 - 100 Rank Rating
  peakTier: string;
  wins: number;
  losses: number;
  history: RankHistoryPoint[];
}

export type GameMapId = 'ascent' | 'bind' | 'haven';
export type GameModeId = 'competitive' | 'deathmatch' | 'spikerush';

export interface GameMapInfo {
  id: GameMapId;
  name: string;
  tagline: string;
  sites: string[];
  hasTeleporter?: boolean;
}
