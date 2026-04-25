import React from 'react';

const colors = ['#2d6a4f', '#40916c', '#52b788', '#74c69d'];
const trunkColors = ['#8B5E3C', '#7A5230', '#6B4226'];

const Tree = ({ x, y, size = 1, variant = 0, isNew = false }) => {
  const color = colors[variant % colors.length];
  const trunk = trunkColors[variant % trunkColors.length];
  const s = size * 18;

  return (
    <g transform={`translate(${x}, ${y})`} className={isNew ? 'animate-fade-in' : ''}>
      {/* Shadow */}
      <ellipse cx={0} cy={s * 0.65} rx={s * 0.35} ry={s * 0.08} fill="rgba(0,0,0,0.15)" />
      {/* Trunk */}
      <rect x={-s * 0.06} y={s * 0.2} width={s * 0.12} height={s * 0.45} rx={2} fill={trunk} />
      {/* Foliage layers */}
      <polygon points={`0,${-s * 0.5} ${s * 0.35},${s * 0.15} ${-s * 0.35},${s * 0.15}`} fill={color} opacity={0.9} />
      <polygon points={`0,${-s * 0.35} ${s * 0.3},${s * 0.05} ${-s * 0.3},${s * 0.05}`} fill={color} opacity={0.7} />
      <polygon points={`0,${-s * 0.6} ${s * 0.25},${-s * 0.1} ${-s * 0.25},${-s * 0.1}`} fill={color} opacity={0.5} />
      {/* Highlight dot */}
      <circle cx={-s * 0.08} cy={-s * 0.25} r={s * 0.04} fill="rgba(255,255,255,0.25)" />
    </g>
  );
};

export default Tree;
