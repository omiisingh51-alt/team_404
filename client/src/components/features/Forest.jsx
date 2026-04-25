import React from 'react';
import Tree from './Tree';

const Forest = ({ treeCount = 0, maxTrees = 100 }) => {
  const count = Math.min(treeCount, maxTrees);
  const cols = 10;
  const spacingX = 55;
  const spacingY = 58;
  const offsetX = 30;
  const offsetY = 20;
  const rows = Math.ceil(maxTrees / cols);
  const viewWidth = cols * spacingX + offsetX * 2;
  const viewHeight = rows * spacingY + offsetY * 2 + 80;

  const trees = [];
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const jitterX = (Math.sin(i * 3.7) * 6);
    const jitterY = (Math.cos(i * 2.3) * 4);
    trees.push(
      <Tree
        key={i}
        x={offsetX + col * spacingX + spacingX / 2 + jitterX}
        y={offsetY + 60 + row * spacingY + jitterY}
        size={0.7 + Math.sin(i * 1.3) * 0.15}
        variant={i % 4}
        isNew={i === count - 1}
      />
    );
  }

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        className="w-full rounded-2xl block"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Sky gradient */}
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="60%" stopColor="#16213e" />
            <stop offset="100%" stopColor="#1b3a2d" />
          </linearGradient>
        </defs>
        <rect width={viewWidth} height={viewHeight} fill="url(#sky)" />

        {/* Clouds */}
        <g opacity={0.12}>
          <ellipse cx={viewWidth * 0.2} cy={30} rx={40} ry={12} fill="white" />
          <ellipse cx={viewWidth * 0.2 + 25} cy={27} rx={30} ry={10} fill="white" />
          <ellipse cx={viewWidth * 0.7} cy={45} rx={35} ry={10} fill="white" />
          <ellipse cx={viewWidth * 0.7 + 20} cy={42} rx={25} ry={8} fill="white" />
        </g>

        {/* Sun / Moon */}
        <circle cx={viewWidth * 0.85} cy={35} r={14} fill="#fbbf24" opacity={0.3} />
        <circle cx={viewWidth * 0.85} cy={35} r={10} fill="#fbbf24" opacity={0.5} />

        {/* Ground */}
        <rect y={viewHeight - 30} width={viewWidth} height={30} fill="#1b3a2d" rx={0} />
        {/* Grass line */}
        <rect y={viewHeight - 32} width={viewWidth} height={4} fill="#2d6a4f" rx={2} />

        {/* Trees */}
        {trees}

        {/* Empty slot hints */}
        {count < maxTrees && Array.from({ length: Math.min(3, maxTrees - count) }).map((_, i) => {
          const idx = count + i;
          const row = Math.floor(idx / cols);
          const col = idx % cols;
          return (
            <circle
              key={`empty-${i}`}
              cx={offsetX + col * spacingX + spacingX / 2}
              cy={offsetY + 60 + row * spacingY + 10}
              r={3}
              fill="rgba(255,255,255,0.1)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={1}
              strokeDasharray="2 2"
            />
          );
        })}

        {/* Empty state */}
        {count === 0 && (
          <text x={viewWidth / 2} y={viewHeight / 2} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="14" fontFamily="Lexend">
            Report obstacles to plant trees! 🌱
          </text>
        )}
      </svg>
    </div>
  );
};

export default Forest;
