// End of round goals pure JSON data from data/endgoals.json and scoring schema from data/endgoalschema.json

export const END_GOAL_SCHEMA = {
  1: { 1: 3, 2: 1, 3: 0, 4: 0 },
  2: { 1: 5, 2: 2, 3: 1, 4: 0 },
  3: { 1: 6, 2: 4, 3: 2, 4: 0 },
  4: { 1: 8, 2: 5, 3: 3, 4: 0 }
};

export const ALL_END_GOALS = [
  {
    id: "goal_refreshing",
    name: "Drinks in Refreshing",
    qualifier: "Highest number of Drinks in Refreshing"
  },
  {
    id: "goal_sours",
    name: "Drinks in Sours",
    qualifier: "Highest number of Drinks in Sours"
  },
  {
    id: "goal_spirit_forward",
    name: "Drinks in Spirit Forward",
    qualifier: "Highest number of Drinks in Spirit Forward"
  },
  {
    id: "goal_dessert",
    name: "Drinks in Dessert",
    qualifier: "Highest number of Drinks in Dessert"
  },
  {
    id: "goal_tiki",
    name: "Drinks in Tiki",
    qualifier: "Highest number of Drinks in Tiki"
  },
  {
    id: "goal_classic_water",
    name: "Classic Drinks with water on them",
    qualifier: "Highest number of Classic Drinks (Year <= 1933) with water on them"
  },
  {
    id: "goal_modern_water",
    name: "Modern Drinks with water on them",
    qualifier: "Highest number of Modern Drinks (Year > 1933) with water on them"
  },
  {
    id: "goal_sets_of_5_water",
    name: "Sets of 5 water on cards across rows",
    qualifier: "Highest number of completed sets of 5 water on cards across rows"
  },
  {
    id: "goal_total_drinks",
    name: "Total Drinks",
    qualifier: "Most Drinks overall across all rows"
  }
];

export const GOAL_EVALUATORS = {
  goal_refreshing: (player) => {
    return (player.tableau.Refreshing || []).filter(Boolean).length;
  },
  goal_sours: (player) => {
    return (player.tableau.Sour || []).filter(Boolean).length;
  },
  goal_spirit_forward: (player) => {
    return (player.tableau["Spirit Forward"] || []).filter(Boolean).length;
  },
  goal_dessert: (player) => {
    return (player.tableau.Dessert || []).filter(Boolean).length;
  },
  goal_tiki: (player) => {
    return (player.tableau.Tiki || []).filter(Boolean).length;
  },
  goal_classic_water: (player) => {
    let count = 0;
    Object.values(player.tableau).forEach(row => {
      row.forEach(card => {
        if (card && card.era === "Classic" && (card.water || 0) > 0) {
          count++;
        }
      });
    });
    return count;
  },
  goal_modern_water: (player) => {
    let count = 0;
    Object.values(player.tableau).forEach(row => {
      row.forEach(card => {
        if (card && card.era === "Modern" && (card.water || 0) > 0) {
          count++;
        }
      });
    });
    return count;
  },
  goal_sets_of_5_water: (player) => {
    let totalWaterOnCards = 0;
    Object.values(player.tableau).forEach(row => {
      row.forEach(card => {
        if (card) totalWaterOnCards += (card.water || 0);
      });
    });
    return Math.floor(totalWaterOnCards / 5);
  },
  goal_total_drinks: (player) => {
    let count = 0;
    Object.values(player.tableau).forEach(row => {
      row.forEach(card => {
        if (card) count++;
      });
    });
    return count;
  }
};

export const ROUND_STRUCTURE = [
  { round: 1, actions: 8 },
  { round: 2, actions: 7 },
  { round: 3, actions: 6 },
  { round: 4, actions: 5 },
];
