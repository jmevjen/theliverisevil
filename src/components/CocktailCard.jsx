import React from 'react';
import { Wine, Citrus, Droplets, Sparkles, Zap, Award, MapPin, Star } from 'lucide-react';

export const INGREDIENT_CONFIG = {
  Juice: { label: 'Juice', color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)', icon: Citrus },
  Aperitif: { label: 'Aperitif', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', icon: Wine },
  Liquer: { label: 'Liquer', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', icon: Sparkles },
  Bitters: { label: 'Bitters', color: '#d97706', bg: 'rgba(217, 119, 6, 0.15)', icon: Droplets },
  Misc: { label: 'Misc', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', icon: Sparkles }
};

export const CATEGORY_THEMES = {
  Refreshing: { border: '#38bdf8', bg: 'linear-gradient(135deg, #0c2136 0%, #061320 100%)', badge: 'bg-sky-950 text-sky-300 border-sky-600' },
  Sour: { border: '#eab308', bg: 'linear-gradient(135deg, #2b2505 0%, #171302 100%)', badge: 'bg-amber-950 text-amber-300 border-amber-600' },
  'Spirit Forward': { border: '#f97316', bg: 'linear-gradient(135deg, #2c1606 0%, #150902 100%)', badge: 'bg-orange-950 text-orange-300 border-orange-600' },
  Tiki: { border: '#22c55e', bg: 'linear-gradient(135deg, #092612 0%, #031307 100%)', badge: 'bg-emerald-950 text-emerald-300 border-emerald-600' },
  Dessert: { border: '#ec4899', bg: 'linear-gradient(135deg, #2b0b1d 0%, #14040d 100%)', badge: 'bg-pink-950 text-pink-300 border-pink-600' }
};

export default function CocktailCard({
  card,
  isPlayable = false,
  onPlay = null,
  onSelect = null,
  compact = false,
  waterCount = 0,
  showPowerGlow = false
}) {
  if (!card) return null;

  const theme = CATEGORY_THEMES[card.classification] || CATEGORY_THEMES.Refreshing;
  const isClassic = card.era === 'Classic';

  return (
    <div
      onClick={() => onSelect && onSelect(card)}
      style={{
        background: theme.bg,
        borderColor: isPlayable ? '#fbbf24' : theme.border,
        boxShadow: isPlayable
          ? '0 0 15px rgba(251, 191, 36, 0.4), inset 0 0 10px rgba(251, 191, 36, 0.2)'
          : '0 4px 12px rgba(0, 0, 0, 0.6)'
      }}
      className={`relative rounded-xl border transition-all duration-200 select-none flex flex-col justify-between overflow-hidden cursor-pointer ${
        compact ? 'w-44 h-64 p-2.5 text-xs' : 'w-56 h-80 p-3 text-sm'
      } hover:scale-[1.02] hover:z-10`}
    >
      {/* Top Banner: Classification & Score */}
      <div>
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span
            style={{ color: theme.border }}
            className="font-bold tracking-wider uppercase text-[10px] px-1.5 py-0.5 rounded bg-black/40 border border-current"
          >
            {card.classification}
          </span>

          <div className="flex items-center gap-1.5">
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                isClassic
                  ? 'bg-amber-950/70 text-amber-300 border border-amber-700/60'
                  : 'bg-indigo-950/70 text-indigo-300 border border-indigo-700/60'
              }`}
            >
              {card.year} ({card.era})
            </span>

            {/* Victory Points Badge */}
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 font-black text-sm shadow-md border border-amber-200">
              {card.score}
            </div>
          </div>
        </div>

        {/* Drink Name */}
        <h3
          className="font-serif font-bold text-stone-100 leading-tight mb-1 truncate text-shadow"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: compact ? '0.95rem' : '1.1rem' }}
          title={card.name}
        >
          {card.name}
        </h3>

        {/* Special tags (City / Celebrity) */}
        {(card.isCity || card.isCelebrity) && (
          <div className="flex items-center gap-1 mb-1">
            {card.isCity && (
              <span className="flex items-center gap-0.5 text-[9px] text-cyan-300 bg-cyan-950/80 px-1 py-0.2 rounded border border-cyan-800">
                <MapPin size={9} /> City
              </span>
            )}
            {card.isCelebrity && (
              <span className="flex items-center gap-0.5 text-[9px] text-yellow-300 bg-yellow-950/80 px-1 py-0.2 rounded border border-yellow-800">
                <Star size={9} /> Celebrity
              </span>
            )}
          </div>
        )}
      </div>

      {/* Middle: Ingredients Cost */}
      <div className="bg-black/40 rounded-lg p-2 border border-white/5 my-1">
        <div className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider mb-1 flex items-center justify-between">
          <span>Cost</span>
          <span className="text-stone-500 font-mono">{card.totalCost} items</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {card.totalCost === 0 ? (
            <span className="text-[10px] text-stone-400 italic">Free recipe (0 ing)</span>
          ) : (
            Object.entries(card.cost || {}).map(([ing, count]) => {
              if (count <= 0) return null;
              const cfg = INGREDIENT_CONFIG[ing] || INGREDIENT_CONFIG.Misc;
              const Icon = cfg.icon;
              return (
                <div
                  key={ing}
                  style={{ backgroundColor: cfg.bg, color: cfg.color, borderColor: cfg.color }}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border border-opacity-40"
                  title={`${count} ${ing}`}
                >
                  <Icon size={11} />
                  <span>
                    {count} {ing}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Water Capacity Tokens (Ice/Dilution) */}
      <div className="bg-black/30 rounded-lg p-1.5 border border-white/5 my-1 flex items-center justify-between">
        <span className="text-[10px] text-sky-300 flex items-center gap-1 font-medium">
          <Droplets size={12} className="text-sky-400" /> Ice / Water
        </span>
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map(idx => {
            const isFilled = idx < (waterCount || card.water || 0);
            return (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-sm transition-all duration-200 border ${
                  isFilled
                    ? 'bg-sky-400 border-sky-200 shadow-[0_0_6px_#38bdf8]'
                    : 'bg-stone-900/60 border-stone-700/60'
                }`}
                title={isFilled ? 'Water Cube' : 'Empty Water Slot'}
              />
            );
          })}
        </div>
      </div>

      {/* Bottom: Brown Power Bar */}
      <div className="mt-1">
        <div
          className={`rounded-lg p-1.5 border transition-all ${
            showPowerGlow
              ? 'bg-amber-900/50 border-amber-400 shadow-[0_0_10px_#f59e0b]'
              : 'bg-amber-950/40 border-amber-800/50'
          }`}
        >
          <div className="flex items-center gap-1 text-amber-300 text-[10px] font-semibold uppercase tracking-wider mb-0.5">
            <Zap size={11} className="text-amber-400" />
            <span>When Activated</span>
          </div>
          <p className="text-stone-300 text-[11px] leading-tight font-medium">
            Gain <strong className="text-amber-200 font-bold">{card.power}</strong>
          </p>
        </div>

        {/* Play Button if playable */}
        {isPlayable && onPlay && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(card);
            }}
            className="w-full mt-2 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-900/40 border border-amber-300 transition-all hover:brightness-110 active:scale-95"
          >
            Play to {card.classification}
          </button>
        )}
      </div>
    </div>
  );
}
