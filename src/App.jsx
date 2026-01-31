import React from 'react';
import { GameProvider, useGame } from './context/GameProvider';
import Dartboard from './components/organisms/Dartboard';
import ScorePanel from './components/organisms/ScorePanel';
import './app.css';

function BoardContainer() {
  const { addThrow } = useGame();
  return <Dartboard onHit={addThrow} />;
}

export default function App() {
  return (
    <GameProvider>
      <div className="ds-root">
        <div className="ds-left">
          <ScorePanel />
        </div>
        <div className="ds-right">
          <BoardContainer />
        </div>
      </div>
    </GameProvider>
  );
}
