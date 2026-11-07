import { Move, Result, Difficulty, OpponentProfile, ClashEffectData, RoundRecord, AiTelemetry } from '../types/game';

export const WIN_MAP: Record<Move, Move[]> = {
  rock: ['scissors', 'lizard'],
  paper: ['rock', 'spock'],
  scissors: ['paper', 'lizard'],
  lizard: ['spock', 'paper'],
  spock: ['scissors', 'rock'],
};

export const COUNTER_MAP: Record<Move, Move> = {
  rock: 'paper',
  paper: 'scissors',
  scissors: 'rock',
  lizard: 'scissors',
  spock: 'paper',
};

export const OPPONENT_PROFILES: Record<Difficulty, OpponentProfile> = {
  novice: {
    id: 'novice',
    name: 'Rookie Ralph',
    title: 'Casual Brawler',
    tagline: 'Throws punches first, thinks later',
    avatarColor: 'text-emerald-400',
    avatarBg: 'bg-emerald-500/10 border-emerald-500/30',
    borderColor: 'border-emerald-500/40',
    levelBadge: 'Novice',
    iconName: 'smile',
    personality: 'Friendly and spontaneous. Tends to stick with his favorites and picks hands randomly.',
    arenaTheme: 'from-emerald-950/40 via-slate-950 to-slate-950 border-emerald-500/30',
    taunts: {
      ready: [
        "Let's see what you've got!",
        "Good luck! I'm feeling lucky today.",
        "Rock, Paper, Scissors... let's rumble!"
      ],
      win: [
        "Woohoo! Beginner's luck strikes!",
        "Haha, didn't see that one coming!",
        "One point for Ralph!"
      ],
      lose: [
        "Ouch! Good one, you caught me off guard.",
        "Hey! How did your paper do that?!",
        "Alright, you got me there. Next round!"
      ],
      draw: [
        "Jinx! Great minds pick alike!",
        "A tie! Let's shake again!",
        "Are you reading my mind?"
      ]
    }
  },
  tactician: {
    id: 'tactician',
    name: 'Sergeant Stone',
    title: 'Discipline Master',
    tagline: 'Tracks your emotional shifts and patterns',
    avatarColor: 'text-amber-400',
    avatarBg: 'bg-amber-500/10 border-amber-500/30',
    borderColor: 'border-amber-500/40',
    levelBadge: 'Tactician',
    iconName: 'shield',
    personality: 'Disciplined and observational. Exploits the Win-Stay / Lose-Shift human reflex.',
    arenaTheme: 'from-amber-950/40 via-slate-950 to-slate-950 border-amber-500/30',
    taunts: {
      ready: [
        "Attention! Every move leaves a trail.",
        "Show me your discipline, recruit.",
        "Patterns never lie. Make your move."
      ],
      win: [
        "Predictable! Humans always follow the formula.",
        "Tactical victory. Study your mistakes.",
        "Read like an open tactical manual!"
      ],
      lose: [
        "Impressive counter-strategy, recruit.",
        "A momentary lapse in my perimeter. Respect.",
        "You broke the routine. Well played."
      ],
      draw: [
        "Mutual parry! Neutral stalemate.",
        "Synchronized action. Regroup!",
        "Gridlock. Let us see who flinches first."
      ]
    }
  },
  cipher: {
    id: 'cipher',
    name: 'Cipher Master',
    title: 'Pattern Algorist',
    tagline: 'Markov chain sequence predictor',
    avatarColor: 'text-cyan-400',
    avatarBg: 'bg-cyan-500/10 border-cyan-500/30',
    borderColor: 'border-cyan-500/40',
    levelBadge: 'Strategic',
    iconName: 'brain',
    personality: 'Analytical and calculated. Evaluates your last 2-3 sequences to calculate exact probabilities.',
    arenaTheme: 'from-cyan-950/40 via-slate-950 to-slate-950 border-cyan-500/30',
    taunts: {
      ready: [
        "Calculating state transition probabilities...",
        "Your decision tree is already resolving.",
        "Data stream locked in. Execute."
      ],
      win: [
        "Probability vector verified. Outcome: Loss.",
        "Your sequence matched Markov node #7.",
        "Calculated down to the millisecond."
      ],
      lose: [
        "Statistical anomaly detected! Fascinating.",
        "You introduced pseudorandom entropy. Well done.",
        "Recalibrating variance parameters..."
      ],
      draw: [
        "Equilibrium attained. Zero state divergence.",
        "Parallel calculation collision.",
        "Identical harmonic vectors."
      ]
    }
  },
  oracle: {
    id: 'oracle',
    name: 'The Oracle',
    title: 'Psychic Mind',
    tagline: 'Anticipates what you think you will counter',
    avatarColor: 'text-fuchsia-400',
    avatarBg: 'bg-fuchsia-500/10 border-fuchsia-500/30',
    borderColor: 'border-fuchsia-500/40',
    levelBadge: 'Master',
    iconName: 'sparkles',
    personality: 'Mystical, profound, and near unbeatable. Anticipates your second-guessing and reverse psychology.',
    arenaTheme: 'from-purple-950/40 via-slate-950 to-slate-950 border-purple-500/30',
    taunts: {
      ready: [
        "I already see the hand you will choose.",
        "Do not think of what beats me... think deeper.",
        "Your destiny awaits in the palm of your hand."
      ],
      win: [
        "You thought you were being clever, didn't you?",
        "I saw that choice before you even reached.",
        "The timeline remains unbroken."
      ],
      lose: [
        "A ripple in the foresight! You surprised me.",
        "You chose against instinct. Magnificent.",
        "Perhaps the future is not entirely written."
      ],
      draw: [
        "Our minds resonated across the void.",
        "Echoes of eternity in a single gesture.",
        "Neither triumphs; both foresee."
      ]
    }
  }
};

