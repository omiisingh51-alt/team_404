import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useGeolocation from '../../hooks/useGeolocation';
import { getObstacles, voteObstacle } from '../../services/obstacleService';
import ObstaclePopup from './ObstaclePopup';
import ObstacleReportModal from './ObstacleReportModal';
import { 
  Plus, Locate, Accessibility, Layers, Navigation, MapPin,
  AlertTriangle, Construction, Footprints, CircleAlert, Route as RouteIcon
} from 'lucide-react';

const obstacleColors = {
  pothole: '#f87171',
  stairs: '#fbbf24',
  construction: '#fb923c',
  narrow_path: '#60a5fa',
  other: '#a78bfa',
};

const obstacleIcons = {
  pothole: CircleAlert,
  stairs: Footprints,
  construction: Construction,
  narrow_path: RouteIcon,
  other: AlertTriangle,
};

// Mock obstacles for demo
const MOCK_OBSTACLES = [
  { id: '1', type: 'pothole', description: 'Deep pothole near crosswalk', lat: 47.6072, lng: -122.3331, upvotes: 5, downvotes: 1 },
  { id: '2', type: 'stairs', description: 'Steep stairs without handrails', lat: 47.6052, lng: -122.3311, upvotes: 8, downvotes: 0 },
  { id: '3', type: 'construction', description: 'Road work blocking sidewalk', lat: 47.6082, lng: -122.3341, upvotes: 12, downvotes: 2 },
  { id: '4', type: 'narrow_path', description: 'Narrow passage between buildings', lat: 47.6042, lng: -122.3351, upvotes: 3, downvotes: 1 },
  { id: '5', type: 'other', description: 'Broken streetlight', lat: 47.6092, lng: -122.3301, upvotes: 6, downvotes: 0 },
];

