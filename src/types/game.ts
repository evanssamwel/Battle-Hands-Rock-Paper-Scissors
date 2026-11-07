export type Move = 'rock' | 'paper' | 'scissors' | 'lizard' | 'spock';

export type Result = 'win' | 'lose' | 'draw';

export type Difficulty = 'novice' | 'tactician' | 'cipher' | 'oracle';

export type GameMode = 'freeplay' | 'best_of_3' | 'best_of_5' | 'survival';

export type BattlePhase = 
  | 'ready'          // Waiting for player move
  | 'countdown'      // "3... 2... 1..." shaking fists
  | 'clash'          // Hands revealed, clash animation & particles
  | 'result'         // Verdict announced, brief pause before next or modal
  | 'match_over';    // Best of 3/5 or survival finished

export type SkinId = 'classic' | 'cyberpunk' | 'magma' | 'emerald' | 'cosmic';

export interface HandSkin {
  id: SkinId;
  name: string;
  description: string;
  unlockCondition: string;
  isUnlocked: boolean;
  colors: {
    start: string;
    mid: string;
    end: string;
    highlight: string;
    glow: string;
    shadow: string;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'wins' | 'streak' | 'mastery' | 'tournament';
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  currentValue: number;
  targetValue: number;
}

export interface RoundRecord {
  id: string;
  roundNumber: number;
  timestamp: number;
  playerMove: Move;
  aiMove: Move;
  result: Result;
  difficulty: Difficulty;
  commentary: string;
}

export interface PlayerStats {
  totalRounds: number;
  playerWins: number;
  aiWins: number;
  draws: number;
  currentStreak: number;
  bestStreak: number;
  history: RoundRecord[];
  movesCount: Record<Move, number>;
  movesWon: Record<Move, number>;
  aiMovesCount: Record<Move, number>;
  difficultyStats: Record<Difficulty, { wins: number; losses: number; draws: number }>;
  equippedSkin: SkinId;
  unlockedSkins: SkinId[];
  achievements: Record<string, { unlocked: boolean; unlockedAt?: number }>;
}

export interface OpponentProfile {
  id: Difficulty;
  name: string;
  title: string;
  tagline: string;
  avatarColor: string;
  avatarBg: string;
  borderColor: string;
  levelBadge: string;
  iconName: 'smile' | 'shield' | 'brain' | 'sparkles';
  personality: string;
  arenaTheme: string;
  taunts: {
    ready: string[];
    win: string[];
    lose: string[];
    draw: string[];
  };
}

export interface ClashEffectData {
  type: 'crush' | 'cut' | 'cover' | 'clash' | 'poison' | 'disintegrate';
  headline: string;
  description: string;
  color: string;
}

export interface AiTelemetry {
  predictedPlayerMove: Move;
  confidence: number;
  reasoning: string;
  recommendedCounter: Move;
}
