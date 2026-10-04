import { WeaponInfo, WeaponCategory } from '../types/valorant';

export const WEAPON_CATEGORIES: { id: WeaponCategory; label: string; countDesc: string; icon: string }[] = [
  { id: 'All', label: 'All Categories', countDesc: 'All Weapons & Skins', icon: 'Crosshair' },
  { id: 'Rifles', label: 'Rifles', countDesc: 'Vandal, Phantom, Guardian, Bulldog', icon: 'Target' },
  { id: 'Pistols', label: 'Pistols / Sidearms', countDesc: 'Sheriff, Ghost, Frenzy, Classic, Shorty', icon: 'Shield' },
  { id: 'Snipers', label: 'Sniper Rifles', countDesc: 'Operator, Outlaw, Marshal', icon: 'Eye' },
  { id: 'SMGs', label: 'SMGs', countDesc: 'Spectre, Stinger', icon: 'Zap' },
  { id: 'Shotguns', label: 'Shotguns', countDesc: 'Judge, Bucky', icon: 'Flame' },
  { id: 'Heavy', label: 'Heavy Machine Guns', countDesc: 'Odin, Ares', icon: 'Layers' },
  { id: 'Melee', label: 'Melee & Knives', countDesc: 'Karambit, Butterfly, Katana, Fan', icon: 'Sword' },
];