const MapView = () => {
  const { t } = useTranslation();
  const { location } = useGeolocation();
  const [obstacles, setObstacles] = useState(MOCK_OBSTACLES);
  const [selectedObstacle, setSelectedObstacle] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [wheelchairMode, setWheelchairMode] = useState(false);
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState({ x: 50, y: 50 });

  // Try to fetch real obstacles, fall back to mock
  useEffect(() => {
    const fetchObstacles = async () => {
      if (!location) return;
      try {
        const data = await getObstacles(location.latitude, location.longitude);
        if (data && data.length > 0) {
          setObstacles(data);
        }
      } catch (err) {
        // Use mock data
      }
    };
    fetchObstacles();
  }, [location]);

  const handleVote = async (id, voteType) => {
    try {
      await voteObstacle(id, voteType);
    } catch (err) {
      // Demo: update locally
    }
    setObstacles(prev => prev.map(o => {
      if ((o._id || o.id) === id) {
        return {
          ...o,
          upvotes: voteType === 'up' ? (o.upvotes || 0) + 1 : o.upvotes,
          downvotes: voteType === 'down' ? (o.downvotes || 0) + 1 : o.downvotes,
        };
      }
      return o;
    }));
  };

  const userLat = location?.latitude || 47.6062;
  const userLng = location?.longitude || -122.3321;

  return (
    <div className="relative w-full h-full bg-surface-container-lowest overflow-hidden" ref={mapRef}>
      {/* Mock Map Background */}
      <div className="absolute inset-0">
        {/* Grid lines */}
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
            <pattern id="road-h" width="100%" height="8" patternUnits="userSpaceOnUse">
              <rect width="100%" height="8" fill="rgba(255,255,255,0.06)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Roads */}
          <rect x="0" y="30%" width="100%" height="12" rx="2" fill="rgba(255,255,255,0.05)" />
          <rect x="0" y="60%" width="100%" height="12" rx="2" fill="rgba(255,255,255,0.05)" />
          <rect x="25%" y="0" width="12" height="100%" rx="2" fill="rgba(255,255,255,0.05)" />
          <rect x="65%" y="0" width="12" height="100%" rx="2" fill="rgba(255,255,255,0.05)" />

          {/* Road dashes */}
          <line x1="0" y1="30.8%" x2="100%" y2="30.8%" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="8 6" />
          <line x1="0" y1="60.8%" x2="100%" y2="60.8%" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="8 6" />
        </svg>

        {/* Block labels */}
        <div className="absolute top-[15%] left-[10%] text-[10px] text-white/10 font-medium tracking-widest uppercase">Park District</div>
        <div className="absolute top-[45%] left-[40%] text-[10px] text-white/10 font-medium tracking-widest uppercase">Downtown</div>
        <div className="absolute top-[75%] right-[15%] text-[10px] text-white/10 font-medium tracking-widest uppercase">Waterfront</div>
      </div>

      {/* User Location */}
      <div className="absolute z-10" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        <div className="relative">
          <div className="absolute -inset-6 rounded-full bg-indigo-500/10 animate-pulse-ring" />
          <div className="absolute -inset-3 rounded-full bg-indigo-500/15" />
          <div className="w-4 h-4 rounded-full bg-indigo-500 border-2 border-white shadow-lg shadow-indigo-500/50" />
        </div>
      </div>

      {/* Obstacle Markers */}
      {obstacles.map((obstacle, i) => {
        const dx = ((obstacle.lng - userLng) * 8000);
        const dy = -((obstacle.lat - userLat) * 8000);
        const color = obstacleColors[obstacle.type] || '#a78bfa';
        const Icon = obstacleIcons[obstacle.type] || AlertTriangle;

        return (
          <button
            key={obstacle._id || obstacle.id || i}
            className="absolute z-20 group"
            style={{ left: `calc(50% + ${dx}px)`, top: `calc(50% + ${dy}px)`, transform: 'translate(-50%, -50%)' }}
            onClick={() => setSelectedObstacle(obstacle)}
          >
            <div className="relative">
              <div className="absolute -inset-2 rounded-full animate-pulse" style={{ backgroundColor: `${color}15` }} />
              <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-125" style={{ backgroundColor: `${color}30`, border: `2px solid ${color}` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
            </div>
          </button>
        );
      })}

      {/* Wheelchair Mode Toggle */}
      <div className="absolute top-4 left-4 z-30">
        <button
          onClick={() => setWheelchairMode(!wheelchairMode)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
            wheelchairMode ? 'bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/30' : 'glass text-on-surface-variant'
          }`}
        >
          <Accessibility className="w-4 h-4" />
          <span className="hidden sm:inline">{t('map.wheelchair_mode')}</span>
        </button>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
        <button className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-all">
          <Locate className="w-5 h-5 text-on-surface-variant" />
        </button>
        <button className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-all">
          <Layers className="w-5 h-5 text-on-surface-variant" />
        </button>
        <button className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-all">
          <Navigation className="w-5 h-5 text-on-surface-variant" />
        </button>
      </div>

      {/* Report FAB */}
      <button
        onClick={() => setShowReport(true)}
        className="absolute bottom-6 right-6 z-30 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all hover:scale-105 lg:bottom-6 lg:right-6"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* Coordinate Display */}
      <div className="absolute bottom-6 left-4 z-30 glass rounded-xl px-3 py-1.5 text-xs text-on-surface-variant">
        <span>{userLat.toFixed(4)}, {userLng.toFixed(4)}</span>
      </div>

      {/* Obstacle Popup */}
      {selectedObstacle && (
        <ObstaclePopup
          obstacle={selectedObstacle}
          onClose={() => setSelectedObstacle(null)}
          onVote={handleVote}
          onResolve={() => {
            setObstacles(prev => prev.filter(o => (o._id || o.id) !== (selectedObstacle._id || selectedObstacle.id)));
            setSelectedObstacle(null);
          }}
        />
      )}

      {/* Report Modal */}
      {showReport && (
        <ObstacleReportModal
          onClose={() => setShowReport(false)}
          userLocation={location}
        />
      )}
    </div>
  );
};

export default MapView;
