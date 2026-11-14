import { DRINKS_DATA } from '../data/drinksData.js';
import { BONUS_CARDS_DATA } from '../data/bonusCardsData.js';
import { ALL_END_GOALS, ROUND_STRUCTURE } from '../data/endGoalsData.js';
import { TABLEAU_ROWS, COLUMN_WATER_COSTS } from '../data/tableauData.js';
import {
  canPlayDrink,
  spendPlayerWater,
  addPlayerWater,
  evaluateRoundGoal,
  calculateFinalScores
} from './evaluators.js';

// Helper to shuffle array
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const CocktailWingspanGame = {
  name: 'cocktail-wingspan',

  setup: (context, setupData = {}) => {
    const ctx = (context && context.ctx) ? context.ctx : context || {};
    const numPlayers = (ctx && ctx.numPlayers) ? ctx.numPlayers : 2;
    const shuffledDeck = shuffle(DRINKS_DATA);
    const shuffledBonus = shuffle(BONUS_CARDS_DATA);
    const shuffledGoals = shuffle(ALL_END_GOALS).slice(0, 4);

    // Initial 3 face-up cards in the bar tray
    const tray = shuffledDeck.splice(0, 3);

    const players = {};
    for (let i = 0; i < numPlayers; i++) {
      const pid = i.toString();
      const isAi = setupData.aiPlayers ? setupData.aiPlayers.includes(pid) : (i > 0);
      
      // Deal 5 drink cards to each player
      const hand = shuffledDeck.splice(0, 5);
      
      // Deal 2 bonus cards to each player (1 will be discarded before play begins)
      const initialBonusDrawn = shuffledBonus.splice(0, 2);

      players[pid] = {
        id: pid,
        name: isAi ? `Automattender (AI)` : `Player ${i + 1}`,
        isAi,
        hand,
        bonusCards: [],
        initialBonusDrawn,
        setupDone: false,
        ingredients: {
          Juice: 1,
          Aperitif: 1,
          Liquer: 1,
          Bitters: 1,
          Misc: 1
        },
        waterSupply: 0,
        actionsRemaining: ROUND_STRUCTURE[0].actions, // 8 in Round 1
        totalActionsThisRound: ROUND_STRUCTURE[0].actions,
        actionCubesPlaced: 0,
        tableau: {
          Refreshing: [null, null, null, null, null],
          Sour: [null, null, null, null, null],
          "Spirit Forward": [null, null, null, null, null],
          Tiki: [null, null, null, null, null],
          Dessert: [null, null, null, null, null]
        }
      };
    }

    return {
      players,
      deck: shuffledDeck,
      tray,
      bonusDeck: shuffledBonus,
      endGoals: shuffledGoals,
      endGoalScores: [],
      currentRound: 1,
      roundStructure: ROUND_STRUCTURE,
      gameLog: [
        {
          timestamp: Date.now(),
          text: "Welcome to The Liver is Evil! 2 bonus cards dealt to each player. Choose 1 to keep."
        }
      ],
      lastAction: null,
      isGameOver: false,
      winner: null,
      finalScores: null
    };
  },

  phases: {
    setupPhase: {
      start: true,
      moves: {
        discardBonusCard: ({ G, ctx, playerID }, bonusCardId) => {
          const pid = playerID || (ctx && ctx.playerID) || (ctx && ctx.currentPlayer) || '0';
          const player = G.players[pid];
          if (!player || player.setupDone) return;

          // Keep the other bonus card
          const kept = player.initialBonusDrawn.find(b => b.id !== bonusCardId);
          if (kept) {
            player.bonusCards = [kept];
          } else {
            player.bonusCards = [player.initialBonusDrawn[0]];
          }
          player.setupDone = true;

          G.gameLog.unshift({
            timestamp: Date.now(),
            text: `${player.name} selected their secret bonus goal: "${player.bonusCards[0].name}".`
          });
        },

        keepBonusCard: ({ G, ctx, playerID }, keptBonusCardId) => {
          const pid = playerID || (ctx && ctx.playerID) || (ctx && ctx.currentPlayer) || '0';
          const player = G.players[pid];
          if (!player || player.setupDone) return;

          const kept = player.initialBonusDrawn.find(b => b.id === keptBonusCardId);
          if (kept) {
            player.bonusCards = [kept];
            player.setupDone = true;
            G.gameLog.unshift({
              timestamp: Date.now(),
              text: `${player.name} selected their secret bonus goal: "${kept.name}".`
            });
          }
        }
      },
      endIf: (context) => {
        const G = context.G || context;
        if (!G || !G.players) return false;
        return Object.values(G.players).every(p => p.setupDone);
      },
      onEnd: (context) => {
        const G = context.G || context;
        if (G && G.gameLog) {
          G.gameLog.unshift({
            timestamp: Date.now(),
            text: "Setup complete! Round 1 begins with 8 action cubes per player."
          });
        }
      },
      next: 'playPhase'
    },

    playPhase: {
      moves: {
        playDrinkCard: ({ G, ctx, playerID, events }, { cardId, rowKey, colIdx }) => {
          const pid = playerID || (ctx && ctx.playerID) || (ctx && ctx.currentPlayer) || '0';
          const player = G.players[pid];
          if (!player || player.actionsRemaining <= 0) return;

          const card = player.hand.find(c => c.id === cardId);
          if (!card) return;

          const validation = canPlayDrink(player, card, rowKey, colIdx);
          if (!validation.valid) return;

          // Deduct ingredient costs
          for (const [ingredient, needed] of Object.entries(card.cost || {})) {
            if (needed > 0) {
              player.ingredients[ingredient] -= needed;
            }
          }

          // Deduct water cost for column
          const waterCost = COLUMN_WATER_COSTS[colIdx] || 0;
          if (waterCost > 0) {
            spendPlayerWater(player, waterCost);
          }

          // Place drink in tableau
          const placedDrink = {
            ...card,
            water: 0
          };
          player.tableau[rowKey][colIdx] = placedDrink;

          // Remove from hand
          player.hand = player.hand.filter(c => c.id !== cardId);

          // Deduct 1 action cube
          player.actionsRemaining -= 1;
          player.actionCubesPlaced += 1;

          G.lastAction = {
            type: 'PLAY_DRINK',
            playerID: pid,
            cardName: card.name,
            rowKey,
            colIdx,
            waterCost
          };

          G.gameLog.unshift({
            timestamp: Date.now(),
            text: `${player.name} played "${card.name}" into ${rowKey} (Col ${colIdx + 1}) for ${waterCost} water.`
          });

          checkRoundAndAdvance(G, ctx, events);
        },

        activateRow: ({ G, ctx, playerID, events }, { rowKey, tradeOption, choices = {} }) => {
          const pid = playerID || (ctx && ctx.playerID) || (ctx && ctx.currentPlayer) || '0';
          const player = G.players[pid];
          if (!player || player.actionsRemaining <= 0) return;

          const row = player.tableau[rowKey];
          const rowDef = TABLEAU_ROWS.find(r => r.key === rowKey);
          if (!row || !rowDef) return;

          // Leftmost empty slot index determines base benefit
          let actionCol = row.findIndex(c => c === null);
          if (actionCol === -1) actionCol = 4; // if row is full, use col 4
          const slot = rowDef.slots[actionCol];

          const logDetails = [];

          // 1. Process base benefits & optional trades
          if (rowKey === 'Refreshing') {
            let waterGained = slot.base.water;
            if (tradeOption && player.hand.length > 0 && choices.discardCardId) {
              player.hand = player.hand.filter(c => c.id !== choices.discardCardId);
              waterGained += 1;
              logDetails.push("traded 1 card for +1 water");
            }
            addPlayerWater(player, waterGained, choices.targetCardId);
            logDetails.push(`gained ${waterGained} water`);
          } else if (rowKey === 'Sour') {
            let ingGained = slot.base.ingredients;
            if (tradeOption && getPlayerTotalWater(player) > 0) {
              spendPlayerWater(player, 1);
              ingGained += 1;
              logDetails.push("traded 1 water for +1 ingredient");
            }
            const ingChoices = choices.ingredients || ['Juice', 'Bitters'];
            for (let i = 0; i < ingGained; i++) {
              const ing = ingChoices[i % ingChoices.length] || 'Juice';
              player.ingredients[ing] = (player.ingredients[ing] || 0) + 1;
            }
            logDetails.push(`gained ${ingGained} ingredients`);
          } else if (rowKey === 'Spirit Forward') {
            let cardsToDraw = slot.base.cards;
            if (tradeOption && choices.discardIngredient && (player.ingredients[choices.discardIngredient] || 0) > 0) {
              player.ingredients[choices.discardIngredient] -= 1;
              cardsToDraw += 1;
              logDetails.push(`traded 1 ${choices.discardIngredient} for +1 card`);
            }
            for (let i = 0; i < cardsToDraw; i++) {
              if (G.deck.length > 0) {
                const drawn = G.deck.pop();
                player.hand.push(drawn);
              }
            }
            logDetails.push(`drew ${cardsToDraw} card(s)`);
          } else if (rowKey === 'Tiki') {
            let count = slot.base.flexible;
            if (tradeOption && player.hand.length > 0 && choices.discardCardId) {
              player.hand = player.hand.filter(c => c.id !== choices.discardCardId);
              count += 1;
              logDetails.push("traded 1 card for +1 Tiki resource");
            }
            const waterPortion = choices.waterCount !== undefined ? choices.waterCount : 1;
            const ingPortion = Math.max(0, count - waterPortion);
            if (waterPortion > 0) {
              addPlayerWater(player, waterPortion);
              logDetails.push(`+${waterPortion} water`);
            }
            if (ingPortion > 0) {
              const ingType = choices.ingredientType || 'Misc';
              player.ingredients[ingType] = (player.ingredients[ingType] || 0) + ingPortion;
              logDetails.push(`+${ingPortion} ${ingType}`);
            }
          } else if (rowKey === 'Dessert') {
            let count = slot.base.flexible;
            if (tradeOption && getPlayerTotalWater(player) > 0) {
              spendPlayerWater(player, 1);
              count += 1;
              logDetails.push("traded 1 water for +1 Dessert resource");
            }
            const cardsPortion = choices.cardCount !== undefined ? choices.cardCount : 1;
            const ingPortion = Math.max(0, count - cardsPortion);
            if (cardsPortion > 0 && G.deck.length > 0) {
              for (let i = 0; i < cardsPortion && G.deck.length > 0; i++) {
                player.hand.push(G.deck.pop());
              }
              logDetails.push(`+${cardsPortion} card(s)`);
            }
            if (ingPortion > 0) {
              const ingType = choices.ingredientType || 'Liquer';
              player.ingredients[ingType] = (player.ingredients[ingType] || 0) + ingPortion;
              logDetails.push(`+${ingPortion} ${ingType}`);
            }
          }

          // 2. Brown Power Activations: right-to-left across all played cards in this row
          const activatedPowers = [];
          for (let col = actionCol - 1; col >= 0; col--) {
            const card = row[col];
            if (card && card.power) {
              const pwr = card.power.toLowerCase();
              if (pwr.includes('water') && !pwr.includes('ingredient')) {
                addPlayerWater(player, 1);
                activatedPowers.push(`${card.name} (+1 Water)`);
              } else if (pwr.includes('drink card')) {
                if (G.deck.length > 0) {
                  player.hand.push(G.deck.pop());
                  activatedPowers.push(`${card.name} (+1 Card)`);
                }
              } else if (pwr.includes('ingredient') && !pwr.includes('water') && !pwr.includes('card')) {
                player.ingredients.Bitters = (player.ingredients.Bitters || 0) + 1;
                activatedPowers.push(`${card.name} (+1 Ingredient)`);
              } else if (pwr.includes('water or ingredient')) {
                addPlayerWater(player, 1);
                activatedPowers.push(`${card.name} (+1 Water)`);
              } else if (pwr.includes('ingredient or drink card')) {
                if (G.deck.length > 0) {
                  player.hand.push(G.deck.pop());
                  activatedPowers.push(`${card.name} (+1 Card)`);
                }
              }
            }
          }

          player.actionsRemaining -= 1;
          player.actionCubesPlaced += 1;

          G.lastAction = {
            type: 'ACTIVATE_ROW',
            playerID: pid,
            rowKey,
            actionCol,
            logDetails,
            activatedPowers
          };

          const pwrText = activatedPowers.length > 0 ? ` Powers activated: [${activatedPowers.join(', ')}].` : '';
          G.gameLog.unshift({
            timestamp: Date.now(),
            text: `${player.name} activated ${rowKey} row (${logDetails.join(', ')}).${pwrText}`
          });

          checkRoundAndAdvance(G, ctx, events);
        },

        drawFromTray: ({ G, ctx, playerID }, trayIndex) => {
          const pid = playerID || (ctx && ctx.playerID) || (ctx && ctx.currentPlayer) || '0';
          const player = G.players[pid];
          if (!player || trayIndex < 0 || trayIndex >= G.tray.length) return;

          const card = G.tray[trayIndex];
          if (!card) return;

          player.hand.push(card);

          if (G.deck.length > 0) {
            G.tray[trayIndex] = G.deck.pop();
          } else {
            G.tray.splice(trayIndex, 1);
          }

          G.gameLog.unshift({
            timestamp: Date.now(),
            text: `${player.name} drafted "${card.name}" from the bar tray.`
          });
        },

        resetTray: ({ G, ctx, playerID }) => {
          const pid = playerID || (ctx && ctx.playerID) || (ctx && ctx.currentPlayer) || '0';
          const player = G.players[pid];
          if (G.deck.length === 0) return;

          const newTray = [];
          for (let i = 0; i < 3 && G.deck.length > 0; i++) {
            newTray.push(G.deck.pop());
          }
          G.tray = newTray;

          G.gameLog.unshift({
            timestamp: Date.now(),
            text: `${player ? player.name : 'Player'} wiped the bar tray and drew 3 fresh drinks.`
          });
        },

        passAction: ({ G, ctx, playerID, events }) => {
          const pid = playerID || (ctx && ctx.playerID) || (ctx && ctx.currentPlayer) || '0';
          const player = G.players[pid];
          if (!player || player.actionsRemaining <= 0) return;

          player.actionsRemaining -= 1;
          player.actionCubesPlaced += 1;

          G.gameLog.unshift({
            timestamp: Date.now(),
            text: `${player.name} passed their action.`
          });

          checkRoundAndAdvance(G, ctx, events);
        }
      }
    }
  },

  endIf: (context) => {
    const G = context.G || context;
    if (G && G.isGameOver) {
      return { winner: G.winner, finalScores: G.finalScores };
    }
  }
};

