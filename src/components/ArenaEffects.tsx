import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { BattlePhase, ClashEffectData, Result } from '../types/game';

interface ArenaEffectsProps {
  phase: BattlePhase;
  countdownStep: number;
  clashEffect: ClashEffectData | null;
  result: Result | null;
}

export const ArenaEffects: React.FC<ArenaEffectsProps> = ({
  phase,
  countdownStep,
  clashEffect,
  result
}) => {
  // Fire celebratory confetti on player victory
  useEffect(() => {
    if ((phase === 'clash' || phase === 'result') && result === 'win') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#FBBF24', '#38BDF8', '#10B981', '#FFFFFF']
      });
    }
  }, [phase, result]);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center overflow-hidden z-20">
      {/* 1. Countdown Phase ("3", "2", "1", "SHOOT!") */}
      <AnimatePresence>
        {phase === 'countdown' && (
          <motion.div
            key={countdownStep}
            initial={{ scale: 2.2, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center"
          >
            <span className="font-display text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_0_35px_rgba(245,158,11,0.6)]">
              {countdownStep === 3 ? '3' : countdownStep === 2 ? '2' : '1'}
            </span>
            <span className="text-xs uppercase tracking-widest text-amber-300/80 font-bold mt-1">
              {countdownStep === 3 ? 'ROCK' : countdownStep === 2 ? 'PAPER' : 'SCISSORS'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Clash Shockwave & Result Headline */}
      <AnimatePresence>
        {(phase === 'clash' || phase === 'result') && clashEffect && (
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 450, damping: 22 }}
            className="flex flex-col items-center text-center px-4"
          >
            {/* Impact Flash Shockwave Ring */}
            <motion.div
              initial={{ scale: 0.2, opacity: 0.9 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`absolute w-36 h-36 rounded-full border-4 ${
                result === 'win'
                  ? 'border-amber-400'
                  : result === 'lose'
                  ? 'border-rose-500'
                  : 'border-slate-300'
              }`}
            />

            {/* Verdict Badge */}
            <div
              className={`px-4 py-1.5 rounded-full border backdrop-blur-md shadow-2xl mb-2 flex items-center gap-2 ${
                result === 'win'
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                  : result === 'lose'
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                  : 'bg-slate-800/80 border-slate-600 text-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full animate-ping inline-block"
                style={{
                  backgroundColor: result === 'win' ? '#F59E0B' : result === 'lose' ? '#F43F5E' : '#94A3B8'
                }}
              />
              <span className="font-display text-sm md:text-base font-bold tracking-wider uppercase">
                {result === 'win' ? 'Round Victory' : result === 'lose' ? 'Round Defeat' : 'Even Stalemate'}
              </span>
            </div>

            {/* Dramatic Action Word */}
            <h2
              className={`font-display text-4xl md:text-6xl font-black tracking-wider uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] ${clashEffect.color}`}
            >
              {clashEffect.headline}
            </h2>

            {/* Matchup Description */}
            <p className="text-xs md:text-sm text-slate-300 max-w-sm mt-1 bg-slate-950/70 px-3 py-1 rounded-md backdrop-blur-sm border border-slate-800">
              {clashEffect.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Ready State Subtle Arena Center Text */}
      {phase === 'ready' && (
        <div className="flex flex-col items-center text-slate-500 select-none">
          <div className="font-display text-3xl font-extrabold tracking-widest text-slate-700/60">
            VS
          </div>
          <span className="text-[11px] font-medium tracking-wide uppercase text-slate-500/80 mt-1">
            Pick your hand below
          </span>
        </div>
      )}
    </div>
  );
};
