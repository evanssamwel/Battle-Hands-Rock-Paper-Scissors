/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Trophy, 
  HelpCircle, 
  RotateCcw, 
  Swords, 
  Volume2, 
  VolumeX, 
  X, 
  Flame, 
  Sparkles,
  Shield,
  Radio
} from 'lucide-react';
import { 
  Move, 
  Result, 
  Difficulty, 
  GameMode, 
  BattlePhase, 
  ClashEffectData, 
  RoundRecord, 
  PlayerStats,
  SkinId
} from './types/game';
import { 
  OPPONENT_PROFILES, 
  determineResult, 
  getClashEffect, 
  generateAiMove, 
  getOpponentDialogue,
  calculateAiTelemetry
} from './utils/aiStrategy';
import { sound } from './utils/audio';
import { loadPlayerStats, recordRound, resetPlayerStats, savePlayerStats } from './utils/storage';
import { HAND_SKINS, evaluateUnlocks } from './utils/cosmeticsAndAchievements';
import { BattleHand } from './components/BattleHand';
import { ArenaEffects } from './components/ArenaEffects';
import { HandSelector } from './components/HandSelector';
import { Scoreboard } from './components/Scoreboard';
import { OpponentSelect } from './components/OpponentSelect';
import { MatchModeSelector } from './components/MatchModeSelector';
import { StatsModal } from './components/StatsModal';
import { MatchOverModal } from './components/MatchOverModal';
import { ArmoryModal } from './components/ArmoryModal';
import { AiRadar } from './components/AiRadar';
import { UnlockToast, UnlockAlert } from './components/UnlockToast';

