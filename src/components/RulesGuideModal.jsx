import React from 'react';
import { BookOpen, X, Droplets, Wine, Award, Target, Sparkles, Layers } from 'lucide-react';

export default function RulesGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-stone-900 to-black border border-amber-600/60 p-6 shadow-2xl text-stone-100 scrollbar-thin scrollbar-thumb-stone-700">
        <button
          onClick={onClose}
          className="sticky top-0 float-right p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-all z-10"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <BookOpen size={14} className="text-amber-400" />
            <span>Rulebook & Guide</span>
          </div>
          <h2 className="font-serif font-black text-3xl text-amber-200">
            The Liver is Evil — Cocktail Wingspan
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-lg mx-auto">
            A strategic cocktail tableau-building game powered by boardgame.io and React, inspired by Wingspan.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 text-sm text-stone-300">
          {/* Section 1: Overview & Rounds */}
          <section className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800">
            <h3 className="font-serif font-bold text-lg text-amber-300 mb-2 flex items-center gap-2">
              <Award size={18} className="text-amber-400" />
              1. Round Structure & Turns
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              The game is played over <strong>4 Rounds</strong>. In each round, players take turns spending 1 action cube until all action cubes for that round are spent:
            </p>
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-800/40">
                <div className="text-amber-400 font-bold">Round 1</div>
                <div className="text-stone-300">8 Actions</div>
              </div>
              <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-800/40">
                <div className="text-amber-400 font-bold">Round 2</div>
                <div className="text-stone-300">7 Actions</div>
              </div>
              <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-800/40">
                <div className="text-amber-400 font-bold">Round 3</div>
                <div className="text-stone-300">6 Actions</div>
              </div>
              <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-800/40">
                <div className="text-amber-400 font-bold">Round 4</div>
                <div className="text-stone-300">5 Actions</div>
              </div>
            </div>
            <p className="text-[11px] text-stone-500 mt-2">
              At the end of each round, 1 action cube is placed on the End-of-Round Goal board, leaving 1 fewer action for the next round.
            </p>
          </section>

          {/* Section 2: Tableau & Water Cost */}
          <section className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800">
            <h3 className="font-serif font-bold text-lg text-sky-300 mb-2 flex items-center gap-2">
              <Droplets size={18} className="text-sky-400" />
              2. The 5 Rows & Column Water Costs
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              Each player's bar board has 5 category rows matching the 5 cocktail classifications:
            </p>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                <strong className="text-sky-300">Refreshing:</strong> Grants <strong>Water / Ice</strong> (for diluting cocktails and paying column costs).
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <strong className="text-amber-300">Sours:</strong> Grants <strong>Ingredients</strong> (Juice, Aperitif, Liquer, Bitters, Misc).
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                <strong className="text-orange-300">Spirit Forward:</strong> Grants <strong>Drink Cards</strong> (draft recipes from bar tray or deck).
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <strong className="text-emerald-300">Tiki:</strong> Grants flexible choices of <strong>Water and Ingredients</strong>.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
                <strong className="text-pink-300">Dessert:</strong> Grants flexible choices of <strong>Ingredients and Drink Cards</strong>.
              </li>
            </ul>

            <div className="mt-3 p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs">
              <div className="text-sky-300 font-bold mb-1">Column Water Cost (Row 6):</div>
              <div className="text-stone-300 font-mono">
                Col 1: 0 Water | Col 2: 1 Water | Col 3: 2 Water | Col 4: 2 Water | Col 5: 3 Water.
              </div>
              <div className="text-stone-500 text-[11px] mt-0.5">
                Water is spent from your cards on the board or your unassigned water supply.
              </div>
            </div>
          </section>

          {/* Section 3: Playing Drinks & Powers */}
          <section className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800">
            <h3 className="font-serif font-bold text-lg text-amber-300 mb-2 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-400" />
              3. Playing Drinks & Brown Activation Powers
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-2">
              When playing a drink, you pay its ingredient cost plus the column's water cost, placing it in its category row.
            </p>
            <p className="text-xs text-stone-400 leading-relaxed mb-2">
              When you activate a row (e.g. Refreshing or Sours), you first collect the benefit from the leftmost empty space, then move <strong>right-to-left</strong> activating all brown powers on cards played in that row!
            </p>
            <p className="text-xs text-amber-200/90 font-mono">
              Powers include: +1 Water, +1 Ingredient, +1 Card, or flexible combinations!
            </p>
          </section>

          {/* Section 4: Bonus Cards & Scoring */}
          <section className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800">
            <h3 className="font-serif font-bold text-lg text-emerald-300 mb-2 flex items-center gap-2">
              <Target size={18} className="text-emerald-400" />
              4. Bonus Cards & Final Scoring
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-2">
              At the start of the game, you draw <strong>2 bonus cards</strong> and discard 1 before play begins.
            </p>
            <p className="text-xs text-stone-400 leading-relaxed mb-2">
              At game end, your total score is calculated across 4 categories:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-xs text-stone-300 font-mono">
              <li><strong>Drink Cards VP:</strong> The sum of points printed on all cocktails on your board.</li>
              <li><strong>Bonus Cards VP:</strong> Points for meeting your secret bonus condition.</li>
              <li><strong>End-of-Round Goals:</strong> Points scored across the 4 round goals (R1: 3/1, R2: 5/2, R3: 6/4, R4: 8/5).</li>
              <li><strong>Water on Cards:</strong> 1 Victory Point per water token resting on your drinks!</li>
            </ol>
          </section>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all"
        >
          Got It, Let's Play!
        </button>
      </div>
    </div>
  );
}