/**
 * Handle turn passing and round completion checks
 */
function checkRoundAndAdvance(G, ctx, events) {
  // Check if ALL players have 0 actions remaining for this round
  const allActionsDone = Object.values(G.players).every(p => p.actionsRemaining <= 0);

  if (allActionsDone) {
    const roundNumber = G.currentRound;
    const currentGoal = G.endGoals[roundNumber - 1];

    if (currentGoal) {
      const roundResult = evaluateRoundGoal(G.players, currentGoal, roundNumber);
      G.endGoalScores.push(roundResult);

      const rankingText = roundResult.results
        .map(r => `${r.playerName}: ${r.rawScore} (${r.points} pts)`)
        .join(', ');

      G.gameLog.unshift({
        timestamp: Date.now(),
        text: `Round ${roundNumber} Goal "${currentGoal.name}" scored! [${rankingText}].`
      });
    }

    // Refresh tray for the new round
    if (G.deck.length >= 3) {
      G.tray = [G.deck.pop(), G.deck.pop(), G.deck.pop()];
    }

    if (roundNumber >= 4) {
      // Game Over after Round 4
      G.isGameOver = true;
      const finalResult = calculateFinalScores(G);
      G.finalScores = finalResult;
      G.winner = finalResult.winner;

      G.gameLog.unshift({
        timestamp: Date.now(),
        text: `Game Over! Final Winner: ${G.winner.playerName} with ${G.winner.totalScore} points!`
      });
    } else {
      // Move to next round
      G.currentRound += 1;
      const nextRoundActions = ROUND_STRUCTURE[G.currentRound - 1].actions;

      Object.values(G.players).forEach(p => {
        p.actionsRemaining = nextRoundActions;
        p.totalActionsThisRound = nextRoundActions;
      });

      G.gameLog.unshift({
        timestamp: Date.now(),
        text: `Round ${G.currentRound} begins! Players have ${nextRoundActions} action cubes.`
      });
    }
  }

  // End turn to advance player in boardgame.io
  if (events && events.endTurn) {
    events.endTurn();
  } else if (ctx && ctx.events && ctx.events.endTurn) {
    ctx.events.endTurn();
  }
}
