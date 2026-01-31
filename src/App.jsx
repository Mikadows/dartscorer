import React from 'react';
import { GameProvider } from './context/GameProvider';
import Dartboard from './components/organisms/Dartboard';
import ScorePanel from './components/organisms/ScorePanel';
import './app.css';

export default function App() {
  return (
    <GameProvider>
      <div className="ds-root">
        <div className="ds-left">
          <ScorePanel />
        </div>
        <div className="ds-right">
          <Dartboard onHit={() => {}} />
        </div>
      </div>
    </GameProvider>
  );
}
