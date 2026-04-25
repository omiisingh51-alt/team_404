import React, { useState } from 'react';
import { 
  ThumbsUp, ThumbsDown, CheckCircle, X, MapPin, 
  AlertTriangle, Construction, Footprints, CircleAlert, Route as RouteIcon
} from 'lucide-react';

const obstacleIcons = {
  pothole: CircleAlert,
  stairs: Footprints,
  construction: Construction,
  narrow_path: RouteIcon,
  other: AlertTriangle,
};

const obstacleColors = {
  pothole: '#f87171',
  stairs: '#fbbf24',
  construction: '#fb923c',
  narrow_path: '#60a5fa',
  other: '#a78bfa',
};

const ObstaclePopup = ({ obstacle, onClose, onVote, onResolve }) => {
  if (!obstacle) return null;

  const Icon = obstacleIcons[obstacle.type] || AlertTriangle;
  const color = obstacleColors[obstacle.type] || '#a78bfa';

  return (
    <div className="absolute bottom-4 left-4 right-4 z-30 bottom-sheet">
      <div className="glass-heavy rounded-2xl p-4 shadow-2xl">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <h3 className="font-semibold text-sm capitalize">{obstacle.type?.replace('_', ' ')}</h3>
              <p className="text-xs text-on-surface-variant">{obstacle.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5">
            <X className="w-4 h-4 text-on-surface-variant" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-3">
          <MapPin className="w-3 h-3" />
          <span>{obstacle.lat?.toFixed(4)}, {obstacle.lng?.toFixed(4)}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onVote?.(obstacle._id || obstacle.id, 'up')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all text-sm"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{obstacle.upvotes || 0}</span>
          </button>
          <button
            onClick={() => onVote?.(obstacle._id || obstacle.id, 'down')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-sm"
          >
            <ThumbsDown className="w-4 h-4" />
            <span>{obstacle.downvotes || 0}</span>
          </button>
          <div className="flex-1" />
          <button
            onClick={() => onResolve?.(obstacle._id || obstacle.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Resolved</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ObstaclePopup;
