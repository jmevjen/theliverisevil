import React from 'react';
import CocktailCard from './CocktailCard';
import { TABLEAU_ROWS, COLUMN_WATER_COSTS } from '../data/tableauData';
import { Droplets, Play, Sparkles } from 'lucide-react';

export default function TableauBoard({
  tableau,
  onActivateRow,
  onSelectSlot,
  selectedCardToPlay = null,
  activePlayerActions = 0,
  isCurrentTurn = true,
  onCardClick = null
}) {
  return (
    <div className="bg-stone-900/90 border border-amber-900/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
      {/* Column Water Costs Header (Row 6 from tableau.json) */}
      <div className="grid grid-cols-[200px_repeat(5,minmax(130px,1fr))] gap-3 pb-3 mb-2 border-b border-stone-800 text-xs items-center">
        <div className="font-serif font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5 pl-2">
          <Droplets size={14} className="text-sky-400" />
          <span>Column Water Cost</span>
        </div>
        {COLUMN_WATER_COSTS.map((cost, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-stone-950/60 border border-stone-800 text-stone-300 font-mono text-center font-semibold"
          >
            <span>Col {idx + 1}:</span>
            <span className={cost > 0 ? "text-sky-400 font-bold" : "text-stone-500"}>
              {cost} {cost === 1 ? 'Water' : 'Water'}
            </span>
          </div>
        ))}
      </div>

      {/* 5 Rows */}
      <div className="space-y-3.5">
        {TABLEAU_ROWS.map((rowDef) => {
          const rowKey = rowDef.key;
          const cardsInRow = tableau[rowKey] || [null, null, null, null, null];
          const leftmostEmpty = cardsInRow.findIndex(c => c === null);
          const isRowFull = leftmostEmpty === -1;
          const activeActionCol = isRowFull ? 4 : leftmostEmpty;
          const currentSlotBenefit = rowDef.slots[activeActionCol];

          // Check if selected card can be played here
          const canPlayHere =
            selectedCardToPlay &&
            selectedCardToPlay.classification === rowKey &&
            leftmostEmpty !== -1 &&
            isCurrentTurn &&
            activePlayerActions > 0;

          return (
            <div
              key={rowKey}
              style={{ borderColor: `${rowDef.accentColor}33` }}
              className="grid grid-cols-[200px_repeat(5,minmax(130px,1fr))] gap-3 p-2.5 rounded-xl bg-stone-950/70 border hover:bg-stone-950/90 transition-all items-center"
            >
              {/* Row Header & Action Button */}
              <div className="flex flex-col justify-between h-full pr-2 border-r border-stone-800">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      style={{ backgroundColor: rowDef.accentColor }}
                      className="w-2.5 h-2.5 rounded-full inline-block shadow-sm"
                    />
                    <h4
                      style={{ color: rowDef.accentColor }}
                      className="font-serif font-bold text-sm tracking-wide"
                    >
                      {rowDef.name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-tight">
                    {rowDef.description}
                  </p>
                </div>

                {/* Activate Row Button */}
                <div className="mt-2">
                  <button
                    disabled={!isCurrentTurn || activePlayerActions <= 0}
                    onClick={() => onActivateRow(rowKey)}
                    style={{
                      borderColor: isCurrentTurn && activePlayerActions > 0 ? rowDef.accentColor : '#444'
                    }}
                    className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md ${
                      isCurrentTurn && activePlayerActions > 0
                        ? 'bg-stone-800 hover:bg-stone-700 text-stone-100 hover:scale-[1.02] active:scale-95'
                        : 'bg-stone-900/60 text-stone-600 cursor-not-allowed border-stone-800'
                    }`}
                    title={`Activate ${rowDef.name} to receive: ${currentSlotBenefit.label}`}
                  >
                    <Play size={11} className="fill-current" />
                    <span>{rowDef.actionName}</span>
                  </button>
                  <div className="text-[10px] text-stone-500 font-mono text-center mt-0.5 truncate">
                    Next: {currentSlotBenefit.label}
                  </div>
                </div>
              </div>

              {/* 5 Slots */}
              {cardsInRow.map((card, colIdx) => {
                const slotDef = rowDef.slots[colIdx];
                const isNextSlot = colIdx === leftmostEmpty;

                if (card) {
                  return (
                    <div key={colIdx} className="h-48 flex justify-center">
                      <CocktailCard
                        card={card}
                        compact={true}
                        waterCount={card.water || 0}
                        onSelect={onCardClick}
                      />
                    </div>
                  );
                }

                return (
                  <div
                    key={colIdx}
                    onClick={() => {
                      if (canPlayHere && isNextSlot) {
                        onSelectSlot(rowKey, colIdx);
                      }
                    }}
                    className={`h-48 rounded-xl border-2 border-dashed flex flex-col justify-between p-2.5 transition-all select-none ${
                      canPlayHere && isNextSlot
                        ? 'border-amber-400 bg-amber-950/20 shadow-[0_0_15px_rgba(251,191,36,0.2)] cursor-pointer hover:bg-amber-950/40 hover:scale-[1.02]'
                        : isNextSlot
                        ? 'border-stone-700 bg-stone-900/40'
                        : 'border-stone-800/60 bg-stone-950/40 opacity-70'
                    }`}
                  >
                    {/* Slot Header */}
                    <div className="flex items-center justify-between text-[11px] text-stone-400">
                      <span className="font-mono font-semibold">Slot {colIdx + 1}</span>
                      <span className="text-[10px] text-sky-400 font-mono">
                        Cost: {COLUMN_WATER_COSTS[colIdx]} Water
                      </span>
                    </div>

                    {/* Slot Center Benefit Label */}
                    <div className="text-center my-auto">
                      <div className="text-xs font-semibold text-stone-300 mb-1">
                        {slotDef.label}
                      </div>
                      {isNextSlot && (
                        <div className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/80 font-mono">
                          <Sparkles size={10} /> Active Action Space
                        </div>
                      )}
                    </div>

                    {/* Click prompt when ready to play */}
                    {canPlayHere && isNextSlot ? (
                      <div className="text-center py-1 bg-amber-500/20 rounded border border-amber-400 text-amber-300 text-[10px] font-bold uppercase animate-pulse">
                        Click to Play Drink
                      </div>
                    ) : (
                      <div className="text-[10px] text-stone-600 text-center font-mono">
                        {rowDef.classification} Drink
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
