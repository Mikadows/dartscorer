export const SECTOR_ORDER = [20,1,18,4,13,6,10,15,2,17,3,19,7,16,8,11,14,9,12,5];

export function getHitFromPoint(dx, dy, R) {
  // dx, dy: coordinates centered at board center (positive right/down)
  const r = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx); // radians, 0 at +X, clockwise positive Y

  // Rings (fractions of R)
  const innerBullR = 0.06 * R;
  const outerBullR = 0.12 * R;
  // Previously increased triple ring thickness by 20% (to 0.048*R).
  // Now increase it by an additional 20% relative to the current thickness.
  // Current thickness = 0.048*R -> new thickness = 0.048 * 1.2 = 0.0576*R
  // Half-thickness = 0.0288*R, center = 0.54*R
  const tripleInnerR = 0.54 * R - 0.0288 * R; // 0.5112 * R
  const tripleOuterR = 0.54 * R + 0.0288 * R; // 0.5688 * R
  const doubleInnerR = 0.92 * R;
  const doubleOuterR = 0.99 * R;

  // Determine ring
  let ringType = 'miss';
  if (r <= innerBullR) ringType = 'innerBull';
  else if (r <= outerBullR) ringType = 'outerBull';
  else if (r >= doubleInnerR && r <= doubleOuterR) ringType = 'double';
  else if (r >= tripleInnerR && r <= tripleOuterR) ringType = 'triple';
  else if (r < doubleOuterR) ringType = 'single';
  else ringType = 'miss';

  // Map angle to sector index. We want sector 20 centered at -90deg (top).
  const twoPi = Math.PI * 2;
  const sectorAngle = twoPi / 20;
  // Normalize so 0 is at top, range [0, 2PI)
  const normalized = (angle + Math.PI / 2 + twoPi) % twoPi; // zero at top
  // Add a half-sector offset so points near the 0-angle boundary
  // are assigned to the correct sector (avoid wrap-around off-by-one).
  const sectorIndex = Math.floor((normalized + sectorAngle / 2) / sectorAngle) % 20;
  const sectorValue = SECTOR_ORDER[sectorIndex];

  // Shorthand and score
  let score = 0;
  let shorthand = '';
  if (ringType === 'innerBull') {
    score = 50;
    shorthand = 'B';
  } else if (ringType === 'outerBull') {
    score = 25;
    shorthand = 'OB';
  } else if (ringType === 'double') {
    score = sectorValue * 2;
    shorthand = `D${sectorValue}`;
  } else if (ringType === 'triple') {
    score = sectorValue * 3;
    shorthand = `T${sectorValue}`;
  } else if (ringType === 'single') {
    score = sectorValue;
    shorthand = `${sectorValue}`;
  } else {
    // outside board
    score = 0;
    shorthand = '—';
  }

  // visual color hints
  const singleColors = ['#f5f5f5', '#7b0f0f'];
  const color =
    ringType === 'innerBull'
      ? '#c0392b'
      : ringType === 'outerBull'
      ? '#27ae60'
      : ringType === 'double' || ringType === 'triple'
      ? sectorIndex % 2 === 0
        ? '#27ae60'
        : '#c0392b'
      : singleColors[sectorIndex % 2];

  return {
    ringType,
    sectorValue,
    score,
    shorthand,
    color,
    sectorIndex,
    r,
    angle,
  };
}
