import React from 'react';
import { GameMode } from '../types/game';
import { Volume2, VolumeX, Zap, Award, Flame, Infinity as InfinityIcon } from 'lucide-react';
import { sound } from '../utils/audio';

interface MatchModeSelectorProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  isFastMode: boolean;
  onToggleFastMode: () => void;
  isExpandedMode: boolean;
  onToggleExpandedMode: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isFighting: boolean;
}

export const MatchModeSelector: React.FC<MatchModeSelectorProps> = ({
  currentMode,
  onSelectMode,
  isFastMode,
  onToggleFastMode,
  isExpandedMode,
  onToggleExpandedMode,
  isMuted,
  onToggleMute,
  isFighting
}) => {
  const modes: { id: GameMode; label: string; icon: React.ReactNode }[] = [
    { id: 'freeplay', label: 'Endless Freeplay', icon: <InfinityIcon className="w-3.5 h-3.5" /> },
    { id: 'best_of_3', label: 'Best of 3', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'best_of_5', label: 'Best of 5', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'survival', label: 'Survival Gauntlet', icon: <Flame className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-3 flex flex-wrap items-center justify-between gap-2.5 text-xs">
      {/* Mode Buttons */}
      <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 overflow-x-auto">
        {modes.map((m) => {
          const isSelected = currentMode === m.id;
          return (
            <button
              key={m.id}
              disabled={isFighting}
              onClick={() => {
                sound.playClick();
                onSelectMode(m.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              } ${isFighting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Auxiliary Toggles */}
      <div className="flex items-center gap-2">
        {/* Expanded Mode (Lizard / Spock) */}
        <button
          disabled={isFighting}
          onClick={() => {
            sound.playClick();
            onToggleExpandedMode();
          }}
          className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
            isExpandedMode
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          } ${isFighting ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Toggle Rock-Paper-Scissors-Lizard-Spock mode"
        >
          {isExpandedMode ? 'RPS-LS: ON' : '+ Lizard Spock'}
        </button>

        {/* Fast Mode Toggle */}
        <button
          onClick={() => {
            sound.playClick();
            onToggleFastMode();
          }}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
            isFastMode
              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
          title="Skip 3-2-1 countdown for rapid fire clashes"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{isFastMode ? 'Fast: ON' : 'Fast: OFF'}</span>
        </button>

        {/* Audio Mute Toggle */}
        <button
          onClick={onToggleMute}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
        </button>
      </div>
    </div>
  );
};
