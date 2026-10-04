import { UserRank, RankHistoryPoint, RankTier } from '../types/valorant';

export const RANK_ORDER: RankTier[] = [
  'Iron',
  'Bronze',
  'Silver',
  'Gold',
  'Platinum',
  'Diamond',
  'Ascendant',
  'Immortal',
  'Radiant',
];

export const INITIAL_RANK_HISTORY: RankHistoryPoint[] = [
  {
    id: 'm-1',
    matchIndex: 1,
    timestamp: '2026-09-28 14:20',
    map: 'Ascent',
    tier: 'Diamond',
    subTier: 1,
    rr: 38,
    rrChange: +22,
    score: '13 - 7',
    result: 'win',
    agent: 'Jett',
    kills: 24,
    deaths: 12,
    assists: 4,
  },
  {
    id: 'm-2',
    matchIndex: 2,
    timestamp: '2026-09-29 16:45',
    map: 'Bind',
    tier: 'Diamond',
    subTier: 1,
    rr: 19,
    rrChange: -19,
    score: '9 - 13',
    result: 'loss',
    agent: 'Reyna',
    kills: 17,
    deaths: 16,
    assists: 3,
  },
  {
    id: 'm-3',
    matchIndex: 3,
    timestamp: '2026-09-30 18:10',
    map: 'Haven',
    tier: 'Diamond',
    subTier: 1,
    rr: 45,
    rrChange: +26,
    score: '13 - 5',
    result: 'win',
    agent: 'Phoenix',
    kills: 28,
    deaths: 10,
    assists: 6,
  },
  {
    id: 'm-4',
    matchIndex: 4,
    timestamp: '2026-10-01 13:00',
    map: 'Ascent',
    tier: 'Diamond',
    subTier: 1,
    rr: 71,
    rrChange: +26,
    score: '13 - 10',
    result: 'win',
    agent: 'Jett',
    kills: 22,
    deaths: 14,
    assists: 5,
  },
  {
    id: 'm-5',
    matchIndex: 5,
    timestamp: '2026-10-02 15:30',
    map: 'Bind',
    tier: 'Diamond',
    subTier: 1,
    rr: 54,
    rrChange: -17,
    score: '11 - 13',
    result: 'loss',
    agent: 'Omen',
    kills: 15,
    deaths: 15,
    assists: 9,
  },
  {
    id: 'm-6',
    matchIndex: 6,
    timestamp: '2026-10-02 19:15',
    map: 'Haven',
    tier: 'Diamond',
    subTier: 1,
    rr: 82,
    rrChange: +28,
    score: '13 - 8',
    result: 'win',
    agent: 'Jett',
    kills: 25,
    deaths: 11,
    assists: 4,
  },
  {
    id: 'm-7',
    matchIndex: 7,
    timestamp: '2026-10-03 14:00',
    map: 'Ascent',
    tier: 'Diamond',
    subTier: 2,
    rr: 10, // Promoted to Diamond 2!
    rrChange: +28,
    score: '13 - 6',
    result: 'win',
    agent: 'Reyna',
    kills: 27,
    deaths: 9,
    assists: 5,
  },
  {
    id: 'm-8',
    matchIndex: 8,
    timestamp: '2026-10-03 17:40',
    map: 'Bind',
    tier: 'Diamond',
    subTier: 2,
    rr: 35,
    rrChange: +25,
    score: '13 - 11',
    result: 'win',
    agent: 'Sage',
    kills: 19,
    deaths: 13,
    assists: 12,
  },
  {
    id: 'm-9',
    matchIndex: 9,
    timestamp: '2026-10-04 01:20',
    map: 'Haven',
    tier: 'Diamond',
    subTier: 2,
    rr: 40,
    rrChange: +5,
    score: '14 - 14',
    result: 'draw',
    agent: 'Jett',
    kills: 31,
    deaths: 20,
    assists: 7,
  },
  {
    id: 'm-10',
    matchIndex: 10,
    timestamp: '2026-10-04 03:00',
    map: 'Ascent',
    tier: 'Diamond',
    subTier: 2,
    rr: 64,
    rrChange: +24,
    score: '13 - 9',
    result: 'win',
    agent: 'Jett',
    kills: 26,
    deaths: 12,
    assists: 4,
  },
];

export const INITIAL_USER_RANK: UserRank = {
  tier: 'Diamond',
  subTier: 2,
  rr: 64,
  peakTier: 'Diamond 3',
  wins: 18,
  losses: 11,
  history: INITIAL_RANK_HISTORY,
};

/**
 * Calculates updated rank, handles promotions/demotions and appends to history.
 */
export function recordMatchResult(
  current: UserRank,
  won: boolean,
  mapName: 'Ascent' | 'Bind' | 'Haven' | 'Split' | 'Breeze' = 'Ascent',
  agentName: string = 'Jett'
): UserRank {
  const rrDelta = won
    ? Math.floor(Math.random() * 8) + 22 // +22 to +29 RR
    : -(Math.floor(Math.random() * 6) + 16); // -16 to -21 RR

  let newRR = current.rr + rrDelta;
  let newTier = current.tier;
  let newSubTier = current.subTier;

  // Check promotion
  if (newRR >= 100) {
    if (newTier === 'Radiant') {
      newRR = Math.min(999, newRR);
    } else if (newSubTier < 3) {
      newSubTier = (newSubTier + 1) as 1 | 2 | 3;
      newRR = newRR - 100 + 10; // start with baseline 10 RR in new sub-tier
    } else {
      // Promote to next major tier
      const currentIdx = RANK_ORDER.indexOf(newTier);
      if (currentIdx < RANK_ORDER.length - 1) {
        newTier = RANK_ORDER[currentIdx + 1];
        newSubTier = 1;
        newRR = 10;
      } else {
        newTier = 'Radiant';
        newRR = 10;
      }
    }
  } else if (newRR < 0) {
    // Demotion check
    if (newSubTier > 1) {
      newSubTier = (newSubTier - 1) as 1 | 2 | 3;
      newRR = 75;
    } else {
      const currentIdx = RANK_ORDER.indexOf(newTier);
      if (currentIdx > 0) {
        newTier = RANK_ORDER[currentIdx - 1];
        newSubTier = 3;
        newRR = 75;
      } else {
        newRR = 0; // Bottom of Iron 1
      }
    }
  }

  const nextIndex = (current.history.length > 0
    ? current.history[current.history.length - 1].matchIndex + 1
    : 1);

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const newHistoryPoint: RankHistoryPoint = {
    id: `m-${Date.now()}`,
    matchIndex: nextIndex,
    timestamp: timeStr,
    map: mapName,
    tier: newTier,
    subTier: newSubTier,
    rr: newRR,
    rrChange: rrDelta,
    score: won ? '13 - 8' : '9 - 13',
    result: won ? 'win' : 'loss',
    agent: agentName,
    kills: won ? Math.floor(Math.random() * 10) + 18 : Math.floor(Math.random() * 8) + 10,
    deaths: won ? Math.floor(Math.random() * 6) + 8 : Math.floor(Math.random() * 6) + 14,
    assists: Math.floor(Math.random() * 7) + 3,
  };

  const updatedHistory = [...current.history, newHistoryPoint].slice(-25); // keep last 25 matches

  return {
    ...current,
    tier: newTier,
    subTier: newSubTier,
    rr: newRR,
    wins: won ? current.wins + 1 : current.wins,
    losses: won ? current.losses : current.losses + 1,
    history: updatedHistory,
  };
}