/**
 * Determines match result for the player
 */
export function determineResult(playerMove: Move, aiMove: Move): Result {
  if (playerMove === aiMove) return 'draw';
  const winsAgainst = WIN_MAP[playerMove] || [];
  return winsAgainst.includes(aiMove) ? 'win' : 'lose';
}

/**
 * Get descriptive clash effect and commentary
 */
export function getClashEffect(playerMove: Move, aiMove: Move): ClashEffectData {
  if (playerMove === aiMove) {
    return {
      type: 'clash',
      headline: 'CLASH! DRAW!',
      description: `Both sides deployed ${playerMove.toUpperCase()}!`,
      color: 'text-slate-200'
    };
  }

  const pWon = WIN_MAP[playerMove]?.includes(aiMove);
  const winnerMove = pWon ? playerMove : aiMove;
  const loserMove = pWon ? aiMove : playerMove;

  if (winnerMove === 'rock' && loserMove === 'scissors') {
    return {
      type: 'crush',
      headline: pWon ? 'CRUSHED!' : 'SMASHED!',
      description: 'Rock bludgeons and shatters Scissors into pieces!',
      color: 'text-amber-400'
    };
  }

  if (winnerMove === 'scissors' && loserMove === 'paper') {
    return {
      type: 'cut',
      headline: pWon ? 'SLICED!' : 'SHREDDED!',
      description: 'Scissors cuts and shreds Paper cleanly in half!',
      color: 'text-rose-400'
    };
  }

  if (winnerMove === 'paper' && loserMove === 'rock') {
    return {
      type: 'cover',
      headline: pWon ? 'SMOTHERED!' : 'WRAPPED!',
      description: 'Paper envelopes and completely covers Rock!',
      color: 'text-emerald-400'
    };
  }

  if (winnerMove === 'rock' && loserMove === 'lizard') {
    return {
      type: 'crush',
      headline: pWon ? 'CRUSHED!' : 'SQUASHED!',
      description: 'Rock crushes the Lizard!',
      color: 'text-amber-400'
    };
  }

  if (winnerMove === 'lizard' && loserMove === 'spock') {
    return {
      type: 'poison',
      headline: pWon ? 'POISONED!' : 'TOXIC BITE!',
      description: 'Lizard poisons Spock!',
      color: 'text-purple-400'
    };
  }

  if (winnerMove === 'spock' && loserMove === 'scissors') {
    return {
      type: 'crush',
      headline: pWon ? 'SMASHED!' : 'CRUMPLED!',
      description: 'Spock smashes the Scissors!',
      color: 'text-blue-400'
    };
  }

  if (winnerMove === 'scissors' && loserMove === 'lizard') {
    return {
      type: 'cut',
      headline: pWon ? 'DECAPITATED!' : 'SEVERED!',
      description: 'Scissors decapitates the Lizard!',
      color: 'text-rose-400'
    };
  }

  if (winnerMove === 'lizard' && loserMove === 'paper') {
    return {
      type: 'cover',
      headline: pWon ? 'DEVOUR!' : 'CONSUMED!',
      description: 'Lizard eats the Paper!',
      color: 'text-lime-400'
    };
  }

  if (winnerMove === 'paper' && loserMove === 'spock') {
    return {
      type: 'cover',
      headline: pWon ? 'DISPROVED!' : 'REFUTED!',
      description: 'Paper disproves Spock!',
      color: 'text-emerald-400'
    };
  }

  if (winnerMove === 'spock' && loserMove === 'rock') {
    return {
      type: 'disintegrate',
      headline: pWon ? 'VAPORIZED!' : 'DISINTEGRATED!',
      description: 'Spock vaporizes Rock!',
      color: 'text-cyan-400'
    };
  }

  return {
    type: 'clash',
    headline: pWon ? 'VICTORY!' : 'DEFEAT!',
    description: `${winnerMove.toUpperCase()} overcomes ${loserMove.toUpperCase()}!`,
    color: 'text-amber-400'
  };
}

