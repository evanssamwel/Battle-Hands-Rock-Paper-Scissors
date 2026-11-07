import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smile, Shield, Brain, Sparkles, MessageSquare } from 'lucide-react';
import { Difficulty, OpponentProfile } from '../types/game';
import { OPPONENT_PROFILES } from '../utils/aiStrategy';
import { sound } from '../utils/audio';

interface OpponentSelectProps {
  currentDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  dialogueText: string;
  isFighting: boolean;
}

export const OpponentSelect: React.FC<OpponentSelectProps> = ({
  currentDifficulty,
  onSelectDifficulty,
  dialogueText,
  isFighting
}) => {
  const currentOpponent = OPPONENT_PROFILES[currentDifficulty];

  const getIcon = (iconName: OpponentProfile['iconName']) => {
    switch (iconName) {
      case 'smile':
        return <Smile className="w-3.5 h-3.5" />;
      case 'shield':
        return <Shield className="w-3.5 h-3.5" />;
      case 'brain':
        return <Brain className="w-3.5 h-3.5" />;
      case 'sparkles':
        return <Sparkles className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  const difficulties: Difficulty[] = ['novice', 'tactician', 'cipher', 'oracle'];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-4">
      {/* Opponent Selection Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
        
        {/* Difficulty Segmented Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-slate-950/60 rounded-lg border border-slate-800/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-2 shrink-0">
            Opponent:
          </span>
          {difficulties.map((diff) => {
            const opp = OPPONENT_PROFILES[diff];
            const isSelected = currentDifficulty === diff;
            return (
              <button
                key={diff}
                disabled={isFighting}
                onClick={() => {
                  sound.playClick();
                  onSelectDifficulty(diff);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? `${opp.avatarBg} ${opp.avatarColor} border ${opp.borderColor} shadow-sm`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                } ${isFighting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {getIcon(opp.iconName)}
                <span>{opp.name}</span>
                <span className="text-[10px] opacity-75 font-normal">({opp.levelBadge})</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Opponent Speech Bubble */}
        <div className="flex items-center gap-2 text-xs w-full sm:w-auto flex-1 justify-end px-1">
          <MessageSquare className="w-4 h-4 text-slate-500 shrink-0" />
          <AnimatePresence mode="wait">
            <motion.p
              key={dialogueText}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-slate-300 italic truncate max-w-sm text-right"
            >
              &ldquo;{dialogueText}&rdquo;
            </motion.p>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
