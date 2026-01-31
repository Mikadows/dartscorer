import React, { createContext, useContext, useState, useCallback } from 'react';

const GameContext = createContext(null);

export function useGame() {
  return useContext(GameContext);
}

// Simple turn model: each turn holds up to 3 throws. Players rotate.
export function GameProvider({ children }) {
  const [players, setPlayers] = useState([
    { id: 'p1', name: 'Gwen', startingScore: 501, inGame: true },
    { id: 'p2', name: 'LA', startingScore: 501, inGame: true },
  ]);

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(null); // { id, playerId, throws: [] }
  const [turns, setTurns] = useState([]); // finalized turns
  // no global winner; players can be eliminated (inGame=false)
  const [undone, setUndone] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const startNewTurnForPlayer = useCallback((playerId) => {
    const t = { id: Date.now().toString(), playerId, throws: [] };
    setCurrentTurn(t);
    return t;
  }, []);

  const getNextActiveIndexFrom = useCallback((startIndex, playersArr) => {
    const len = playersArr.length;
    if (len === 0) return 0;
    for (let offset = 1; offset <= len; offset++) {
      const idx = (startIndex + offset) % len;
      if (playersArr[idx].inGame) return idx;
    }
    // fallback to startIndex if no active players
    return startIndex;
  }, []);

  const finalizeCurrentTurn = useCallback((turn) => {
    setTurns((prev) => [turn, ...prev]);
    setCurrentTurn(null);
    setCurrentPlayerIndex((i) => getNextActiveIndexFrom(i, players));
  }, [getNextActiveIndexFrom, players]);

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

      // If the player reached exactly 0, mark player out of the game and mark this turn as the winning turn
      if (remaining === 0) {
        updatedTurn.win = true;
        updatedTurn.remainingAfter = 0;
        // compute new players array with this player eliminated
        const newPlayers = players.map((p) => (p.id === playerId ? { ...p, inGame: false } : p));
        setPlayers(newPlayers);
        // finalize this winning turn and advance to next active player
        setTurns((prev) => [updatedTurn, ...prev]);
        const nextIdx = getNextActiveIndexFrom(players.findIndex((p) => p.id === playerId), newPlayers);
        setCurrentPlayerIndex(nextIdx);
        // if there are no active players left, mark game over
        const anyActive = newPlayers.some((p) => p.inGame);
        if (!anyActive) setGameOver(true);
        return null;
      }

      // If player busts (remaining < 0) -> finalize turn as bust and advance
      if (remaining < 0) {
        updatedTurn.bust = true;
        updatedTurn.remainingAfter = remainingBeforeTurn; // no score change on bust
        setTurns((prev) => [updatedTurn, ...prev]);
        setCurrentPlayerIndex((i) => getNextActiveIndexFrom(i, players));
        return null;
      }

      // Auto-finalize on 3 throws (normal)
      if (updatedTurn.throws.length >= 3) {
        // finalize normal turn
        const subtotal = updatedTurn.throws.reduce((s, h) => s + (h.score || 0), 0);
        updatedTurn.remainingAfter = remainingBeforeTurn - subtotal;
        setTurns((prev) => [updatedTurn, ...prev]);
        setCurrentPlayerIndex((i) => getNextActiveIndexFrom(i, players));
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
  }, []);

  const resetGame = useCallback(() => {
    // reset all state to initial
    setCurrentTurn(null);
    setTurns([]);
    setUndone([]);
    setCurrentPlayerIndex(0);
    // reset players inGame state
    setPlayers((prev) => prev.map((p) => ({ ...p, inGame: true })));
    setGameOver(false);
  }, []);

  const startGame = useCallback(({ roster = [], startingScore = 501 }) => {
    // roster: array of { id?, name }
    const normalized = roster.map((p, idx) => ({
      id: p.id || `pl_${Date.now()}_${idx}`,
      name: p.name,
      startingScore: startingScore,
      inGame: true,
    }));
    setPlayers(normalized);
    setTurns([]);
    setCurrentTurn(null);
    setUndone([]);
    setCurrentPlayerIndex(0);
    setGameOver(false);
  }, []);

  const closeGameOver = useCallback(() => {
    setGameOver(false);
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
    addThrow,
    undo,
    redo,
    clear,
    resetGame,
    startGame,
    gameOver,
    closeGameOver,
    getPlayerScoreRemaining,
  };


  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
