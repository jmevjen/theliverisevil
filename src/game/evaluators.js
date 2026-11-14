import { ALL_END_GOALS, END_GOAL_SCHEMA } from '../data/endGoalsData.js';
import { BONUS_CARDS_DATA } from '../data/bonusCardsData.js';
import { COLUMN_WATER_COSTS } from '../data/tableauData.js';

/**
 * Check if a player can afford and play a drink card
 */
export function canPlayDrink(player, card, rowKey, colIdx) {
  if (!card) return { valid: false, reason: "No card selected" };
  if (card.classification !== rowKey) {
    return { valid: false, reason: `This drink belongs in the ${card.classification} row, not ${rowKey}` };
  }

  const row = player.tableau[rowKey];
  if (!row) return { valid: false, reason: "Invalid row" };

  // Must place in the leftmost empty slot
  const leftmostEmpty = row.findIndex(c => c === null);
  if (leftmostEmpty === -1) {
    return { valid: false, reason: "This row is already completely full (5/5 drinks)" };
  }
  if (colIdx !== leftmostEmpty) {
    return { valid: false, reason: `Drinks must be placed left-to-right. Place in column ${leftmostEmpty + 1}` };
  }

  // Check ingredient cost
  for (const [ingredient, needed] of Object.entries(card.cost || {})) {
    if (needed > 0 && (player.ingredients[ingredient] || 0) < needed) {
      return {
        valid: false,
        reason: `Need ${needed} ${ingredient} (you have ${player.ingredients[ingredient] || 0})`
      };
    }
  }

  // Check water cost for this column
  const waterNeeded = COLUMN_WATER_COSTS[colIdx] || 0;
  const availableWater = getPlayerTotalWater(player);
  if (availableWater < waterNeeded) {
    return {
      valid: false,
      reason: `Column ${colIdx + 1} requires ${waterNeeded} water (you have ${availableWater} water on your cards & bar)`
    };
  }

  return { valid: true };
}

/**
 * Total water available across player's tableau cards + water supply
 */
export function getPlayerTotalWater(player) {
  let total = player.waterSupply || 0;
  Object.values(player.tableau).forEach(row => {
    row.forEach(card => {
      if (card) total += (card.water || 0);
    });
  });
  return total;
}

/**
 * Remove water from player (from cards or water supply)
 */
export function spendPlayerWater(player, amount) {
  let remaining = amount;
  
  // Spend unassigned water supply first
  if (player.waterSupply >= remaining) {
    player.waterSupply -= remaining;
    return;
  } else {
    remaining -= player.waterSupply;
    player.waterSupply = 0;
  }

  // Then take water from drinks on tableau
  for (const row of Object.values(player.tableau)) {
    for (const card of row) {
      if (card && card.water > 0) {
        const take = Math.min(card.water, remaining);
        card.water -= take;
        remaining -= take;
        if (remaining <= 0) return;
      }
    }
  }
}

/**
 * Distribute gained water to drinks that have capacity, excess to waterSupply
 */
export function addPlayerWater(player, amount, preferredCardId = null) {
  let remaining = amount;

  // If player specified a preferred card
  if (preferredCardId) {
    for (const row of Object.values(player.tableau)) {
      for (const card of row) {
        if (card && card.id === preferredCardId) {
          const space = (card.maxWater || 5) - (card.water || 0);
          const add = Math.min(space, remaining);
          card.water = (card.water || 0) + add;
          remaining -= add;
          break;
        }
      }
    }
  }

  // Fill remaining onto any drink with space
  if (remaining > 0) {
    for (const row of Object.values(player.tableau)) {
      for (const card of row) {
        if (card && (card.water || 0) < (card.maxWater || 5)) {
          const space = (card.maxWater || 5) - (card.water || 0);
          const add = Math.min(space, remaining);
          card.water = (card.water || 0) + add;
          remaining -= add;
          if (remaining <= 0) break;
        }
      }
      if (remaining <= 0) break;
    }
  }

  // Any excess goes into water supply
  if (remaining > 0) {
    player.waterSupply = (player.waterSupply || 0) + remaining;
  }
}

/**
 * Evaluate all players for an end-of-round goal
 */
