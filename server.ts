import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

app.use(express.json());

interface PlayerState {
  id: string;
  name: string;
  team: 'attackers' | 'defenders';
  agent: string;
  skinId: string;
  x: number;
  y: number;
  angle: number;
  hp: number;
  maxHp: number;
  shield: number;
  credits: number;
  weapon: string;
  ammo: number;
  isAlive: boolean;
  isBot: boolean;
  kills: number;
  deaths: number;
  isPlanting: boolean;
  isDefusing: boolean;
  isCrouching?: boolean;
  isJumping?: boolean;
}

interface Bullet {
  id: string;
  shooterId: string;
  team: 'attackers' | 'defenders';
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  life: number;
}

interface MapWall {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Teleporter {
  id: string;
  entry: { x: number; y: number; r: number };
  exit: { x: number; y: number; angle: number };
}

interface GameRoom {
  id: string;
  mapId: 'ascent' | 'bind' | 'haven';
  mode: 'competitive' | 'deathmatch' | 'spikerush';
  round: number;
  roundPhase: 'buy' | 'action' | 'round_end' | 'game_over';
  phaseTimer: number;
  score: { attackers: number; defenders: number };
  spike: {
    status: 'idle' | 'carried' | 'planting' | 'planted' | 'defusing' | 'defused';
    carrierId: string | null;
    x: number;
    y: number;
    timer: number;
    site: 'A' | 'B' | 'C' | null;
  };
  players: Record<string, PlayerState>;
  bullets: Bullet[];
  killFeed: { id: string; killerName: string; victimName: string; weapon: string; headshot: boolean; time: number }[];
  walls: MapWall[];
  teleporters: Teleporter[];
}

const MAP_PRESETS: Record<'ascent' | 'bind' | 'haven', { walls: MapWall[]; teleporters: Teleporter[] }> = {
  ascent: {
    walls: [
      // Perimeter
      { x: 0, y: 0, w: 1200, h: 20 },
      { x: 0, y: 780, w: 1200, h: 20 },
      { x: 0, y: 0, w: 20, h: 800 },
      { x: 1180, y: 0, w: 20, h: 800 },
      // Mid Courtyard & Catwalk
      { x: 540, y: 260, w: 120, h: 260 },
      { x: 380, y: 220, w: 30, h: 180 },
      { x: 790, y: 400, w: 30, h: 180 },
      // Site A Structures
      { x: 180, y: 160, w: 160, h: 40 },
      { x: 200, y: 320, w: 40, h: 160 },
      // Site B Structures
      { x: 860, y: 480, w: 160, h: 40 },
      { x: 960, y: 320, w: 40, h: 160 },
    ],
    teleporters: []
  },
  bind: {
    walls: [
      // Perimeter
      { x: 0, y: 0, w: 1200, h: 20 },
      { x: 0, y: 780, w: 1200, h: 20 },
      { x: 0, y: 0, w: 20, h: 800 },
      { x: 1180, y: 0, w: 20, h: 800 },
      // Mid & Hookah
      { x: 500, y: 320, w: 200, h: 160 },
      { x: 340, y: 180, w: 40, h: 140 },
      { x: 820, y: 460, w: 40, h: 140 },
      // Showers (A-Short)
      { x: 220, y: 180, w: 140, h: 30 },
      // B-Long
      { x: 840, y: 320, w: 140, h: 30 },
    ],
    teleporters: [
      // Teleporter 1: A-Short to B-Lobby
      {
        id: 'tele-a',
        entry: { x: 350, y: 280, r: 24 },
        exit: { x: 900, y: 680, angle: -Math.PI / 2 }
      },
      // Teleporter 2: B-Long to A-Lobby
      {
        id: 'tele-b',
        entry: { x: 850, y: 280, r: 24 },
        exit: { x: 250, y: 680, angle: -Math.PI / 2 }
      }
    ]
  },
  haven: {
    walls: [
      // Perimeter
      { x: 0, y: 0, w: 1200, h: 20 },
      { x: 0, y: 780, w: 1200, h: 20 },
      { x: 0, y: 0, w: 20, h: 800 },
      { x: 1180, y: 0, w: 20, h: 800 },
      // 3 Sites: A (left), B (mid), C (right)
      { x: 200, y: 240, w: 40, h: 180 }, // Site A divider
      { x: 560, y: 220, w: 80, h: 120 }, // Site B temple
      { x: 960, y: 240, w: 40, h: 180 }, // Site C garage
      // Mid doors
      { x: 420, y: 440, w: 140, h: 30 },
      { x: 640, y: 440, w: 140, h: 30 },
    ],
    teleporters: []
  }
};

const rooms: Record<string, GameRoom> = {};

function createRoom(roomId: string, mapId: 'ascent' | 'bind' | 'haven' = 'ascent', mode: 'competitive' | 'deathmatch' | 'spikerush' = 'competitive'): GameRoom {
  const mapPreset = MAP_PRESETS[mapId] || MAP_PRESETS.ascent;
  return {
    id: roomId,
    mapId,
    mode,
    round: 1,
    roundPhase: 'buy',
    phaseTimer: 10,
    score: { attackers: 0, defenders: 0 },
    spike: {
      status: 'idle',
      carrierId: null,
      x: 180,
      y: 700,
      timer: 45,
      site: null,
    },
    players: {},
    bullets: [],
    killFeed: [],
    walls: mapPreset.walls,
    teleporters: mapPreset.teleporters,
  };
}

const DEFAULT_ROOM_ID = 'match-5v5';
rooms[DEFAULT_ROOM_ID] = createRoom(DEFAULT_ROOM_ID, 'ascent', 'competitive');

// Bot agents and loadouts for 5v5
const BOT_ROSTER = [
  { name: 'Jett (AI)', agent: 'Jett', weapon: 'Vandal', skinId: 'vandal-prime' },
  { name: 'Phoenix (AI)', agent: 'Phoenix', weapon: 'Phantom', skinId: 'vandal-champions-2026' },
  { name: 'Chamber (AI)', agent: 'Chamber', weapon: 'Sheriff', skinId: 'sheriff-neo-frontier' },
  { name: 'Reyna (AI)', agent: 'Reyna', weapon: 'Vandal', skinId: 'vandal-reaver' },
  { name: 'Sage (AI)', agent: 'Sage', weapon: 'Vandal', skinId: 'vandal-prime' },
  { name: 'Omen (AI)', agent: 'Omen', weapon: 'Phantom', skinId: 'vandal-reaver' },
  { name: 'Sova (AI)', agent: 'Sova', weapon: 'Operator', skinId: 'op-reaver' },
  { name: 'Raze (AI)', agent: 'Raze', weapon: 'Judge', skinId: 'sheriff-neo-frontier' },
  { name: 'Cypher (AI)', agent: 'Cypher', weapon: 'Guardian', skinId: 'vandal-champions-2026' },
  { name: 'Killjoy (AI)', agent: 'Killjoy', weapon: 'Spectre', skinId: 'vandal-prime' },
];

// Fill 5v5 bots
function fillBots(room: GameRoom) {
  const currentAttackers = Object.values(room.players).filter(p => p.team === 'attackers');
  const currentDefenders = Object.values(room.players).filter(p => p.team === 'defenders');

  // Fill up to 5 Attackers
  while (currentAttackers.length < 5) {
    const idx = currentAttackers.length;
    const botDef = BOT_ROSTER[idx % BOT_ROSTER.length];
    const id = `bot-atk-${Date.now()}-${idx}-${Math.random()}`;
    const bot: PlayerState = {
      id,
      name: botDef.name,
      team: 'attackers',
      agent: botDef.agent,
      skinId: botDef.skinId,
      x: 80 + idx * 60,
      y: 710,
      angle: -Math.PI / 2,
      hp: 100,
      maxHp: 100,
      shield: 50,
      credits: 3000,
      weapon: botDef.weapon,
      ammo: 25,
      isAlive: true,
      isBot: true,
      kills: 0,
      deaths: 0,
      isPlanting: false,
      isDefusing: false,
    };
    room.players[id] = bot;
    currentAttackers.push(bot);
  }

  // Fill up to 5 Defenders
  while (currentDefenders.length < 5) {
    const idx = currentDefenders.length;
    const botDef = BOT_ROSTER[(idx + 5) % BOT_ROSTER.length];
    const id = `bot-def-${Date.now()}-${idx}-${Math.random()}`;
    const bot: PlayerState = {
      id,
      name: botDef.name,
      team: 'defenders',
      agent: botDef.agent,
      skinId: botDef.skinId,
      x: 1020 - idx * 60,
      y: 90,
      angle: Math.PI / 2,
      hp: 100,
      maxHp: 100,
      shield: 50,
      credits: 3000,
      weapon: botDef.weapon,
      ammo: 25,
      isAlive: true,
      isBot: true,
      kills: 0,
      deaths: 0,
      isPlanting: false,
      isDefusing: false,
    };
    room.players[id] = bot;
    currentDefenders.push(bot);
  }
}

fillBots(rooms[DEFAULT_ROOM_ID]);

function collidesWithWalls(x: number, y: number, walls: MapWall[], radius: number = 16): boolean {
  for (const w of walls) {
    if (
      x + radius > w.x &&
      x - radius < w.x + w.w &&
      y + radius > w.y &&
      y - radius < w.y + w.h
    ) {
      return true;
    }
  }
  return false;
}

// Bot AI update loop
function updateBots(room: GameRoom) {
  if (room.roundPhase !== 'action') return;

  const players = Object.values(room.players);
  const aliveEnemies = (team: 'attackers' | 'defenders') =>
    players.filter(p => p.isAlive && (room.mode === 'deathmatch' ? p.id !== team : p.team !== team));

  players.filter(p => p.isBot && p.isAlive).forEach(bot => {
    const enemies = aliveEnemies(bot.team);
    if (enemies.length === 0) return;

    let closestEnemy: PlayerState | null = null;
    let minDist = 999999;
    enemies.forEach(e => {
      const d = Math.hypot(e.x - bot.x, e.y - bot.y);
      if (d < minDist) {
        minDist = d;
        closestEnemy = e;
      }
    });

    if (closestEnemy) {
      const targetAngle = Math.atan2((closestEnemy as PlayerState).y - bot.y, (closestEnemy as PlayerState).x - bot.x);
      bot.angle = targetAngle;

      const speed = 2.4;
      const targetDist = 260;
      let moveDir = 1;
      if (minDist < targetDist) moveDir = -0.5;
      else if (minDist > targetDist + 120) moveDir = 1;

      const nextX = bot.x + Math.cos(targetAngle) * speed * moveDir;
      const nextY = bot.y + Math.sin(targetAngle) * speed * moveDir;

      if (!collidesWithWalls(nextX, nextY, room.walls, 16)) {
        bot.x = nextX;
        bot.y = nextY;
      }

      // Check teleporters in Bind
      if (room.teleporters && room.teleporters.length > 0) {
        room.teleporters.forEach(tp => {
          const distToTele = Math.hypot(bot.x - tp.entry.x, bot.y - tp.entry.y);
          if (distToTele < tp.entry.r) {
            bot.x = tp.exit.x;
            bot.y = tp.exit.y;
            bot.angle = tp.exit.angle;
          }
        });
      }

      // Shoot
      if (minDist < 520 && Math.random() < 0.06 && bot.ammo > 0) {
        bot.ammo--;
        const spread = (Math.random() - 0.5) * 0.12;
        const shotAngle = bot.angle + spread;
        room.bullets.push({
          id: `bullet-${Date.now()}-${Math.random()}`,
          shooterId: bot.id,
          team: bot.team,
          x: bot.x + Math.cos(shotAngle) * 20,
          y: bot.y + Math.sin(shotAngle) * 20,
          vx: Math.cos(shotAngle) * 19,
          vy: Math.sin(shotAngle) * 19,
          damage: 38,
          life: 42,
        });
      }
    }
  });
}

function startNextRound(room: GameRoom) {
  room.round++;
  room.roundPhase = 'buy';
  room.phaseTimer = 8;
  room.bullets = [];
  room.spike = {
    status: 'idle',
    carrierId: null,
    x: 200,
    y: 700,
    timer: 45,
    site: null,
  };

  const attackers = Object.values(room.players).filter(p => p.team === 'attackers');
  const defenders = Object.values(room.players).filter(p => p.team === 'defenders');

  attackers.forEach((p, i) => {
    p.hp = 100;
    p.shield = 50;
    p.ammo = 25;
    p.isAlive = true;
    p.isPlanting = false;
    p.isDefusing = false;
    p.x = 80 + i * 65;
    p.y = 710;
    p.angle = -Math.PI / 2;
  });

  defenders.forEach((p, i) => {
    p.hp = 100;
    p.shield = 50;
    p.ammo = 25;
    p.isAlive = true;
    p.isPlanting = false;
    p.isDefusing = false;
    p.x = 1020 - i * 65;
    p.y = 90;
    p.angle = Math.PI / 2;
  });
}

// Tick loop (30Hz)
setInterval(() => {
  const room = rooms[DEFAULT_ROOM_ID];
  if (!room) return;

  if (room.roundPhase === 'buy') {
    room.phaseTimer -= 1 / 30;
    if (room.phaseTimer <= 0) {
      room.roundPhase = 'action';
      room.phaseTimer = 100;
    }
  } else if (room.roundPhase === 'action') {
    room.phaseTimer -= 1 / 30;

    if (room.spike.status === 'planted' || room.spike.status === 'defusing') {
      room.spike.timer -= 1 / 30;
      if (room.spike.timer <= 0) {
        room.score.attackers++;
        room.roundPhase = 'round_end';
        room.phaseTimer = 5;
      }
    } else if (room.phaseTimer <= 0) {
      room.score.defenders++;
      room.roundPhase = 'round_end';
      room.phaseTimer = 5;
    }

    // Bullets update
    for (let i = room.bullets.length - 1; i >= 0; i--) {
      const b = room.bullets[i];
      b.x += b.vx;
      b.y += b.vy;
      b.life--;

      if (b.life <= 0 || collidesWithWalls(b.x, b.y, room.walls, 4)) {
        room.bullets.splice(i, 1);
        continue;
      }

      let hit = false;
      for (const p of Object.values(room.players)) {
        if (!p.isAlive || p.team === b.team) continue;
        const dist = Math.hypot(p.x - b.x, p.y - b.y);
        if (dist < 18) {
          hit = true;
          const isHeadshot = Math.random() < 0.28;
          const totalDmg = isHeadshot ? 160 : b.damage;

          if (p.shield > 0) {
            const absorb = Math.min(p.shield, totalDmg);
            p.shield -= absorb;
            p.hp -= (totalDmg - absorb);
          } else {
            p.hp -= totalDmg;
          }

          if (p.hp <= 0) {
            p.hp = 0;
            p.isAlive = false;
            p.deaths++;
            const killer = room.players[b.shooterId];
            if (killer) killer.kills++;

            room.killFeed.unshift({
              id: `kill-${Date.now()}-${Math.random()}`,
              killerName: killer ? killer.name : 'Unknown',
              victimName: p.name,
              weapon: killer ? killer.weapon : 'Vandal',
              headshot: isHeadshot,
              time: Date.now(),
            });
            if (room.killFeed.length > 6) room.killFeed.pop();

            // Deathmatch instant respawn
            if (room.mode === 'deathmatch') {
              setTimeout(() => {
                if (room.players[p.id]) {
                  p.hp = 100;
                  p.shield = 50;
                  p.isAlive = true;
                  p.x = 200 + Math.random() * 800;
                  p.y = 150 + Math.random() * 500;
                }
              }, 2500);
            }
          }
          break;
        }
      }

      if (hit) {
        room.bullets.splice(i, 1);
      }
    }

    // Check round victory
    if (room.mode !== 'deathmatch') {
      const aliveAttackers = Object.values(room.players).filter(p => p.team === 'attackers' && p.isAlive).length;
      const aliveDefenders = Object.values(room.players).filter(p => p.team === 'defenders' && p.isAlive).length;

      if (aliveAttackers === 0 && room.spike.status !== 'planted') {
        room.score.defenders++;
        room.roundPhase = 'round_end';
        room.phaseTimer = 5;
      } else if (aliveDefenders === 0 && room.spike.status !== 'defused') {
        room.score.attackers++;
        room.roundPhase = 'round_end';
        room.phaseTimer = 5;
      }
    }

    updateBots(room);

  } else if (room.roundPhase === 'round_end') {
    room.phaseTimer -= 1 / 30;
    if (room.phaseTimer <= 0) {
      const winTarget = room.mode === 'spikerush' ? 4 : 5;
      if (room.score.attackers >= winTarget || room.score.defenders >= winTarget) {
        room.roundPhase = 'game_over';
        room.phaseTimer = 12;
      } else {
        startNextRound(room);
      }
    }
  } else if (room.roundPhase === 'game_over') {
    room.phaseTimer -= 1 / 30;
    if (room.phaseTimer <= 0) {
      room.round = 1;
      room.score = { attackers: 0, defenders: 0 };
      startNextRound(room);
    }
  }

  // Broadcast state
  const statePayload = JSON.stringify({
    type: 'sync',
    room: {
      id: room.id,
      mapId: room.mapId,
      mode: room.mode,
      round: room.round,
      roundPhase: room.roundPhase,
      phaseTimer: Math.ceil(room.phaseTimer),
      score: room.score,
      spike: room.spike,
      players: room.players,
      bullets: room.bullets,
      killFeed: room.killFeed,
      walls: room.walls,
      teleporters: room.teleporters,
    }
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(statePayload);
    }
  });
}, 1000 / 30);

