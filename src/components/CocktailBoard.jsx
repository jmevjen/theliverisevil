import React, { useState, useEffect } from 'react';
import TableauBoard from './TableauBoard';
import HandView from './HandView';
import BarSupply from './BarSupply';
import DrinkTray from './DrinkTray';
import EndGoalsBoard from './EndGoalsBoard';
import BonusCardsModal from './BonusCardsModal';
import ActionModal from './ActionModal';
import ScoreSummaryModal from './ScoreSummaryModal';
import RulesGuideModal from './RulesGuideModal';
import CardDetailModal from './CardDetailModal';
import { sounds } from '../utils/soundEffects';
import { makeAiMove } from '../game/aiBot';
import { Volume2, VolumeX, Sparkles, Trophy, Users, ShieldAlert, BookOpen, Clock, Activity } from 'lucide-react';

export default function CocktailBoard({ G, ctx, moves, events, playerID }) {
  // Local viewing player ID (support hotseat pass-and-play or solo vs AI)
  const [viewingPlayerID, setViewingPlayerID] = useState(ctx.currentPlayer || '0');
  const [selectedCardToPlay, setSelectedCardToPlay] = useState(null);
  const [inspectedCard, setInspectedCard] = useState(null);
  const [actionModalRow, setActionModalRow] = useState(null);
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState('TABLEAU'); // 'TABLEAU', 'TRAY', 'GOALS'

  const currentPlayer = G.players[ctx.currentPlayer];
  const viewingPlayer = G.players[viewingPlayerID] || currentPlayer;
  const isCurrentTurn = ctx.currentPlayer === viewingPlayerID;

  // Sync viewing player to active player on turn change
  useEffect(() => {
    if (ctx.currentPlayer) {
      setViewingPlayerID(ctx.currentPlayer);
    }
  }, [ctx.currentPlayer]);

  // Handle AI turn automation
  useEffect(() => {
    if (currentPlayer && currentPlayer.isAi && !G.isGameOver) {
      const timer = setTimeout(() => {
        makeAiMove(G, ctx, moves);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [ctx.currentPlayer, ctx.phase, G.isGameOver, currentPlayer]);

  // Handlers
  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const handleSelectBonusCard = (bonusId) => {
    sounds.playCardDeal();
    if (moves.discardBonusCard) {
      moves.discardBonusCard(bonusId);
    }
  };

  const handlePlayDrinkStart = (card) => {
    sounds.playCardDeal();
    setSelectedCardToPlay(card);
    setActiveTab('TABLEAU');
  };

  const handleSelectSlot = (rowKey, colIdx) => {
    if (!selectedCardToPlay) return;
    sounds.playPour();
    sounds.playIceClink();
    moves.playDrinkCard({
      cardId: selectedCardToPlay.id,
      rowKey,
      colIdx
    });
    setSelectedCardToPlay(null);
  };

  const handleActivateRowClick = (rowKey) => {
    sounds.playIceClink();
    setActionModalRow(rowKey);
  };

  const handleConfirmRowAction = ({ rowKey, tradeOption, choices }) => {
    sounds.playPour();
    moves.activateRow({
      rowKey,
      tradeOption,
      choices
    });
    setActionModalRow(null);
  };

  const handleDraftFromTray = (trayIndex) => {
    sounds.playCardDeal();
    moves.drawFromTray(trayIndex);
  };

  const handleResetTray = () => {
    sounds.playCardDeal();
    moves.resetTray();
  };

  const handlePlayAgain = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Top Speakeasy Bar Header */}
      <header className="sticky top-0 z-40 bg-stone-950/90 border-b border-amber-900/40 backdrop-blur-md px-6 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-md flex items-center justify-center">
            <span className="font-serif font-black text-xl text-stone-950">🍸</span>
          </div>
          <div>
            <h1
              className="font-serif font-black text-xl text-amber-200 tracking-wide flex items-center gap-2"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              The Liver is Evil
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Wingspan: Cocktail Edition
              </span>
            </h1>
            <p className="text-[11px] text-stone-400 font-mono flex items-center gap-2">
              <span>Round {G.currentRound} of 4</span>
              <span>•</span>
              <span className="text-amber-400">
                Turn: {currentPlayer?.name || `Player ${ctx.currentPlayer}`}
              </span>
              {ctx.phase === 'setupPhase' && (
                <span className="text-cyan-400 font-bold animate-pulse">
                  [Setup Phase: Bonus Goal Selection]
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-stone-900/80 border border-stone-800">
          <button
            onClick={() => setActiveTab('TABLEAU')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'TABLEAU'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            My Bar Tableau
          </button>
          <button
            onClick={() => setActiveTab('TRAY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
              activeTab === 'TRAY'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>Display Tray</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 font-mono">
              {G.tray.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('GOALS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
              activeTab === 'GOALS'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Trophy size={12} />
            <span>Round Goals</span>
          </button>
        </div>

        {/* Right: Controls & Player Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Player Switcher (for Hotseat / Inspection) */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-900 border border-stone-800">
            {Object.keys(G.players).map((pid) => (
              <button
                key={pid}
                onClick={() => setViewingPlayerID(pid)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                  viewingPlayerID === pid
                    ? 'bg-stone-700 text-amber-300 font-bold border border-amber-500/40 shadow-inner'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                P{parseInt(pid) + 1}
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-amber-300 transition-all active:scale-95"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>

          {/* Rules Guide Button */}
          <button
            onClick={() => setShowRulesModal(true)}
            className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all active:scale-95 flex items-center gap-1 text-xs font-bold uppercase"
            title="Read Rules"
          >
            <BookOpen size={16} />
            <span className="hidden sm:inline">Rules</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Active Player Inventory Header */}
        <BarSupply
          player={viewingPlayer}
          currentRound={G.currentRound}
          onOpenBonusModal={() => setShowBonusModal(true)}
          onOpenRules={() => setShowRulesModal(true)}
        />

        {/* Notification / Prompt Banner */}
        {selectedCardToPlay ? (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400 flex items-center justify-between gap-3 text-amber-300 text-xs font-semibold animate-pulse">
            <div className="flex items-center gap-2">
              <Sparkles size={16} />
              <span>
                Playing <strong>{selectedCardToPlay.name}</strong>. Click the highlighted slot in the{' '}
                <strong>{selectedCardToPlay.classification}</strong> row on your tableau below.
              </span>
            </div>
            <button
              onClick={() => setSelectedCardToPlay(null)}
              className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs"
            >
              Cancel
            </button>
          </div>
        ) : !isCurrentTurn ? (
          <div className="p-2 rounded-xl bg-stone-900/60 border border-stone-800 text-center text-xs text-stone-400 font-mono">
            Waiting for <strong>{currentPlayer?.name}</strong> to make their move...
          </div>
        ) : null}

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-center gap-1 p-1 rounded-xl bg-stone-900 border border-stone-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('TABLEAU')}
            className={`flex-1 py-1.5 rounded-lg ${
              activeTab === 'TABLEAU' ? 'bg-amber-500 text-stone-950' : 'text-stone-400'
            }`}
          >
            Bar Tableau
          </button>
          <button
            onClick={() => setActiveTab('TRAY')}
            className={`flex-1 py-1.5 rounded-lg ${
              activeTab === 'TRAY' ? 'bg-amber-500 text-stone-950' : 'text-stone-400'
            }`}
          >
            Display Tray ({G.tray.length})
          </button>
          <button
            onClick={() => setActiveTab('GOALS')}
            className={`flex-1 py-1.5 rounded-lg ${
              activeTab === 'GOALS' ? 'bg-amber-500 text-stone-950' : 'text-stone-400'
            }`}
          >
            Round Goals
          </button>
        </div>

        {/* Tab 1: Tableau Board */}
        {activeTab === 'TABLEAU' && (
          <TableauBoard
            tableau={viewingPlayer.tableau}
            onActivateRow={handleActivateRowClick}
            onSelectSlot={handleSelectSlot}
            selectedCardToPlay={selectedCardToPlay}
            activePlayerActions={viewingPlayer.actionsRemaining}
            isCurrentTurn={isCurrentTurn}
            onCardClick={(c) => setInspectedCard(c)}
          />
        )}

        {/* Tab 2: Display Tray */}
        {activeTab === 'TRAY' && (
          <DrinkTray
            tray={G.tray}
            deckCount={G.deck.length}
            onDraftCard={handleDraftFromTray}
            onResetTray={handleResetTray}
            isCurrentTurn={isCurrentTurn}
            onCardClick={(c) => setInspectedCard(c)}
          />
        )}

        {/* Tab 3: End Goals & Standings */}
        {activeTab === 'GOALS' && (
          <EndGoalsBoard
            endGoals={G.endGoals}
            currentRound={G.currentRound}
            players={G.players}
            endGoalScores={G.endGoalScores}
          />
        )}

        {/* Hand of Cards at the bottom */}
        <HandView
          player={viewingPlayer}
          isCurrentTurn={isCurrentTurn}
          onPlayDrink={handlePlayDrinkStart}
          onSelectCard={(c) => setInspectedCard(c)}
          selectedCard={selectedCardToPlay}
        />

        {/* Game Log Stream */}
        <div className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-stone-400 uppercase text-[10px] font-bold tracking-wider mb-2">
            <Activity size={12} className="text-amber-400" />
            <span>Recent Bar Activity Log:</span>
          </div>
          <div className="space-y-1 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-800">
            {G.gameLog.slice(0, 5).map((log, i) => (
              <div key={i} className="text-stone-400 leading-tight">
                <span className="text-stone-600">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{' '}
                <span className="text-stone-300">{log.text}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* MODALS */}

      {/* Initial Setup Bonus Cards Modal */}
      <BonusCardsModal
        isOpen={ctx.phase === 'setupPhase' && !viewingPlayer.setupDone}
        isSetupPhase={true}
        initialBonusCards={viewingPlayer.initialBonusDrawn || []}
        onSelectBonusCard={handleSelectBonusCard}
        onClose={() => {}}
      />

      {/* In-game Bonus Card Inspector Modal */}
      <BonusCardsModal
        isOpen={showBonusModal && ctx.phase !== 'setupPhase'}
        isSetupPhase={false}
        keptBonusCard={viewingPlayer.bonusCards?.[0]}
        tableau={viewingPlayer.tableau}
        onClose={() => setShowBonusModal(false)}
      />

      {/* Row Activation Action Modal */}
      <ActionModal
        isOpen={Boolean(actionModalRow)}
        onClose={() => setActionModalRow(null)}
        rowKey={actionModalRow}
        player={viewingPlayer}
        onConfirmAction={handleConfirmRowAction}
      />

      {/* Card Detail Inspection Modal */}
      <CardDetailModal
        isOpen={Boolean(inspectedCard)}
        card={inspectedCard}
        onClose={() => setInspectedCard(null)}
      />

      {/* Rules Guide Modal */}
      <RulesGuideModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
      />

      {/* End of Game Score Summary Modal */}
      <ScoreSummaryModal
        isOpen={G.isGameOver}
        finalScores={G.finalScores}
        winner={G.winner}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
}
