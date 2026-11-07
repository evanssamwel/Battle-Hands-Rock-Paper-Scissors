import { HandSkin, SkinId, Achievement, PlayerStats, Difficulty, Move, Result } from '../types/game';

export const HAND_SKINS: Record<SkinId, HandSkin> = {
  classic: {
    id: 'classic',
    name: 'Champion Amber',
    description: 'Forged from polished bronze and amber battle armor.',
    unlockCondition: 'Unlocked by default',
    isUnlocked: true,
    colors: {
      start: '#F59E0B',
      mid: '#D97706',
      end: '#B45309',
      highlight: '#FDE68A',
      glow: 'rgba(245, 158, 11, 0.45)',
      shadow: '#78350F'
    }
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Synthwave Neon',
    description: 'Pulsing cybernetic circuits running overcharged neon cyan.',
    unlockCondition: 'Reach a 3-win streak or 5 total wins',
    isUnlocked: false,
    colors: {
      start: '#06B6D4',
      mid: '#0284C7',
      end: '#0369A1',
      highlight: '#A5F3FC',
      glow: 'rgba(6, 182, 212, 0.55)',
      shadow: '#082F49'
    }
  },
  magma: {
    id: 'magma',
    name: 'Molten Inferno',
    description: 'Cracked volcanic rock glowing with molten volcanic fire.',
    unlockCondition: 'Win 12 total rounds',
    isUnlocked: false,
    colors: {
      start: '#EA580C',
      mid: '#C2410C',
      end: '#9A3412',
      highlight: '#FED7AA',
      glow: 'rgba(234, 88, 12, 0.55)',
      shadow: '#431407'
    }
  },
  emerald: {
    id: 'emerald',
    name: 'Jade Dragon',
    description: 'Polished imperial jade carved with ancient dragon crests.',
    unlockCondition: 'Win any Best of 3 or Best of 5 tournament',
    isUnlocked: false,
    colors: {
      start: '#10B981',
      mid: '#059669',
      end: '#047857',
      highlight: '#A7F3D0',
      glow: 'rgba(16, 185, 129, 0.5)',
      shadow: '#064E3B'
    }
  },
  cosmic: {
    id: 'cosmic',
    name: 'Celestial Void',
    description: 'Resonating deep space obsidian infused with starlight.',
    unlockCondition: 'Defeat The Oracle on Master difficulty',
    isUnlocked: false,
    colors: {
      start: '#A855F7',
      mid: '#9333EA',
      end: '#7E22CE',
      highlight: '#F3E8FF',
      glow: 'rgba(168, 85, 247, 0.55)',
      shadow: '#3B0764'
    }
  }
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    title: 'First Blood',
    description: 'Win your very first battle round.',
    category: 'wins',
    icon: 'Swords',
    unlocked: false,
    currentValue: 0,
    targetValue: 1
  },
  {
    id: 'streak_3',
    title: 'Triple Threat',
    description: 'Achieve a winning streak of 3 rounds.',
    category: 'streak',
    icon: 'Flame',
    unlocked: false,
    currentValue: 0,
    targetValue: 3
  },
  {
    id: 'streak_5',
    title: 'Unstoppable Force',
    description: 'Achieve a winning streak of 5 rounds.',
    category: 'streak',
    icon: 'Zap',
    unlocked: false,
    currentValue: 0,
    targetValue: 5
  },
  {
    id: 'rock_specialist',
    title: 'Rock Solid',
    description: 'Win 5 rounds using Rock.',
    category: 'mastery',
    icon: 'Shield',
    unlocked: false,
    currentValue: 0,
    targetValue: 5
  },
  {
    id: 'paper_specialist',
    title: 'Paper Origami',
    description: 'Win 5 rounds using Paper.',
    category: 'mastery',
    icon: 'Scroll',
    unlocked: false,
    currentValue: 0,
    targetValue: 5
  },
  {
    id: 'scissors_specialist',
    title: 'Razor Edge',
    description: 'Win 5 rounds using Scissors.',
    category: 'mastery',
    icon: 'Scissors',
    unlocked: false,
    currentValue: 0,
    targetValue: 5
  },
  {
    id: 'oracle_slayer',
    title: 'Mind Breaker',
    description: 'Defeat The Oracle in battle.',
    category: 'mastery',
    icon: 'Brain',
    unlocked: false,
    currentValue: 0,
    targetValue: 1
  },
  {
    id: 'tournament_champ',
    title: 'Grand Champion',
    description: 'Win a Best of 3 or Best of 5 Tournament.',
    category: 'tournament',
    icon: 'Trophy',
    unlocked: false,
    currentValue: 0,
    targetValue: 1
  },
  {
    id: 'survivor_elite',
    title: 'Survivor Elite',
    description: 'Survive 5 consecutive rounds in Survival Gauntlet.',
    category: 'tournament',
    icon: 'Heart',
    unlocked: false,
    currentValue: 0,
    targetValue: 5
  }
];

