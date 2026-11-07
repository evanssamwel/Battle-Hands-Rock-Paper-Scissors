import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Sparkles, X } from 'lucide-react';

export interface UnlockAlert {
  id: string;
  type: 'skin' | 'achievement';
  title: string;
  description: string;
}

interface UnlockToastProps {
  alerts: UnlockAlert[];
  onDismiss: (id: string) => void;
}

export const UnlockToast: React.FC<UnlockToastProps> = ({ alerts, onDismiss }) => {
  return (
    <div className="fixed top-18 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="pointer-events-auto bg-slate-900 border border-amber-400/60 p-3.5 rounded-xl shadow-2xl flex items-start gap-3 backdrop-blur-md ring-1 ring-amber-400/20"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-400/40 flex items-center justify-center shrink-0">
              {alert.type === 'skin' ? (
                <Sparkles className="w-5 h-5 animate-pulse" />
              ) : (
                <Trophy className="w-5 h-5 animate-bounce" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                {alert.type === 'skin' ? 'Gauntlet Skin Unlocked!' : 'Achievement Unlocked!'}
              </span>
              <h4 className="font-display text-sm font-bold text-white truncate">
                {alert.title}
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">
                {alert.description}
              </p>
            </div>

            <button
              onClick={() => onDismiss(alert.id)}
              className="text-slate-500 hover:text-slate-300 p-0.5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
