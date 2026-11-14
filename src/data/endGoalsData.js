// End of round goals from data/endgoals.json and scoring schema from data/endgoalschema.json

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
    qualifier: "Highest number of Drinks in Refreshing",
    evaluate: (player) => {
      return (player.tableau.Refreshing || []).filter(Boolean).length;
    }
  },
  {
    id: "goal_sours",
    name: "Drinks in Sours",
    qualifier: "Highest number of Drinks in Sours",
    evaluate: (player) => {
      return (player.tableau.Sour || []).filter(Boolean).length;
    }
  },
  {
    id: "goal_spirit_forward",
    name: "Drinks in Spirit Forward",
    qualifier: "Highest number of Drinks in Spirit Forward",
    evaluate: (player) => {
      return (player.tableau["Spirit Forward"] || []).filter(Boolean).length;
    }
  },
  {
    id: "goal_dessert",
    name: "Drinks in Dessert",
    qualifier: "Highest number of Drinks in Dessert",
    evaluate: (player) => {
      return (player.tableau.Dessert || []).filter(Boolean).length;
    }
  },
  {
    id: "goal_tiki",
    name: "Drinks in Tiki",
    qualifier: "Highest number of Drinks in Tiki",
    evaluate: (player) => {
      return (player.tableau.Tiki || []).filter(Boolean).length;
    }
  },
  {
    id: "goal_classic_water",
    name: "Classic Drinks with water on them",
    qualifier: "Highest number of Classic Drinks (Year <= 1933) with water on them",
    evaluate: (player) => {
      let count = 0;
      Object.values(player.tableau).forEach(row => {
        row.forEach(card => {
          if (card && card.era === "Classic" && (card.water || 0) > 0) {
            count++;
          }
        });
      });
      return count;
    }
  },
  {
    id: "goal_modern_water",
    name: "Modern Drinks with water on them",
    qualifier: "Highest number of Modern Drinks (Year > 1933) with water on them",
    evaluate: (player) => {
      let count = 0;
      Object.values(player.tableau).forEach(row => {
        row.forEach(card => {
          if (card && card.era === "Modern" && (card.water || 0) > 0) {
            count++;
          }
        });
      });
      return count;
    }
  },
  {
    id: "goal_sets_of_5_water",
    name: "Sets of 5 water on cards across rows",
    qualifier: "Highest number of completed sets of 5 water on cards across rows",
    evaluate: (player) => {
      let totalWaterOnCards = 0;
      Object.values(player.tableau).forEach(row => {
        row.forEach(card => {
          if (card) totalWaterOnCards += (card.water || 0);
        });
      });
      return Math.floor(totalWaterOnCards / 5);
    }
  },
  {
    id: "goal_total_drinks",
    name: "Total Drinks",
    qualifier: "Most Drinks overall across all rows",
    evaluate: (player) => {
      let count = 0;
      Object.values(player.tableau).forEach(row => {
        row.forEach(card => {
          if (card) count++;
        });
      });
      return count;
    }
  }
];

export const ROUND_STRUCTURE = [
  { round: 1, actions: 8 },
  { round: 2, actions: 7 },
  { round: 3, actions: 6 },
  { round: 4, actions: 5 },
];
