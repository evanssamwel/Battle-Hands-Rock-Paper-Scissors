import React from 'react';
import { Flame, Trophy, Shield, Heart } from 'lucide-react';
import { GameMode, OpponentProfile } from '../types/game';

interface ScoreboardProps {
  playerWins: number;
  aiWins: number;
  draws: number;
  totalRounds: number;
  currentStreak: number;
  bestStreak: number;
  gameMode: GameMode;
  targetWins: number;
  survivalLivesRemaining: number;
  opponent: OpponentProfile;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  playerWins,
  aiWins,
  draws,
  totalRounds,
  currentStreak,
  bestStreak,
  gameMode,
  targetWins,
  survivalLivesRemaining,
  opponent
}) => {
  const winRate = totalRounds > 0 ? Math.round((playerWins / totalRounds) * 100) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-4">
      {/* Primary Score Deck */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          
          {/* Player Corner */}
          <div className="flex items-center gap-3 justify-start">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-display text-xl font-bold">
              YOU
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-base font-bold text-slate-100 tracking-wide">
                  CHALLENGER
                </span>
                {currentStreak >= 2 && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40 animate-pulse">
                    <Flame className="w-3 h-3 fill-amber-400" />
                    {currentStreak} STREAK
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>Best: {bestStreak}</span>
                <span>·</span>
                <span className="font-mono-numbers">Win Rate: {winRate}%</span>
              </div>
            </div>
          </div>

          {/* Central Duel Score Display */}
          <div className="flex flex-col items-center justify-center border-y md:border-y-0 md:border-x border-slate-800 py-2 md:py-0 px-2">
            <div className="flex items-center justify-center gap-4">
              <span className="font-display font-black text-4xl text-amber-400 font-mono-numbers min-w-[2.5rem] text-right">
                {playerWins}
              </span>
              <span className="font-display text-xs tracking-widest text-slate-500 uppercase font-bold">
                VS
              </span>
              <span className="font-display font-black text-4xl text-rose-400 font-mono-numbers min-w-[2.5rem] text-left">
                {aiWins}
              </span>
            </div>

            {/* Draws and Total Rounds */}
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400 mt-1">
              <span>Draws: <b className="text-slate-200 font-mono-numbers">{draws}</b></span>
              <span>·</span>
              <span>Round: <b className="text-slate-200 font-mono-numbers">{totalRounds + 1}</b></span>
            </div>

            {/* Mode-specific status */}
            {gameMode === 'best_of_3' || gameMode === 'best_of_5' ? (
              <div className="flex items-center gap-3 mt-2 text-xs">
                <div className="flex gap-1.5 items-center">
                  {Array.from({ length: targetWins }).map((_, i) => (
                    <div
                      key={`p-${i}`}
                      className={`w-2.5 h-2.5 rounded-full border transition-all ${
                        i < playerWins
                          ? 'bg-amber-400 border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                          : 'bg-slate-800 border-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Target: {targetWins}
                </span>
                <div className="flex gap-1.5 items-center">
                  {Array.from({ length: targetWins }).map((_, i) => (
                    <div
                      key={`ai-${i}`}
                      className={`w-2.5 h-2.5 rounded-full border transition-all ${
                        i < aiWins
                          ? 'bg-rose-400 border-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                          : 'bg-slate-800 border-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : gameMode === 'survival' ? (
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[11px] text-slate-400 mr-1 font-medium">Lives:</span>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Heart
                    key={`heart-${i}`}
                    className={`w-4 h-4 transition-colors ${
                      i < survivalLivesRemaining
                        ? 'text-rose-500 fill-rose-500 animate-pulse'
                        : 'text-slate-700 fill-slate-800'
                    }`}
                  />
                ))}
              </div>
            ) : null}
          </div>

          {/* AI Opponent Corner */}
          <div className="flex items-center gap-3 justify-end text-right">
            <div>
              <div className="flex items-center justify-end gap-2">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${opponent.avatarBg} ${opponent.avatarColor}`}>
                  {opponent.levelBadge}
                </span>
                <span className="font-display text-base font-bold text-slate-100 tracking-wide">
                  {opponent.name}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5 truncate max-w-[180px]">
                {opponent.title}
              </div>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-display text-xl font-bold border ${opponent.avatarBg} ${opponent.avatarColor} ${opponent.borderColor}`}>
              AI
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
