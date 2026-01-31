import React, { useRef, useState } from 'react';
import { getHitFromPoint } from '../../utils/geometry';
import './Dartboard.css';

export default function Dartboard({ onHit }) {
  const svgRef = useRef(null);
  const [markers, setMarkers] = useState([]);

  function handleClick(e) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const clientX = e.clientX;
    const clientY = e.clientY;
    const dx = clientX - rect.left - cx;
    const dy = clientY - rect.top - cy;
    const R = Math.min(rect.width, rect.height) / 2;

    const hit = getHitFromPoint(dx, dy, R);
    setMarkers((m) => [...m, { x: (dx + cx) / rect.width * 100, y: (dy + cy) / rect.height * 100, id: Date.now(), shorthand: hit.shorthand, color: hit.color }]);
    if (onHit) onHit(hit);
  }

  return (
    <div className="dartboard-wrapper">
      <svg
        ref={svgRef}
        className="dartboard-svg"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid meet"
        onClick={handleClick}
      >
        <defs>
          <radialGradient id="boardGrad" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#222" />
            <stop offset="100%" stopColor="#000" />
          </radialGradient>
        </defs>

        <g transform="translate(500,500)">
          {/* Outer background */}
          <circle r="500" fill="url(#boardGrad)" />

          {/* Double ring */}
          <circle r="485" fill="none" stroke="#222" strokeWidth="30" />

          {/* Numbers ring (thin) */}
          <circle r="430" fill="none" stroke="#111" strokeWidth="140" />

          {/* Triple ring */}
          <circle r="280" fill="none" stroke="#222" strokeWidth="60" />

          {/* Single area is left as background; we'll approximate with alternating sectors visually omitted for brevity */}

          {/* Outer bull */}
          <circle r="120" fill="#27ae60" />

          {/* Inner bull */}
          <circle r="60" fill="#c0392b" />

          {/* Visual thin separators (not precise but gives feel) */}
          <circle r="560" fill="none" stroke="#000" strokeWidth="10" />

          {/* Markers */}
          {markers.map((m) => (
            <g key={m.id} transform={`translate(${(m.x - 50) * 10}, ${(m.y - 50) * 10})`}>
              <circle r="10" fill="white" />
              <text x="14" y="6" fontSize="40" fill={m.color}>
                {m.shorthand}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
