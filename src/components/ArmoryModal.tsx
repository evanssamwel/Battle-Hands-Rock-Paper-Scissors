import React from 'react';
import { motion } from 'motion/react';
import { X, Shield, Lock, CheckCircle, Sparkles } from 'lucide-react';
import { SkinId, HandSkin } from '../types/game';
import { HAND_SKINS } from '../utils/cosmeticsAndAchievements';
import { HandSvg } from './HandSvg';
import { sound } from '../utils/audio';

interface ArmoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  equippedSkinId: SkinId;
  unlockedSkins: SkinId[];
  onEquipSkin: (skinId: SkinId) => void;
}

export const ArmoryModal: React.FC<ArmoryModalProps> = ({
  isOpen,
  onClose,
  equippedSkinId,
  unlockedSkins,
  onEquipSkin
}) => {
  if (!isOpen) return null;

  const allSkins = Object.values(HAND_SKINS);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="font-display text-xl font-bold tracking-wide">
              BATTLE GAUNTLET ARMORY
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

        {/* Subtitle */}
        <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
          <span>Customize the cosmetic appearance and energy aura of your battle hands.</span>
          <span className="font-mono text-amber-400">
            {unlockedSkins.length} / {allSkins.length} Unlocked
          </span>
        </div>

        {/* Skins Grid */}
        <div className="p-6 overflow-y-auto max-h-[70vh] grid grid-cols-1 sm:grid-cols-2 gap-4">
          {allSkins.map((skin) => {
            const isUnlocked = unlockedSkins.includes(skin.id);
            const isEquipped = equippedSkinId === skin.id;

            return (
              <div
                key={skin.id}
                className={`relative p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isEquipped
                    ? 'bg-slate-950 border-amber-400 ring-2 ring-amber-400/30 shadow-lg'
                    : isUnlocked
                    ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                {/* Top Title & Status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-100">
                      {skin.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {skin.description}
                    </p>
                  </div>
                  {isEquipped ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/40">
                      <CheckCircle className="w-3 h-3" />
                      EQUIPPED
                    </span>
                  ) : !isUnlocked ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                      <Lock className="w-3 h-3" />
                      LOCKED
                    </span>
                  ) : null}
                </div>

                {/* Hand Visual Preview */}
                <div className="py-2 flex items-center justify-center my-1 rounded-lg bg-slate-900/60 border border-slate-800/60">
                  <HandSvg move="rock" skin={skin} size={80} />
                </div>

                {/* Bottom Action / Unlock Requirement */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                  {isUnlocked ? (
                    <button
                      disabled={isEquipped}
                      onClick={() => {
                        sound.playClick();
                        onEquipSkin(skin.id);
                      }}
                      className={`w-full py-2 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                        isEquipped
                          ? 'bg-slate-800 text-slate-400 cursor-default'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md'
                      }`}
                    >
                      {isEquipped ? 'Active in Battle' : 'Equip Gauntlet'}
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{skin.unlockCondition}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
