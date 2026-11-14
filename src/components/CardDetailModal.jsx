import React from 'react';
import { X, Droplets, Zap, Wine, Award, Calendar, MapPin, Star } from 'lucide-react';
import { INGREDIENT_CONFIG, CATEGORY_THEMES } from './CocktailCard';

export default function CardDetailModal({ card, isOpen, onClose }) {
  if (!isOpen || !card) return null;

  const theme = CATEGORY_THEMES[card.classification] || CATEGORY_THEMES.Refreshing;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        style={{ borderColor: theme.border }}
        className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-stone-900 via-stone-950 to-black border-2 p-6 shadow-2xl text-stone-100"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-all"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <span
            style={{ color: theme.border }}
            className="font-bold tracking-wider uppercase text-xs px-2 py-0.5 rounded bg-black/50 border border-current mb-2 inline-block"
          >
            {card.classification}
          </span>
          <h2 className="font-serif font-black text-2xl text-amber-200">
            {card.name}
          </h2>
          <div className="flex items-center justify-center gap-2 text-xs text-stone-400 mt-1 font-mono">
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {card.year}
            </span>
            <span>•</span>
            <span className={card.era === 'Classic' ? 'text-amber-400' : 'text-indigo-400'}>
              {card.era} Cocktail
            </span>
          </div>
        </div>

        {/* Victory Points */}
        <div className="flex items-center justify-center gap-2 my-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
          <Award size={20} className="text-amber-400" />
          <span className="font-serif font-bold text-lg text-amber-300">
            {card.score} Victory Points
          </span>
        </div>

        {/* Recipe Ingredients */}
        <div className="my-3 p-3 rounded-2xl bg-stone-950/80 border border-stone-800">
          <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-2">
            Recipe Ingredients Cost ({card.totalCost} total)
          </div>
          <div className="flex flex-wrap gap-1.5">
            {card.totalCost === 0 ? (
              <span className="text-xs text-stone-400 italic">Free recipe (0 ingredients)</span>
            ) : (
              Object.entries(card.cost || {}).map(([ing, count]) => {
                if (count <= 0) return null;
                const cfg = INGREDIENT_CONFIG[ing] || INGREDIENT_CONFIG.Misc;
                const Icon = cfg.icon;
                return (
                  <div
                    key={ing}
                    style={{ backgroundColor: cfg.bg, color: cfg.color, borderColor: cfg.color }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border"
                  >
                    <Icon size={14} />
                    <span>{count} {ing}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Water Capacity */}
        <div className="my-3 p-3 rounded-2xl bg-sky-950/30 border border-sky-800/40 flex items-center justify-between">
          <div className="text-xs text-sky-300 font-semibold flex items-center gap-1.5">
            <Droplets size={16} className="text-sky-400" />
            <span>Water / Ice Capacity</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3, 4].map(idx => (
              <div
                key={idx}
                className={`w-4 h-4 rounded-sm border ${
                  idx < (card.water || 0)
                    ? 'bg-sky-400 border-sky-200 shadow-[0_0_8px_#38bdf8]'
                    : 'bg-stone-900 border-stone-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Brown Activation Power */}
        <div className="my-3 p-3 rounded-2xl bg-amber-950/40 border border-amber-800/60">
          <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Zap size={14} className="text-amber-400" />
            <span>When Activated (Brown Power)</span>
          </div>
          <p className="text-sm font-semibold text-stone-200">
            Gain <strong className="text-amber-300">{card.power}</strong> whenever you activate the {card.classification} row.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs uppercase tracking-wider transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
}
