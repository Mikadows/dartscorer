import React from 'react';
import { useGame } from '../../context/GameProvider';
import Button from '../atoms/Button';
import './ScorePanel.css';

function TurnCard({ turn, player, remaining, isActive = false }) {
  const slots = Array.from({ length: 3 }).map((_, i) => turn && turn.throws[i] ? turn.throws[i].shorthand : '');
  const subtotal = turn ? turn.throws.reduce((s, t) => s + (t.score || 0), 0) : 0;
  return (
    <div className={`turn-card ${isActive ? 'active' : ''}`}>
      <div className="turn-top">
        <div className="player-info">
          <div className="avatar">{player.name[0]}</div>
          <div className="player-name">{player.name}</div>
        </div>
        <div className="remaining">{remaining}</div>
      </div>

      <div className="slots-row">
        <div className="slots">
          {slots.map((s, i) => (
            <div key={i} className={`slot ${s ? 'filled' : 'empty'}`}>{s || ''}</div>
          ))}
        </div>

        <div className={`turn-subtotal ${turn && turn.bust ? 'bust' : ''}`}>
          <div className="subtotal-label">Turn</div>
          <div className="subtotal-value">{turn && turn.bust ? 'BUST' : subtotal}</div>
        </div>
      </div>
    </div>
  );
}

export default function ScorePanel() {
  const { players, currentPlayerIndex, currentTurn, turns, undo, redo, clear, getPlayerScoreRemaining } = useGame();
  const { winner, continueAfterWin, resetGame } = useGame();


  const activePlayer = players[currentPlayerIndex];

  return (
    <aside className="score-panel">
      
      {winner && (
        <div className="winner-modal" role="dialog" aria-modal="true">
          <div className="winner-card">
            <div className="winner-title">Player {players.find((p) => p.id === winner.playerId)?.name} won!</div>
            <div className="winner-actions">
              <Button onClick={continueAfterWin} title="Continue">Continue</Button>
              <Button onClick={resetGame} title="New Game">New Game</Button>
            </div>
          </div>
        </div>
      )}
      <div className="score-header">
        <h2>Dart Scorer</h2>
        <div className="controls">
          <Button onClick={undo} title="Undo">Undo</Button>
          <Button onClick={redo} title="Redo">Redo</Button>
          <Button onClick={clear} title="Clear">Clear</Button>
        </div>
      </div>

      <div className="active-area">
        <h3>Active Player</h3>
        <TurnCard isActive turn={currentTurn} player={activePlayer} remaining={getPlayerScoreRemaining(activePlayer.id)} />
      </div>

      <div className="history">
        <h3>History</h3>
        {turns.length === 0 ? (
          <div className="empty">No turns yet — click the board to score.</div>
        ) : (
          turns.map((t) => {
            const p = players.find((pl) => pl.id === t.playerId);
            const remainingAfter = t.remainingAfter !== undefined ? t.remainingAfter : getPlayerScoreRemaining(p.id);
            return <TurnCard key={t.id} turn={t} player={p} remaining={remainingAfter} />;
          })
        )}
      </div>
    </aside>
  );
}
