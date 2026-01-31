import React, { useState, useEffect } from 'react'
import { useGame } from '../context/GameProvider'
import './Home.css'

export default function Home({ onStart }){
  const { startGame } = useGame()
  const [target, setTarget] = useState(501)
  const [customTarget, setCustomTarget] = useState('')
  const [name, setName] = useState('')
  const [existing, setExisting] = useState(() => {
    try {
      const raw = localStorage.getItem('ds_players_pool')
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })
  const [roster, setRoster] = useState([])
  const [error, setError] = useState('')

  function addPlayer(){
    const trimmed = name.trim()
    if(!trimmed){ setError('Name cannot be empty'); return }
    if(existing.some(r => r.name.toLowerCase() === trimmed.toLowerCase())){ setError('Duplicate name'); return }
    const newP = { name: trimmed }
    setExisting(e => [...e, newP])
    setName('')
    setError('')
  }

  function addToRoster(idx){
    const p = existing[idx]
    if(roster.some(r=>r.name.toLowerCase()===p.name.toLowerCase())){ setError('Already in roster'); return }
    setRoster(r => [...r, p])
    setError('')
  }

  function removeExisting(idx){
    setExisting(e=>{
      const next = e.filter((_,i)=>i!==idx)
      try{ localStorage.setItem('ds_players_pool', JSON.stringify(next)) }catch(_){}
      return next
    })
  }

  useEffect(()=>{
    try{ localStorage.setItem('ds_players_pool', JSON.stringify(existing)) }catch(e){}
  },[existing])

  function removePlayer(idx){
    setRoster(r => r.filter((_,i)=>i!==idx))
  }
  function moveUp(idx){ if(idx===0) return; setRoster(r=>{const a=[...r]; [a[idx-1],a[idx]]=[a[idx],a[idx-1]]; return a}) }
  function moveDown(idx){ if(idx===roster.length-1) return; setRoster(r=>{const a=[...r]; [a[idx+1],a[idx]]=[a[idx],a[idx+1]]; return a}) }

  function onStartClick(){
    if(roster.length===0){ setError('Add at least one player'); return }
    // validate names
    const names = roster.map(r=>r.name.trim())
    if(names.some(n=>!n)){ setError('All player names must be non-empty'); return }
    const lower = names.map(n=>n.toLowerCase())
    const dup = lower.some((v,i)=>lower.indexOf(v)!==i)
    if(dup){ setError('Duplicate player names'); return }
    const s = target === 'custom' ? Math.max(1, parseInt(customTarget || '0',10)) : target
    startGame({ roster, startingScore: s })
    if(onStart) onStart()
  }

  return (
    <div className="home-root">
      <div className="landing-brand">
        <div className="brand-title">Dart Scorer</div>
        <div className="brand-sub">Simple and free dart scorer 🎯</div>
      </div>
      <div className="home-card">
        <h1>New Game</h1>

        <section className="section">
          <label className="label">Starting score</label>
          <div className="targets">
            <label><input type="radio" name="target" checked={target===501} onChange={()=>setTarget(501)} /> 501</label>
            <label><input type="radio" name="target" checked={target===301} onChange={()=>setTarget(301)} /> 301</label>
            <label><input type="radio" name="target" checked={target==='custom'} onChange={()=>setTarget('custom')} /> Custom</label>
            {target==='custom' && <input className="custom" value={customTarget} onChange={e=>setCustomTarget(e.target.value)} placeholder="Enter target (e.g. 301)" />}
          </div>
        </section>

        <div className="split">
          <section className="section pool">
            <label className="label">Existing players (pool)</label>
            <div className="add-row">
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Player name" onKeyDown={e=>{ if(e.key==='Enter') addPlayer() }} />
              <button className="ds-btn" onClick={addPlayer}>Add</button>
            </div>
            <div className="pool-list">
              {existing.length===0 && <div className="empty">No available players</div>}
              {existing.map((p,idx)=> (
                <div className="pool-item" key={idx}>
                  <div className="pool-name">{p.name}</div>
                  <div className="pool-actions">
                      <button className="action-btn" onClick={()=>addToRoster(idx)} aria-label="Add to roster" title="Add to roster">＋</button>
                      <button className="action-btn danger" onClick={()=>removeExisting(idx)} aria-label="Remove" title="Remove">✕</button>
                    </div>
                </div>
              ))}
            </div>
          </section>

          <section className="section roster-panel">
            <label className="label">Roster (next game)</label>
            <div className="roster">
              {roster.length===0 && <div className="empty">No players added</div>}
              {roster.map((p,idx)=> (
                <div className="roster-item" key={idx}>
                  <div className="roster-name">{p.name}</div>
                  <div className="roster-actions">
                    <button className="action-btn" onClick={()=>moveUp(idx)} disabled={idx===0} aria-label="Move up" title="Move up">↑</button>
                    <button className="action-btn" onClick={()=>moveDown(idx)} disabled={idx===roster.length-1} aria-label="Move down" title="Move down">↓</button>
                    <button className="action-btn danger" onClick={()=>removePlayer(idx)} aria-label="Remove" title="Remove">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="actions">
          <button className="ds-btn primary" onClick={onStartClick} disabled={roster.length===0}>Start Game</button>
        </div>

        <footer className="home-footer">
          <a href="https://github.com/Mikadows/dartscorer" target="_blank" rel="noreferrer">GitHub repository</a>
        </footer>

      </div>
    </div>
  )
}