export const INITIAL_WEAPONS: WeaponInfo[] = [
  // --- RIFLES ---
  {
    id: 'vandal',
    name: 'Vandal',
    category: 'Rifles',
    cost: 2900,
    magazineSize: 25,
    fireRate: 9.75,
    wallPenetration: 'Medium',
    runSpeed: 5.4,
    reloadTime: 2.5,
    firstBulletAccuracy: 0.25,
    damageRanges: [
      { range: '0-50m', head: 160, body: 40, leg: 34 }
    ],
    defaultIcon: 'https://media.valorant-api.com/weapons/9c82e19d-4575-0200-1a81-3eacf00cf872/displayicon.png',
    skins: [
      {
        id: 'vandal-champions-2026',
        name: 'Champions 2026 Vandal',
        weaponName: 'Vandal',
        weaponCategory: 'Rifles',
        tier: 'Exclusive',
        tierColor: '#f59e0b',
        costVp: 2675,
        theme: 'Champions',
        soundProfile: 'cyber',
        hasFinisher: true,
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/7b1899ea-4d89-7602-0e22-dfa79e491c12/fullrender.png',
        chromas: [
          { id: 'champ26-c1', name: 'Champions Gold & Carbon', swatchHex: '#eab308', accentHex: '#09090b', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/7b1899ea-4d89-7602-0e22-dfa79e491c12/fullrender.png' },
          { id: 'champ26-c2', name: 'Radiant White & Gold', swatchHex: '#f8fafc', accentHex: '#f59e0b', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/4f2a71bf-4fa6-38d5-beea-619f7e71ecce/fullrender.png' },
          { id: 'champ26-c3', name: 'Champions Ruby Red', swatchHex: '#dc2626', accentHex: '#18181b', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/630fc6e7-4954-471f-0e1d-ba80f4f9f7dc/fullrender.png' },
        ],
        levels: [
          { level: 1, name: 'Champions 2026 Frame', description: 'Carbon fiber and 24K gold geometric body with glowing Champions logo' },
          { level: 2, name: 'Champions Aura VFX', description: 'Gold luminescent radiant glow that intensifies with match kills' },
          { level: 3, name: 'Anthem Inspect Animation', description: 'Dynamic camera flourish playing the official Champions 2026 anthem' },
          { level: 4, name: 'Champions Trophy Finisher', description: 'Massive Champions 2026 golden trophy erupts beneath target with stadium fireworks' },
        ]
      },
      {
        id: 'vandal-prime',
        name: 'Prime Vandal',
        weaponName: 'Vandal',
        weaponCategory: 'Rifles',
        tier: 'Premium',
        tierColor: '#f59e0b',
        costVp: 1775,
        theme: 'Prime',
        soundProfile: 'laser',
        hasFinisher: true,
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/4f2a71bf-4fa6-38d5-beea-619f7e71ecce/fullrender.png',
        chromas: [
          { id: 'prime-c1', name: 'Default Gold & White', swatchHex: '#eab308', accentHex: '#ffffff', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/4f2a71bf-4fa6-38d5-beea-619f7e71ecce/fullrender.png' },
          { id: 'prime-c2', name: 'Orange & Cyan', swatchHex: '#f97316', accentHex: '#06b6d4', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/1169eb9b-4375-7b7d-304d-e9a930777e38/fullrender.png' },
          { id: 'prime-c3', name: 'Blue & Silver', swatchHex: '#2563eb', accentHex: '#94a3b8', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/34db39c7-43ca-9a00-58c5-68875eaee0a2/fullrender.png' },
          { id: 'prime-c4', name: 'Yellow & Black', swatchHex: '#facc15', accentHex: '#18181b', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/7b1899ea-4d89-7602-0e22-dfa79e491c12/fullrender.png' },
        ],
        levels: [
          { level: 1, name: 'Base Model', description: 'Clean gold and crystalline aerospace chassis' },
          { level: 2, name: 'VFX & Audio', description: 'Energy laser muzzle flashes and high-resonance firing tone' },
          { level: 3, name: 'Animations', description: 'Fluid energetic reload with crystalline power cell swap' },
          { level: 4, name: 'Finisher & Banner', description: 'Golden radiant wolf apparition devourer finisher' },
        ]
      },
      {
        id: 'vandal-reaver',
        name: 'Reaver Vandal',
        weaponName: 'Vandal',
        weaponCategory: 'Rifles',
        tier: 'Premium',
        tierColor: '#9333ea',
        costVp: 1775,
        theme: 'Reaver',
        soundProfile: 'dark',
        hasFinisher: true,
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/cf534b8c-4bc3-95ca-9a1d-a388f8d22df6/fullrender.png',
        chromas: [
          { id: 'reaver-c1', name: 'Dark Purple', swatchHex: '#7e22ce', accentHex: '#1e1b4b', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/cf534b8c-4bc3-95ca-9a1d-a388f8d22df6/fullrender.png' },
          { id: 'reaver-c2', name: 'Blood Crimson', swatchHex: '#dc2626', accentHex: '#450a0a', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/630fc6e7-4954-471f-0e1d-ba80f4f9f7dc/fullrender.png' },
          { id: 'reaver-c3', name: 'Frost White', swatchHex: '#e2e8f0', accentHex: '#0284c7', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/454cf338-4e8c-8f3f-42fe-eb86d67cf26f/fullrender.png' },
          { id: 'reaver-c4', name: 'Obsidian Black', swatchHex: '#0f172a', accentHex: '#eab308', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/6e5f322e-4b68-43f1-f033-288289899f18/fullrender.png' },
        ],
        levels: [
          { level: 1, name: 'Gothic Chassis', description: 'Intricate necromantic iron engravings' },
          { level: 2, name: 'Soul VFX', description: 'Shadow aura wisps and echoing soul gunfire' },
          { level: 3, name: 'Levitation Reload', description: 'Telekinetic magazine extraction and phantom placement' },
          { level: 4, name: 'Underworld Finisher', description: 'Summons ghostly chains dragging the defeated to the abyss' },
        ]
      },
      {
        id: 'vandal-kuronami',
        name: 'Kuronami Vandal',
        weaponName: 'Vandal',
        weaponCategory: 'Rifles',
        tier: 'Exclusive',
        tierColor: '#ff4655',
        costVp: 2375,
        theme: 'Kuronami',
        soundProfile: 'elemental',
        hasFinisher: true,
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/fb6c5e63-4700-1c05-b026-66a9ba86556e/fullrender.png',
        chromas: [
          { id: 'kuro-c1', name: 'Tempest Mist', swatchHex: '#38bdf8', accentHex: '#0f172a', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/fb6c5e63-4700-1c05-b026-66a9ba86556e/fullrender.png' },
          { id: 'kuro-c2', name: 'Blood Rain', swatchHex: '#e11d48', accentHex: '#000000', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/cf534b8c-4bc3-95ca-9a1d-a388f8d22df6/fullrender.png' },
          { id: 'kuro-c3', name: 'Silver Storm', swatchHex: '#cbd5e1', accentHex: '#475569', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/454cf338-4e8c-8f3f-42fe-eb86d67cf26f/fullrender.png' },
          { id: 'kuro-c4', name: 'Toxic Gale', swatchHex: '#84cc16', accentHex: '#14532d', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/1169eb9b-4375-7b7d-304d-e9a930777e38/fullrender.png' },
        ],
        levels: [
          { level: 1, name: 'Water Ninja Frame', description: 'Tempered Japanese steel wrapped in rain ribbons' },
          { level: 2, name: 'Water Vortex VFX', description: 'Fluid water bullets and pressurized hydro burst' },
          { level: 3, name: 'Kunai Twirl Reload', description: 'Kunai chain spin with hydro orb reconstitution' },
          { level: 4, name: 'Zen Finisher', description: 'Encapsulates the target in a levitating water bubble that freezes and shatters' },
        ]
      },
      {
        id: 'vandal-elderflame',
        name: 'Elderflame Vandal',
        weaponName: 'Vandal',
        weaponCategory: 'Rifles',
        tier: 'Ultra',
        tierColor: '#f59e0b',
        costVp: 2475,
        theme: 'Elderflame',
        soundProfile: 'elemental',
        hasFinisher: true,
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/866d98c2-466a-1bb0-5fa3-0eb47d7c185a/fullrender.png',
        chromas: [
          { id: 'ef-c1', name: 'Magma Red', swatchHex: '#ef4444', accentHex: '#78350f', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/866d98c2-466a-1bb0-5fa3-0eb47d7c185a/fullrender.png' },
          { id: 'ef-c2', name: 'Crystalline Cyan', swatchHex: '#06b6d4', accentHex: '#164e63', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/1169eb9b-4375-7b7d-304d-e9a930777e38/fullrender.png' },
          { id: 'ef-c3', name: 'Dark Void', swatchHex: '#475569', accentHex: '#0f172a', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/cf534b8c-4bc3-95ca-9a1d-a388f8d22df6/fullrender.png' },
        ],
        levels: [
          { level: 1, name: 'Living Dragon', description: 'A living dragon that roars and reacts to actions' },
          { level: 2, name: 'Fire Breath VFX', description: 'Breathes searing dragon fire with every round' },
          { level: 3, name: 'Feeding Reload', description: 'Feeds a magma orb directly into the dragon throat' },
          { level: 4, name: 'Dragon Strike Finisher', description: 'Huge colossal dragon descends from storm clouds incinerating the target' },
        ]
      }
    ]
  },
  {
    id: 'phantom',
    name: 'Phantom',
    category: 'Rifles',
    cost: 2900,
    magazineSize: 30,
    fireRate: 11,
    wallPenetration: 'Medium',
    runSpeed: 5.4,
    reloadTime: 2.5,
    firstBulletAccuracy: 0.2,
    damageRanges: [
      { range: '0-15m', head: 156, body: 39, leg: 33 },
      { range: '15-30m', head: 140, body: 35, leg: 29 },
      { range: '30-50m', head: 124, body: 31, leg: 26 },
    ],
    defaultIcon: 'https://media.valorant-api.com/weapons/ee8fa195-4c7c-b1c3-9ece-a584121485d7/displayicon.png',
    skins: [
      {
        id: 'phantom-oni',
        name: 'Oni Phantom',
        weaponName: 'Phantom',
        weaponCategory: 'Rifles',
        tier: 'Premium',
        tierColor: '#9333ea',
        costVp: 1775,
        theme: 'Oni',
        soundProfile: 'dark',
        hasFinisher: true,
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/2d46e9df-4aa6-7875-92ce-cfa003058889/fullrender.png',
        chromas: [
          { id: 'oni-c1', name: 'Cherry Blossom Red', swatchHex: '#e11d48', accentHex: '#fef08a', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/2d46e9df-4aa6-7875-92ce-cfa003058889/fullrender.png' },
          { id: 'oni-c2', name: 'Kuro Onyx', swatchHex: '#18181b', accentHex: '#ef4444', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/1169eb9b-4375-7b7d-304d-e9a930777e38/fullrender.png' },
          { id: 'oni-c3', name: 'White Spirit', swatchHex: '#f8fafc', accentHex: '#0284c7', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/454cf338-4e8c-8f3f-42fe-eb86d67cf26f/fullrender.png' },
          { id: 'oni-c4', name: 'Emerald Jade', swatchHex: '#059669', accentHex: '#fde047', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/7b1899ea-4d89-7602-0e22-dfa79e491c12/fullrender.png' },
        ],
        levels: [
          { level: 1, name: 'Oni Mask Carving', description: 'Handcrafted samurai lacquer with demonic faceplate' },
          { level: 2, name: 'Spiritual Spirit VFX', description: 'Wisps of green demonic spiritual essence' },
          { level: 3, name: 'Spirit Smoke Reload', description: 'Cherry blossom petals scatter during cartridge replacement' },
          { level: 4, name: 'Katana Sealing Finisher', description: 'Target is pinned by spiritual katanas with blossoming sakura' },
        ]
      },
      {
        id: 'phantom-recon',
        name: 'Recon Phantom',
        weaponName: 'Phantom',
        weaponCategory: 'Rifles',
        tier: 'Premium',
        tierColor: '#9333ea',
        costVp: 1775,
        theme: 'Recon',
        soundProfile: 'standard',
        hasFinisher: false,
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/b8178875-45ad-5f25-bb3e-75ba5a83b276/fullrender.png',
        chromas: [
          { id: 'recon-c1', name: 'Military Olive', swatchHex: '#4d5d40', accentHex: '#1a1f16', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/b8178875-45ad-5f25-bb3e-75ba5a83b276/fullrender.png' },
          { id: 'recon-c2', name: 'Urban Camo', swatchHex: '#64748b', accentHex: '#cbd5e1', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/454cf338-4e8c-8f3f-42fe-eb86d67cf26f/fullrender.png' },
          { id: 'recon-c3', name: 'Desert Ops', swatchHex: '#d97706', accentHex: '#78350f', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/7b1899ea-4d89-7602-0e22-dfa79e491c12/fullrender.png' },
        ],
        levels: [
          { level: 1, name: 'Tactical Mil-Spec', description: 'Modern assault rifle with modular picatinny attachments' },
          { level: 2, name: 'Randomized Attachments', description: 'Laser sights, flashlights, and foregrips randomly equipped' },
          { level: 3, name: 'Tactical Suppressor Audio', description: 'Clean subsonic suppressed muzzle acoustics' },
        ]
      },
      {
        id: 'phantom-glitchpop',
        name: 'Glitchpop Phantom',
        weaponName: 'Phantom',
        weaponCategory: 'Rifles',
        tier: 'Exclusive',
        tierColor: '#ff4655',
        costVp: 2175,
        theme: 'Glitchpop',
        soundProfile: 'cyber',
        hasFinisher: true,
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/c4b82bc4-47be-ec65-27a9-2eaf98a39a04/fullrender.png',
        chromas: [
          { id: 'gp-c1', name: 'Cyber Magenta', swatchHex: '#d946ef', accentHex: '#06b6d4', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/c4b82bc4-47be-ec65-27a9-2eaf98a39a04/fullrender.png' },
          { id: 'gp-c2', name: 'Neon Blue', swatchHex: '#0ea5e9', accentHex: '#f43f5e', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/1169eb9b-4375-7b7d-304d-e9a930777e38/fullrender.png' },
          { id: 'gp-c3', name: 'Dystopian Red', swatchHex: '#ef4444', accentHex: '#18181b', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/630fc6e7-4954-471f-0e1d-ba80f4f9f7dc/fullrender.png' },
          { id: 'gp-c4', name: 'Glitch Gold', swatchHex: '#eab308', accentHex: '#3b82f6', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/7b1899ea-4d89-7602-0e22-dfa79e491c12/fullrender.png' },
        ],
        levels: [
          { level: 1, name: 'Cyberpunk Frame', description: 'Stickers, exposed circuitry, and holographic displays' },
          { level: 2, name: 'Holo Hologram VFX', description: 'Digital glitch trails, anime stickers, and neon muzzle burst' },
          { level: 3, name: 'Glitch Reload', description: 'Digital pixel disintegration and reconstructed energy mag' },
          { level: 4, name: 'Holo Pop Finisher', description: 'Explosive cyber cartoon billboard detonation with confetti' },
        ]
      }
    ]
  },
  {
    id: 'guardian',
    name: 'Guardian',
    category: 'Rifles',
    cost: 2250,
    magazineSize: 12,
    fireRate: 5.25,
    wallPenetration: 'High',
    runSpeed: 5.4,
    reloadTime: 2.5,
    firstBulletAccuracy: 0.1,
    damageRanges: [
      { range: '0-50m', head: 195, body: 65, leg: 48 }
    ],
    defaultIcon: 'https://media.valorant-api.com/weapons/ae3de142-42d3-210c-6976-9794a0785232/displayicon.png',
    skins: [
      {
        id: 'guardian-sovereign',
        name: 'Sovereign Guardian',
        weaponName: 'Guardian',
        weaponCategory: 'Rifles',
        tier: 'Premium',
        tierColor: '#9333ea',
        costVp: 1775,
        theme: 'Sovereign',
        soundProfile: 'laser',
        hasFinisher: true,
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/5a703d15-4fa8-761e-dc4b-b0b2ce21396a/fullrender.png',
        chromas: [
          { id: 'sov-c1', name: 'Holy White & Gold', swatchHex: '#f8fafc', accentHex: '#eab308', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/5a703d15-4fa8-761e-dc4b-b0b2ce21396a/fullrender.png' },
          { id: 'sov-c2', name: 'Celestial Blue', swatchHex: '#0284c7', accentHex: '#f8fafc', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/34db39c7-43ca-9a00-58c5-68875eaee0a2/fullrender.png' },
          { id: 'sov-c3', name: 'Fallen Shadow', swatchHex: '#334155', accentHex: '#991b1b', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/6e5f322e-4b68-43f1-f033-288289899f18/fullrender.png' },
        ],
        levels: [
          { level: 1, name: 'Royal Ivory Model', description: 'Angelic wings and royal filigree design' },
          { level: 2, name: 'Angelic Audio & VFX', description: 'Crystalline holy tone with chime reverberation' },
          { level: 3, name: 'Winged Reload', description: 'Graceful levitation reload with feathers' },
          { level: 4, name: 'Heavenly Sword Finisher', description: 'A holy broadsword plunges from the heavens into the enemy' },
        ]
      }
    ]
  },

  // --- PISTOLS ---
  {
    id: 'sheriff',
    name: 'Sheriff',
    category: 'Pistols',
    cost: 800,
    magazineSize: 6,
    fireRate: 4,
    wallPenetration: 'High',
    runSpeed: 5.73,
    reloadTime: 2.25,
    firstBulletAccuracy: 0.25,
    damageRanges: [
      { range: '0-30m', head: 159, body: 55, leg: 46 },
      { range: '30-50m', head: 145, body: 50, leg: 42 }
    ],
    defaultIcon: 'https://media.valorant-api.com/weapons/e336c6b8-418d-9340-d77f-7a9e4cfe0702/displayicon.png',
    skins: [
      {
        id: 'sheriff-neo-frontier',
        name: 'Neo Frontier Sheriff',
        weaponName: 'Sheriff',
        weaponCategory: 'Pistols',
        tier: 'Exclusive',
        tierColor: '#ff4655',
        costVp: 2175,
        theme: 'Neo Frontier',
        soundProfile: 'cyber',
        hasFinisher: true,
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/5a0c32df-4c3e-c6c7-32ee-da97e0766e4a/fullrender.png',
        chromas: [
          { id: 'nf-c1', name: 'Old West Wood & Brass', swatchHex: '#b45309', accentHex: '#fef08a', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/5a0c32df-4c3e-c6c7-32ee-da97e0766e4a/fullrender.png' },
          { id: 'nf-c2', name: 'Futuristic Gold', swatchHex: '#eab308', accentHex: '#18181b', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/7b1899ea-4d89-7602-0e22-dfa79e491c12/fullrender.png' },
          { id: 'nf-c3', name: 'Cyberpunk Silver', swatchHex: '#94a3b8', accentHex: '#06b6d4', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/454cf338-4e8c-8f3f-42fe-eb86d67cf26f/fullrender.png' },
          { id: 'nf-c4', name: 'Copper Rust', swatchHex: '#c2410c', accentHex: '#451a03', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/630fc6e7-4954-471f-0e1d-ba80f4f9f7dc/fullrender.png' },
        ],
        levels: [
          { level: 1, name: 'Wild West Revolver', description: 'Classic wooden handle revolver with twirling animations' },
          { level: 2, name: 'Cylinder Spin Animation', description: 'Fast gun-slinging cylinder spin when drawing and inspecting' },
          { level: 3, name: 'Sci-Fi Transmutation', description: 'Transforms into a futuristic laser rail-revolver' },
          { level: 4, name: 'High Noon Duel Finisher', description: 'Spawns a sunset desert showdown where the enemy falls in dust' },
        ]
      },
      {
        id: 'sheriff-chronovoid',
        name: 'ChronoVoid Sheriff',
        weaponName: 'Sheriff',
        weaponCategory: 'Pistols',
        tier: 'Exclusive',
        tierColor: '#ff4655',
        costVp: 2175,
        theme: 'ChronoVoid',
        soundProfile: 'laser',
        hasFinisher: true,
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/2042dbff-4f4e-98ee-55fa-b684534cf50a/fullrender.png',
        chromas: [
          { id: 'cv-c1', name: 'Solar Gold', swatchHex: '#f59e0b', accentHex: '#ffffff', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/2042dbff-4f4e-98ee-55fa-b684534cf50a/fullrender.png' },
          { id: 'cv-c2', name: 'Purple Nebula', swatchHex: '#9333ea', accentHex: '#38bdf8', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/cf534b8c-4bc3-95ca-9a1d-a388f8d22df6/fullrender.png' },
          { id: 'cv-c3', name: 'Black Singularity', swatchHex: '#09090b', accentHex: '#ef4444', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/6e5f322e-4b68-43f1-f033-288289899f18/fullrender.png' },
        ],
        levels: [
          { level: 1, name: 'Orb Reactor Core', description: 'Suspended levitating sphere rotating inside the cylinder' },
          { level: 2, name: 'Time Warp VFX', description: 'Gravitational distortions during firing' },
          { level: 3, name: 'Kinetic Re-center Reload', description: 'Sphere flies out and snaps back with gravitational pulse' },
          { level: 4, name: 'Black Hole Spacetime Finisher', description: 'Traps opponent in a gravitational event horizon' },
        ]
      }
    ]
  },
  {
    id: 'ghost',
    name: 'Ghost',
    category: 'Pistols',
    cost: 500,
    magazineSize: 15,
    fireRate: 6.75,
    wallPenetration: 'Medium',
    runSpeed: 5.73,
    reloadTime: 1.5,
    firstBulletAccuracy: 0.3,
    damageRanges: [
      { range: '0-30m', head: 105, body: 30, leg: 25 },
      { range: '30-50m', head: 87, body: 25, leg: 21 }
    ],
    defaultIcon: 'https://media.valorant-api.com/weapons/1baa85b4-4c70-1284-64bb-6481dfc3bb4e/displayicon.png',
    skins: [
      {
        id: 'ghost-sovereign',
        name: 'Sovereign Ghost',
        weaponName: 'Ghost',
        weaponCategory: 'Pistols',
        tier: 'Premium',
        tierColor: '#9333ea',
        costVp: 1775,
        theme: 'Sovereign',
        soundProfile: 'laser',
        hasFinisher: true,
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/ea91a7eb-4f7f-ec82-58e1-518420e6ca74/fullrender.png',
        chromas: [
          { id: 'sg-c1', name: 'White & Gold', swatchHex: '#f8fafc', accentHex: '#eab308', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/ea91a7eb-4f7f-ec82-58e1-518420e6ca74/fullrender.png' },
          { id: 'sg-c2', name: 'Azure Sky', swatchHex: '#0284c7', accentHex: '#ffffff', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/34db39c7-43ca-9a00-58c5-68875eaee0a2/fullrender.png' },
          { id: 'sg-c3', name: 'Obsidian Shade', swatchHex: '#18181b', accentHex: '#dc2626', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/6e5f322e-4b68-43f1-f033-288289899f18/fullrender.png' },
        ],
        levels: [
          { level: 1, name: 'Sovereign Frame', description: 'Polished alabaster slide and gold trigger' },
          { level: 2, name: 'Angelic Suppressed Pop', description: 'Crystal quiet shot audio' },
          { level: 3, name: 'Levitation Mag', description: 'Magazine flows into place automatically' },
          { level: 4, name: 'Celestial Finisher', description: 'Holy ray of light and spectral blade strike' },
        ]
      },
      {
        id: 'ghost-magepunk',
        name: 'Magepunk Ghost',
        weaponName: 'Ghost',
        weaponCategory: 'Pistols',
        tier: 'Premium',
        tierColor: '#9333ea',
        costVp: 1775,
        theme: 'Magepunk',
        soundProfile: 'cyber',
        hasFinisher: true,
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/86a863ca-49ba-2ff8-86d4-8d998d5c806c/fullrender.png',
        chromas: [
          { id: 'mp-c1', name: 'Brass & Blue Spark', swatchHex: '#d97706', accentHex: '#06b6d4', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/86a863ca-49ba-2ff8-86d4-8d998d5c806c/fullrender.png' },
          { id: 'mp-c2', name: 'Green Spark', swatchHex: '#16a34a', accentHex: '#facc15', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/1169eb9b-4375-7b7d-304d-e9a930777e38/fullrender.png' },
          { id: 'mp-c3', name: 'Purple Spark', swatchHex: '#9333ea', accentHex: '#f43f5e', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/cf534b8c-4bc3-95ca-9a1d-a388f8d22df6/fullrender.png' },
        ],
        levels: [
          { level: 1, name: 'Steampunk Glass Chassis', description: 'Exposed vacuum tubes with crackling electricity' },
          { level: 2, name: 'Arc Lightning VFX', description: 'Tesla coil discharges with each trigger pull' },
          { level: 3, name: 'Glass Tube Swap', description: 'Glowing charged vacuum bulb insertion' },
          { level: 4, name: 'Tesla Chamber Finisher', description: 'Traps the defeated agent in an electrical glass bell jar' },
        ]
      }
    ]
  },
  {
    id: 'classic',
    name: 'Classic',
    category: 'Pistols',
    cost: 0,
    magazineSize: 12,
    fireRate: 6.75,
    wallPenetration: 'Low',
    runSpeed: 5.73,
    reloadTime: 1.5,
    firstBulletAccuracy: 0.4,
    damageRanges: [
      { range: '0-30m', head: 78, body: 26, leg: 22 },
      { range: '30-50m', head: 66, body: 22, leg: 18 }
    ],
    defaultIcon: 'https://media.valorant-api.com/weapons/29a14737-4184-4b6e-da3a-09947c5c3a1e/displayicon.png',
    skins: [
      {
        id: 'classic-prime',
        name: 'Prime Classic',
        weaponName: 'Classic',
        weaponCategory: 'Pistols',
        tier: 'Premium',
        tierColor: '#f59e0b',
        costVp: 1775,
        theme: 'Prime',
        soundProfile: 'laser',
        hasFinisher: true,
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/b80155b4-4b82-cb1e-7f61-e186a86c62c9/fullrender.png',
        chromas: [
          { id: 'pc-c1', name: 'Gold & White', swatchHex: '#eab308', accentHex: '#ffffff', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/b80155b4-4b82-cb1e-7f61-e186a86c62c9/fullrender.png' },
          { id: 'pc-c2', name: 'Orange & Cyan', swatchHex: '#ea580c', accentHex: '#06b6d4', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/1169eb9b-4375-7b7d-304d-e9a930777e38/fullrender.png' },
          { id: 'pc-c3', name: 'Blue & Cobalt', swatchHex: '#2563eb', accentHex: '#cbd5e1', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/34db39c7-43ca-9a00-58c5-68875eaee0a2/fullrender.png' },
        ],
        levels: [
          { level: 1, name: 'Prime Aerospace Frame', description: 'Clean ergonomic body with glowing crystal power core' },
          { level: 2, name: 'Laser Audio & VFX', description: 'High-tech burst and laser acoustics' },
          { level: 3, name: 'Core Reload', description: 'Drop and vacuum pull crystal reload' },
          { level: 4, name: 'Prime Wolf Finisher', description: 'Golden wolf apparition execution' },
        ]
      }
    ]
  },

  // --- SNIPERS ---
  {
    id: 'operator',
    name: 'Operator',
    category: 'Snipers',
    cost: 4700,
    magazineSize: 5,
    fireRate: 0.75,
    wallPenetration: 'High',
    runSpeed: 5.1,
    reloadTime: 3.7,
    firstBulletAccuracy: 0,
    damageRanges: [
      { range: '0-50m', head: 255, body: 150, leg: 120 }
    ],
    defaultIcon: 'https://media.valorant-api.com/weapons/a03b24d3-4319-996d-0f8c-94eacfe21c50/displayicon.png',
    skins: [
      {
        id: 'op-reaver',
        name: 'Reaver Operator',
        weaponName: 'Operator',
        weaponCategory: 'Snipers',
        tier: 'Premium',
        tierColor: '#9333ea',
        costVp: 1775,
        theme: 'Reaver',
        soundProfile: 'dark',
        hasFinisher: true,
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/bb555ecf-4bf1-e565-d069-b5930bfe51aa/fullrender.png',
        chromas: [
          { id: 'rop-c1', name: 'Dark Purple', swatchHex: '#7e22ce', accentHex: '#1e1b4b', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/bb555ecf-4bf1-e565-d069-b5930bfe51aa/fullrender.png' },
          { id: 'rop-c2', name: 'Crimson Red', swatchHex: '#dc2626', accentHex: '#450a0a', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/630fc6e7-4954-471f-0e1d-ba80f4f9f7dc/fullrender.png' },
          { id: 'rop-c3', name: 'Ghost White', swatchHex: '#f1f5f9', accentHex: '#0284c7', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/454cf338-4e8c-8f3f-42fe-eb86d67cf26f/fullrender.png' },
        ],
        levels: [
          { level: 1, name: 'Abyssal Sniper Frame', description: 'Gothic filigree sniper with glowing scope crosshairs' },
          { level: 2, name: 'Soul Boom VFX', description: 'Heavy supernatural thunder shot echoing across the map' },
          { level: 3, name: 'Phantom Bolt Cycle', description: 'Telekinetic bolt action cycling and floating mag' },
          { level: 4, name: 'Abyssal Chains Finisher', description: 'Underworld portal opens with grasping shadowy chains' },
        ]
      },
      {
        id: 'op-araxys',
        name: 'Araxys Operator',
        weaponName: 'Operator',
        weaponCategory: 'Snipers',
        tier: 'Exclusive',
        tierColor: '#ff4655',
        costVp: 2175,
        theme: 'Araxys',
        soundProfile: 'cyber',
        hasFinisher: true,
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/2d02c811-4770-349f-b769-65a882cb79a4/fullrender.png',
        chromas: [
          { id: 'arx-c1', name: 'Biomorphic Bronze', swatchHex: '#b45309', accentHex: '#f59e0b', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/2d02c811-4770-349f-b769-65a882cb79a4/fullrender.png' },
          { id: 'arx-c2', name: 'Plasma Purple', swatchHex: '#a855f7', accentHex: '#ec4899', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/cf534b8c-4bc3-95ca-9a1d-a388f8d22df6/fullrender.png' },
          { id: 'arx-c3', name: 'Frost Silver', swatchHex: '#94a3b8', accentHex: '#38bdf8', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/454cf338-4e8c-8f3f-42fe-eb86d67cf26f/fullrender.png' },
        ],
        levels: [
          { level: 1, name: 'Alien Chitin Armor', description: 'Dynamic opening scales that breathe and react to aiming' },
          { level: 2, name: 'Plasma Cannon VFX', description: 'Incinerating alien energy beam shot' },
          { level: 3, name: 'Mechanical Flap Reload', description: 'Chitin plates flutter open releasing excess thermal gas' },
          { level: 4, name: 'Orbital Ray Finisher', description: 'Mothership beam vaporizes the target into dust' },
        ]
      }
    ]
  },
  {
    id: 'marshal',
    name: 'Marshal',
    category: 'Snipers',
    cost: 950,
    magazineSize: 5,
    fireRate: 1.5,
    wallPenetration: 'Medium',
    runSpeed: 5.4,
    reloadTime: 2.5,
    firstBulletAccuracy: 0.1,
    damageRanges: [
      { range: '0-50m', head: 202, body: 101, leg: 85 }
    ],
    defaultIcon: 'https://media.valorant-api.com/weapons/c4883e50-4494-202c-3ec3-6b8a9284f00b/displayicon.png',
    skins: [
      {
        id: 'marshal-sovereign',
        name: 'Sovereign Marshal',
        weaponName: 'Marshal',
        weaponCategory: 'Snipers',
        tier: 'Premium',
        tierColor: '#9333ea',
        costVp: 1775,
        theme: 'Sovereign',
        soundProfile: 'laser',
        hasFinisher: true,
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/b80155b4-4b82-cb1e-7f61-e186a86c62c9/fullrender.png',
        chromas: [
          { id: 'sm-c1', name: 'Ivory & Gold', swatchHex: '#f8fafc', accentHex: '#eab308', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/b80155b4-4b82-cb1e-7f61-e186a86c62c9/fullrender.png' },
          { id: 'sm-c2', name: 'Azure Sky', swatchHex: '#0284c7', accentHex: '#f8fafc', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/34db39c7-43ca-9a00-58c5-68875eaee0a2/fullrender.png' },
        ],
        levels: [
          { level: 1, name: 'Sovereign Scout Frame', description: 'Graceful lever-action rifle' },
          { level: 2, name: 'Holy Crack Audio', description: 'Angelic resonance chime' },
          { level: 3, name: 'Golden Round Insertion', description: 'Smooth cartridge lever flick' },
          { level: 4, name: 'Sovereign Finisher', description: 'Light beam and divine blade strike' },
        ]
      }
    ]
  },

  // --- SMGS ---
  {
    id: 'spectre',
    name: 'Spectre',
    category: 'SMGs',
    cost: 1600,
    magazineSize: 30,
    fireRate: 13.33,
    wallPenetration: 'Medium',
    runSpeed: 5.73,
    reloadTime: 2.25,
    firstBulletAccuracy: 0.4,
    damageRanges: [
      { range: '0-15m', head: 78, body: 26, leg: 22 },
      { range: '15-30m', head: 66, body: 22, leg: 18 },
      { range: '30-50m', head: 60, body: 20, leg: 17 }
    ],
    defaultIcon: 'https://media.valorant-api.com/weapons/462080d1-4035-2937-7c09-27aa2a5c27a7/displayicon.png',
    skins: [
      {
        id: 'spectre-prime',
        name: 'Prime Spectre',
        weaponName: 'Spectre',
        weaponCategory: 'SMGs',
        tier: 'Premium',
        tierColor: '#f59e0b',
        costVp: 1775,
        theme: 'Prime',
        soundProfile: 'laser',
        hasFinisher: true,
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/4f2a71bf-4fa6-38d5-beea-619f7e71ecce/fullrender.png',
        chromas: [
          { id: 'sp-c1', name: 'Gold & White', swatchHex: '#eab308', accentHex: '#ffffff', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/4f2a71bf-4fa6-38d5-beea-619f7e71ecce/fullrender.png' },
          { id: 'sp-c2', name: 'Orange & Cyan', swatchHex: '#ea580c', accentHex: '#06b6d4', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/1169eb9b-4375-7b7d-304d-e9a930777e38/fullrender.png' },
        ],
        levels: [
          { level: 1, name: 'Prime SMG Frame', description: 'Rapid laser weapon with aerodynamic curves' },
          { level: 2, name: 'Laser Burst Audio', description: 'Suppressed laser acoustics' },
          { level: 3, name: 'Prime Mag Swap', description: 'Crystal cell snap-in' },
          { level: 4, name: 'Prime Finisher', description: 'Radiant wolf execution' },
        ]
      }
    ]
  },

  // --- SHOTGUNS ---
  {
    id: 'judge',
    name: 'Judge',
    category: 'Shotguns',
    cost: 1850,
    magazineSize: 7,
    fireRate: 3.5,
    wallPenetration: 'Medium',
    runSpeed: 5.4,
    reloadTime: 2.2,
    firstBulletAccuracy: 0.8,
    damageRanges: [
      { range: '0-10m', head: 34, body: 17, leg: 14 },
      { range: '10-15m', head: 20, body: 10, leg: 8 }
    ],
    defaultIcon: 'https://media.valorant-api.com/weapons/ec84251c-4ccb-4948-e872-0da596bc85a5/displayicon.png',
    skins: [
      {
        id: 'judge-elderflame',
        name: 'Elderflame Judge',
        weaponName: 'Judge',
        weaponCategory: 'Shotguns',
        tier: 'Ultra',
        tierColor: '#f59e0b',
        costVp: 2475,
        theme: 'Elderflame',
        soundProfile: 'elemental',
        hasFinisher: true,
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/866d98c2-466a-1bb0-5fa3-0eb47d7c185a/fullrender.png',
        chromas: [
          { id: 'ej-c1', name: 'Infernal Red', swatchHex: '#ef4444', accentHex: '#78350f', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/866d98c2-466a-1bb0-5fa3-0eb47d7c185a/fullrender.png' },
          { id: 'ej-c2', name: 'Azure Flame', swatchHex: '#0284c7', accentHex: '#164e63', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/1169eb9b-4375-7b7d-304d-e9a930777e38/fullrender.png' },
        ],
        levels: [
          { level: 1, name: 'Dragon Wyrmling', description: 'Snapping fiery dragon hatchling' },
          { level: 2, name: 'Cluster Fire VFX', description: 'Flames erupt with each buckshot' },
          { level: 3, name: 'Dragon Feed Reload', description: 'Dragon catches shotgun shell and swallows it' },
          { level: 4, name: 'Colossal Dragon Finisher', description: 'Dragon incinerates target from above' },
        ]
      }
    ]
  },

  // --- HEAVY ---
  {
    id: 'odin',
    name: 'Odin',
    category: 'Heavy',
    cost: 3200,
    magazineSize: 100,
    fireRate: 12,
    wallPenetration: 'High',
    runSpeed: 5.1,
    reloadTime: 5.0,
    firstBulletAccuracy: 0.8,
    damageRanges: [
      { range: '0-30m', head: 95, body: 38, leg: 32 },
      { range: '30-50m', head: 77, body: 31, leg: 26 }
    ],
    defaultIcon: 'https://media.valorant-api.com/weapons/63e6c2b6-4a8e-869c-3d4c-e38355226584/displayicon.png',
    skins: [
      {
        id: 'odin-reaver',
        name: 'Reaver Odin',
        weaponName: 'Odin',
        weaponCategory: 'Heavy',
        tier: 'Premium',
        tierColor: '#9333ea',
        costVp: 1775,
        theme: 'Reaver',
        soundProfile: 'dark',
        hasFinisher: true,
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/cf534b8c-4bc3-95ca-9a1d-a388f8d22df6/fullrender.png',
        chromas: [
          { id: 'ro-c1', name: 'Dark Purple', swatchHex: '#7e22ce', accentHex: '#1e1b4b', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/cf534b8c-4bc3-95ca-9a1d-a388f8d22df6/fullrender.png' },
          { id: 'ro-c2', name: 'Crimson', swatchHex: '#dc2626', accentHex: '#450a0a', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/630fc6e7-4954-471f-0e1d-ba80f4f9f7dc/fullrender.png' },
        ],
        levels: [
          { level: 1, name: 'Reaver Heavy Cannon', description: 'Imposing machine gun with demonic runes' },
          { level: 2, name: 'Torrent Soul VFX', description: 'Massive rate-of-fire soul blasts' },
          { level: 3, name: 'Telekinetic Drum Reload', description: 'Large skull ammo box levitates into chamber' },
          { level: 4, name: 'Reaver Finisher', description: 'Abyssal chains pull target downward' },
        ]
      }
    ]
  },

  // --- MELEE ---
  {
    id: 'melee',
    name: 'Melee',
    category: 'Melee',
    cost: 0,
    magazineSize: 0,
    fireRate: 2,
    wallPenetration: 'Medium',
    runSpeed: 6.0,
    reloadTime: 0,
    firstBulletAccuracy: 1,
    damageRanges: [
      { range: 'Melee', head: 150, body: 75, leg: 50 }
    ],
    defaultIcon: 'https://media.valorant-api.com/weapons/2f59173c-4bed-b6c3-2191-dea9b58be9c7/displayicon.png',
    skins: [
      {
        id: 'melee-champions-2026',
        name: 'Champions 2026 Blade',
        weaponName: 'Melee',
        weaponCategory: 'Melee',
        tier: 'Exclusive',
        tierColor: '#f59e0b',
        costVp: 5350,
        theme: 'Champions',
        soundProfile: 'cyber',
        hasFinisher: true,
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/7b1899ea-4d89-7602-0e22-dfa79e491c12/fullrender.png',
        chromas: [
          { id: 'champ26-blade-c1', name: 'Champions Gold', swatchHex: '#eab308', accentHex: '#09090b', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/7b1899ea-4d89-7602-0e22-dfa79e491c12/fullrender.png' },
          { id: 'champ26-blade-c2', name: 'Radiant White & Gold', swatchHex: '#f8fafc', accentHex: '#f59e0b', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/4f2a71bf-4fa6-38d5-beea-619f7e71ecce/fullrender.png' },
        ],
        levels: [
          { level: 1, name: 'Champions 2026 Tactical Blade', description: 'Handcrafted gold blade with carbon-fiber weave handle and LED VCT crest' },
          { level: 2, name: 'Radiant Aura & Anthem Inspect', description: 'Glows brightly with team top-frag aura and plays the Champions 2026 anthem on inspection' },
        ]
      },
      {
        id: 'melee-prime-karambit',
        name: 'Prime 2.0 Karambit',
        weaponName: 'Melee',
        weaponCategory: 'Melee',
        tier: 'Exclusive',
        tierColor: '#ff4655',
        costVp: 3550,
        theme: 'Prime',
        soundProfile: 'laser',
        hasFinisher: false,
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/1169eb9b-4375-7b7d-304d-e9a930777e38/fullrender.png',
        chromas: [
          { id: 'pk-c1', name: 'Gold & White', swatchHex: '#eab308', accentHex: '#ffffff', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/1169eb9b-4375-7b7d-304d-e9a930777e38/fullrender.png' },
          { id: 'pk-c2', name: 'Cobalt Blue', swatchHex: '#2563eb', accentHex: '#cbd5e1', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/34db39c7-43ca-9a00-58c5-68875eaee0a2/fullrender.png' },
        ],
        levels: [
          { level: 1, name: 'Karambit Curved Blade', description: 'Aerospace curved blade with spinning index ring' },
          { level: 2, name: 'Energy Edge VFX', description: 'Glow line along the razor sharp cutting edge' },
        ]
      },
      {
        id: 'melee-kuronami-no-yaiba',
        name: 'Kuronami no Yaiba',
        weaponName: 'Melee',
        weaponCategory: 'Melee',
        tier: 'Exclusive',
        tierColor: '#ff4655',
        costVp: 5350,
        theme: 'Kuronami',
        soundProfile: 'elemental',
        hasFinisher: false,
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/fb6c5e63-4700-1c05-b026-66a9ba86556e/fullrender.png',
        chromas: [
          { id: 'kny-c1', name: 'Ocean Mist', swatchHex: '#38bdf8', accentHex: '#0f172a', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/fb6c5e63-4700-1c05-b026-66a9ba86556e/fullrender.png' },
          { id: 'kny-c2', name: 'Crimson Blood', swatchHex: '#e11d48', accentHex: '#000000', displayIcon: 'https://media.valorant-api.com/weaponskinchromas/cf534b8c-4bc3-95ca-9a1d-a388f8d22df6/fullrender.png' },
        ],
        levels: [
          { level: 1, name: 'Twin Kusarigama Knives', description: 'Chained dual ninja daggers' },
          { level: 2, name: 'Water Chain Spin VFX', description: 'Swirling water chain whirlwind inspect' },
        ]
      }
    ]
  }
];
