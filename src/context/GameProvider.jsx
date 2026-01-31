import React, { createContext, useContext, useState, useCallback } from 'react';

const GameContext = createContext(null);

export function useGame() {
  return useContext(GameContext);
}

// Simple turn model: each turn holds up to 3 throws. Players rotate.
export function GameProvider({ children }) {
  const [players] = useState([
    { id: 'p1', name: 'Gwen', startingScore: 501 },
    { id: 'p2', name: 'LA', startingScore: 501 },
  ]);

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(null); // { id, playerId, throws: [] }
  const [turns, setTurns] = useState([]); // finalized turns
  const [winner, setWinner] = useState(null); // { playerId }
  const [undone, setUndone] = useState([]);

  const startNewTurnForPlayer = useCallback((playerId) => {
    const t = { id: Date.now().toString(), playerId, throws: [] };
    setCurrentTurn(t);
    return t;
  }, []);

  const finalizeCurrentTurn = useCallback((turn) => {
    setTurns((prev) => [turn, ...prev]);
    setCurrentTurn(null);
    setCurrentPlayerIndex((i) => (i + 1) % players.length);
  }, [players.length]);

  const addThrow = useCallback((hit) => {
    setUndone([]);
    // Synchronous calculation: determine which player receives the hit
    setCurrentTurn((turn) => {
      const playerId = turn ? turn.playerId : players[currentPlayerIndex].id;
      const updatedTurn = turn ? { ...turn } : { id: Date.now().toString(), playerId, throws: [] };
      const newThrow = { ...hit, id: Date.now() };
      updatedTurn.throws = [...updatedTurn.throws, newThrow];

      // compute remaining score for player after this throw
      const player = players.find((p) => p.id === playerId);
      const used = turns
        .filter((t) => t.playerId === playerId && !t.bust)
        .flatMap((t) => t.throws)
        .reduce((s, h) => s + (h.score || 0), 0);
      const remainingBeforeTurn = (player ? player.startingScore : 0) - used;
      const currentUsed = updatedTurn.throws.reduce((s, h) => s + (h.score || 0), 0);
      const remaining = (player ? player.startingScore : 0) - used - currentUsed;

      // If the player reached exactly 0, they win
      if (remaining === 0) {
        setWinner({ playerId });
      }

      // If player busts (remaining < 0) -> finalize turn as bust and advance
      if (remaining < 0) {
        updatedTurn.bust = true;
        updatedTurn.remainingAfter = remainingBeforeTurn; // no score change on bust
        setTurns((prev) => [updatedTurn, ...prev]);
        setCurrentPlayerIndex((i) => (i + 1) % players.length);
        return null;
      }

      // Auto-finalize on 3 throws (normal)
      if (updatedTurn.throws.length >= 3) {
        // finalize normal turn
        const subtotal = updatedTurn.throws.reduce((s, h) => s + (h.score || 0), 0);
        updatedTurn.remainingAfter = remainingBeforeTurn - subtotal;
        setTurns((prev) => [updatedTurn, ...prev]);
        setCurrentPlayerIndex((i) => (i + 1) % players.length);
        return null;
      }

      return updatedTurn;
    });
  }, [currentPlayerIndex, players, turns]);

  const undo = useCallback(() => {
    // If there's a currentTurn with throws, pop last
    if (currentTurn && currentTurn.throws.length > 0) {
      setCurrentTurn((t) => ({ ...t, throws: t.throws.slice(0, -1) }));
      return;
    }

    // Otherwise, un-finalize the most recent turn
    setTurns((prev) => {
      if (prev.length === 0) return prev;
      const [first, ...rest] = prev;
      setCurrentTurn(first);
      setCurrentPlayerIndex(players.findIndex((p) => p.id === first.playerId));
      setUndone((u) => [first, ...u]);
      return rest;
    });
  }, [currentTurn, players]);

  const redo = useCallback(() => {
    setUndone((prev) => {
      if (prev.length === 0) return prev;
      const [first, ...rest] = prev;
      setTurns((t) => [first, ...t]);
      setCurrentTurn(null);
      setCurrentPlayerIndex(players.findIndex((p) => p.id === first.playerId));
      return rest;
    });
  }, [players]);

  const clear = useCallback(() => {
    setCurrentTurn(null);
    setTurns([]);
    setUndone([]);
    setCurrentPlayerIndex(0);
    setWinner(null);
  }, []);

  const continueAfterWin = useCallback(() => {
    // simply clear winner flag so game can continue (no state changes)
    setWinner(null);
  }, []);

  const resetGame = useCallback(() => {
    // reset all state to initial
    setCurrentTurn(null);
    setTurns([]);
    setUndone([]);
    setCurrentPlayerIndex(0);
    setWinner(null);
  }, []);

  const getPlayerScoreRemaining = useCallback(
    (playerId) => {
      const player = players.find((p) => p.id === playerId);
      if (!player) return 0;
      const used = turns
        .filter((t) => t.playerId === playerId && !t.bust)
        .flatMap((t) => t.throws)
        .reduce((s, h) => s + (h.score || 0), 0);
      const currentUsed = currentTurn && currentTurn.playerId === playerId ? currentTurn.throws.reduce((s, h) => s + (h.score || 0), 0) : 0;
      return player.startingScore - used - currentUsed;
    },
    [players, turns, currentTurn]
  );

  const value = {
    players,
    currentPlayerIndex,
    currentTurn,
    turns,
    undone,
    winner,
    addThrow,
    undo,
    redo,
    clear,
    continueAfterWin,
    resetGame,
    getPlayerScoreRemaining,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
