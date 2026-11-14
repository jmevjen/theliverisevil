import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, Droplets, Target, Layers, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function ScoreSummaryModal({
  isOpen,
  finalScores,
  winner,
  onPlayAgain
}) {
  useEffect(() => {
    if (isOpen) {
      sounds.playVictory();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen]);

  if (!isOpen || !finalScores) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-stone-900 via-stone-950 to-black border-2 border-amber-500/70 p-6 shadow-2xl text-stone-100">
        {/* Celebration Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 mb-2 shadow-lg animate-bounce">
            <Trophy size={36} />
          </div>
          <h2 className="font-serif font-black text-3xl text-amber-300 tracking-wide">
            {winner ? `${winner.playerName} Wins!` : 'Game Over!'}
          </h2>
          <p className="text-xs text-stone-400 mt-1 font-mono">
            Final Scores & Wingspan Cocktail Scorecard
          </p>
        </div>

        {/* Scorecard Table */}
        <div className="overflow-x-auto my-4 rounded-2xl border border-stone-800 bg-stone-950/60 p-3">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 uppercase text-[10px] tracking-wider">
                <th className="py-2 px-3">Scoring Category</th>
                {finalScores.ranked.map(p => (
                  <th key={p.playerID} className="py-2 px-3 text-right">
                    <span className={p.playerID === winner?.playerID ? "text-amber-400 font-bold" : "text-stone-300"}>
                      {p.playerName}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {/* 1. Drink Cards VP */}
              <tr>
                <td className="py-2 px-3 flex items-center gap-1.5 text-stone-300">
                  <Layers size={13} className="text-amber-400" />
                  <span>Cocktail Recipes ({finalScores.ranked[0]?.drinksCount || 0} drinks)</span>
                </td>
                {finalScores.ranked.map(p => (
                  <td key={p.playerID} className="py-2 px-3 text-right font-bold text-stone-200">
                    {p.drinksScore}
                  </td>
                ))}
              </tr>

              {/* 2. Bonus Cards VP */}
              <tr>
                <td className="py-2 px-3 flex items-center gap-1.5 text-stone-300">
                  <Target size={13} className="text-red-400" />
                  <span>Secret Bonus Goals</span>
                </td>
                {finalScores.ranked.map(p => (
                  <td key={p.playerID} className="py-2 px-3 text-right font-bold text-amber-300">
                    {p.bonusCardsScore}
                  </td>
                ))}
              </tr>

              {/* 3. End of Round Goals VP */}
              <tr>
                <td className="py-2 px-3 flex items-center gap-1.5 text-stone-300">
                  <Award size={13} className="text-yellow-400" />
                  <span>End-of-Round Goals (4 Rounds)</span>
                </td>
                {finalScores.ranked.map(p => (
                  <td key={p.playerID} className="py-2 px-3 text-right font-bold text-emerald-400">
                    {p.endGoalsScore}
                  </td>
                ))}
              </tr>

              {/* 4. Water on Cards */}
              <tr>
                <td className="py-2 px-3 flex items-center gap-1.5 text-stone-300">
                  <Droplets size={13} className="text-sky-400" />
                  <span>Water / Dilution on Cocktails</span>
                </td>
                {finalScores.ranked.map(p => (
                  <td key={p.playerID} className="py-2 px-3 text-right font-bold text-sky-400">
                    {p.waterScore}
                  </td>
                ))}
              </tr>

              {/* Total Score */}
              <tr className="bg-amber-950/30 text-sm font-bold border-t-2 border-amber-600/60">
                <td className="py-3 px-3 uppercase text-amber-300 font-serif">
                  Total Victory Points
                </td>
                {finalScores.ranked.map(p => (
                  <td key={p.playerID} className="py-3 px-3 text-right text-base text-amber-300 font-mono">
                    {p.totalScore} pts
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bonus Breakdown Details */}
        <div className="space-y-2 my-4">
          <div className="text-[11px] uppercase font-bold text-stone-400 tracking-wider">
            Bonus Goal Explanations:
          </div>
          {finalScores.ranked.map(p => (
            <div key={p.playerID} className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs">
              <span className="font-bold text-amber-300">{p.playerName}: </span>
              {p.bonusBreakdown.map((b, i) => (
                <span key={i} className="text-stone-300 font-mono">
                  "{b.name}" ({b.count} matching = {b.points} pts).
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Play Again Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onPlayAgain}
            className="py-3 px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-900/50 border border-amber-300 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <RotateCcw size={16} />
            <span>Play New Game</span>
          </button>
        </div>
      </div>
    </div>
  );
}
