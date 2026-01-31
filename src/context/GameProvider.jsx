import React, { createContext, useContext, useState, useCallback } from 'react';

const GameContext = createContext(null);

export function useGame() {
  return useContext(GameContext);
}

export function GameProvider({ children }) {
  const [actions, setActions] = useState([]); // list of hits
  const [undone, setUndone] = useState([]);

  const addThrow = useCallback((hit) => {
    setActions((prev) => [...prev, { ...hit, id: Date.now() }]);
    setUndone([]);
  }, []);

  const undo = useCallback(() => {
    setActions((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setUndone((u) => [last, ...u]);
      return prev.slice(0, -1);
    });
  }, []);

  const redo = useCallback(() => {
    setUndone((prev) => {
      if (prev.length === 0) return prev;
      const [first, ...rest] = prev;
      setActions((a) => [...a, first]);
      return rest;
    });
  }, []);

  const clear = useCallback(() => {
    setActions([]);
    setUndone([]);
  }, []);

  const value = {
    actions,
    undone,
    addThrow,
    undo,
    redo,
    clear,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
