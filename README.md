# The Liver is Evil — Cocktail Wingspan

A rich, cocktail-themed tableau-building strategy board game inspired by **Wingspan**, built with **boardgame.io** for core state management, turn mechanics, and scoring systems, and **React.js** (Vite + Tailwind CSS) for graphics and interactive UI.

---

## 🍸 Game Concept & Data Mapping

All game data is directly parsed and integrated from the project's source JSON files:

| Source File | Game Integration |
|-------------|------------------|
| `roundstructure.json` | 4-Round structure: **Round 1** (8 actions), **Round 2** (7 actions), **Round 3** (6 actions), **Round 4** (5 actions). |
| `tableau.json` | 5 Category Rows: **Refreshing** (Water), **Sours** (Ingredients), **Spirit Forward** (Drink Cards), **Tiki** (Water/Ingredients), and **Dessert** (Ingredients/Cards). Includes Column Water Costs: `[0, 1, 2, 2, 3]` and trade options for each space. |
| `drinks.json` | **111 unique cocktails** across 5 classifications with ingredient costs (Juice, Aperitif, Liquer, Bitters, Misc), Year of invention, Era (Classic vs Modern), Victory Point values, and "When Activated" Brown Powers. |
| `bonuscards.json` | **18 secret bonus goal cards**. 2 bonus cards are dealt to each player at the beginning of the game during `setupPhase`; 1 is kept and 1 is discarded before play begins. |
| `endgoals.json` | 9 End-of-Round goals (e.g., drinks in categories, classic/modern drinks with water on them, sets of 5 water, total drinks). 4 are randomly selected per game. |
| `endgoalschema.json` | Scoring schema for 1st, 2nd, 3rd, and 4th place in each of the 4 rounds, with Wingspan tie-resolution rules. |

---

## 🕹️ Gameplay Mechanics

### 1. Initial Setup Phase (`setupPhase`)
- Each player receives **5 cocktail cards**, **5 starting ingredients** (1 Juice, 1 Aperitif, 1 Liquer, 1 Bitters, 1 Misc), and **2 secret bonus cards**.
- Players must choose **1 bonus card to keep** and discard the other before Round 1 starts.

### 2. Player Turns & Actions
On their turn, a player spends 1 action cube to perform one of the following:
1. **Play a Drink Card:**
   - Pay the required ingredients (Juice, Aperitif, Liquer, Bitters, Misc).
   - Pay the water cost for the column being played into:
     - Col 1: `0 Water`
     - Col 2: `1 Water`
     - Col 3: `2 Water`
     - Col 4: `2 Water`
     - Col 5: `3 Water`
   - Place the card in the leftmost empty slot of that drink's category row.
2. **Activate a Row:**
   - Receive the resource printed in the leftmost empty space in that row (with optional resource trade).
   - Move **right-to-left** through all drinks already played in that row, activating each card's **Brown Power** (e.g. `+1 Water`, `+1 Ingredient`, `+1 Card`).
3. **Draft Drink Cards:**
   - Choose from the 3 face-up cards on the bar counter or draw blind from the deck.
   - Wipe the tray and deal 3 new cards if desired.

### 3. End-of-Round & Game End Scoring
- At the end of each round, that round's goal is evaluated and ranked.
- At the end of Round 4, the final scorecard tallies:
  1. **Drink Cards VP**
  2. **Secret Bonus Cards VP**
  3. **End-of-Round Goal Points**
  4. **Water/Dilution on Cards (1 VP each)**
- The player with the highest total Victory Points is crowned champion with confetti!

---

## 🚀 How to Run

### Development Server:
```bash
npm run dev
```

### Production Build:
```bash
npm run build
```

### Production Preview:
```bash
npm run preview
```
