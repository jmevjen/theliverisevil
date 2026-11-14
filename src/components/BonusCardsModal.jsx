import React from 'react';
import { Target, Award, CheckCircle, X, Sparkles, HelpCircle } from 'lucide-react';

export default function BonusCardsModal({
  isOpen,
  onClose,
  initialBonusCards = [],
  keptBonusCard = null,
  isSetupPhase = false,
  onSelectBonusCard = null,
  tableau = {},
  drinks = []
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-b from-stone-900 via-stone-950 to-black border border-amber-600/60 p-6 shadow-2xl text-stone-100">
        {/* Close Button (only if not forced setup phase) */}
        {!isSetupPhase && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-all"
          >
            <X size={18} />
          </button>
        )}

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Target size={14} className="text-amber-400" />
            {isSetupPhase ? 'Initial Setup: Choose Secret Bonus Goal' : 'Your Secret Bonus Goal'}
          </div>
          <h2 className="font-serif font-bold text-2xl text-amber-200">
            {isSetupPhase
              ? 'Select 1 Bonus Card to Keep'
              : keptBonusCard
              ? keptBonusCard.name
              : 'Secret Bonus Goal'}
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-md mx-auto">
            {isSetupPhase
              ? 'Wingspan rules: 2 bonus cards were dealt to you at the start of the game. Choose 1 to keep for end-game victory points; the other will be discarded before play begins.'
              : 'Complete this secret condition with drinks in your bar for bonus victory points at the end of the game!'}
          </p>
        </div>

        {/* Cards Presentation */}
        {isSetupPhase ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            {initialBonusCards.map((bonus) => (
              <div
                key={bonus.id}
                className="rounded-xl border border-amber-500/40 bg-stone-900/90 p-4 flex flex-col justify-between hover:border-amber-400 hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-amber-400 font-mono mb-2">
                    <span className="uppercase font-bold tracking-wider">Secret Bonus</span>
                    <Award size={14} />
                  </div>

                  <h3 className="font-serif font-bold text-xl text-stone-100 mb-1">
                    {bonus.name}
                  </h3>

                  <div className="my-2 p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1">
                      Objective (Ask)
                    </div>
                    <div className="text-sm font-semibold text-amber-200">
                      {bonus.ask}
                    </div>
                  </div>

                  <div className="my-2 p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40">
                    <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider mb-1">
                      Victory Points
                    </div>
                    <div className="text-xs font-mono font-bold text-amber-300">
                      {bonus.pointsDesc}
                    </div>
                  </div>

                  {bonus.hint && (
                    <div className="text-[11px] text-stone-400 italic mt-2">
                      💡 Hint: {bonus.hint}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onSelectBonusCard(bonus.id)}
                  className="w-full mt-4 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-900/40 border border-amber-300 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={15} />
                  <span>Keep This Goal (Discard Other)</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Inspect Kept Bonus Card */
          keptBonusCard && (
            <div className="rounded-xl border border-amber-500/50 bg-stone-900/90 p-5 max-w-lg mx-auto">
              <div className="flex items-center justify-between text-xs text-amber-400 font-mono mb-2">
                <span className="uppercase font-bold tracking-wider">Active Secret Bonus</span>
                <Award size={16} />
              </div>

              <h3 className="font-serif font-bold text-2xl text-amber-200 mb-2">
                {keptBonusCard.name}
              </h3>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                  <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-0.5">
                    Objective
                  </div>
                  <div className="text-sm font-semibold text-stone-200">
                    {keptBonusCard.ask}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/60">
                  <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider mb-0.5">
                    Scoring Thresholds
                  </div>
                  <div className="text-sm font-mono font-bold text-amber-300">
                    {keptBonusCard.pointsDesc}
                  </div>
                </div>

                {keptBonusCard.hint && (
                  <div className="text-xs text-stone-400 italic">
                    💡 Tip: {keptBonusCard.hint}
                  </div>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-full mt-6 py-2 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs uppercase tracking-wider transition-all"
              >
                Close
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