export function evaluateRoundGoal(players, goalObj, roundNumber) {
  const schema = END_GOAL_SCHEMA[roundNumber] || { 1: 3, 2: 1, 3: 0, 4: 0 };
  
  // Calculate each player's raw score on this goal
  const playerScores = Object.entries(players).map(([playerID, player]) => {
    const rawScore = goalObj.evaluate(player);
    return {
      playerID,
      playerName: player.name || `Player ${parseInt(playerID) + 1}`,
      rawScore
    };
  });

  // Sort descending by raw score
  playerScores.sort((a, b) => b.rawScore - a.rawScore);

  // Calculate ranks and handle ties (Wingspan tie rules: tied players share points)
  const results = [];
  let currentRank = 1;

  for (let i = 0; i < playerScores.length; ) {
    let tieCount = 1;
    while (
      i + tieCount < playerScores.length &&
      playerScores[i + tieCount].rawScore === playerScores[i].rawScore
    ) {
      tieCount++;
    }

    // Points for tied positions
    let totalPoints = 0;
    for (let r = 0; r < tieCount; r++) {
      const rankPos = currentRank + r;
      totalPoints += schema[rankPos] || 0;
    }
    const pointsEach = Math.floor(totalPoints / tieCount);

    for (let r = 0; r < tieCount; r++) {
      results.push({
        playerID: playerScores[i + r].playerID,
        playerName: playerScores[i + r].playerName,
        rawScore: playerScores[i + r].rawScore,
        rank: currentRank,
        points: pointsEach
      });
    }

    currentRank += tieCount;
    i += tieCount;
  }

  return {
    goalId: goalObj.id,
    goalName: goalObj.name,
    qualifier: goalObj.qualifier,
    roundNumber,
    results
  };
}

/**
 * Calculate comprehensive final scores for all players
 */
export function calculateFinalScores(G) {
  const finalScores = {};

  Object.entries(G.players).forEach(([playerID, player]) => {
    // 1. Played Drink Cards Score
    let drinksScore = 0;
    const allPlayedDrinks = [];
    Object.values(player.tableau).forEach(row => {
      row.forEach(card => {
        if (card) {
          drinksScore += (card.score || 0);
          allPlayedDrinks.push(card);
        }
      });
    });

    // 2. Bonus Cards Score
    let bonusCardsScore = 0;
    const bonusBreakdown = [];
    (player.bonusCards || []).forEach(bonus => {
      const bonusDef = BONUS_CARDS_DATA.find(b => b.id === bonus.id || b.name === bonus.name);
      if (bonusDef && bonusDef.evaluate) {
        const evalResult = bonusDef.evaluate(allPlayedDrinks, player.tableau);
        bonusCardsScore += evalResult.points;
        bonusBreakdown.push({
          name: bonusDef.name,
          ask: bonusDef.ask,
          count: evalResult.count,
          points: evalResult.points,
          details: evalResult.matchingNames
        });
      }
    });

    // 3. End of Round Goals Score
    let endGoalsScore = 0;
    const endGoalsBreakdown = [];
    (G.endGoalScores || []).forEach(roundResult => {
      const pRes = roundResult.results.find(r => r.playerID === playerID);
      const points = pRes ? pRes.points : 0;
      endGoalsScore += points;
      endGoalsBreakdown.push({
        round: roundResult.roundNumber,
        goalName: roundResult.goalName,
        rawScore: pRes ? pRes.rawScore : 0,
        rank: pRes ? pRes.rank : '-',
        points
      });
    });

    // 4. Water on Cards (1 pt each)
    let waterScore = 0;
    allPlayedDrinks.forEach(d => {
      waterScore += (d.water || 0);
    });

    // Total Score
    const totalScore = drinksScore + bonusCardsScore + endGoalsScore + waterScore;

    finalScores[playerID] = {
      playerID,
      playerName: player.name || `Player ${parseInt(playerID) + 1}`,
      totalScore,
      drinksScore,
      bonusCardsScore,
      endGoalsScore,
      waterScore,
      drinksCount: allPlayedDrinks.length,
      bonusBreakdown,
      endGoalsBreakdown
    };
  });

  // Rank players by total score
  const ranked = Object.values(finalScores).sort((a, b) => b.totalScore - a.totalScore);
  const winner = ranked[0];

  return {
    scores: finalScores,
    ranked,
    winner
  };
}
