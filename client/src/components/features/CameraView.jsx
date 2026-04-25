import React, { useState } from 'react';
import useCamera from '../../hooks/useCamera';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, CameraOff, Power, Volume2, VolumeX, Eye } from 'lucide-react';

const detectionColors = {
  'Stairs': '#fbbf24',
  'Person': '#60a5fa',
  'Pothole': '#f87171',
  'Bicycle': '#34d399',
  'Construction': '#fb923c',
  'Curb': '#a78bfa',
};

const CameraView = () => {
  const { t } = useTranslation();
  const {
    hasPermission, error, videoRef, detections,
    isActive, soundEnabled, startCamera, stopCamera,
    setIsActive, setSoundEnabled,
  } = useCamera();

  const handleToggle = () => {
    if (isActive) {
      setIsActive(false);
      stopCamera();
    } else {
      setIsActive(true);
      startCamera();
    }
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      {/* Fallback when no camera */}
      {!hasPermission && (
        <div className="absolute inset-0 bg-surface-container-lowest flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <CameraOff className="w-10 h-10 text-on-surface-variant" />
            </div>
            <p className="text-on-surface-variant text-sm mb-1">Camera not available</p>
            <p className="text-on-surface-variant/50 text-xs">Using simulated detection</p>
          </div>
        </div>
      )}

      {/* HUD Overlay */}
      {isActive && (
        <>
          {/* Scanning grid */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full" style={{
              backgroundImage: 'linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />
            {/* Scan line */}
            <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent animate-scan-line" />
          </div>

          {/* Corner markers */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-indigo-500/50 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-indigo-500/50 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-indigo-500/50 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-indigo-500/50 rounded-br-lg" />

          {/* Detection bounding boxes */}
          {detections.map((det, i) => {
            const color = detectionColors[det.object] || '#a78bfa';
            return (
              <div
                key={i}
                className="absolute pointer-events-none transition-all duration-500"
                style={{
                  left: `${det.bbox.x}%`,
                  top: `${det.bbox.y}%`,
                  width: `${det.bbox.w}%`,
                  height: `${det.bbox.h}%`,
                }}
              >
                <div className="w-full h-full border-2 rounded-lg" style={{ borderColor: color }}>
                  <div className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: color, color: '#000' }}>
                    {det.object} {(det.confidence * 100).toFixed(0)}%
                  </div>
                  <div className="absolute -bottom-4 right-0 px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/60 text-white">
                    {det.distance}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Scanning indicator */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-indigo-400">
            <Eye className="w-3 h-3 animate-pulse" />
            <span>{t('detection.scanning')}</span>
          </div>
        </>
      )}

      {/* Detection sidebar */}
      {isActive && detections.length > 0 && (
        <div className="absolute top-16 right-3 z-20 space-y-2 max-w-[180px]">
          {detections.map((det, i) => {
            const color = detectionColors[det.object] || '#a78bfa';
            return (
              <div key={i} className="glass rounded-xl px-3 py-2 animate-fade-in">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs font-medium">{det.object}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-on-surface-variant">Dist: {det.distance}</span>
                  <span className="text-[10px] text-on-surface-variant">{(det.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            soundEnabled ? 'glass text-on-surface' : 'bg-white/5 text-on-surface-variant'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

        <button
          onClick={handleToggle}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
            isActive
              ? 'bg-red-500 shadow-red-500/30 hover:bg-red-600'
              : 'bg-gradient-to-br from-indigo-500 to-purple-500 shadow-indigo-500/30 hover:shadow-xl'
          }`}
        >
          <Power className="w-7 h-7 text-white" />
        </button>

        <button className="w-12 h-12 rounded-xl glass flex items-center justify-center text-on-surface-variant">
          <AlertTriangle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CameraView;
