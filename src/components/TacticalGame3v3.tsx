import React, { useEffect, useRef, useState, useCallback } from 'react';
import { soundManager } from '../utils/audio';
import { WeaponSkin, UserRank, GameMapId, GameModeId } from '../types/valorant';
import { RankBadge } from './RankBadge';
import { RankProgressionChart } from './RankProgressionChart';
import { AgentSelector } from './AgentSelector';
import { AGENTS_ROSTER, AgentDefinition } from '../data/agentsData';
import { recordMatchResult, INITIAL_USER_RANK } from '../data/rankData';
import { Crosshair, Shield, ShoppingCart, Users, Trophy, MapPin, Zap, Flame, Wind } from 'lucide-react';

interface TacticalGameProps {
  equippedSkin: WeaponSkin | null;
  userRank: UserRank;
  onUpdateRank: (newRank: UserRank) => void;
  onExitGame: () => void;
}

interface ServerPlayer {
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
  isCrouching?: boolean;
  isJumping?: boolean;
}

interface ServerBullet {
  id: string;
  x: number;
  y: number;
  team: 'attackers' | 'defenders';
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

interface GameRoomState {
  id: string;
  mapId: GameMapId;
  mode: GameModeId;
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
  players: Record<string, ServerPlayer>;
  bullets: ServerBullet[];
  killFeed: { id: string; killerName: string; victimName: string; weapon: string; headshot: boolean }[];
  walls: MapWall[];
  teleporters: Teleporter[];
}

export const TacticalGame3v3: React.FC<TacticalGameProps> = ({
  equippedSkin,
  userRank,
  onUpdateRank,
  onExitGame,
}) => {
  const [playerName, setPlayerName] = useState('Agent 1');
  const [selectedTeam, setSelectedTeam] = useState<'attackers' | 'defenders'>('attackers');
  const [selectedAgent, setSelectedAgent] = useState('Jett');
  const [selectedMap, setSelectedMap] = useState<GameMapId>('ascent');
  const [selectedMode, setSelectedMode] = useState<GameModeId>('competitive');
  const [isPlaying, setIsPlaying] = useState(false);
  const [, setIsConnected] = useState(false);
  const [isBuyMenuOpen, setIsBuyMenuOpen] = useState(false);
  const [abilityFeedback, setAbilityFeedback] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const myPlayerIdRef = useRef<string | null>(null);
  const roomStateRef = useRef<GameRoomState | null>(null);

  const keysPressed = useRef<Record<string, boolean>>({});
  const mousePos = useRef({ x: 0, y: 0 });
  const isMouseDown = useRef(false);

  // Active agent object with abilities
  const activeAgentDef = AGENTS_ROSTER.find(
    a => a.name.toLowerCase() === selectedAgent.toLowerCase()
  ) || AGENTS_ROSTER[0];

  // Ability Cooldown states
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  // Trigger agent ability
  const triggerAbility = useCallback((key: 'C' | 'Q' | 'E' | 'X') => {
    if (cooldowns[key] && cooldowns[key] > 0) return;

    soundManager.playEquip();

    // Show on-screen notification
    const ability = activeAgentDef.abilities.find(a => a.key === key);
    if (ability) {
      setAbilityFeedback(`${ability.name.toUpperCase()} ACTIVATED!`);
      setTimeout(() => setAbilityFeedback(null), 1800);
    }

    // Set cooldown
    setCooldowns(prev => ({ ...prev, [key]: 10 }));

    // Send to WebSocket server
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'ability',
        abilityKey: key,
        agent: activeAgentDef.name,
      }));
    }
  }, [cooldowns, activeAgentDef]);

  // Tick cooldowns down
  useEffect(() => {
    const cdInterval = setInterval(() => {
      setCooldowns(prev => {
        let changed = false;
        const next = { ...prev };
        Object.keys(next).forEach(k => {
          if (next[k] > 0) {
            next[k] -= 1;
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(cdInterval);
  }, []);

  // Connect to WebSocket server
  const connectToServer = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      ws.send(JSON.stringify({
        type: 'join',
        name: playerName,
        team: selectedTeam,
        agent: selectedAgent,
        skinId: equippedSkin?.id || 'vandal-champions-2026',
        mapId: selectedMap,
        mode: selectedMode,
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'joined') {
          myPlayerIdRef.current = data.playerId;
        } else if (data.type === 'sync') {
          roomStateRef.current = data.room;

          // Check if match concluded to award RR
          if (data.room.roundPhase === 'game_over' && myPlayerIdRef.current) {
            const myP = data.room.players[myPlayerIdRef.current];
            if (myP) {
              const won = (myP.team === 'attackers' && data.room.score.attackers > data.room.score.defenders) ||
                          (myP.team === 'defenders' && data.room.score.defenders > data.room.score.attackers);
              handleMatchEndRankUpdate(won);
            }
          }
        }
      } catch {
        // Ignore
      }
    };

    ws.onclose = () => setIsConnected(false);
    ws.onerror = () => setIsConnected(false);
  }, [playerName, selectedTeam, selectedAgent, equippedSkin, selectedMap, selectedMode]);

  // Handle Match Rank Adjustment using rankData helper
  const handleMatchEndRankUpdate = useCallback((won: boolean) => {
    const mapCapitalized = selectedMap === 'bind' ? 'Bind' : selectedMap === 'haven' ? 'Haven' : 'Ascent';
    const updated = recordMatchResult(userRank, won, mapCapitalized, selectedAgent);
    onUpdateRank(updated);
  }, [userRank, onUpdateRank, selectedMap, selectedAgent]);

  const handleStartGame = () => {
    soundManager.playEquip();
    setIsPlaying(true);
    connectToServer();
  };

  // Crouch and Jump state
  const isCrouchingRef = useRef(false);
  const [isCrouching, setIsCrouching] = useState(false);
  const isJumpingRef = useRef(false);
  const [isJumping, setIsJumping] = useState(false);
  const jumpZRef = useRef(0);

  // Keyboard & Mouse Listeners
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keysPressed.current[k] = true;

      // Jump action [Space]
      if (e.code === 'Space') {
        e.preventDefault();
        if (!isJumpingRef.current) {
          isJumpingRef.current = true;
          setIsJumping(true);
          soundManager.playJump();

          const startTime = performance.now();
          const jumpDuration = 380; // ms

          const stepJump = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / jumpDuration);
            // Parabolic jump arc: 4 * h * p * (1 - p)
            jumpZRef.current = Math.sin(progress * Math.PI) * 22;

            if (progress < 1) {
              requestAnimationFrame(stepJump);
            } else {
              jumpZRef.current = 0;
              isJumpingRef.current = false;
              setIsJumping(false);
              soundManager.playLand();
            }
          };
          requestAnimationFrame(stepJump);
        }
      }

      // Crouch hold [Control] or [C] if not holding ability
      if (e.key === 'Control') {
        isCrouchingRef.current = true;
        setIsCrouching(true);
      }

      // Buy menu
      if (k === 'b') {
        setIsBuyMenuOpen(prev => !prev);
      }

      // Abilities [C, Q, E, X]
      if (k === 'c') triggerAbility('C');
      if (k === 'q') triggerAbility('Q');
      if (k === 'e') triggerAbility('E');
      if (k === 'x') triggerAbility('X');
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keysPressed.current[k] = false;

      if (e.key === 'Control') {
        isCrouchingRef.current = false;
        setIsCrouching(false);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = canvasRef.current.width / rect.width;
      const scaleY = canvasRef.current.height / rect.height;
      mousePos.current = {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    };

    const handleMouseDownEvt = (e: MouseEvent) => {
      if (e.button === 0) isMouseDown.current = true;
    };

    const handleMouseUpEvt = (e: MouseEvent) => {
      if (e.button === 0) isMouseDown.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDownEvt);
    window.addEventListener('mouseup', handleMouseUpEvt);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDownEvt);
      window.removeEventListener('mouseup', handleMouseUpEvt);
      if (wsRef.current) wsRef.current.close();
    };
  }, [isPlaying, triggerAbility]);

  // Input transmission loop (30Hz)
  useEffect(() => {
    if (!isPlaying) return;

    const inputInterval = setInterval(() => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
      const myId = myPlayerIdRef.current;
      const room = roomStateRef.current;
      if (!myId || !room || !room.players[myId]) return;

      const myPlayer = room.players[myId];

      let dx = 0;
      let dy = 0;
      if (keysPressed.current['w']) dy -= 1;
      if (keysPressed.current['s']) dy += 1;
      if (keysPressed.current['a']) dx -= 1;
      if (keysPressed.current['d']) dx += 1;

      if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
      }

      const aimAngle = Math.atan2(mousePos.current.y - myPlayer.y, mousePos.current.x - myPlayer.x);
      const isPlanting = !!keysPressed.current['4'];
      const isDefusing = !!keysPressed.current['f'];

      wsRef.current.send(JSON.stringify({
        type: 'input',
        dx,
        dy,
        angle: aimAngle,
        isShooting: isMouseDown.current,
        isPlanting,
        isDefusing,
        isCrouching: isCrouchingRef.current,
        isJumping: isJumpingRef.current,
      }));

      if (isMouseDown.current && myPlayer.ammo > 0 && room.roundPhase === 'action') {
        soundManager.playGunshot(equippedSkin?.soundProfile || 'laser');
      }
    }, 1000 / 30);

    return () => clearInterval(inputInterval);
  }, [isPlaying, equippedSkin]);

  // Canvas Render Loop (60FPS)
  useEffect(() => {
    if (!isPlaying) return;
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const room = roomStateRef.current;

      // 1. Background
      ctx.fillStyle = '#0a0f16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Tactical Map Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 3. Draw Bomb Sites
      ctx.fillStyle = 'rgba(234, 179, 8, 0.08)';
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(220, 250, 110, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#eab308';
      ctx.font = 'bold 18px Chakra Petch, sans-serif';
      ctx.fillText('SITE A', 195, 255);

      ctx.fillStyle = 'rgba(234, 179, 8, 0.08)';
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.35)';
      ctx.beginPath();
      ctx.arc(900, 450, 110, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#eab308';
      ctx.fillText('SITE B', 875, 455);

      if (room?.mapId === 'haven') {
        ctx.fillStyle = 'rgba(234, 179, 8, 0.08)';
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.35)';
        ctx.beginPath();
        ctx.arc(560, 250, 90, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#eab308';
        ctx.fillText('SITE C', 535, 255);
      }

      // 4. Draw Teleporters (Bind)
      if (room?.teleporters && room.teleporters.length > 0) {
        room.teleporters.forEach(tp => {
          ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(tp.entry.x, tp.entry.y, tp.entry.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('PORTAL', tp.entry.x - 18, tp.entry.y + 3);

          ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
          ctx.strokeRect(tp.exit.x - 12, tp.exit.y - 12, 24, 24);
        });
      }

      // 5. Draw Walls
      const walls = room?.walls || [];
      ctx.fillStyle = '#17222e';
      ctx.strokeStyle = '#27384a';
      ctx.lineWidth = 2;
      walls.forEach(w => {
        ctx.fillRect(w.x, w.y, w.w, w.h);
        ctx.strokeRect(w.x, w.y, w.w, w.h);
      });

      // 6. Draw Spike
      if (room && room.spike) {
        if (room.spike.status === 'planted' || room.spike.status === 'defusing') {
          ctx.fillStyle = 'rgba(255, 70, 85, 0.25)';
          ctx.beginPath();
          ctx.arc(room.spike.x, room.spike.y, 45, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ff4655';
          ctx.beginPath();
          ctx.arc(room.spike.x, room.spike.y, 10, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px monospace';
          ctx.fillText(`SPIKE: ${Math.ceil(room.spike.timer)}s`, room.spike.x - 28, room.spike.y - 18);
        } else if (room.spike.status === 'idle') {
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(room.spike.x - 8, room.spike.y - 8, 16, 16);
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('SPK', room.spike.x - 7, room.spike.y + 4);
        }
      }

      // 7. Bullets
      if (room && room.bullets) {
        room.bullets.forEach(b => {
          ctx.fillStyle = b.team === 'attackers' ? '#ff4655' : '#06b6d4';
          ctx.beginPath();
          ctx.arc(b.x, b.y, 3.5, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 8. Players
      if (room && room.players) {
        const myId = myPlayerIdRef.current;
        Object.values(room.players).forEach(p => {
          if (!p.isAlive) {
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(p.x - 8, p.y - 8);
            ctx.lineTo(p.x + 8, p.y + 8);
            ctx.moveTo(p.x + 8, p.y - 8);
            ctx.lineTo(p.x - 8, p.y + 8);
            ctx.stroke();
            return;
          }

          const isMe = p.id === myId;
          const isCrouched = isMe ? isCrouchingRef.current : (p.isCrouching || false);
          const currentJumpZ = isMe ? jumpZRef.current : (p.isJumping ? 14 : 0);

          // If jumping: render dynamic ground shadow
          if (currentJumpZ > 0) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
            ctx.beginPath();
            ctx.ellipse(p.x, p.y + 4, Math.max(8, 16 - currentJumpZ * 0.3), Math.max(4, 9 - currentJumpZ * 0.15), 0, 0, Math.PI * 2);
            ctx.fill();
          }

          const renderY = p.y - currentJumpZ;
          const radius = isCrouched ? 11 : currentJumpZ > 0 ? 18 : 15;

          // Gun direction
          const barrelLen = isCrouched ? 20 : currentJumpZ > 0 ? 28 : 26;
          ctx.strokeStyle = isMe ? '#ffffff' : p.team === 'attackers' ? '#ff4655' : '#06b6d4';
          ctx.lineWidth = isCrouched ? 3 : 4;
          ctx.beginPath();
          ctx.moveTo(p.x, renderY);
          ctx.lineTo(p.x + Math.cos(p.angle) * barrelLen, renderY + Math.sin(p.angle) * barrelLen);
          ctx.stroke();

          // Body Circle
          ctx.fillStyle = p.team === 'attackers' ? '#e11d48' : '#0284c7';
          ctx.beginPath();
          ctx.arc(p.x, renderY, radius, 0, Math.PI * 2);
          ctx.fill();

          if (isMe) {
            ctx.strokeStyle = isCrouched ? '#10b981' : currentJumpZ > 0 ? '#38bdf8' : '#facc15';
            ctx.lineWidth = 3;
            ctx.stroke();
          } else {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          // Label with Agent & status
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px Chakra Petch, sans-serif';
          ctx.textAlign = 'center';
          const statusText = isCrouched ? ' [CROUCH]' : currentJumpZ > 0 ? ' [JUMP]' : '';
          ctx.fillText(`${p.name} (${p.agent})${statusText}`, p.x, renderY - 24);

          // Health bar
          const barW = 32;
          const barH = 4;
          const hpPercent = p.hp / p.maxHp;
          ctx.fillStyle = '#334155';
          ctx.fillRect(p.x - barW / 2, renderY - 20, barW, barH);
          ctx.fillStyle = hpPercent > 0.4 ? '#10b981' : '#ef4444';
          ctx.fillRect(p.x - barW / 2, renderY - 20, barW * hpPercent, barH);
        });
      }

      // Crosshair
      ctx.strokeStyle = '#ff4655';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(mousePos.current.x, mousePos.current.y, 6, 0, Math.PI * 2);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const myPlayer = (roomStateRef.current && myPlayerIdRef.current)
    ? roomStateRef.current.players[myPlayerIdRef.current]
    : null;

  const currentRoom = roomStateRef.current;

  const handleBuyItem = (item: string, cost: number) => {
    soundManager.playPurchase();
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'buy', item, cost }));
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {!isPlaying ? (
        /* 5v5 Match Lobby Screen with D3 Line Chart & Agent Roster */
        <div
          className="w-full max-w-5xl bg-[#0f151c] border border-white/10 p-5 sm:p-7 shadow-2xl text-white my-4 space-y-6"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))'
          }}
        >
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#ff4655] font-bold">
                  Tactical Arena · 5v5 Protocol
                </span>
                <span className="text-slate-500">·</span>
                <RankBadge rank={userRank} size="sm" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-wide">
                VALORANT 5v5 MATCH ARENA
              </h1>
            </div>

            <button
              type="button"
              onClick={onExitGame}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-mono uppercase cursor-pointer"
            >
              Back to Arsenal
            </button>
          </div>

          {/* Mode & Map Selection Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Game Mode */}
            <div className="md:col-span-6">
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Select Game Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMode('competitive')}
                  className={`py-2 px-2 text-xs font-bold uppercase border cursor-pointer ${
                    selectedMode === 'competitive'
                      ? 'bg-[#ff4655] border-[#ff4655] text-white'
                      : 'bg-black/30 border-white/10 text-slate-400'
                  }`}
                >
                  Competitive 5v5
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMode('deathmatch')}
                  className={`py-2 px-2 text-xs font-bold uppercase border cursor-pointer ${
                    selectedMode === 'deathmatch'
                      ? 'bg-[#ff4655] border-[#ff4655] text-white'
                      : 'bg-black/30 border-white/10 text-slate-400'
                  }`}
                >
                  Deathmatch (FFA)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMode('spikerush')}
                  className={`py-2 px-2 text-xs font-bold uppercase border cursor-pointer ${
                    selectedMode === 'spikerush'
                      ? 'bg-[#ff4655] border-[#ff4655] text-white'
                      : 'bg-black/30 border-white/10 text-slate-400'
                  }`}
                >
                  Spike Rush 5v5
                </button>
              </div>
            </div>

            {/* Map Selection */}
            <div className="md:col-span-6">
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1 flex items-center justify-between">
                <span>Select Map</span>
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMap('ascent')}
                  className={`p-2 text-left border cursor-pointer ${
                    selectedMap === 'ascent'
                      ? 'bg-white/15 border-amber-400 text-white'
                      : 'bg-black/30 border-white/10 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold">Ascent</div>
                  <div className="text-[10px] text-slate-500">Mid Courtyard</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMap('bind')}
                  className={`p-2 text-left border cursor-pointer ${
                    selectedMap === 'bind'
                      ? 'bg-white/15 border-cyan-400 text-white'
                      : 'bg-black/30 border-white/10 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold text-cyan-300">Bind</div>
                  <div className="text-[10px] text-slate-500">Teleporters!</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMap('haven')}
                  className={`p-2 text-left border cursor-pointer ${
                    selectedMap === 'haven'
                      ? 'bg-white/15 border-emerald-400 text-white'
                      : 'bg-black/30 border-white/10 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold text-emerald-300">Haven</div>
                  <div className="text-[10px] text-slate-500">3 Sites (A/B/C)</div>
                </button>
              </div>
            </div>
          </div>

          {/* D3 LINE CHART IN THE 'COMPETITIVE' SECTION */}
          {selectedMode === 'competitive' && (
            <div className="border border-white/10 bg-[#0e141c]">
              <RankProgressionChart
                userRank={userRank}
                onSimulateMatch={(won) => handleMatchEndRankUpdate(won)}
                onResetHistory={() => onUpdateRank(INITIAL_USER_RANK)}
              />
            </div>
          )}

          {/* AGENTS ROSTER WITH ABILITIES [Jett, Phoenix, Chamber, etc.] */}
          <AgentSelector
            selectedAgentId={selectedAgent}
            onSelectAgent={(name) => setSelectedAgent(name)}
          />

          {/* Player details & Start button */}
          <div className="bg-[#121922] border border-white/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                  Call-Sign
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="px-3 py-1.5 bg-[#141b24] border border-white/10 text-white font-mono text-xs focus:border-[#ff4655] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                  Team Side
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedTeam('attackers')}
                    className={`px-3 py-1.5 text-xs font-bold uppercase border cursor-pointer ${
                      selectedTeam === 'attackers'
                        ? 'bg-[#ff4655] border-[#ff4655] text-white'
                        : 'bg-black/30 border-white/10 text-slate-400'
                    }`}
                  >
                    Attackers
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTeam('defenders')}
                    className={`px-3 py-1.5 text-xs font-bold uppercase border cursor-pointer ${
                      selectedTeam === 'defenders'
                        ? 'bg-[#06b6d4] border-[#06b6d4] text-white'
                        : 'bg-black/30 border-white/10 text-slate-400'
                    }`}
                  >
                    Defenders
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartGame}
              className="w-full sm:w-auto px-8 py-3 bg-[#ff4655] hover:bg-[#e03b49] text-white font-bold font-display uppercase tracking-wider text-sm transition-colors cursor-pointer shadow-xl flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>START 5v5 MATCH (PLAY AS {selectedAgent.toUpperCase()})</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active 5v5 Viewport with Abilities HUD Bar */
        <div className="w-full max-w-6xl flex flex-col items-center">
          {/* Top HUD */}
          <div className="w-full bg-[#121922] border border-white/10 px-4 py-2 flex items-center justify-between font-mono text-xs shadow-lg">
            {/* Score */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#ff4655] uppercase">Attackers (5)</span>
                <span className="text-lg font-bold text-white tabular-nums">
                  {currentRoom?.score.attackers || 0}
                </span>
              </div>
              <span className="text-slate-500 font-bold">-</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white tabular-nums">
                  {currentRoom?.score.defenders || 0}
                </span>
                <span className="text-xs font-bold text-[#06b6d4] uppercase">Defenders (5)</span>
              </div>
            </div>

            {/* Timer & Map */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-[10px] text-slate-400 uppercase">
                  {currentRoom?.mapId.toUpperCase()} · {currentRoom?.mode.toUpperCase()}
                </div>
                <div className={`text-base font-bold tabular-nums ${
                  currentRoom?.spike.status === 'planted' ? 'text-[#ff4655] animate-pulse' : 'text-white'
                }`}>
                  {currentRoom?.spike.status === 'planted'
                    ? `⚠️ SPIKE: ${Math.ceil(currentRoom.spike.timer)}s`
                    : `${currentRoom?.phaseTimer || 0}s`}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsBuyMenuOpen(prev => !prev)}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-1 cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Buy [B]</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  if (wsRef.current) wsRef.current.close();
                }}
                className="px-2.5 py-1 bg-rose-950/40 border border-rose-500/40 text-rose-300 font-mono text-xs cursor-pointer"
              >
                Leave
              </button>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="relative border border-white/10 overflow-hidden shadow-2xl bg-black">
            <canvas
              ref={canvasRef}
              width={1200}
              height={800}
              className="w-full max-w-full h-auto cursor-crosshair block"
            />

            {/* Ability Activation Toast */}
            {abilityFeedback && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-[#ff4655] text-white px-4 py-1.5 font-mono text-xs font-bold tracking-widest shadow-2xl animate-in zoom-in-95 pointer-events-none">
                {abilityFeedback}
              </div>
            )}

            {/* KillFeed */}
            {currentRoom && currentRoom.killFeed.length > 0 && (
              <div className="absolute top-3 right-3 space-y-1 font-mono text-xs pointer-events-none">
                {currentRoom.killFeed.map((kf) => (
                  <div key={kf.id} className="bg-black/70 px-2 py-1 border border-white/10 flex items-center gap-1.5 text-[11px]">
                    <span className="text-white font-bold">{kf.killerName}</span>
                    <span className="text-slate-400">[{kf.weapon}]</span>
                    <span className="text-[#ff4655] font-bold">{kf.victimName}</span>
                    {kf.headshot && <span className="text-amber-400 font-bold">🎯</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Bottom In-Game HUD: Health, Shields, Weapon, and AGENT ABILITIES BAR [C] [Q] [E] [X] */}
            {myPlayer && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#0e141c]/95 border border-white/20 px-6 py-2 flex items-center gap-6 shadow-2xl font-mono">
                {/* Health & Shield */}
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-[10px] text-emerald-400 uppercase">HP</div>
                    <div className="text-xl font-bold text-white tabular-nums">{myPlayer.hp}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-cyan-400 uppercase">Shield</div>
                    <div className="text-xl font-bold text-cyan-300 tabular-nums">{myPlayer.shield}</div>
                  </div>
                </div>

                <div className="w-[1px] h-8 bg-white/10" />

                {/* 4 Agent Abilities [C] [Q] [E] [X] */}
                <div className="flex items-center gap-2">
                  {activeAgentDef.abilities.map((ab) => {
                    const isCooling = (cooldowns[ab.key] || 0) > 0;
                    return (
                      <button
                        key={ab.key}
                        type="button"
                        onClick={() => triggerAbility(ab.key)}
                        disabled={isCooling}
                        className={`w-11 h-12 border flex flex-col items-center justify-between p-1 transition-all relative ${
                          isCooling
                            ? 'bg-black/60 border-white/10 opacity-50'
                            : 'bg-black/40 border-white/20 hover:border-[#ff4655] cursor-pointer'
                        }`}
                      >
                        <span className="text-xs">{ab.iconSymbol}</span>
                        <span className="text-[9px] font-bold text-white truncate max-w-full">
                          {isCooling ? `${cooldowns[ab.key]}s` : ab.key}
                        </span>
                        <div className="absolute -top-1.5 -right-1 text-[8px] px-1 bg-[#ff4655] text-white font-bold">
                          {ab.key}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="w-[1px] h-8 bg-white/10" />

                {/* Weapon & Ammo */}
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">
                    {equippedSkin?.name || myPlayer.weapon}
                  </div>
                  <div className="text-xl font-bold text-white tabular-nums">
                    {myPlayer.ammo} <span className="text-xs text-slate-500 font-normal">/ 25</span>
                  </div>
                </div>

                <div className="w-[1px] h-8 bg-white/10" />

                {/* Stance: Crouch & Jump */}
                <div className="flex items-center gap-1.5 text-[10px]">
                  <div
                    className={`px-2 py-1 border transition-all ${
                      isCrouching
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 font-bold'
                        : 'bg-black/40 border-white/10 text-slate-400'
                    }`}
                  >
                    CROUCH [CTRL]
                  </div>
                  <div
                    className={`px-2 py-1 border transition-all ${
                      isJumping
                        ? 'bg-sky-950/80 border-sky-400 text-sky-300 font-bold'
                        : 'bg-black/40 border-white/10 text-slate-400'
                    }`}
                  >
                    JUMP [SPACE]
                  </div>
                </div>

                <div className="w-[1px] h-8 bg-white/10" />

                {/* Credits */}
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Creds</div>
                  <div className="text-base font-bold text-amber-300 tabular-nums">
                    {myPlayer.credits} ¤
                  </div>
                </div>
              </div>
            )}

            {/* Buy Menu */}
            {isBuyMenuOpen && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-30">
                <div className="bg-[#121922] border border-white/20 p-6 max-w-xl w-full text-white font-mono">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <h3 className="text-base font-bold font-display uppercase tracking-wide">
                      5v5 Buy Phase Arsenal
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsBuyMenuOpen(false)}
                      className="text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
                    >
                      Close [B]
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => handleBuyItem('Sheriff', 800)}
                      className="p-2.5 bg-black/40 border border-white/10 hover:border-[#ff4655] text-left cursor-pointer"
                    >
                      <div className="font-bold text-white">Sheriff</div>
                      <div className="text-amber-300 text-[10px]">800 ¤</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBuyItem('Spectre', 1600)}
                      className="p-2.5 bg-black/40 border border-white/10 hover:border-[#ff4655] text-left cursor-pointer"
                    >
                      <div className="font-bold text-white">Spectre (SMG)</div>
                      <div className="text-amber-300 text-[10px]">1,600 ¤</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBuyItem('Judge', 1850)}
                      className="p-2.5 bg-black/40 border border-white/10 hover:border-[#ff4655] text-left cursor-pointer"
                    >
                      <div className="font-bold text-white">Judge (Shotgun)</div>
                      <div className="text-amber-300 text-[10px]">1,850 ¤</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBuyItem('Vandal', 2900)}
                      className="p-2.5 bg-black/40 border border-white/10 hover:border-[#ff4655] text-left cursor-pointer"
                    >
                      <div className="font-bold text-white">Vandal (Rifle)</div>
                      <div className="text-amber-300 text-[10px]">2,900 ¤</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBuyItem('Phantom', 2900)}
                      className="p-2.5 bg-black/40 border border-white/10 hover:border-[#ff4655] text-left cursor-pointer"
                    >
                      <div className="font-bold text-white">Phantom (Rifle)</div>
                      <div className="text-amber-300 text-[10px]">2,900 ¤</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBuyItem('Operator', 4700)}
                      className="p-2.5 bg-black/40 border border-white/10 hover:border-[#ff4655] text-left cursor-pointer"
                    >
                      <div className="font-bold text-white">Operator (Sniper)</div>
                      <div className="text-amber-300 text-[10px]">4,700 ¤</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBuyItem('Odin', 3200)}
                      className="p-2.5 bg-black/40 border border-white/10 hover:border-[#ff4655] text-left cursor-pointer"
                    >
                      <div className="font-bold text-white">Odin (Heavy)</div>
                      <div className="text-amber-300 text-[10px]">3,200 ¤</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBuyItem('Heavy Armor', 1000)}
                      className="col-span-2 p-2.5 bg-black/40 border border-white/10 hover:border-cyan-500 text-left cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-cyan-300">Heavy Armor (+50 Shield)</div>
                        <div className="text-slate-400 text-[10px]">Absorbs 66% damage</div>
                      </div>
                      <div className="text-amber-300 font-bold">1,000 ¤</div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
