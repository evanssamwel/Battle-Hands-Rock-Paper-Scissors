import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Move, BattlePhase } from '../types/game';
import { HandSvg } from './HandSvg';
import { sound } from '../utils/audio';

interface HandSelectorProps {
  onSelectMove: (move: Move) => void;
  phase: BattlePhase;
  selectedMove: Move | null;
  isExpandedMode: boolean;
  onNextRound?: () => void;
}

interface HandOption {
  move: Move;
  label: string;
  keyHint: string;
  altKey: string;
  beats: string;
  accentColor: string;
  borderColor: string;
}

export const HandSelector: React.FC<HandSelectorProps> = ({
  onSelectMove,
  phase,
  selectedMove,
  isExpandedMode,
  onNextRound
}) => {
  const options: HandOption[] = [
    {
      move: 'rock',
      label: 'Rock',
      keyHint: '1',
      altKey: 'R',
      beats: 'Crushes Scissors',
      accentColor: 'hover:bg-amber-500/15 text-amber-400',
      borderColor: 'border-amber-500/40 hover:border-amber-400'
    },
    {
      move: 'paper',
      label: 'Paper',
      keyHint: '2',
      altKey: 'P',
      beats: 'Covers Rock',
      accentColor: 'hover:bg-emerald-500/15 text-emerald-400',
      borderColor: 'border-emerald-500/40 hover:border-emerald-400'
    },
    {
      move: 'scissors',
      label: 'Scissors',
      keyHint: '3',
      altKey: 'S',
      beats: 'Cuts Paper',
      accentColor: 'hover:bg-rose-500/15 text-rose-400',
      borderColor: 'border-rose-500/40 hover:border-rose-400'
    },
    ...(isExpandedMode
      ? [
          {
            move: 'lizard' as Move,
            label: 'Lizard',
            keyHint: '4',
            altKey: 'L',
            beats: 'Eats Paper, Poisons Spock',
            accentColor: 'hover:bg-purple-500/15 text-purple-400',
            borderColor: 'border-purple-500/40 hover:border-purple-400'
          },
          {
            move: 'spock' as Move,
            label: 'Spock',
            keyHint: '5',
            altKey: 'K',
            beats: 'Smashes Scissors, Vaporizes Rock',
            accentColor: 'hover:bg-cyan-500/15 text-cyan-400',
            borderColor: 'border-cyan-500/40 hover:border-cyan-400'
          }
        ]
      : [])
  ];

  const isInteractive = phase === 'ready';
  const isResultPhase = phase === 'result';

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const key = e.key.toUpperCase();

      if (isResultPhase && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault();
        onNextRound?.();
        return;
      }

      if (!isInteractive) return;

      if (key === '1' || key === 'R') {
        sound.playClick();
        onSelectMove('rock');
      } else if (key === '2' || key === 'P') {
        sound.playClick();
        onSelectMove('paper');
      } else if (key === '3' || key === 'S') {
        sound.playClick();
        onSelectMove('scissors');
      } else if (isExpandedMode && (key === '4' || key === 'L')) {
        sound.playClick();
        onSelectMove('lizard');
      } else if (isExpandedMode && (key === '5' || key === 'K')) {
        sound.playClick();
        onSelectMove('spock');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInteractive, isResultPhase, isExpandedMode, onSelectMove, onNextRound]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* If currently showing result, provide clear Next Round prompt */}
      {isResultPhase ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3 py-2"
        >
          <button
            onClick={() => {
              sound.playClick();
              onNextRound?.();
            }}
            className="group relative px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-display text-lg font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Fight Next Round</span>
            <span className="text-xs px-2 py-0.5 bg-slate-950/20 text-slate-900 rounded font-mono font-medium">
              Space / Enter
            </span>
          </button>
          <span className="text-xs text-slate-400">Or pick a hand directly to fight instantly</span>
        </motion.div>
      ) : (
        <div className="text-center mb-2.5">
          <p className="text-xs md:text-sm font-medium text-slate-400">
            {phase === 'countdown' ? 'Brace for impact...' : 'Select your hand to initiate clash:'}
          </p>
        </div>
      )}

      {/* Hand Cards Grid */}
      <div className={`grid gap-3 ${isExpandedMode ? 'grid-cols-5' : 'grid-cols-3'}`}>
        {options.map((opt) => {
          const isSelected = selectedMove === opt.move && phase !== 'ready';
          return (
            <motion.button
              key={opt.move}
              whileHover={isInteractive ? { y: -4, scale: 1.02 } : {}}
              whileTap={isInteractive ? { scale: 0.96 } : {}}
              disabled={!isInteractive && !isResultPhase}
              onClick={() => {
                sound.playClick();
                onSelectMove(opt.move);
              }}
              className={`relative flex flex-col items-center justify-between p-3 md:p-4 rounded-xl border bg-slate-900/80 backdrop-blur-sm transition-all text-left cursor-pointer ${
                isSelected
                  ? 'border-amber-400 bg-amber-500/20 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/40'
                  : isInteractive || isResultPhase
                  ? `${opt.borderColor} ${opt.accentColor} hover:shadow-md`
                  : 'border-slate-800 opacity-60 cursor-not-allowed'
              }`}
            >
              {/* Keyboard Badge */}
              <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span className="font-semibold text-slate-300">{opt.label}</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-bold">
                  {opt.keyHint}
                </span>
              </div>

              {/* Hand Icon */}
              <div className="my-1.5 flex items-center justify-center">
                <HandSvg
                  move={opt.move}
                  size={isExpandedMode ? 56 : 74}
                  className="transition-transform group-hover:scale-110"
                />
              </div>

              {/* Matchup summary hint */}
              <div className="w-full text-center mt-1">
                <span className="text-[10px] md:text-[11px] text-slate-400 truncate block">
                  {opt.beats}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
