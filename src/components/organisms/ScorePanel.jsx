import React from 'react';
import { useGame } from '../../context/GameProvider';
import Button from '../atoms/Button';
import './ScorePanel.css';

export default function ScorePanel() {
  const { actions, undo, redo, clear } = useGame();

  return (
    <aside className="score-panel">
      <div className="score-header">
        <h2>Dart Scorer</h2>
        <div className="controls">
          <Button onClick={undo} title="Undo">Undo</Button>
          <Button onClick={redo} title="Redo">Redo</Button>
          <Button onClick={clear} title="Clear">Clear</Button>
        </div>
      </div>

      <div className="throws-list" aria-live="polite">
        {actions.length === 0 ? (
          <div className="empty">No throws yet — click the board to score.</div>
        ) : (
          actions.slice().reverse().map((a) => (
            <div key={a.id} className="throw-row">
              <div className="shorthand" style={{ color: a.color }}>{a.shorthand}</div>
              <div className="meta">{a.ringType} • {a.sectorValue} • {a.score}</div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
