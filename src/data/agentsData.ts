export interface AgentAbility {
  key: 'C' | 'Q' | 'E' | 'X';
  name: string;
  type: 'Basic' | 'Signature' | 'Ultimate';
  description: string;
  charges: number;
  iconSymbol: string;
  cooldownSeconds?: number;
}

export interface AgentDefinition {
  id: string;
  name: string;
  role: 'Duelist' | 'Sentinel' | 'Controller' | 'Initiator';
  roleIcon: string;
  avatar: string;
  tagline: string;
  accentColor: string;
  voiceLine: string;
  abilities: AgentAbility[];
}

export const AGENTS_ROSTER: AgentDefinition[] = [
  {
    id: 'jett',
    name: 'Jett',
    role: 'Duelist',
    roleIcon: '🗡️',
    avatar: 'https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png',
    tagline: 'Wind agile duelist specialized in rapid evasion and precision dagger eliminations.',
    accentColor: '#38bdf8',
    voiceLine: 'Watch this!',
    abilities: [
      {
        key: 'C',
        name: 'Cloudburst',
        type: 'Basic',
        description: 'INSTANTLY throw a projectile that expands into a brief wind cloud on impact, blocking enemy line of sight.',
        charges: 2,
        iconSymbol: '💨',
      },
      {
        key: 'Q',
        name: 'Updraft',
        type: 'Basic',
        description: 'INSTANTLY propel Jett high into the air, reaching elevated tactical vantage points.',
        charges: 1,
        iconSymbol: '🌪️',
      },
      {
        key: 'E',
        name: 'Tailwind',
        type: 'Signature',
        description: 'INSTANTLY dash forward in the direction Jett is moving. Grants immediate evasion from gunfire.',
        charges: 1,
        cooldownSeconds: 12,
        iconSymbol: '⚡',
      },
      {
        key: 'X',
        name: 'Blade Storm',
        type: 'Ultimate',
        description: 'EQUIP a set of 5 lethal throwing knives that deal 50 body / 150 headshot damage. Recharges all knives upon securing a kill.',
        charges: 1,
        iconSymbol: '🗡️',
      },
    ],
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    role: 'Duelist',
    roleIcon: '🔥',
    avatar: 'https://media.valorant-api.com/agents/eb9333ab-402b-c4e0-a4c8-346b8765e8e0/displayicon.png',
    tagline: 'Pyromancer igniting the battleground with curveball flashes, firewalls, and self-resurrection.',
    accentColor: '#f97316',
    voiceLine: "Joke's over, you're dead!",
    abilities: [
      {
        key: 'C',
        name: 'Blaze',
        type: 'Basic',
        description: 'EQUIP a flame wall. FIRE to create a line of fire that moves forward, creating a wall that blocks vision, damages enemies, and heals Phoenix.',
        charges: 1,
        iconSymbol: '🧱',
      },
      {
        key: 'Q',
        name: 'Curveball',
        type: 'Basic',
        description: 'EQUIP a flare orb that takes a curving path and detonates shortly after throwing, blinding all players who look at it.',
        charges: 2,
        iconSymbol: '✨',
      },
      {
        key: 'E',
        name: 'Hot Hands',
        type: 'Signature',
        description: 'EQUIP a fireball. FIRE to throw a fireball that explodes after a set amount of time or upon hitting the ground, creating a lingering fire zone that hurts enemies and heals Phoenix.',
        charges: 1,
        cooldownSeconds: 15,
        iconSymbol: '🔥',
      },
      {
        key: 'X',
        name: 'Run It Back',
        type: 'Ultimate',
        description: 'INSTANTLY mark Phoenix current location. If Phoenix dies during this ability, or when ability timer expires, he is reborn at marked location with full HP.',
        charges: 1,
        iconSymbol: '🦅',
      },
    ],
  },
  {
    id: 'chamber',
    name: 'Chamber',
    role: 'Sentinel',
    roleIcon: '🛡️',
    avatar: 'https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/displayicon.png',
    tagline: 'French weapons designer armed with custom high-caliber sidearms and teleport anchors.',
    accentColor: '#eab308',
    voiceLine: 'You want to play, let’s play.',
    abilities: [
      {
        key: 'C',
        name: 'Trademark',
        type: 'Basic',
        description: 'PLACE a trap that scans for enemies. When a visible enemy comes in range, the trap counts down and then destabilizes the terrain around them, creating a lingering slow field.',
        charges: 1,
        iconSymbol: '📍',
      },
      {
        key: 'Q',
        name: 'Headhunter',
        type: 'Basic',
        description: 'EQUIP a heavy custom pistol. ALT FIRE with the pistol equipped to aim down sights for pinpoint surgical headshots (159 headshot damage).',
        charges: 8,
        iconSymbol: '🎯',
      },
      {
        key: 'E',
        name: 'Rendezvous',
        type: 'Signature',
        description: 'PLACE a teleport anchor beacon on the ground. While in range on the ground, ACTIVATE to instantly teleport back to the anchor location.',
        charges: 1,
        cooldownSeconds: 10,
        iconSymbol: '📡',
      },
      {
        key: 'X',
        name: 'Tour de Force',
        type: 'Ultimate',
        description: 'EQUIP a powerful, custom sniper rifle that will eliminate an enemy with any direct hit. Eliminating an enemy creates a lingering slow field around them.',
        charges: 5,
        iconSymbol: '👑',
      },
    ],
  },
  {
    id: 'reyna',
    name: 'Reyna',
    role: 'Duelist',
    roleIcon: '💜',
    avatar: 'https://media.valorant-api.com/agents/a3bfb854-434b-1423-4d63-da97acaf3b2f/displayicon.png',
    tagline: 'Forged in Mexico, Reyna dominates single combat, popping off with each kill she scores.',
    accentColor: '#c084fc',
    voiceLine: 'They will cower!',
    abilities: [
      {
        key: 'C',
        name: 'Leer',
        type: 'Basic',
        description: 'EQUIP an ethereal, destructible eye. Cast the eye forward a short distance. The eye nearsights all enemies who look at it.',
        charges: 2,
        iconSymbol: '👁️',
      },
      {
        key: 'Q',
        name: 'Devour',
        type: 'Basic',
        description: 'Harvest Soul Orb from eliminated enemies to rapidly heal 100 HP, over-healing into bonus shields.',
        charges: 2,
        iconSymbol: '🩸',
      },
      {
        key: 'E',
        name: 'Dismiss',
        type: 'Signature',
        description: 'Instantly consume a nearby soul orb, becoming intangible for a short duration with extreme movement speed.',
        charges: 2,
        iconSymbol: '👻',
      },
      {
        key: 'X',
        name: 'Empress',
        type: 'Ultimate',
        description: 'INSTANTLY enter a frenzy, dramatically increasing firing speed, equip speed, and reload speed, granting infinite charges of soul abilities.',
        charges: 1,
        iconSymbol: '👑',
      },
    ],
  },
  {
    id: 'sage',
    name: 'Sage',
    role: 'Sentinel',
    roleIcon: '💠',
    avatar: 'https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/displayicon.png',
    tagline: 'Chinese monk providing calm bastion with healing orbs, jade barrier walls, and resurrection.',
    accentColor: '#34d399',
    voiceLine: 'I am both shield and sword.',
    abilities: [
      {
        key: 'C',
        name: 'Barrier Orb',
        type: 'Basic',
        description: 'EQUIP a jade barrier orb. FIRE places a solid jade wall blocking corridors and chokepoints.',
        charges: 1,
        iconSymbol: '🧊',
      },
      {
        key: 'Q',
        name: 'Slow Orb',
        type: 'Basic',
        description: 'EQUIP a slowing orb. FIRE to throw a slowing orb that bursts on impact, slowing all who move through it.',
        charges: 2,
        iconSymbol: '❄️',
      },
      {
        key: 'E',
        name: 'Healing Orb',
        type: 'Signature',
        description: 'EQUIP a healing orb. FIRE with crosshairs over an ally or ALT FIRE to heal Sage for up to 60 HP.',
        charges: 1,
        cooldownSeconds: 20,
        iconSymbol: '💚',
      },
      {
        key: 'X',
        name: 'Resurrection',
        type: 'Ultimate',
        description: 'EQUIP a resurrection ability. FIRE with crosshairs over a fallen friendly corpse to begin reviving them with full health.',
        charges: 1,
        iconSymbol: '✨',
      },
    ],
  },
  {
    id: 'omen',
    name: 'Omen',
    role: 'Controller',
    roleIcon: '🌌',
    avatar: 'https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png',
    tagline: 'Phantom of a memory, hunts in the shadows with blind paranoia and global hollow smokes.',
    accentColor: '#818cf8',
    voiceLine: 'Scatter!',
    abilities: [
      {
        key: 'C',
        name: 'Shrouded Step',
        type: 'Basic',
        description: 'EQUIP a shadow walk ability and see its range indicator. FIRE to begin a brief channel, then teleport to the marked location.',
        charges: 2,
        iconSymbol: '👣',
      },
      {
        key: 'Q',
        name: 'Paranoia',
        type: 'Basic',
        description: 'INSTANTLY fire a shadow projectile forward, briefly reducing the vision range and deafening all players it touches through walls.',
        charges: 1,
        iconSymbol: '🌑',
      },
      {
        key: 'E',
        name: 'Dark Cover',
        type: 'Signature',
        description: 'EQUIP a shadow orb, entering a phased world to place long-lasting hollow smoke spheres that block vision.',
        charges: 2,
        cooldownSeconds: 25,
        iconSymbol: '☁️',
      },
      {
        key: 'X',
        name: 'From the Shadows',
        type: 'Ultimate',
        description: 'EQUIP a tactical map. FIRE to teleport to any chosen map location as a shadow Shade, gathering intel or flanking.',
        charges: 1,
        iconSymbol: '🌌',
      },
    ],
  },
];
