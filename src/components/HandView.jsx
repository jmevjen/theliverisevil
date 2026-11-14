import React, { useState } from 'react';
import CocktailCard from './CocktailCard';
import { canPlayDrink } from '../game/evaluators';
import { Sparkles, Filter, Layers } from 'lucide-react';

export default function HandView({
  player,
  isCurrentTurn,
  onPlayDrink,
  onSelectCard,
  selectedCard
}) {
  const [filter, setFilter] = useState('ALL');

  if (!player || !player.hand) return null;

  // Evaluate which cards in hand are playable right now
  const cardsWithPlayability = player.hand.map(card => {
    const rowKey = card.classification;
    const row = player.tableau[rowKey];
    let isPlayable = false;
    let reason = '';

    if (row && isCurrentTurn && player.actionsRemaining > 0) {
      const leftmostEmpty = row.findIndex(c => c === null);
      if (leftmostEmpty !== -1) {
        const val = canPlayDrink(player, card, rowKey, leftmostEmpty);
        isPlayable = val.valid;
        reason = val.reason || '';
      }
    }

    return { card, isPlayable, reason };
  });

  const filteredCards = cardsWithPlayability.filter(({ card, isPlayable }) => {
    if (filter === 'ALL') return true;
    if (filter === 'PLAYABLE') return isPlayable;
    return card.classification === filter;
  });

  const playableCount = cardsWithPlayability.filter(c => c.isPlayable).length;

  return (
    <div className="bg-stone-900/90 border border-amber-900/40 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      {/* Hand Header & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-amber-400" />
          <h3 className="font-serif font-bold text-base text-stone-100">
            Cocktail Recipes in Hand ({player.hand.length})
          </h3>
          {playableCount > 0 && (
            <span className="flex items-center gap-1 text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/50 px-2 py-0.5 rounded-full font-semibold">
              <Sparkles size={11} /> {playableCount} Playable
            </span>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-stone-500 flex items-center gap-1 mr-1">
            <Filter size={12} /> Filter:
          </span>
          {[
            { id: 'ALL', label: 'All' },
            { id: 'PLAYABLE', label: `Playable (${playableCount})` },
            { id: 'Refreshing', label: 'Refreshing' },
            { id: 'Sour', label: 'Sour' },
            { id: 'Spirit Forward', label: 'Spirit' },
            { id: 'Tiki', label: 'Tiki' },
            { id: 'Dessert', label: 'Dessert' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                filter === f.id
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'bg-stone-800/80 text-stone-400 hover:bg-stone-700 hover:text-stone-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Scroll Container */}
      {filteredCards.length === 0 ? (
        <div className="py-8 text-center text-stone-500 font-mono text-sm">
          No drink cards matching filter "{filter}".
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-stone-700">
          {filteredCards.map(({ card, isPlayable, reason }) => {
            const isSelected = selectedCard && selectedCard.id === card.id;

            return (
              <div key={card.id} className="relative flex-shrink-0">
                <CocktailCard
                  card={card}
                  isPlayable={isPlayable && isCurrentTurn && player.actionsRemaining > 0}
                  onPlay={() => onPlayDrink(card)}
                  onSelect={() => onSelectCard(card)}
                  compact={false}
                />

                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-amber-400 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg border border-amber-200 uppercase tracking-wider animate-bounce">
                    Selected
                  </div>
                )}

                {!isPlayable && reason && (
                  <div className="mt-1 text-[10px] text-stone-500 text-center truncate max-w-[224px]" title={reason}>
                    {reason}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