/**
 * Intelligent move generator based on selected AI difficulty
 */
export function generateAiMove(
  difficulty: Difficulty,
  history: RoundRecord[],
  isExpandedMode: boolean = false
): Move {
  const pool: Move[] = isExpandedMode 
    ? ['rock', 'paper', 'scissors', 'lizard', 'spock']
    : ['rock', 'paper', 'scissors'];

  const getRandom = () => pool[Math.floor(Math.random() * pool.length)];

  // 1. Novice: 75% random, 25% slight human bias toward Rock or repeating
  if (difficulty === 'novice' || history.length === 0) {
    const roll = Math.random();
    if (roll < 0.25 && history.length > 0) {
      // Repeat player's last winning move or Ralph's own last move
      return history[history.length - 1].playerMove;
    }
    return getRandom();
  }

  const lastRound = history[history.length - 1];

  // 2. Tactician: Win-Stay, Lose-Shift (WSLS) behavioral psychology
  // Research from Zhejiang University (Wang et al., 2014) showed:
  // - Winners tend to repeat their winning move
  // - Losers tend to cycle forward: Rock -> Paper -> Scissors -> Rock
  if (difficulty === 'tactician') {
    // 30% chance of random to prevent being 100% predictable
    if (Math.random() < 0.25) return getRandom();

    if (lastRound.result === 'win') {
      // Player won! Player is psychologically likely to repeat the same move.
      // Tactician plays the counter to player's winning move.
      return COUNTER_MAP[lastRound.playerMove] || getRandom();
    } else if (lastRound.result === 'lose') {
      // Player lost! Player is likely to switch to the move that would have beaten what the bot played.
      const botLastMove = lastRound.aiMove;
      const expectedPlayerMove = COUNTER_MAP[botLastMove]; // player tries to beat bot's last move
      return COUNTER_MAP[expectedPlayerMove] || getRandom();
    } else {
      // Draw: player often switches to the move that beats the tied move
      const expectedPlayerMove = COUNTER_MAP[lastRound.playerMove];
      return COUNTER_MAP[expectedPlayerMove] || getRandom();
    }
  }

  // 3. Cipher Master: Markov chain & N-gram sequence predictor
  if (difficulty === 'cipher') {
    if (history.length < 2) return getRandom();

    // Look for occurrences of [lastMove -> nextMove] in history
    const lastPlayerMove = lastRound.playerMove;
    const transitions: Record<Move, number> = {
      rock: 0,
      paper: 0,
      scissors: 0,
      lizard: 0,
      spock: 0
    };

    for (let i = 0; i < history.length - 1; i++) {
      if (history[i].playerMove === lastPlayerMove) {
        const nextMove = history[i + 1].playerMove;
        transitions[nextMove] = (transitions[nextMove] || 0) + 1;
      }
    }

    // Find the move with highest transition count
    let mostLikelyMove: Move = lastPlayerMove;
    let maxCount = -1;
    for (const move of pool) {
      if ((transitions[move] || 0) > maxCount) {
        maxCount = transitions[move];
        mostLikelyMove = move;
      }
    }

    // If no transition data yet or uniform, use frequency counting
    if (maxCount <= 0) {
      const overallFreq: Record<Move, number> = { rock: 0, paper: 0, scissors: 0, lizard: 0, spock: 0 };
      history.forEach(r => overallFreq[r.playerMove] = (overallFreq[r.playerMove] || 0) + 1);
      const sorted = pool.slice().sort((a, b) => (overallFreq[b] || 0) - (overallFreq[a] || 0));
      mostLikelyMove = sorted[0];
    }

    // Counter the most likely move (with 15% random noise for variety)
    if (Math.random() < 0.15) return getRandom();
    return COUNTER_MAP[mostLikelyMove] || getRandom();
  }

  // 4. The Oracle: Advanced second-order predictor
  // The Oracle anticipates that smart players expect the bot to counter their last move,
  // so the player will try to counter the bot's counter! The Oracle counters that second-order counter.
  if (difficulty === 'oracle') {
    if (history.length < 2) {
      // Initial mind-read: human opening moves heavily favor Rock (~37%) and Scissors (~33%), Paper is least common (~30%)
      // Oracle starts with Paper to crush initial Rock
      return Math.random() < 0.6 ? 'paper' : 'rock';
    }

    // Check if player is on a winning streak
    let playerStreak = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].result === 'win') playerStreak++;
      else break;
    }

    // If player is on a roll (2+ wins), they might attempt a meta-bluff
    if (playerStreak >= 2) {
      // Counter their expected bluff
      const anticipated = COUNTER_MAP[lastRound.playerMove];
      const counterToAnticipated = COUNTER_MAP[anticipated];
      return counterToAnticipated;
    }

    // Combine Markov (order 2) with frequency weights
    const lastTwo = history.slice(-2).map(r => r.playerMove).join('-');
    const patternCount: Record<Move, number> = { rock: 0, paper: 0, scissors: 0, lizard: 0, spock: 0 };

    for (let i = 0; i < history.length - 2; i++) {
      const pattern = `${history[i].playerMove}-${history[i + 1].playerMove}`;
      if (pattern === lastTwo) {
        const followUp = history[i + 2].playerMove;
        patternCount[followUp] = (patternCount[followUp] || 0) + 1;
      }
    }

    let topPredicted: Move | null = null;
    let topVal = 0;
    for (const m of pool) {
      if (patternCount[m] > topVal) {
        topVal = patternCount[m];
        topPredicted = m;
      }
    }

    if (topPredicted && topVal >= 1) {
      return COUNTER_MAP[topPredicted];
    }

    // Fallback: reverse counter logic
    const directCounter = COUNTER_MAP[lastRound.playerMove];
    return COUNTER_MAP[directCounter];
  }

  return getRandom();
}

