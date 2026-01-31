import React from 'react';
import { GameProvider, useGame } from './context/GameProvider';
import Dartboard from './components/organisms/Dartboard';
import ScorePanel from './components/organisms/ScorePanel';
import NextOverlay from './components/organisms/NextOverlay';
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
          <div style={{position:'relative',width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <NextOverlay />
            <BoardContainer />
          </div>
        </div>
      </div>
    </GameProvider>
  );
}
