import { PlayerStats, RoundRecord, Move, Difficulty } from '../types/game';

const STORAGE_KEY = 'battle_hands_player_stats_v1';

const INITIAL_STATS: PlayerStats = {
  totalRounds: 0,
  playerWins: 0,
  aiWins: 0,
  draws: 0,
  currentStreak: 0,
  bestStreak: 0,
  history: [],
  movesCount: {
    rock: 0,
    paper: 0,
    scissors: 0,
    lizard: 0,
    spock: 0
  },
  movesWon: {
    rock: 0,
    paper: 0,
    scissors: 0,
    lizard: 0,
    spock: 0
  },
  aiMovesCount: {
    rock: 0,
    paper: 0,
    scissors: 0,
    lizard: 0,
    spock: 0
  },
  difficultyStats: {
    novice: { wins: 0, losses: 0, draws: 0 },
    tactician: { wins: 0, losses: 0, draws: 0 },
    cipher: { wins: 0, losses: 0, draws: 0 },
    oracle: { wins: 0, losses: 0, draws: 0 }
  },
  equippedSkin: 'classic',
  unlockedSkins: ['classic'],
  achievements: {}
};

export function loadPlayerStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATS;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_STATS,
      ...parsed,
      movesCount: { ...INITIAL_STATS.movesCount, ...(parsed.movesCount || {}) },
      movesWon: { ...INITIAL_STATS.movesWon, ...(parsed.movesWon || {}) },
      aiMovesCount: { ...INITIAL_STATS.aiMovesCount, ...(parsed.aiMovesCount || {}) },
      difficultyStats: {
        novice: { ...INITIAL_STATS.difficultyStats.novice, ...(parsed.difficultyStats?.novice || {}) },
        tactician: { ...INITIAL_STATS.difficultyStats.tactician, ...(parsed.difficultyStats?.tactician || {}) },
        cipher: { ...INITIAL_STATS.difficultyStats.cipher, ...(parsed.difficultyStats?.cipher || {}) },
        oracle: { ...INITIAL_STATS.difficultyStats.oracle, ...(parsed.difficultyStats?.oracle || {}) }
      },
      equippedSkin: parsed.equippedSkin || 'classic',
      unlockedSkins: parsed.unlockedSkins?.length ? parsed.unlockedSkins : ['classic'],
      achievements: parsed.achievements || {}
    };
  } catch {
    return INITIAL_STATS;
  }
}

export function savePlayerStats(stats: PlayerStats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save player stats to localStorage:', e);
  }
}

export function recordRound(prevStats: PlayerStats, record: RoundRecord): PlayerStats {
  const isWin = record.result === 'win';
  const isLoss = record.result === 'lose';
  const isDraw = record.result === 'draw';

  const newCurrentStreak = isWin ? prevStats.currentStreak + 1 : 0;
  const newBestStreak = Math.max(prevStats.bestStreak, newCurrentStreak);

  const diffStats = { ...prevStats.difficultyStats };
  const currentDiff = record.difficulty;
  if (!diffStats[currentDiff]) {
    diffStats[currentDiff] = { wins: 0, losses: 0, draws: 0 };
  }

  diffStats[currentDiff] = {
    wins: diffStats[currentDiff].wins + (isWin ? 1 : 0),
    losses: diffStats[currentDiff].losses + (isLoss ? 1 : 0),
    draws: diffStats[currentDiff].draws + (isDraw ? 1 : 0)
  };

  const newStats: PlayerStats = {
    ...prevStats,
    totalRounds: prevStats.totalRounds + 1,
    playerWins: prevStats.playerWins + (isWin ? 1 : 0),
    aiWins: prevStats.aiWins + (isLoss ? 1 : 0),
    draws: prevStats.draws + (isDraw ? 1 : 0),
    currentStreak: newCurrentStreak,
    bestStreak: newBestStreak,
    history: [record, ...prevStats.history.slice(0, 99)], // keep last 100 rounds
    movesCount: {
      ...prevStats.movesCount,
      [record.playerMove]: (prevStats.movesCount[record.playerMove] || 0) + 1
    },
    movesWon: {
      ...prevStats.movesWon,
      [record.playerMove]: (prevStats.movesWon[record.playerMove] || 0) + (isWin ? 1 : 0)
    },
    aiMovesCount: {
      ...prevStats.aiMovesCount,
      [record.aiMove]: (prevStats.aiMovesCount[record.aiMove] || 0) + 1
    },
    difficultyStats: diffStats
  };

  savePlayerStats(newStats);
  return newStats;
}

export function resetPlayerStats(): PlayerStats {
  savePlayerStats(INITIAL_STATS);
  return INITIAL_STATS;
}
