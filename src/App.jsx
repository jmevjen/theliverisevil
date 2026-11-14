import React, { useState, useEffect } from 'react';
import { Client } from 'boardgame.io/client';
import { CocktailWingspanGame } from './game/cocktailGame.js';
import CocktailBoard from './components/CocktailBoard.jsx';

export default function App() {
  const [client] = useState(() => {
    const c = Client({
      game: CocktailWingspanGame,
      numPlayers: 2,
      debug: false
    });
    c.start();
    return c;
  });

  const [state, setState] = useState(() => client.getState());

  useEffect(() => {
    const unsub = client.subscribe((newState) => {
      if (newState) {
        setState({ ...newState });
      }
    });

    return () => {
      unsub();
      client.stop();
    };
  }, [client]);

  if (!state || !state.G) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-amber-200 font-serif text-lg gap-3">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
        <div>Mixing Cocktails & Shuffling Bar Recipes...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-stone-950 text-stone-100">
      <CocktailBoard
        G={state.G}
        ctx={state.ctx}
        moves={client.moves}
        events={client.events}
        playerID={client.playerID}
      />
    </div>
  );
}