export default function App() {
  // Game Configuration State
  const [difficulty, setDifficulty] = useState<Difficulty>('novice');
  const [gameMode, setGameMode] = useState<GameMode>('freeplay');
  const [isFastMode, setIsFastMode] = useState<boolean>(false);
  const [isExpandedMode, setIsExpandedMode] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.isMuted());

  // Battle State
  const [phase, setPhase] = useState<BattlePhase>('ready');
  const [countdownStep, setCountdownStep] = useState<number>(3);
  const [playerMove, setPlayerMove] = useState<Move | null>(null);
  const [aiMove, setAiMove] = useState<Move | null>(null);
  const [lastResult, setLastResult] = useState<Result | null>(null);
  const [clashEffect, setClashEffect] = useState<ClashEffectData | null>(null);

  // Match Scores for current session / tournament
  const [matchPlayerWins, setMatchPlayerWins] = useState<number>(0);
  const [matchAiWins, setMatchAiWins] = useState<number>(0);
  const [matchDraws, setMatchDraws] = useState<number>(0);
  const [matchRounds, setMatchRounds] = useState<number>(0);
  const [survivalLives, setSurvivalLives] = useState<number>(3);

  // Overlays & Modals
  const [dialogueText, setDialogueText] = useState<string>(() => 
    getOpponentDialogue('novice', 'ready')
  );
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isArmoryOpen, setIsArmoryOpen] = useState<boolean>(false);
  const [isRadarOpen, setIsRadarOpen] = useState<boolean>(false);
  const [isMatchOverModalOpen, setIsMatchOverModalOpen] = useState<boolean>(false);
  const [unlockAlerts, setUnlockAlerts] = useState<UnlockAlert[]>([]);

  // Persistent Player Statistics
  const [stats, setStats] = useState<PlayerStats>(() => loadPlayerStats());

  // Current active skin
  const currentSkin = useMemo(() => {
    return HAND_SKINS[stats.equippedSkin || 'classic'] || HAND_SKINS.classic;
  }, [stats.equippedSkin]);

  // AI Telemetry Mind-Reader
  const telemetry = useMemo(() => {
    return calculateAiTelemetry(difficulty, stats.history, isExpandedMode);
  }, [difficulty, stats.history, isExpandedMode]);

  // Audio mute handler
  const handleToggleMute = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  // Change AI Difficulty
  const handleSelectDifficulty = (newDiff: Difficulty) => {
    setDifficulty(newDiff);
    setDialogueText(getOpponentDialogue(newDiff, 'ready'));
  };

  // Reset current match state
  const resetMatchState = useCallback(() => {
    setMatchPlayerWins(0);
    setMatchAiWins(0);
    setMatchDraws(0);
    setMatchRounds(0);
    setSurvivalLives(3);
    setPhase('ready');
    setPlayerMove(null);
    setAiMove(null);
    setLastResult(null);
    setClashEffect(null);
    setIsMatchOverModalOpen(false);
  }, []);

  // Change Game Mode
  const handleSelectGameMode = (mode: GameMode) => {
    setGameMode(mode);
    resetMatchState();
  };

  // Target wins for tournaments
  const targetWins = gameMode === 'best_of_3' ? 2 : gameMode === 'best_of_5' ? 3 : 0;

  // Equip skin
  const handleEquipSkin = (skinId: SkinId) => {
    const updated: PlayerStats = {
      ...stats,
      equippedSkin: skinId
    };
    savePlayerStats(updated);
    setStats(updated);
  };

  // Dismiss unlock notification
  const handleDismissAlert = (id: string) => {
    setUnlockAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  // Execute clash calculation
  const executeClash = useCallback((chosenPlayerMove: Move) => {
    const opponentMove = generateAiMove(difficulty, stats.history, isExpandedMode);
    const result = determineResult(chosenPlayerMove, opponentMove);
    const effect = getClashEffect(chosenPlayerMove, opponentMove);

    setAiMove(opponentMove);
    setLastResult(result);
    setClashEffect(effect);
    setPhase('clash');

    // Audio SFX
    sound.playShootWhoosh();
    setTimeout(() => {
      sound.playClash(effect.type);
      if (result === 'win') {
        sound.playVictory();
      } else if (result === 'lose') {
        sound.playDefeat();
      }
    }, 120);

    // Update match scores
    const newPlayerWins = matchPlayerWins + (result === 'win' ? 1 : 0);
    const newAiWins = matchAiWins + (result === 'lose' ? 1 : 0);
    const newDraws = matchDraws + (result === 'draw' ? 1 : 0);
    const newRounds = matchRounds + 1;
    let newLives = survivalLives;

    if (gameMode === 'survival' && result === 'lose') {
      newLives = Math.max(0, survivalLives - 1);
      setSurvivalLives(newLives);
    }

    setMatchPlayerWins(newPlayerWins);
    setMatchAiWins(newAiWins);
    setMatchDraws(newDraws);
    setMatchRounds(newRounds);

    // Update Opponent commentary
    const opponentQuote = getOpponentDialogue(difficulty, result);
    setDialogueText(opponentQuote);

    // Save to persistent stats
    const record: RoundRecord = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      roundNumber: newRounds,
      timestamp: Date.now(),
      playerMove: chosenPlayerMove,
      aiMove: opponentMove,
      result: result,
      difficulty: difficulty,
      commentary: effect.description
    };
    
    // Evaluate unlocks
    setStats((prev) => {
      const recorded = recordRound(prev, record);
      const isTournamentWon = (gameMode === 'best_of_3' && newPlayerWins >= 2) || (gameMode === 'best_of_5' && newPlayerWins >= 3);
      const { newlyUnlockedAchievements, newlyUnlockedSkins, updatedStats } = evaluateUnlocks(
        recorded,
        { result, playerMove: chosenPlayerMove, difficulty },
        isTournamentWon,
        newRounds
      );

      if (newlyUnlockedAchievements.length > 0 || newlyUnlockedSkins.length > 0) {
        sound.playStreakChime();
        const alerts: UnlockAlert[] = [
          ...newlyUnlockedSkins.map((s) => ({
            id: `skin_${s.id}_${Date.now()}`,
            type: 'skin' as const,
            title: s.name,
            description: s.description
          })),
          ...newlyUnlockedAchievements.map((a) => ({
            id: `ach_${a.id}_${Date.now()}`,
            type: 'achievement' as const,
            title: a.title,
            description: a.description
          }))
        ];
        setUnlockAlerts((existing) => [...existing, ...alerts]);
        savePlayerStats(updatedStats);
        return updatedStats;
      }

      return recorded;
    });

    // Transition to result or match_over
    setTimeout(() => {
      let isMatchFinished = false;
      if (gameMode === 'best_of_3' && (newPlayerWins >= 2 || newAiWins >= 2)) {
        isMatchFinished = true;
      } else if (gameMode === 'best_of_5' && (newPlayerWins >= 3 || newAiWins >= 3)) {
        isMatchFinished = true;
      } else if (gameMode === 'survival' && newLives <= 0) {
        isMatchFinished = true;
      }

      if (isMatchFinished) {
        setPhase('match_over');
        setIsMatchOverModalOpen(true);
      } else {
        setPhase('result');
      }
    }, 1200);
  }, [difficulty, stats.history, isExpandedMode, matchPlayerWins, matchAiWins, matchDraws, matchRounds, survivalLives, gameMode]);

  // Handle player choosing a move
  const handleSelectMove = useCallback((move: Move) => {
    if (phase !== 'ready' && phase !== 'result') return;

    setPlayerMove(move);
    setAiMove(null);
    setLastResult(null);
    setClashEffect(null);

    if (isFastMode) {
      executeClash(move);
    } else {
      setPhase('countdown');
      setCountdownStep(3);
      sound.playCountdownTick(3);

      setTimeout(() => {
        setCountdownStep(2);
        sound.playCountdownTick(2);
      }, 350);

      setTimeout(() => {
        setCountdownStep(1);
        sound.playCountdownTick(1);
      }, 700);

      setTimeout(() => {
        executeClash(move);
      }, 1050);
    }
  }, [phase, isFastMode, executeClash]);

  // Proceed to next round
  const handleNextRound = () => {
    setPhase('ready');
    setPlayerMove(null);
    setAiMove(null);
    setLastResult(null);
    setClashEffect(null);
    setDialogueText(getOpponentDialogue(difficulty, 'ready'));
  };

  // Reset player stats
  const handleResetAllStats = () => {
    const fresh = resetPlayerStats();
    setStats(fresh);
    resetMatchState();
  };

  const currentOpponent = OPPONENT_PROFILES[difficulty];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* 1. Header (Anti-Slop Top Bar Contract) */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20">
            <Swords className="w-5 h-5" />
          </div>
          <span className="font-display text-xl font-extrabold tracking-wider text-slate-100 uppercase">
            Battle Hands
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => {
              sound.playClick();
              setIsArmoryOpen(true);
            }}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Gauntlet Armory</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded border border-amber-500/40 font-mono">
              {currentSkin.name}
            </span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setIsStatsOpen(true);
            }}
            className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Match Records & Trophies
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setIsRulesOpen(true);
            }}
            className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            How to Play
          </button>
        </nav>

        {/* Zone 3: Primary Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              setIsArmoryOpen(true);
            }}
            className="md:hidden p-2 text-amber-400 bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Gauntlet Armory"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setIsStatsOpen(true);
            }}
            className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Stats & Trophies</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setIsRulesOpen(true);
            }}
            className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Rules & Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Game Arena Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto flex flex-col justify-between py-3 relative">
        
        {/* Top Controls: Match Mode Selector */}
        <MatchModeSelector
          currentMode={gameMode}
          onSelectMode={handleSelectGameMode}
          isFastMode={isFastMode}
          onToggleFastMode={() => setIsFastMode(!isFastMode)}
          isExpandedMode={isExpandedMode}
          onToggleExpandedMode={() => setIsExpandedMode(!isExpandedMode)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          isFighting={phase === 'countdown' || phase === 'clash'}
        />

        {/* Opponent Selection & Live Speech Bubble */}
        <OpponentSelect
          currentDifficulty={difficulty}
          onSelectDifficulty={handleSelectDifficulty}
          dialogueText={dialogueText}
          isFighting={phase === 'countdown' || phase === 'clash'}
        />

        {/* Live Scoreboard */}
        <Scoreboard
          playerWins={matchPlayerWins}
          aiWins={matchAiWins}
          draws={matchDraws}
          totalRounds={matchRounds}
          currentStreak={stats.currentStreak}
          bestStreak={stats.bestStreak}
          gameMode={gameMode}
          targetWins={targetWins}
          survivalLivesRemaining={survivalLives}
          opponent={currentOpponent}
        />

        {/* AI Tactical Radar / Psychological Predictor (Interactive Telemetry) */}
        <AiRadar
          telemetry={telemetry}
          difficulty={difficulty}
          isOpen={isRadarOpen}
          onToggle={() => setIsRadarOpen(!isRadarOpen)}
        />

        {/* BATTLE ARENA STAGE (Dynamic themed lighting) */}
        <div className={`relative w-full max-w-4xl mx-auto my-auto min-h-[290px] md:min-h-[340px] px-6 py-4 flex items-center justify-between rounded-3xl bg-gradient-to-b ${currentOpponent.arenaTheme} shadow-2xl overflow-hidden transition-all duration-700`}>
          
          {/* Subtle Stage Grid Backdrop */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          
          {/* Floor Battle Line Center Divider */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-slate-800/60 to-transparent pointer-events-none" />

          {/* Left Fighter: Player Hand (Equipped Skin) */}
          <div className="w-1/2 flex flex-col items-center justify-center z-10">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1">
              <span>Challenger</span>
              <span className="text-[9px] text-amber-400/80">({currentSkin.name})</span>
            </span>
            <BattleHand
              isAi={false}
              phase={phase}
              selectedMove={playerMove}
              countdownStep={countdownStep}
              result={lastResult}
              isExpandedMode={isExpandedMode}
              skin={currentSkin}
            />
          </div>

          {/* Center Battle Effects / Countdown / Verdict Overlay */}
          <ArenaEffects
            phase={phase}
            countdownStep={countdownStep}
            clashEffect={clashEffect}
            result={lastResult}
          />

          {/* Right Fighter: AI Opponent Hand */}
          <div className="w-1/2 flex flex-col items-center justify-center z-10">
            <span className={`text-[11px] font-mono font-semibold uppercase tracking-widest ${currentOpponent.avatarColor} mb-2`}>
              {currentOpponent.name}
            </span>
            <BattleHand
              isAi={true}
              phase={phase}
              selectedMove={aiMove}
              countdownStep={countdownStep}
              result={lastResult}
              isExpandedMode={isExpandedMode}
            />
          </div>
        </div>

        {/* Hand Selector Bottom Dock */}
        <div className="mt-3 mb-2">
          <HandSelector
            onSelectMove={handleSelectMove}
            phase={phase}
            selectedMove={playerMove}
            isExpandedMode={isExpandedMode}
            onNextRound={handleNextRound}
          />
        </div>

      </main>

      {/* Footer (Clean & quiet) */}
      <footer className="border-t border-slate-900 py-3 px-6 text-center text-xs text-slate-500">
        <span>Battle Hands © 2026</span>
        <span className="mx-2">·</span>
        <span>Keyboard: 1 (Rock) · 2 (Paper) · 3 (Scissors) · Space (Next Round)</span>
      </footer>

      {/* Stats & Trophies Modal */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        onResetStats={handleResetAllStats}
      />

      {/* Gauntlet Armory Modal */}
      <ArmoryModal
        isOpen={isArmoryOpen}
        onClose={() => setIsArmoryOpen(false)}
        equippedSkinId={stats.equippedSkin || 'classic'}
        unlockedSkins={stats.unlockedSkins || ['classic']}
        onEquipSkin={handleEquipSkin}
      />

      {/* Tournament Game Over Modal */}
      <MatchOverModal
        isOpen={isMatchOverModalOpen}
        gameMode={gameMode}
        playerWins={matchPlayerWins}
        aiWins={matchAiWins}
        roundsSurvived={matchRounds}
        opponent={currentOpponent}
        onPlayAgain={resetMatchState}
        onOpenStats={() => {
          setIsMatchOverModalOpen(false);
          setIsStatsOpen(true);
        }}
      />

      {/* Unlock Toast Alerts */}
      <UnlockToast alerts={unlockAlerts} onDismiss={handleDismissAlert} />

      {/* Rules & How to Play Modal */}
      {isRulesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-display text-lg font-bold uppercase tracking-wide flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                Battle Hands Rules & Strategies
              </h3>
              <button
                onClick={() => {
                  sound.playClick();
                  setIsRulesOpen(false);
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs md:text-sm text-slate-300">
              <div>
                <h4 className="font-bold text-amber-400 mb-1">Classic Rules:</h4>
                <ul className="space-y-1 list-disc list-inside text-slate-400">
                  <li><strong className="text-slate-200">Rock</strong> bludgeons and crushes <strong className="text-rose-300">Scissors</strong>.</li>
                  <li><strong className="text-slate-200">Paper</strong> covers and smothers <strong className="text-amber-300">Rock</strong>.</li>
                  <li><strong className="text-slate-200">Scissors</strong> cuts and shreds <strong className="text-emerald-300">Paper</strong>.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-purple-400 mb-1">Expanded Mode (RPS-LS):</h4>
                <p className="text-slate-400">
                  Adds <strong>Lizard</strong> and <strong>Spock</strong> for deeper tactical play:
                  Rock crushes Lizard, Lizard poisons Spock, Spock smashes Scissors, Scissors decapitates Lizard, Lizard eats Paper, Paper disproves Spock, Spock vaporizes Rock.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-cyan-400 mb-1">AI Difficulty Levels:</h4>
                <ul className="space-y-1.5 text-slate-400">
                  <li><strong className="text-emerald-300">Rookie Ralph (Novice):</strong> Casual play, picks mostly random hands.</li>
                  <li><strong className="text-amber-300">Sergeant Stone (Tactician):</strong> Exploits human Win-Stay / Lose-Shift reflexes.</li>
                  <li><strong className="text-cyan-300">Cipher Master (Strategic):</strong> Uses a Markov transition chain to predict your move sequence.</li>
                  <li><strong className="text-fuchsia-300">The Oracle (Master):</strong> High-IQ psychological predictor that anticipates second-order counters.</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setIsRulesOpen(false);
              }}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase rounded-xl transition-colors cursor-pointer"
            >
              Got it, let&apos;s fight!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
