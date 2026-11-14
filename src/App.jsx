import React, { useState } from 'react';
import { Client } from 'boardgame.io/react';
import { CocktailWingspanGame } from './game/cocktailGame';
import CocktailBoard from './components/CocktailBoard';

// Pre-create Client instances
const TwoPlayerVsAiClient = Client({
  game: CocktailWingspanGame,
  board: CocktailBoard,
  numPlayers: 2,
  debug: false
});

export default function App() {
  return (
    <div className="w-full min-h-screen bg-stone-950 text-stone-100">
      <TwoPlayerVsAiClient />
    </div>
  );
}
