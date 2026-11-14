import React from 'react';
import CocktailCard from './CocktailCard';
import { Layers, RotateCcw, Plus } from 'lucide-react';

export default function DrinkTray({
  tray,
  deckCount,
  onDraftCard,
  onResetTray,
  isCurrentTurn = true,
  canDraw = false,
  onCardClick = null
}) {
  return (
    <div className="bg-stone-900/90 border border-amber-900/40 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-amber-400" />
          <h3 className="font-serif font-bold text-base text-stone-100">
            The Bar Display (Face-Up Drinks)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetTray}
            disabled={!isCurrentTurn || deckCount === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
              isCurrentTurn && deckCount > 0
                ? 'bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border-stone-700 active:scale-95'
                : 'bg-stone-900 text-stone-600 border-stone-800 cursor-not-allowed'
            }`}
            title="Discard all 3 display cards and deal 3 fresh drinks"
          >
            <RotateCcw size={12} />
            <span>Reset Tray</span>
          </button>
        </div>
      </div>

      {/* Tray Cards & Deck */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Draw Deck Stack */}
        <div className="h-64 rounded-xl border border-amber-900/40 bg-gradient-to-br from-stone-950 to-stone-900 p-4 flex flex-col justify-between items-center text-center shadow-lg relative overflow-hidden group">
          <div className="w-full flex items-center justify-between text-xs text-stone-400 font-mono">
            <span>Bar Deck</span>
            <span className="text-amber-400 font-bold">{deckCount} Left</span>
          </div>

          <div className="my-auto flex flex-col items-center">
            <div className="w-16 h-20 rounded-lg border-2 border-amber-500/40 bg-amber-950/30 flex items-center justify-center shadow-inner group-hover:scale-105 transition-all">
              <Layers size={28} className="text-amber-400" />
            </div>
            <div className="mt-2 font-serif font-bold text-stone-200 text-sm">
              Cocktail Deck
            </div>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Blind recipe draw
            </p>
          </div>

          <div className="text-[10px] text-stone-500 font-mono">
            Face-down draw pile
          </div>
        </div>

        {/* 3 Face-up Display Cards */}
        {tray.map((card, index) => {
          if (!card) {
            return (
              <div
                key={index}
                className="h-64 rounded-xl border border-dashed border-stone-800 bg-stone-950/40 flex items-center justify-center text-stone-600 font-mono text-xs"
              >
                Empty Slot
              </div>
            );
          }

          return (
            <div key={card.id || index} className="relative group">
              <CocktailCard
                card={card}
                compact={true}
                onSelect={onCardClick}
              />

              {/* Draft Button overlay */}
              <button
                onClick={() => onDraftCard(index)}
                className="w-full mt-2 py-1.5 px-3 rounded-lg bg-stone-800 hover:bg-amber-600 text-stone-200 hover:text-stone-950 font-bold text-xs uppercase tracking-wider border border-stone-700 hover:border-amber-400 transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                <Plus size={13} />
                <span>Draft to Hand</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
