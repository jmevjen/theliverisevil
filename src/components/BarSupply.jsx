import React from 'react';
import { INGREDIENT_CONFIG } from './CocktailCard';
import { Droplets, Clock, Target, HelpCircle, Award } from 'lucide-react';
import { getPlayerTotalWater } from '../game/evaluators';

export default function BarSupply({
  player,
  currentRound = 1,
  onOpenBonusModal = null,
  onOpenRules = null
}) {
  if (!player) return null;

  const totalWater = getPlayerTotalWater(player);
  const bonus = (player.bonusCards && player.bonusCards[0]) || null;

  return (
    <div className="bg-stone-900/90 border border-amber-900/40 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
      {/* Player Identity & Action Cubes */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-amber-900 border border-amber-400/60 flex items-center justify-center text-amber-200 font-serif font-black text-xl shadow-lg">
          {player.name.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-lg text-stone-100">
              {player.name}
            </h2>
            {player.isAi && (
              <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-700 px-1.5 py-0.2 rounded font-mono">
                AI BOT
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span className="flex items-center gap-1 font-mono">
              <Clock size={12} className="text-amber-400" />
              Round {currentRound} Actions:
            </span>
            {/* Visual Action Cubes */}
            <div className="flex items-center gap-1">
              {Array.from({ length: player.totalActionsThisRound || 8 }).map((_, i) => {
                const isAvailable = i < player.actionsRemaining;
                return (
                  <div
                    key={i}
                    className={`w-3.5 h-3.5 rounded-sm transition-all border ${
                      isAvailable
                        ? 'bg-amber-400 border-amber-200 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                        : 'bg-stone-900 border-stone-800 opacity-40'
                    }`}
                    title={isAvailable ? 'Available Action Cube' : 'Spent Action Cube'}
                  />
                );
              })}
              <span className="text-amber-300 font-bold ml-1 font-mono">
                ({player.actionsRemaining})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Water & Dilution Counter */}
      <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-sky-950/40 border border-sky-800/60 shadow-inner">
        <div className="w-9 h-9 rounded-lg bg-sky-500/20 border border-sky-400/60 flex items-center justify-center text-sky-300">
          <Droplets size={20} className="text-sky-400 animate-pulse" />
        </div>
        <div>
          <div className="text-[11px] font-semibold text-sky-300 uppercase tracking-wider">
            Water / Ice
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-sky-200">
              {totalWater}
            </span>
            <span className="text-[10px] text-sky-400 font-mono">
              ({player.waterSupply || 0} in pool)
            </span>
          </div>
        </div>
      </div>

      {/* Ingredient Stock Tokens */}
      <div className="flex items-center gap-2 flex-wrap">
        {Object.entries(INGREDIENT_CONFIG).map(([ing, cfg]) => {
          const Icon = cfg.icon;
          const count = player.ingredients[ing] || 0;
          return (
            <div
              key={ing}
              style={{ borderColor: `${cfg.color}44` }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-950/80 border shadow-sm"
              title={`${count} ${ing}`}
            >
              <div
                style={{ backgroundColor: cfg.bg, color: cfg.color }}
                className="w-6 h-6 rounded-md flex items-center justify-center"
              >
                <Icon size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-stone-400 tracking-wider">
                  {cfg.label}
                </span>
                <span className="font-mono font-bold text-sm text-stone-100">
                  {count}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bonus Card & Rules Quick Buttons */}
      <div className="flex items-center gap-2">
        {bonus && (
          <button
            onClick={onOpenBonusModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-950 to-stone-900 border border-amber-600/70 text-amber-200 text-xs font-semibold hover:border-amber-400 transition-all shadow-md active:scale-95"
            title="Inspect your secret bonus goal"
          >
            <Target size={14} className="text-amber-400" />
            <div className="text-left">
              <div className="text-[9px] text-stone-400 uppercase tracking-wider">Secret Bonus</div>
              <div className="font-bold text-amber-300 truncate max-w-[100px]">{bonus.name}</div>
            </div>
          </button>
        )}

        <button
          onClick={onOpenRules}
          className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-all shadow-md active:scale-95"
          title="Open Rules & Guide"
        >
          <HelpCircle size={18} />
        </button>
      </div>
    </div>
  );
}
