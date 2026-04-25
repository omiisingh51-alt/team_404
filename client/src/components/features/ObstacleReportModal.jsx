import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  X, MapPin, AlertTriangle, Construction, Footprints, 
  CircleAlert, Route as RouteIcon, Send
} from 'lucide-react';
import { reportObstacle } from '../../services/obstacleService';

const obstacleTypes = [
  { type: 'pothole', icon: CircleAlert, label: 'Pothole', color: '#f87171' },
  { type: 'stairs', icon: Footprints, label: 'Stairs', color: '#fbbf24' },
  { type: 'construction', icon: Construction, label: 'Construction', color: '#fb923c' },
  { type: 'narrow_path', icon: RouteIcon, label: 'Narrow Path', color: '#60a5fa' },
  { type: 'other', icon: AlertTriangle, label: 'Other', color: '#a78bfa' },
];

const ObstacleReportModal = ({ onClose, userLocation }) => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedType) return;
    setSubmitting(true);
    try {
      await reportObstacle({
        type: selectedType,
        description,
        lat: userLocation?.latitude || 47.6062,
        lng: userLocation?.longitude || -122.3321,
      });
      onClose();
    } catch (err) {
      console.error('Report failed:', err);
      // In demo mode, just close
      onClose();
    }
    setSubmitting(false);
  };

  return (
    <div className="absolute inset-0 z-40 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full glass-heavy rounded-t-3xl p-6 bottom-sheet">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold">{t('map.report_obstacle')}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5">
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        {/* Type selector */}
        <div className="grid grid-cols-5 gap-2 mb-5">
          {obstacleTypes.map(({ type, icon: Icon, label, color }) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                selectedType === type ? 'ring-2 ring-indigo-500 bg-white/5' : 'hover:bg-white/5'
              }`}
            >
              <Icon className="w-6 h-6" style={{ color }} />
              <span className="text-xs text-on-surface-variant">{label}</span>
            </button>
          ))}
        </div>

        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the obstacle..."
          className="w-full h-20 bg-white/5 rounded-xl p-3 text-sm text-on-surface placeholder:text-on-surface-variant border border-white/5 focus:border-indigo-500 focus:outline-none resize-none mb-4"
        />

        {/* Location */}
        <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-5">
          <MapPin className="w-3 h-3" />
          <span>
            {userLocation
              ? `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`
              : 'Using approximate location'}
          </span>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!selectedType || submitting}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-indigo-500/20"
        >
          <Send className="w-4 h-4" />
          {submitting ? 'Reporting...' : 'Report Obstacle'}
        </button>
      </div>
    </div>
  );
};

export default ObstacleReportModal;