/**
 * Gets a taunt / quote for the opponent
 */
export function getOpponentDialogue(
  difficulty: Difficulty,
  state: 'ready' | 'win' | 'lose' | 'draw'
): string {
  const profile = OPPONENT_PROFILES[difficulty];
  const list = profile.taunts[state] || profile.taunts.ready;
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * Calculates real-time AI radar telemetry for the player
 */
export function calculateAiTelemetry(
  difficulty: Difficulty,
  history: RoundRecord[],
  isExpandedMode: boolean
): AiTelemetry {
  const pool: Move[] = isExpandedMode ? ['rock', 'paper', 'scissors', 'lizard', 'spock'] : ['rock', 'paper', 'scissors'];

  if (history.length === 0) {
    return {
      predictedPlayerMove: 'rock',
      confidence: 38,
      reasoning: 'First round baseline: Human players statistically initiate with Rock in ~37% of matches.',
      recommendedCounter: 'paper'
    };
  }

  const last = history[history.length - 1];

  if (difficulty === 'novice') {
    return {
      predictedPlayerMove: last.playerMove,
      confidence: 42,
      reasoning: 'Rookie Ralph anticipates you will repeat your previous hand or pick a spontaneous move.',
      recommendedCounter: COUNTER_MAP[last.playerMove]
    };
  }

  if (difficulty === 'tactician') {
    if (last.result === 'win') {
      return {
        predictedPlayerMove: last.playerMove,
        confidence: 65,
        reasoning: `Win-Stay reflex: Since you won with ${last.playerMove.toUpperCase()}, Stone anticipates you will repeat it.`,
        recommendedCounter: COUNTER_MAP[COUNTER_MAP[last.playerMove]]
      };
    } else {
      const expectedShift = COUNTER_MAP[last.aiMove];
      return {
        predictedPlayerMove: expectedShift,
        confidence: 58,
        reasoning: `Lose-Shift reflex: After a defeat, players naturally cycle to beat what beat them.`,
        recommendedCounter: COUNTER_MAP[COUNTER_MAP[expectedShift]]
      };
    }
  }

  if (difficulty === 'cipher') {
    return {
      predictedPlayerMove: last.playerMove,
      confidence: 74,
      reasoning: `Markov Sequence: Cipher is scanning your last 2 moves across history to map transition nodes.`,
      recommendedCounter: COUNTER_MAP[COUNTER_MAP[last.playerMove]]
    };
  }

  // Oracle
  return {
    predictedPlayerMove: COUNTER_MAP[last.playerMove],
    confidence: 86,
    reasoning: `Psychic Inversion: The Oracle anticipates that you will try to counter its counter.`,
    recommendedCounter: last.playerMove
  };
}
