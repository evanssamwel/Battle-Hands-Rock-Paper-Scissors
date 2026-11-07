import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Move, BattlePhase, Result, HandSkin } from '../types/game';
import { HandSvg } from './HandSvg';

interface BattleHandProps {
  isAi: boolean;
  phase: BattlePhase;
  selectedMove: Move | null;
  countdownStep: number; // 3, 2, 1
  result: Result | null;
  isExpandedMode?: boolean;
  skin?: HandSkin;
}

export const BattleHand: React.FC<BattleHandProps> = ({
  isAi,
  phase,
  selectedMove,
  countdownStep,
  result,
  skin
}) => {
  // During countdown or ready with no move yet, show closed fist (rock)
  const isCountdown = phase === 'countdown';
  const isClashOrResult = phase === 'clash' || phase === 'result' || phase === 'match_over';
  const displayMove: Move = isClashOrResult && selectedMove ? selectedMove : 'rock';

  // Determine if this hand won, lost, or drew
  const isWinner = result === (isAi ? 'lose' : 'win');
  const isLoser = result === (isAi ? 'win' : 'lose');
  const isDraw = result === 'draw';

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Hand Aura / Battle Ring */}
      <div
        className={`absolute w-44 h-44 rounded-full blur-2xl transition-all duration-500 pointer-events-none ${
          isAi
            ? isWinner
              ? 'bg-rose-500/35 scale-125'
              : 'bg-rose-600/15'
            : isWinner
            ? 'scale-125'
            : 'opacity-70'
        }`}
        style={!isAi ? { backgroundColor: skin?.colors.glow || 'rgba(245,158,11,0.2)' } : undefined}
      />

      {/* Animated Motion Hand Container */}
      <motion.div
        className="relative z-10"
        initial={{ y: 0, x: 0, rotate: 0 }}
        animate={
          isCountdown
            ? {
                // Energetic 3-2-1 fist pumping
                y: [0, -38, 12, 0],
                rotate: isAi ? [0, 8, -4, 0] : [0, -8, 4, 0],
                transition: {
                  duration: 0.38,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }
              }
            : isClashOrResult
            ? isWinner
              ? {
                  // Forward thrust & proud victory pulse
                  x: isAi ? -18 : 18,
                  y: -10,
                  scale: 1.15,
                  rotate: isAi ? -12 : 12,
                  transition: { type: 'spring', stiffness: 350, damping: 18 }
                }
              : isLoser
              ? {
                  // Knocked backwards & down
                  x: isAi ? 35 : -35,
                  y: 30,
                  scale: 0.88,
                  rotate: isAi ? 25 : -25,
                  opacity: 0.7,
                  transition: { type: 'spring', stiffness: 220, damping: 20 }
                }
              : isDraw
              ? {
                  // Deadlocked shake
                  x: isAi ? [-6, 6, -3, 3, 0] : [6, -6, 3, -3, 0],
                  y: [0, -4, 4, 0],
                  scale: 1.05,
                  transition: { duration: 0.4 }
                }
              : {
                  x: isAi ? -15 : 15,
                  scale: 1.05
                }
            : {
                // Idle breathing float
                y: [0, -6, 0],
                transition: {
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }
              }
        }
      >
        <div
          className={`transform transition-transform ${
            isAi ? 'scale-x-[-1] -rotate-45' : 'rotate-45'
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={displayMove + (isCountdown ? countdownStep : 'static')}
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0.5 }}
              transition={{ duration: 0.15 }}
            >
              <HandSvg
                move={displayMove}
                isAi={isAi}
                skin={!isAi ? skin : undefined}
                size={160}
                className="transition-all duration-300"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Hand Label Badge */}
      <div className="mt-3 text-center">
        <span
          className={`inline-block font-display text-sm tracking-wider uppercase font-semibold transition-colors ${
            isAi ? 'text-rose-400' : 'text-amber-400'
          }`}
        >
          {isClashOrResult && selectedMove ? selectedMove : isCountdown ? 'SHAKING...' : 'READY'}
        </span>
      </div>
    </div>
  );
};
