import { canPlayDrink, getPlayerTotalWater } from './evaluators.js';

export function makeAiMove(G, ctx, moves) {
  const pid = ctx.currentPlayer;
  const player = G.players[pid];
  if (!player || !player.isAi) return false;

  // 1. Setup Phase AI
  if (ctx.phase === 'setupPhase') {
    if (!player.setupDone && player.initialBonusDrawn && player.initialBonusDrawn.length === 2) {
      // Pick the first bonus card, discard the second
      moves.discardBonusCard(player.initialBonusDrawn[1].id);
      return true;
    }
    return false;
  }

  // 2. Play Phase AI
  if (ctx.phase === 'playPhase') {
    if (player.actionsRemaining <= 0) return false;

    // Check if AI can play any drink in its hand
    const playableDrinks = [];
    player.hand.forEach(card => {
      const rowKey = card.classification;
      const row = player.tableau[rowKey];
      if (row) {
        const leftmostEmpty = row.findIndex(c => c === null);
        if (leftmostEmpty !== -1) {
          const val = canPlayDrink(player, card, rowKey, leftmostEmpty);
          if (val.valid) {
            playableDrinks.push({ card, rowKey, colIdx: leftmostEmpty });
          }
        }
      }
    });

    // If can play, play the highest-scoring card
    if (playableDrinks.length > 0) {
      playableDrinks.sort((a, b) => (b.card.score || 0) - (a.card.score || 0));
      const best = playableDrinks[0];
      moves.playDrinkCard({
        cardId: best.card.id,
        rowKey: best.rowKey,
        colIdx: best.colIdx
      });
      return true;
    }

    // Otherwise, decide which row to activate:
    // Check what resources we lack for cards in hand
    let needWater = false;
    let neededIngredients = [];

    player.hand.forEach(card => {
      const rowKey = card.classification;
      const row = player.tableau[rowKey];
      if (row) {
        const leftmostEmpty = row.findIndex(c => c === null);
        if (leftmostEmpty !== -1) {
          // Check ingredients
          for (const [ing, count] of Object.entries(card.cost || {})) {
            if ((player.ingredients[ing] || 0) < count) {
              neededIngredients.push(ing);
            }
          }
        }
      }
    });

    const totalWater = getPlayerTotalWater(player);
    if (totalWater < 2) {
      needWater = true;
    }

    // Heuristics:
    if (player.hand.length <= 1) {
      // Draw cards
      moves.activateRow({
        rowKey: 'Spirit Forward',
        tradeOption: false
      });
      return true;
    }

    if (needWater && totalWater === 0) {
      // Gain Water
      moves.activateRow({
        rowKey: 'Refreshing',
        tradeOption: false
      });
      return true;
    }

    if (neededIngredients.length > 0) {
      // Gain Ingredients
      moves.activateRow({
        rowKey: 'Sour',
        tradeOption: false,
        choices: {
          ingredients: [neededIngredients[0] || 'Juice', 'Bitters']
        }
      });
      return true;
    }

    // Flexible Tiki or Dessert
    moves.activateRow({
      rowKey: 'Tiki',
      tradeOption: false,
      choices: {
        waterCount: 1,
        ingredientType: 'Misc'
      }
    });
    return true;
  }

  return false;
}
