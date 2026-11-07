import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Flame, RotateCcw, BarChart2 } from 'lucide-react';
import { GameMode, OpponentProfile } from '../types/game';
import { sound } from '../utils/audio';

interface MatchOverModalProps {
  isOpen: boolean;
  gameMode: GameMode;
  playerWins: number;
  aiWins: number;
  roundsSurvived?: number;
  opponent: OpponentProfile;
  onPlayAgain: () => void;
  onOpenStats: () => void;
}

export const MatchOverModal: React.FC<MatchOverModalProps> = ({
  isOpen,
  gameMode,
  playerWins,
  aiWins,
  roundsSurvived = 0,
  opponent,
  onPlayAgain,
  onOpenStats
}) => {
  if (!isOpen) return null;

  const isTournament = gameMode === 'best_of_3' || gameMode === 'best_of_5';
  const playerWonMatch = isTournament ? playerWins > aiWins : roundsSurvived >= 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl text-center flex flex-col items-center"
      >
        {/* Victory Icon / Banner */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
            playerWonMatch
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
          }`}
        >
          {playerWonMatch ? (
            <Trophy className="w-8 h-8 animate-bounce" />
          ) : (
            <Flame className="w-8 h-8" />
          )}
        </div>

        <h3 className="font-display text-3xl font-extrabold uppercase tracking-wide text-slate-100">
          {playerWonMatch ? 'Tournament Champion!' : 'Tournament Concluded'}
        </h3>

        <p className="text-xs md:text-sm text-slate-400 mt-1.5 max-w-xs">
          {gameMode === 'survival'
            ? `You survived ${roundsSurvived} battle rounds against ${opponent.name}!`
            : playerWonMatch
            ? `Spectacular victory against ${opponent.name} (${opponent.levelBadge})!`
            : `${opponent.name} clinched the tournament title this time.`}
        </p>

        {/* Final Score Pill */}
        {isTournament && (
          <div className="flex items-center justify-center gap-4 my-5 px-6 py-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">You</span>
              <span className="font-display text-3xl font-bold text-amber-400 font-mono-numbers">
                {playerWins}
              </span>
            </div>
            <span className="text-slate-600 font-bold text-lg">-</span>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">{opponent.name}</span>
              <span className="font-display text-3xl font-bold text-rose-400 font-mono-numbers">
                {aiWins}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-2">
          <button
            onClick={() => {
              sound.playClick();
              onPlayAgain();
            }}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-display text-base font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Rematch / New Match</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenStats();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <BarChart2 className="w-4 h-4" />
            <span>Stats</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
