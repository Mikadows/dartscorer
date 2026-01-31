import React, { useEffect, useRef, useState } from 'react'
import { useGame } from '../../context/GameProvider'
import './ScorePanel.css'

export default function NextOverlay(){
  const { currentPlayerIndex, players } = useGame()
  const [show, setShow] = useState(false)
  const prev = useRef(currentPlayerIndex)

  useEffect(()=>{
    if(prev.current !== currentPlayerIndex){
      // don't show on first mount if equal
      setShow(true)
      const t = setTimeout(()=>setShow(false),2000)
      prev.current = currentPlayerIndex
      return ()=>clearTimeout(t)
    }
  },[currentPlayerIndex])

  if(!show) return null

  const player = players[currentPlayerIndex]

  return (
    <div className="next-card show" role="status" aria-live="polite">
      <div className="next-card-inner">
        <div className="next-label">NEXT</div>
        <div className="next-player">{player?.name}</div>
      </div>
    </div>
  )
}