// WebSocket handling
wss.on('connection', (ws) => {
  let boundPlayerId: string | null = null;
  const room = rooms[DEFAULT_ROOM_ID];

  ws.on('message', (msgStr) => {
    try {
      const msg = JSON.parse(msgStr.toString());

      if (msg.type === 'join') {
        const { name, team, agent, skinId, mapId, mode } = msg;

        // Change map or mode if requested
        if (mapId && MAP_PRESETS[mapId as 'ascent' | 'bind' | 'haven']) {
          room.mapId = mapId;
          const p = MAP_PRESETS[mapId as 'ascent' | 'bind' | 'haven'];
          room.walls = p.walls;
          room.teleporters = p.teleporters;
        }
        if (mode && (mode === 'competitive' || mode === 'deathmatch' || mode === 'spikerush')) {
          room.mode = mode;
        }

        boundPlayerId = `player-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const chosenTeam = (team === 'defenders' ? 'defenders' : 'attackers') as 'attackers' | 'defenders';
        const botToReplace = Object.values(room.players).find(p => p.isBot && p.team === chosenTeam);

        const newPlayer: PlayerState = {
          id: boundPlayerId,
          name: name || 'Agent',
          team: chosenTeam,
          agent: agent || 'Jett',
          skinId: skinId || 'vandal-champions-2026',
          x: chosenTeam === 'attackers' ? 140 : 1000,
          y: chosenTeam === 'attackers' ? 710 : 90,
          angle: chosenTeam === 'attackers' ? -Math.PI / 2 : Math.PI / 2,
          hp: 100,
          maxHp: 100,
          shield: 50,
          credits: 3000,
          weapon: 'Vandal',
          ammo: 25,
          isAlive: true,
          isBot: false,
          kills: 0,
          deaths: 0,
          isPlanting: false,
          isDefusing: false,
        };

        if (botToReplace) {
          delete room.players[botToReplace.id];
        }

        room.players[boundPlayerId] = newPlayer;

        ws.send(JSON.stringify({
          type: 'joined',
          playerId: boundPlayerId,
          walls: room.walls,
          teleporters: room.teleporters,
        }));
      }

      if (msg.type === 'input' && boundPlayerId && room.players[boundPlayerId]) {
        const p = room.players[boundPlayerId];
        if (!p.isAlive) return;

        const { dx, dy, angle, isShooting, isPlanting, isDefusing, isCrouching, isJumping } = msg;

        if (typeof angle === 'number') {
          p.angle = angle;
        }

        if (typeof isCrouching === 'boolean') {
          p.isCrouching = isCrouching;
        }
        if (typeof isJumping === 'boolean') {
          p.isJumping = isJumping;
        }

        if (dx || dy) {
          // 50% movement speed when crouching (stealth walk)
          const speed = p.isCrouching ? 2.0 : 3.8;
          const nextX = p.x + (dx || 0) * speed;
          const nextY = p.y + (dy || 0) * speed;
          const hitRadius = p.isCrouching ? 11 : 16;

          if (!collidesWithWalls(nextX, p.y, room.walls, hitRadius)) p.x = nextX;
          if (!collidesWithWalls(p.x, nextY, room.walls, hitRadius)) p.y = nextY;

          // Check teleporters
          if (room.teleporters && room.teleporters.length > 0) {
            room.teleporters.forEach(tp => {
              const distToTele = Math.hypot(p.x - tp.entry.x, p.y - tp.entry.y);
              if (distToTele < tp.entry.r) {
                p.x = tp.exit.x;
                p.y = tp.exit.y;
                p.angle = tp.exit.angle;
              }
            });
          }
        }

        if (isShooting && p.ammo > 0 && room.roundPhase === 'action') {
          p.ammo--;
          // Crouch significantly improves spray accuracy; jumping severely penalizes accuracy
          const spreadFactor = p.isCrouching ? 0.025 : p.isJumping ? 0.22 : 0.08;
          const spread = (Math.random() - 0.5) * spreadFactor;
          const shotAngle = p.angle + spread;

          room.bullets.push({
            id: `bullet-${Date.now()}-${Math.random()}`,
            shooterId: p.id,
            team: p.team,
            x: p.x + Math.cos(shotAngle) * 22,
            y: p.y + Math.sin(shotAngle) * 22,
            vx: Math.cos(shotAngle) * 23,
            vy: Math.sin(shotAngle) * 23,
            damage: 40,
            life: 45,
          });
        }

        // Spike plant / defuse
        if (isPlanting && p.team === 'attackers' && room.spike.status !== 'planted') {
          const distA = Math.hypot(p.x - 220, p.y - 250);
          const distB = Math.hypot(p.x - 900, p.y - 450);
          const distC = Math.hypot(p.x - 560, p.y - 250);

          if (distA < 120) {
            room.spike.status = 'planted';
            room.spike.x = p.x;
            room.spike.y = p.y;
            room.spike.timer = 45;
            room.spike.site = 'A';
          } else if (distB < 120) {
            room.spike.status = 'planted';
            room.spike.x = p.x;
            room.spike.y = p.y;
            room.spike.timer = 45;
            room.spike.site = 'B';
          } else if (room.mapId === 'haven' && distC < 120) {
            room.spike.status = 'planted';
            room.spike.x = p.x;
            room.spike.y = p.y;
            room.spike.timer = 45;
            room.spike.site = 'C';
          }
        }

        if (isDefusing && p.team === 'defenders' && room.spike.status === 'planted') {
          const distSpike = Math.hypot(p.x - room.spike.x, p.y - room.spike.y);
          if (distSpike < 65) {
            room.spike.status = 'defused';
            room.score.defenders++;
            room.roundPhase = 'round_end';
            room.phaseTimer = 5;
          }
        }
      }

      if (msg.type === 'buy' && boundPlayerId && room.players[boundPlayerId]) {
        const p = room.players[boundPlayerId];
        const { item, cost } = msg;
        if (p.credits >= cost && room.roundPhase === 'buy') {
          p.credits -= cost;
          p.weapon = item;
          if (item === 'Operator') p.ammo = 5;
          else if (item === 'Sheriff') p.ammo = 6;
          else if (item === 'Heavy Armor') p.shield = 50;
          else if (item === 'Judge') p.ammo = 7;
          else if (item === 'Spectre') p.ammo = 30;
          else if (item === 'Odin') p.ammo = 100;
          else p.ammo = 25;
        }
      }

      if (msg.type === 'ability' && boundPlayerId && room.players[boundPlayerId]) {
        const p = room.players[boundPlayerId];
        if (!p.isAlive) return;
        const { abilityKey, agent } = msg;

        if (agent === 'Jett' && abilityKey === 'E') {
          // Tailwind Dash (dash 130px forward)
          const nx = p.x + Math.cos(p.angle) * 130;
          const ny = p.y + Math.sin(p.angle) * 130;
          if (!collidesWithWalls(nx, ny, room.walls, 16)) {
            p.x = nx;
            p.y = ny;
          }
        } else if (agent === 'Phoenix' && abilityKey === 'E') {
          // Hot Hands fireball heal
          p.hp = Math.min(100, p.hp + 30);
        } else if (agent === 'Sage' && abilityKey === 'E') {
          // Healing Orb
          p.hp = Math.min(100, p.hp + 45);
        } else if (agent === 'Chamber' && abilityKey === 'E') {
          // Chamber Rendezvous Teleport
          const tpX = p.team === 'attackers' ? 180 : 980;
          const tpY = p.team === 'attackers' ? 680 : 120;
          p.x = tpX;
          p.y = tpY;
        } else if (agent === 'Reyna' && abilityKey === 'E') {
          // Dismiss boost
          const nx = p.x + Math.cos(p.angle) * 90;
          const ny = p.y + Math.sin(p.angle) * 90;
          if (!collidesWithWalls(nx, ny, room.walls, 16)) {
            p.x = nx;
            p.y = ny;
          }
        }
      }
    } catch {
      // Ignore
    }
  });

  ws.on('close', () => {
    if (boundPlayerId && room.players[boundPlayerId]) {
      delete room.players[boundPlayerId];
      fillBots(room);
    }
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
