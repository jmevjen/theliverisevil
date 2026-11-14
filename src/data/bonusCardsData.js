// Generated and adapted from data/bonuscards.json
export const BONUS_CARDS_DATA = [
  {
    id: "bonus_medicinal",
    name: "Medicinal",
    ask: "Drinks that include Bitters",
    pointsDesc: "3-4 cards = 3 pts | 5+ cards = 6 pts",
    hint: "Drinks with Bitters > 0",
    evaluate: (drinks) => {
      const matching = drinks.filter(d => (d.cost?.Bitters || 0) > 0);
      const count = matching.length;
      let points = 0;
      if (count >= 5) points = 6;
      else if (count >= 3) points = 3;
      return { count, points, matchingNames: matching.map(m => m.name) };
    }
  },
  {
    id: "bonus_strong_wine",
    name: "Strong Wine",
    ask: "Drinks that include Aperitifs",
    pointsDesc: "3-4 cards = 3 pts | 5+ cards = 6 pts",
    hint: "Drinks with Aperitif > 0",
    evaluate: (drinks) => {
      const matching = drinks.filter(d => (d.cost?.Aperitif || 0) > 0);
      const count = matching.length;
      let points = 0;
      if (count >= 5) points = 6;
      else if (count >= 3) points = 3;
      return { count, points, matchingNames: matching.map(m => m.name) };
    }
  },
  {
    id: "bonus_spelt_wrong",
    name: "Spelt Wrong",
    ask: "Drinks that include Liquer",
    pointsDesc: "3-4 cards = 3 pts | 5+ cards = 6 pts",
    hint: "Drinks with Liquer > 0",
    evaluate: (drinks) => {
      const matching = drinks.filter(d => (d.cost?.Liquer || 0) > 0);
      const count = matching.length;
      let points = 0;
      if (count >= 5) points = 6;
      else if (count >= 3) points = 3;
      return { count, points, matchingNames: matching.map(m => m.name) };
    }
  },
  {
    id: "bonus_other",
    name: "Other",
    ask: "Drinks that include Misc",
    pointsDesc: "3-4 cards = 3 pts | 5+ cards = 6 pts",
    hint: "Drinks with Misc > 0",
    evaluate: (drinks) => {
      const matching = drinks.filter(d => (d.cost?.Misc || 0) > 0);
      const count = matching.length;
      let points = 0;
      if (count >= 5) points = 6;
      else if (count >= 3) points = 3;
      return { count, points, matchingNames: matching.map(m => m.name) };
    }
  },
  {
    id: "bonus_juicy",
    name: "Juicy",
    ask: "Drinks that include Juice",
    pointsDesc: "3-4 cards = 3 pts | 5+ cards = 6 pts",
    hint: "Drinks with Juice > 0",
    evaluate: (drinks) => {
      const matching = drinks.filter(d => (d.cost?.Juice || 0) > 0);
      const count = matching.length;
      let points = 0;
      if (count >= 5) points = 6;
      else if (count >= 3) points = 3;
      return { count, points, matchingNames: matching.map(m => m.name) };
    }
  },
  {
    id: "bonus_traditionalist",
    name: "Traditionalist",
    ask: "Drinks invented before 1900",
    pointsDesc: "3-4 cards = 4 pts | 5+ cards = 7 pts",
    hint: "Year < 1900 (~19% of cards)",
    evaluate: (drinks) => {
      const matching = drinks.filter(d => d.year < 1900);
      const count = matching.length;
      let points = 0;
      if (count >= 5) points = 7;
      else if (count >= 3) points = 4;
      return { count, points, matchingNames: matching.map(m => m.name) };
    }
  },
  {
    id: "bonus_prohibition_luck",
    name: "How did you manage that?",
    ask: "Drinks invented during prohibition (1920-1933)",
    pointsDesc: "2-3 cards = 4 pts | 4+ cards = 7 pts",
    hint: "1920 <= Year <= 1933 (~5% of cards)",
    evaluate: (drinks) => {
      const matching = drinks.filter(d => d.year >= 1920 && d.year <= 1933);
      const count = matching.length;
      let points = 0;
      if (count >= 4) points = 7;
      else if (count >= 2) points = 4;
      return { count, points, matchingNames: matching.map(m => m.name) };
    }
  },
  {
    id: "bonus_modernist",
    name: "Modernist",
    ask: "Drinks invented in 21st century (2000+)",
    pointsDesc: "2-3 cards = 3 pts | 4+ cards = 6 pts",
    hint: "Year >= 2000 (~5% of cards)",
    evaluate: (drinks) => {
      const matching = drinks.filter(d => d.year >= 2000);
      const count = matching.length;
      let points = 0;
      if (count >= 4) points = 6;
      else if (count >= 2) points = 3;
      return { count, points, matchingNames: matching.map(m => m.name) };
    }
  },
  {
    id: "bonus_indiscriminate",
    name: "Indiscriminate",
    ask: "Balanced row distribution across tableau",
    pointsDesc: "At least 1 in all 5 rows = 4 pts | 2+ in all 5 rows = 8 pts",
    hint: "Distribute drinks evenly across categories",
    evaluate: (drinks, tableau) => {
      const rows = ['Refreshing', 'Sour', 'Spirit Forward', 'Tiki', 'Dessert'];
      const counts = rows.map(r => (tableau[r] || []).filter(Boolean).length);
      const minInRow = Math.min(...counts);
      let points = 0;
      if (minInRow >= 2) points = 8;
      else if (minInRow >= 1) points = 4;
      return { count: minInRow, points, matchingNames: rows.map((r, i) => `${r}: ${counts[i]}`) };
    }
  },
  {
    id: "bonus_seasoned_alcoholic",
    name: "Seasoned Alcoholic",
    ask: "Drinks in Spirit Forward",
    pointsDesc: "3-4 cards = 3 pts | 5 cards = 5 pts",
    hint: "Spirit Forward category (~30% of cards)",
    evaluate: (drinks) => {
      const matching = drinks.filter(d => d.classification === 'Spirit Forward');
      const count = matching.length;
      let points = 0;
      if (count >= 5) points = 5;
      else if (count >= 3) points = 3;
      return { count, points, matchingNames: matching.map(m => m.name) };
    }
  },
  {
    id: "bonus_urbanized",
    name: "Urbanized",
    ask: "Drinks with City Names (Vancouver, Toronto, Chicago, Manhattan...)",
    pointsDesc: "2 pts per drink (up to 8 pts)",
    hint: "Vancouver, Toronto, Chicago, Manhattan, Manhattan Perfecto",
    evaluate: (drinks) => {
      const matching = drinks.filter(d => d.isCity);
      const count = matching.length;
      const points = Math.min(8, count * 2);
      return { count, points, matchingNames: matching.map(m => m.name) };
    }
  },
  {
    id: "bonus_hollywood",
    name: "Hollywood",
    ask: "Drinks named after celebrities (Mary Pickford, Hemingway, Bellini)",
    pointsDesc: "3 pts per drink (up to 9 pts)",
    hint: "Mary Pickford, Hemingway Daiquiri, Bellini",
    evaluate: (drinks) => {
      const matching = drinks.filter(d => d.isCelebrity);
      const count = matching.length;
      const points = Math.min(9, count * 3);
      return { count, points, matchingNames: matching.map(m => m.name) };
    }
  },
  {
    id: "bonus_tiki_enthusiast",
    name: "Tiki Enthusiast",
    ask: "Drinks in Tiki",
    pointsDesc: "3-4 cards = 4 pts | 5 cards = 8 pts",
    hint: "Tiki category (~7% of cards)",
    evaluate: (drinks) => {
      const matching = drinks.filter(d => d.classification === 'Tiki');
      const count = matching.length;
      let points = 0;
      if (count >= 5) points = 8;
      else if (count >= 3) points = 4;
      return { count, points, matchingNames: matching.map(m => m.name) };
    }
  },
  {
    id: "bonus_refresher",
    name: "Refresher",
    ask: "Drinks in Refreshing",
    pointsDesc: "3-4 cards = 3 pts | 5 cards = 5 pts",
    hint: "Refreshing category (~30% of cards)",
    evaluate: (drinks) => {
      const matching = drinks.filter(d => d.classification === 'Refreshing');
      const count = matching.length;
      let points = 0;
      if (count >= 5) points = 5;
      else if (count >= 3) points = 3;
      return { count, points, matchingNames: matching.map(m => m.name) };
    }
  },
  {
    id: "bonus_sourpuss",
    name: "Sourpuss",
    ask: "Drinks in Sour",
    pointsDesc: "3-4 cards = 3 pts | 5 cards = 6 pts",
    hint: "Sour category (~22% of cards)",
    evaluate: (drinks) => {
      const matching = drinks.filter(d => d.classification === 'Sour');
      const count = matching.length;
      let points = 0;
      if (count >= 5) points = 6;
      else if (count >= 3) points = 3;
      return { count, points, matchingNames: matching.map(m => m.name) };
    }
  },
  {
    id: "bonus_sweet_tooth",
    name: "Sweet Tooth",
    ask: "Drinks in Dessert",
    pointsDesc: "3-4 cards = 4 pts | 5 cards = 7 pts",
    hint: "Dessert category (~12% of cards)",
    evaluate: (drinks) => {
      const matching = drinks.filter(d => d.classification === 'Dessert');
      const count = matching.length;
      let points = 0;
      if (count >= 5) points = 7;
      else if (count >= 3) points = 4;
      return { count, points, matchingNames: matching.map(m => m.name) };
    }
  },
  {
    id: "bonus_pre_prohibitionist",
    name: "Pre-prohibitionist",
    ask: "Drinks Invented Before 1920",
    pointsDesc: "3-4 cards = 3 pts | 5 cards = 5 pts",
    hint: "Year < 1920 (~48% of cards)",
    evaluate: (drinks) => {
      const matching = drinks.filter(d => d.year < 1920);
      const count = matching.length;
      let points = 0;
      if (count >= 5) points = 5;
      else if (count >= 3) points = 3;
      return { count, points, matchingNames: matching.map(m => m.name) };
    }
  },
  {
    id: "bonus_post_prohibitionist",
    name: "Post-prohibitionist",
    ask: "Drinks Invented After 1933",
    pointsDesc: "3-4 cards = 3 pts | 5 cards = 5 pts",
    hint: "Year > 1933 (~47% of cards)",
    evaluate: (drinks) => {
      const matching = drinks.filter(d => d.year > 1933);
      const count = matching.length;
      let points = 0;
      if (count >= 5) points = 5;
      else if (count >= 3) points = 3;
      return { count, points, matchingNames: matching.map(m => m.name) };
    }
  }
];
