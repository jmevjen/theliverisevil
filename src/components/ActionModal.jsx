import React, { useState } from 'react';
import { TABLEAU_ROWS } from '../data/tableauData';
import { INGREDIENT_CONFIG } from './CocktailCard';
import { Play, Droplets, Wine, Sparkles, X, Check, RefreshCw } from 'lucide-react';
import { getPlayerTotalWater } from '../game/evaluators';

export default function ActionModal({
  isOpen,
  onClose,
  rowKey,
  player,
  onConfirmAction
}) {
  if (!isOpen || !rowKey || !player) return null;

  const rowDef = TABLEAU_ROWS.find(r => r.key === rowKey);
  if (!rowDef) return null;

  const row = player.tableau[rowKey] || [];
  let leftmostEmpty = row.findIndex(c => c === null);
  if (leftmostEmpty === -1) leftmostEmpty = 4;
  const slot = rowDef.slots[leftmostEmpty];

  const totalWater = getPlayerTotalWater(player);

  // States
  const [useTrade, setUseTrade] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState(['Juice', 'Bitters']);
  const [selectedIngredientType, setSelectedIngredientType] = useState('Misc');
  const [waterCount, setWaterCount] = useState(1);
  const [discardCardId, setDiscardCardId] = useState(player.hand[0]?.id || '');
  const [discardIngredient, setDiscardIngredient] = useState('Juice');

  // Brown powers in this row that will activate
  const powersToActivate = [];
  for (let c = leftmostEmpty - 1; c >= 0; c--) {
    const card = row[c];
    if (card) {
      powersToActivate.push(card);
    }
  }

  const handleConfirm = () => {
    const choices = {
      ingredients: selectedIngredients,
      ingredientType: selectedIngredientType,
      waterCount: waterCount,
      discardCardId: discardCardId,
      discardIngredient: discardIngredient
    };

    onConfirmAction({
      rowKey,
      tradeOption: useTrade,
      choices
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-stone-900 to-stone-950 border border-amber-600/50 p-6 shadow-2xl text-stone-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-all"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span
            style={{ backgroundColor: rowDef.accentColor }}
            className="w-3.5 h-3.5 rounded-full inline-block shadow-sm"
          />
          <div>
            <h3 className="font-serif font-bold text-xl text-stone-100">
              Activate {rowDef.name} Row
            </h3>
            <p className="text-xs text-stone-400">
              Column {leftmostEmpty + 1} Benefit: <strong className="text-amber-300 font-bold">{slot.label}</strong>
            </p>
          </div>
        </div>

        {/* Row Specific Configuration */}
        <div className="space-y-4 my-4">
          {rowKey === 'Sour' && (
            <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800">
              <label className="text-xs font-semibold text-stone-300 mb-2 block">
                Choose {slot.base.ingredients + (useTrade ? 1 : 0)} Ingredients to Take:
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {Object.entries(INGREDIENT_CONFIG).map(([ing, cfg]) => {
                  const Icon = cfg.icon;
                  const isSelected = selectedIngredients.includes(ing);
                  return (
                    <button
                      key={ing}
                      onClick={() => {
                        if (isSelected && selectedIngredients.length > 1) {
                          setSelectedIngredients(selectedIngredients.filter(i => i !== ing));
                        } else {
                          setSelectedIngredients([...selectedIngredients, ing]);
                        }
                      }}
                      style={{
                        borderColor: isSelected ? cfg.color : '#333',
                        backgroundColor: isSelected ? cfg.bg : 'transparent'
                      }}
                      className="p-2 rounded-lg border text-center flex flex-col items-center gap-1 transition-all"
                    >
                      <Icon size={16} style={{ color: cfg.color }} />
                      <span className="text-[10px] font-bold" style={{ color: isSelected ? cfg.color : '#888' }}>
                        {cfg.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {rowKey === 'Tiki' && (
            <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800">
              <label className="text-xs font-semibold text-stone-300 mb-2 block">
                Tiki Choice: Split between Water and Ingredients:
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setWaterCount(Math.max(0, waterCount - 1))}
                  className="px-2 py-1 bg-stone-800 rounded font-bold text-sm"
                >
                  -
                </button>
                <div className="text-xs font-mono">
                  <span className="text-sky-300 font-bold">{waterCount} Water</span> +{' '}
                  <span className="text-amber-300 font-bold">{Math.max(0, slot.base.flexible + (useTrade ? 1 : 0) - waterCount)} Ingredients</span>
                </div>
                <button
                  onClick={() => setWaterCount(Math.min(slot.base.flexible + (useTrade ? 1 : 0), waterCount + 1))}
                  className="px-2 py-1 bg-stone-800 rounded font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Trade Option if available */}
          {slot.trade && (
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-amber-300">
                  Optional Trade ({slot.trade.discard === 'water' ? 'Trade 1 Water' : slot.trade.discard === 'ingredient' ? 'Trade 1 Ingredient' : 'Trade 1 Card'})
                </div>
                <div className="text-[11px] text-stone-400">
                  Receive +1 extra resource for trading
                </div>
              </div>
              <button
                onClick={() => setUseTrade(!useTrade)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                  useTrade
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                {useTrade ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          )}

          {/* Brown Powers Summary */}
          {powersToActivate.length > 0 && (
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <div className="text-[11px] uppercase font-bold text-amber-400 tracking-wider mb-1.5 flex items-center gap-1">
                <Sparkles size={12} /> Powers That Will Activate ({powersToActivate.length}):
              </div>
              <div className="space-y-1">
                {powersToActivate.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-mono py-0.5 px-2 bg-stone-900/60 rounded">
                    <span className="text-stone-300">{c.name}</span>
                    <span className="text-amber-300 font-bold">+{c.power}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs uppercase tracking-wider transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-900/40 border border-amber-300 transition-all flex items-center justify-center gap-2"
          >
            <Play size={14} className="fill-current" />
            <span>Execute Action</span>
          </button>
        </div>
      </div>
    </div>
  );
}
