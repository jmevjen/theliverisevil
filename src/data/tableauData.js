// Tableau configuration from data/tableau.json
export const TABLEAU_ROWS = [
  {
    key: "Refreshing",
    name: "Refreshing",
    classification: "Refreshing",
    actionName: "Gain Water",
    resourceType: "water",
    description: "Gain water for your cocktails & dilution",
    accentColor: "#38bdf8", // Sky blue / water
    slots: [
      { col: 0, base: { water: 2 }, trade: null, label: "2 Water" },
      { col: 1, base: { water: 2 }, trade: { discard: "card", gain: { water: 1 } }, label: "2 Water (+1 for 1 Card)" },
      { col: 2, base: { water: 3 }, trade: null, label: "3 Water" },
      { col: 3, base: { water: 3 }, trade: { discard: "card", gain: { water: 1 } }, label: "3 Water (+1 for 1 Card)" },
      { col: 4, base: { water: 4 }, trade: null, label: "4 Water" },
    ]
  },
  {
    key: "Sour",
    name: "Sours",
    classification: "Sour",
    actionName: "Gain Ingredients",
    resourceType: "ingredient",
    description: "Gain ingredients (Juice, Aperitif, Liquer, Bitters, Misc)",
    accentColor: "#facc15", // Citrus yellow
    slots: [
      { col: 0, base: { ingredients: 2 }, trade: null, label: "2 Ingredients" },
      { col: 1, base: { ingredients: 2 }, trade: { discard: "water", gain: { ingredients: 1 } }, label: "2 Ingredients (+1 for 1 Water)" },
      { col: 2, base: { ingredients: 3 }, trade: null, label: "3 Ingredients" },
      { col: 3, base: { ingredients: 3 }, trade: { discard: "water", gain: { ingredients: 1 } }, label: "3 Ingredients (+1 for 1 Water)" },
      { col: 4, base: { ingredients: 4 }, trade: null, label: "4 Ingredients" },
    ]
  },
  {
    key: "Spirit Forward",
    name: "Spirit Forward",
    classification: "Spirit Forward",
    actionName: "Draw Drink Cards",
    resourceType: "card",
    description: "Draw cocktail recipes from the bar tray or deck",
    accentColor: "#f97316", // Amber / whiskey orange
    slots: [
      { col: 0, base: { cards: 1 }, trade: null, label: "1 Card" },
      { col: 1, base: { cards: 1 }, trade: { discard: "ingredient", gain: { cards: 1 } }, label: "1 Card (+1 for 1 Ingredient)" },
      { col: 2, base: { cards: 2 }, trade: null, label: "2 Cards" },
      { col: 3, base: { cards: 2 }, trade: { discard: "ingredient", gain: { cards: 1 } }, label: "2 Cards (+1 for 1 Ingredient)" },
      { col: 4, base: { cards: 3 }, trade: null, label: "3 Cards" },
    ]
  },
  {
    key: "Tiki",
    name: "Tiki",
    classification: "Tiki",
    actionName: "Gain Water & Ingredients",
    resourceType: "water_and_ingredient",
    description: "Gain flexible choice of water or ingredients",
    accentColor: "#4ade80", // Tropical green
    slots: [
      { col: 0, base: { flexible: 1 }, trade: null, label: "1 of Either" },
      { col: 1, base: { flexible: 1 }, trade: { discard: "card", gain: { flexible: 1 } }, label: "1 of Either (+1 for 1 Card)" },
      { col: 2, base: { flexible: 2 }, trade: null, label: "2 of Either" },
      { col: 3, base: { flexible: 2 }, trade: { discard: "card", gain: { flexible: 1 } }, label: "2 of Either (+1 for 1 Card)" },
      { col: 4, base: { flexible: 3 }, trade: null, label: "3 of Either" },
    ]
  },
  {
    key: "Dessert",
    name: "Dessert",
    classification: "Dessert",
    actionName: "Gain Ingredients & Cards",
    resourceType: "ingredient_and_card",
    description: "Gain flexible choice of ingredients or cards",
    accentColor: "#ec4899", // Berry pink / dessert cream
    slots: [
      { col: 0, base: { flexible: 1 }, trade: null, label: "1 of Either" },
      { col: 1, base: { flexible: 1 }, trade: { discard: "water", gain: { flexible: 1 } }, label: "1 of Either (+1 for 1 Water)" },
      { col: 2, base: { flexible: 2 }, trade: null, label: "2 of Either" },
      { col: 3, base: { flexible: 2 }, trade: { discard: "water", gain: { flexible: 1 } }, label: "2 of Either (+1 for 1 Water)" },
      { col: 4, base: { flexible: 3 }, trade: null, label: "3 of Either" },
    ]
  }
];

export const COLUMN_WATER_COSTS = [0, 1, 2, 2, 3];
