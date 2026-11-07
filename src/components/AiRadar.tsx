import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, ChevronDown, ChevronUp, Eye, Sparkles, BrainCircuit } from 'lucide-react';
import { AiTelemetry, Difficulty } from '../types/game';
import { OPPONENT_PROFILES } from '../utils/aiStrategy';
import { sound } from '../utils/audio';

interface AiRadarProps {
  telemetry: AiTelemetry;
  difficulty: Difficulty;
  isOpen: boolean;
  onToggle: () => void;
}

export const AiRadar: React.FC<AiRadarProps> = ({
  telemetry,
  difficulty,
  isOpen,
  onToggle
}) => {
  const opponent = OPPONENT_PROFILES[difficulty];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-2 select-none">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
        {/* Toggle Button */}
        <button
          onClick={() => {
            sound.playClick();
            onToggle();
          }}
          className="w-full px-4 py-2 flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-display tracking-wider uppercase text-slate-200">
              AI Mind-Reader Radar & Game Theory Telemetry
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>{isOpen ? 'Hide Radar' : 'View Prediction'}</span>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {/* Expandable Telemetry Analysis */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-slate-800/80 px-4 py-3 bg-slate-950/60 text-xs"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                
                {/* 1. Move Prediction */}
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
                    Predicted Your Next Hand
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-bold text-amber-400 uppercase">
                      {telemetry.predictedPlayerMove}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-cyan-400">
                      {telemetry.confidence}% Conf.
                    </span>
                  </div>
                  {/* Confidence bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                      style={{ width: `${telemetry.confidence}%` }}
                    />
                  </div>
                </div>

                {/* 2. Tactical Rationale */}
                <div className="md:col-span-2 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-start gap-2">
                    <BrainCircuit className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                        Psychological Modeling ({opponent.name})
                      </span>
                      <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                        {telemetry.reasoning}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">To reverse-psychology this AI:</span>
                    <span className="font-display font-bold text-emerald-400 uppercase">
                      Play {telemetry.recommendedCounter}
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