/**
 * Check which achievements and skins should be unlocked based on new stats
 */
export function evaluateUnlocks(
  stats: PlayerStats,
  lastRound?: { result: Result; playerMove: Move; difficulty: Difficulty },
  tournamentWon?: boolean,
  survivalSurvivedCount?: number
): {
  newlyUnlockedAchievements: Achievement[];
  newlyUnlockedSkins: HandSkin[];
  updatedStats: PlayerStats;
} {
  const newlyUnlockedAchievements: Achievement[] = [];
  const newlyUnlockedSkins: HandSkin[] = [];

  const currentUnlockedAchievements = { ...stats.achievements };
  const currentUnlockedSkins = new Set(stats.unlockedSkins || ['classic']);

  // Evaluate Achievements
  INITIAL_ACHIEVEMENTS.forEach((ach) => {
    if (currentUnlockedAchievements[ach.id]?.unlocked) return;

    let shouldUnlock = false;
    let currVal = 0;

    if (ach.id === 'first_blood') {
      currVal = stats.playerWins;
      shouldUnlock = stats.playerWins >= 1;
    } else if (ach.id === 'streak_3') {
      currVal = stats.bestStreak;
      shouldUnlock = stats.bestStreak >= 3;
    } else if (ach.id === 'streak_5') {
      currVal = stats.bestStreak;
      shouldUnlock = stats.bestStreak >= 5;
    } else if (ach.id === 'rock_specialist') {
      currVal = stats.movesWon.rock || 0;
      shouldUnlock = currVal >= 5;
    } else if (ach.id === 'paper_specialist') {
      currVal = stats.movesWon.paper || 0;
      shouldUnlock = currVal >= 5;
    } else if (ach.id === 'scissors_specialist') {
      currVal = stats.movesWon.scissors || 0;
      shouldUnlock = currVal >= 5;
    } else if (ach.id === 'oracle_slayer') {
      currVal = stats.difficultyStats.oracle?.wins || 0;
      shouldUnlock = currVal >= 1;
    } else if (ach.id === 'tournament_champ') {
      currVal = tournamentWon ? 1 : 0;
      shouldUnlock = !!tournamentWon;
    } else if (ach.id === 'survivor_elite') {
      currVal = survivalSurvivedCount || 0;
      shouldUnlock = (survivalSurvivedCount || 0) >= 5;
    }

    if (shouldUnlock) {
      currentUnlockedAchievements[ach.id] = { unlocked: true, unlockedAt: Date.now() };
      newlyUnlockedAchievements.push({ ...ach, unlocked: true, currentValue: currVal });
    }
  });

  // Evaluate Skins
  // 1. Cyberpunk: 3-win streak or 5 wins
  if (!currentUnlockedSkins.has('cyberpunk')) {
    if (stats.bestStreak >= 3 || stats.playerWins >= 5) {
      currentUnlockedSkins.add('cyberpunk');
      newlyUnlockedSkins.push(HAND_SKINS.cyberpunk);
    }
  }

  // 2. Magma: 12 total wins
  if (!currentUnlockedSkins.has('magma')) {
    if (stats.playerWins >= 12) {
      currentUnlockedSkins.add('magma');
      newlyUnlockedSkins.push(HAND_SKINS.magma);
    }
  }

  // 3. Emerald: Win any tournament
  if (!currentUnlockedSkins.has('emerald')) {
    if (tournamentWon) {
      currentUnlockedSkins.add('emerald');
      newlyUnlockedSkins.push(HAND_SKINS.emerald);
    }
  }

  // 4. Cosmic: Defeat The Oracle
  if (!currentUnlockedSkins.has('cosmic')) {
    if ((stats.difficultyStats.oracle?.wins || 0) >= 1) {
      currentUnlockedSkins.add('cosmic');
      newlyUnlockedSkins.push(HAND_SKINS.cosmic);
    }
  }

  const updatedStats: PlayerStats = {
    ...stats,
    unlockedSkins: Array.from(currentUnlockedSkins),
    achievements: currentUnlockedAchievements
  };

  return {
    newlyUnlockedAchievements,
    newlyUnlockedSkins,
    updatedStats
  };
}
