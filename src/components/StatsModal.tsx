import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, BarChart3, History, RotateCcw, Download, ShieldCheck, Flame, Award, Lock, Check } from 'lucide-react';
import { PlayerStats, Result, Difficulty, Move } from '../types/game';
import { OPPONENT_PROFILES } from '../utils/aiStrategy';
import { INITIAL_ACHIEVEMENTS } from '../utils/cosmeticsAndAchievements';
import { sound } from '../utils/audio';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onResetStats
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'achievements'>('overview');
  const [historyFilter, setHistoryFilter] = useState<'all' | Result>('all');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const winRate = stats.totalRounds > 0 ? Math.round((stats.playerWins / stats.totalRounds) * 100) : 0;

  // Move distribution calculation
  const totalPlayerMoves = Object.values(stats.movesCount).reduce((a, b) => a + b, 0);
  const getMovePercent = (move: Move) => {
    if (totalPlayerMoves === 0) return 0;
    return Math.round(((stats.movesCount[move] || 0) / totalPlayerMoves) * 100);
  };

  const filteredHistory = stats.history.filter((rec) => {
    if (historyFilter === 'all') return true;
    return rec.result === historyFilter;
  });

  // Export history to JSON
  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(stats, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `battle_hands_stats_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="font-display text-xl font-bold tracking-wide">
              PLAYER STATISTICS & MATCH HISTORY
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-950/50 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('overview');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Performance Analytics</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('history');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Match History ({stats.history.length})</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('achievements');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'achievements'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Trophies ({Object.values(stats.achievements || {}).filter(a => a.unlocked).length}/{INITIAL_ACHIEVEMENTS.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              title="Export Stats as JSON"
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={() => setShowConfirmReset(true)}
              title="Reset all stats"
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'overview' ? (
            <>
              {/* Top High-level Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-xs text-slate-400 block font-medium">Win Rate</span>
                  <div className="font-display text-3xl font-bold text-amber-400 font-mono-numbers mt-1">
                    {winRate}%
                  </div>
                  <span className="text-[11px] text-slate-500">{stats.playerWins}W - {stats.aiWins}L - {stats.draws}D</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-xs text-slate-400 block font-medium">Best Streak</span>
                  <div className="font-display text-3xl font-bold text-emerald-400 font-mono-numbers mt-1 flex items-center gap-1">
                    <Flame className="w-5 h-5 text-amber-400" />
                    {stats.bestStreak}
                  </div>
                  <span className="text-[11px] text-slate-500">Current: {stats.currentStreak} wins</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-xs text-slate-400 block font-medium">Total Rounds</span>
                  <div className="font-display text-3xl font-bold text-sky-400 font-mono-numbers mt-1">
                    {stats.totalRounds}
                  </div>
                  <span className="text-[11px] text-slate-500">All game modes</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-xs text-slate-400 block font-medium">Clash Draws</span>
                  <div className="font-display text-3xl font-bold text-purple-400 font-mono-numbers mt-1">
                    {stats.draws}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {stats.totalRounds > 0 ? Math.round((stats.draws / stats.totalRounds) * 100) : 0}% of all rounds
                  </span>
                </div>
              </div>

              {/* Hand Usage Distribution Breakdown */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <h3 className="font-display text-sm font-bold tracking-wider uppercase text-slate-300 mb-3">
                  Your Move Frequency & Success Rate
                </h3>
                <div className="space-y-3">
                  {(['rock', 'paper', 'scissors'] as Move[]).map((move) => {
                    const count = stats.movesCount[move] || 0;
                    const won = stats.movesWon[move] || 0;
                    const pct = getMovePercent(move);
                    const moveWinRate = count > 0 ? Math.round((won / count) * 100) : 0;

                    const label = move === 'rock' ? 'Rock' : move === 'paper' ? 'Paper' : 'Scissors';
                    const color = move === 'rock' ? 'bg-amber-500' : move === 'paper' ? 'bg-emerald-500' : 'bg-rose-500';

                    return (
                      <div key={move}>
                        <div className="flex items-center justify-between text-xs font-medium mb-1">
                          <span className="text-slate-200 font-semibold">{label}</span>
                          <span className="text-slate-400">
                            {count} plays ({pct}%) · Won {won} ({moveWinRate}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                          <div
                            className={`h-full ${color} transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Performance by AI Difficulty */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <h3 className="font-display text-sm font-bold tracking-wider uppercase text-slate-300 mb-3">
                  Record Versus AI Opponents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(['novice', 'tactician', 'cipher', 'oracle'] as Difficulty[]).map((diff) => {
                    const profile = OPPONENT_PROFILES[diff];
                    const diffData = stats.difficultyStats[diff] || { wins: 0, losses: 0, draws: 0 };
                    const diffTotal = diffData.wins + diffData.losses + diffData.draws;
                    const diffWinRate = diffTotal > 0 ? Math.round((diffData.wins / diffTotal) * 100) : 0;

                    return (
                      <div
                        key={diff}
                        className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${profile.avatarBg} ${profile.avatarColor}`}>
                              {profile.levelBadge}
                            </span>
                            <span className="font-semibold text-xs text-slate-200">{profile.name}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {diffData.wins}W - {diffData.losses}L - {diffData.draws}D ({diffTotal} rounds)
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-display text-base font-bold text-amber-400 font-mono-numbers">
                            {diffWinRate}%
                          </span>
                          <span className="text-[10px] text-slate-500 block">Win rate</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : activeTab === 'history' ? (
            /* Match History Table */
            <div className="space-y-3">
              {/* Filter controls */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 mr-1">Filter:</span>
                {(['all', 'win', 'lose', 'draw'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setHistoryFilter(filter)}
                    className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors cursor-pointer ${
                      historyFilter === filter
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {filter === 'all' ? 'All Matches' : `${filter}s`}
                  </button>
                ))}
              </div>

              {filteredHistory.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">
                  No rounds recorded matching this filter yet.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {filteredHistory.map((rec) => {
                    const isWin = rec.result === 'win';
                    const isLoss = rec.result === 'lose';
                    const opp = OPPONENT_PROFILES[rec.difficulty];
                    const date = new Date(rec.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    });

                    return (
                      <div
                        key={rec.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`font-display font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                              isWin
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : isLoss
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                          >
                            {rec.result}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-200 uppercase">
                              {rec.playerMove}
                            </span>
                            <span className="text-slate-500 text-[10px]">vs</span>
                            <span className="font-semibold text-slate-300 uppercase">
                              {rec.aiMove}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                          <span>vs {opp.name} ({opp.levelBadge})</span>
                          <span>·</span>
                          <span className="font-mono-numbers">{date}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Achievements / Trophy Hall Tab */
            <div className="space-y-4">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Earn trophies by mastering moves, sustaining streaks, and defeating AI masters.</span>
                <span className="font-mono text-amber-400 font-bold">
                  {Object.values(stats.achievements || {}).filter(a => a.unlocked).length} / {INITIAL_ACHIEVEMENTS.length} Complete
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INITIAL_ACHIEVEMENTS.map((ach) => {
                  const unlockedRecord = stats.achievements?.[ach.id];
                  const isUnlocked = !!unlockedRecord?.unlocked;

                  return (
                    <div
                      key={ach.id}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                        isUnlocked
                          ? 'bg-slate-950/80 border-amber-500/40 shadow-sm'
                          : 'bg-slate-950/30 border-slate-800/80 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                          isUnlocked
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                            : 'bg-slate-900 text-slate-600 border-slate-800'
                        }`}
                      >
                        {isUnlocked ? <Trophy className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className={`font-display text-sm font-bold truncate ${isUnlocked ? 'text-slate-100' : 'text-slate-400'}`}>
                            {ach.title}
                          </h4>
                          {isUnlocked ? (
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                              CLAIMED
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-500">
                              Target: {ach.targetValue}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                          {ach.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Reset Confirmation Prompt Overlay */}
        <AnimatePresence>
          {showConfirmReset && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-6"
            >
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl max-w-sm text-center">
                <h4 className="font-display text-lg font-bold text-rose-400 mb-2">
                  Reset All Statistics?
                </h4>
                <p className="text-xs text-slate-300 mb-5">
                  This will erase all recorded games, win/loss history, streaks, and difficulty statistics.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onResetStats();
                      setShowConfirmReset(false);
                    }}
                    className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Yes, Reset Everything
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
