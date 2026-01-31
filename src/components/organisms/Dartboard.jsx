import React, { useRef } from 'react';
import { getHitFromPoint, SECTOR_ORDER } from '../../utils/geometry';
import './Dartboard.css';

export default function Dartboard({ onHit }) {
  const svgRef = useRef(null);

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
    // For now: log the hit result; markers removed per request
    // Hit contains: ringType, sectorValue, score, shorthand, color
    // Use console.log so dev tools can inspect
    // eslint-disable-next-line no-console
    console.log('Dart hit:', hit);
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
            <stop offset="0%" stopColor="#1b1b1b" />
            <stop offset="100%" stopColor="#000" />
          </radialGradient>
        </defs>

        <g transform="translate(500,500)">
          {/* Outer background */}
          <circle r="500" fill="url(#boardGrad)" />

          {/* Board geometry (radii based on 500) */}
          {/** radii scaled to SVG coordinate space **/}
          {
            (() => {
              const R = 500;
              const innerBullR = 0.06 * R; // 30
              const outerBullR = 0.12 * R; // 60
              // Previously increased triple ring thickness by 20%.
              // Now increase it by another 20% (relative to prior change).
              // New inner/outer: 0.5112*R .. 0.5688*R
              const tripleInnerR = 0.5112 * R; // ~256
              const tripleOuterR = 0.5688 * R; // ~284
              const doubleInnerR = 0.92 * R; // 460
              const doubleOuterR = 0.99 * R; // 495
              const numbersR = 480;
              const sectorAngle = 360 / 20;

              function degToRad(d) {
                return (d * Math.PI) / 180;
              }

              function polar(angleDeg, radius) {
                const a = degToRad(angleDeg);
                return { x: Math.cos(a) * radius, y: Math.sin(a) * radius };
              }

              function sectorPath(rInner, rOuter, startDeg, endDeg) {
                const a1 = degToRad(startDeg);
                const a2 = degToRad(endDeg);
                const x1 = Math.cos(a1) * rOuter;
                const y1 = Math.sin(a1) * rOuter;
                const x2 = Math.cos(a2) * rOuter;
                const y2 = Math.sin(a2) * rOuter;
                const x3 = Math.cos(a2) * rInner;
                const y3 = Math.sin(a2) * rInner;
                const x4 = Math.cos(a1) * rInner;
                const y4 = Math.sin(a1) * rInner;
                const large = endDeg - startDeg > 180 ? 1 : 0;
                return `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${large} 0 ${x4} ${y4} Z`;
              }

              const sectors = [];
              for (let i = 0; i < 20; i++) {
                const center = -90 + i * sectorAngle; // top is sector 20
                const start = center - sectorAngle / 2;
                const end = center + sectorAngle / 2;
                const isEven = i % 2 === 0;
                const singleColor = isEven ? '#f3f3e9' : '#141414';
                const ringColor = isEven ? '#c0392b' : '#27ae60';

                // inner single
                sectors.push(
                  <path
                    key={`s-in-${i}`}
                    d={sectorPath(outerBullR, tripleInnerR, start, end)}
                    fill={singleColor}
                    stroke="none"
                  />
                );

                // triple
                sectors.push(
                  <path
                    key={`t-${i}`}
                    d={sectorPath(tripleInnerR, tripleOuterR, start, end)}
                    fill={ringColor}
                    stroke="none"
                  />
                );

                // outer single
                sectors.push(
                  <path
                    key={`s-out-${i}`}
                    d={sectorPath(tripleOuterR, doubleInnerR, start, end)}
                    fill={singleColor}
                    stroke="none"
                  />
                );

                // double
                sectors.push(
                  <path
                    key={`d-${i}`}
                    d={sectorPath(doubleInnerR, doubleOuterR, start, end)}
                    fill={ringColor}
                    stroke="none"
                  />
                );

                // numbers
                const numPos = polar(center, numbersR);
                sectors.push(
                  <text
                    key={`n-${i}`}
                    x={numPos.x}
                    y={numPos.y + 12}
                    textAnchor="middle"
                    fontSize="36"
                    fill="#f7f7f7"
                    transform={`rotate(${center} ${numPos.x} ${numPos.y})`}
                    className="sector-number"
                  >
                    {SECTOR_ORDER[i]}
                  </text>
                );
              }

              return (
                <g key="sectors">
                  {sectors}

                  {/* Bulls */}
                  <circle r={outerBullR} fill="#27ae60" />
                  <circle r={innerBullR} fill="#c0392b" />

                  {/* Outer rim stroke */}
                  <circle r="498" fill="none" stroke="#2c2c2c" strokeWidth="4" />
                </g>
              );
            })()
          }

          {/* Markers intentionally removed — hits are logged to console for now */}
        </g>
      </svg>
    </div>
  );
}
