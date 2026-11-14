import React from 'react';
import { Trophy, Target, Award, CheckCircle } from 'lucide-react';
import { END_GOAL_SCHEMA, GOAL_EVALUATORS } from '../data/endGoalsData';

export default function EndGoalsBoard({
  endGoals = [],
  currentRound = 1,
  players = {},
  endGoalScores = []
}) {
  return (
    <div className="bg-stone-900/90 border border-amber-900/40 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-amber-400" />
          <h3 className="font-serif font-bold text-base text-stone-100">
            End-of-Round Goals & Standings
          </h3>
        </div>
        <div className="text-xs font-mono text-amber-300 font-bold bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded-full">
          Active: Round {currentRound} of 4
        </div>
      </div>

      {/* 4 Rounds Goal Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {endGoals.map((goal, idx) => {
          const roundNum = idx + 1;
          const isCurrent = roundNum === currentRound;
          const isCompleted = roundNum < currentRound;
          const schema = END_GOAL_SCHEMA[roundNum] || { 1: 3, 2: 1, 3: 0, 4: 0 };
          const completedResult = endGoalScores.find(s => s.roundNumber === roundNum);

          return (
            <div
              key={goal.id || idx}
              className={`rounded-xl p-3 border transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'bg-amber-950/40 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : isCompleted
                  ? 'bg-stone-950/80 border-emerald-800/60'
                  : 'bg-stone-950/40 border-stone-800 opacity-80'
              }`}
            >
              <div>
                {/* Round Badge & Points Schema */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full font-mono ${
                      isCurrent
                        ? 'bg-amber-500 text-stone-950'
                        : isCompleted
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    Round {roundNum}
                  </span>

                  <span className="text-[10px] font-mono text-amber-300 font-semibold" title="1st / 2nd / 3rd place points">
                    1st: {schema[1]}p | 2nd: {schema[2]}p
                  </span>
                </div>

                {/* Goal Name */}
                <h4 className="font-serif font-bold text-stone-100 text-sm mb-1 leading-snug">
                  {goal.name}
                </h4>

                <p className="text-[11px] text-stone-400 leading-tight mb-3">
                  {goal.qualifier}
                </p>
              </div>

              {/* Player Standings on this Goal */}
              <div className="mt-2 pt-2 border-t border-white/5 space-y-1">
                <div className="text-[10px] text-stone-500 uppercase font-semibold font-mono flex items-center justify-between">
                  <span>Player</span>
                  <span>{isCompleted ? 'Final Pts' : 'Current Progress'}</span>
                </div>

                {Object.entries(players).map(([pid, p]) => {
                  let displayValue = '';
                  let pointsEarned = null;

                  if (isCompleted && completedResult) {
                    const r = completedResult.results.find(res => res.playerID === pid);
                    displayValue = `${r ? r.rawScore : 0} (${r ? r.points : 0} pts)`;
                    pointsEarned = r ? r.points : 0;
                  } else {
                    const evalFn = GOAL_EVALUATORS[goal.id] || (() => 0);
                    const raw = evalFn(p);
                    displayValue = `${raw} count`;
                  }

                  return (
                    <div
                      key={pid}
                      className="flex items-center justify-between text-xs py-0.5 px-1.5 rounded bg-black/30 font-mono"
                    >
                      <span className="text-stone-300 truncate max-w-[100px]">{p.name}:</span>
                      <span className={pointsEarned !== null && pointsEarned > 0 ? "text-amber-300 font-bold" : "text-stone-400"}>
                        {displayValue}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Status Indicator */}
              <div className="mt-2 flex items-center gap-1 text-[10px] font-mono justify-end">
                {isCompleted ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle size={10} /> Completed
                  </span>
                ) : isCurrent ? (
                  <span className="text-amber-400 animate-pulse font-semibold">
                    Active Scoring
                  </span>
                ) : (
                  <span className="text-stone-600">Upcoming</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
