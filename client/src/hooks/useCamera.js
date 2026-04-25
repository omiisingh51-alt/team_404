import { useState, useEffect, useRef, useCallback } from 'react';

// Mock detection results for demo mode
const MOCK_DETECTIONS = [
  { object: 'Stairs', confidence: 0.92, bbox: { x: 30, y: 40, w: 35, h: 25 }, distance: '2.5m' },
  { object: 'Person', confidence: 0.88, bbox: { x: 55, y: 20, w: 20, h: 50 }, distance: '4.0m' },
  { object: 'Pothole', confidence: 0.78, bbox: { x: 10, y: 65, w: 25, h: 15 }, distance: '1.2m' },
  { object: 'Bicycle', confidence: 0.85, bbox: { x: 70, y: 35, w: 18, h: 30 }, distance: '3.5m' },
  { object: 'Construction', confidence: 0.95, bbox: { x: 40, y: 10, w: 30, h: 20 }, distance: '5.0m' },
  { object: 'Curb', confidence: 0.72, bbox: { x: 5, y: 80, w: 90, h: 8 }, distance: '0.8m' },
];

const useCamera = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [detections, setDetections] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const videoRef = useRef(null);
  const audioCtxRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setStream(mediaStream);
      setHasPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError(err.message);
      setHasPermission(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Mock detection cycle
  useEffect(() => {
    if (!isActive) {
      setDetections([]);
      return;
    }

    const interval = setInterval(() => {
      const count = Math.floor(Math.random() * 3) + 1;
      const shuffled = [...MOCK_DETECTIONS].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count).map(d => ({
        ...d,
        bbox: {
          x: d.bbox.x + (Math.random() * 6 - 3),
          y: d.bbox.y + (Math.random() * 6 - 3),
          w: d.bbox.w,
          h: d.bbox.h,
        },
        confidence: Math.max(0.6, d.confidence + (Math.random() * 0.1 - 0.05)),
      }));
      setDetections(selected);

      // Proximity beep
      if (soundEnabled && selected.length > 0) {
        playBeep(selected[0]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive, soundEnabled]);

  const playBeep = (detection) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const dist = parseFloat(detection.distance);
      osc.frequency.value = dist < 2 ? 880 : dist < 4 ? 660 : 440;
      gain.gain.value = dist < 2 ? 0.3 : 0.15;

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // Audio not supported
    }
  };

  return {
    hasPermission,
    error,
    videoRef,
    stream,
    detections,
    isActive,
    soundEnabled,
    startCamera,
    stopCamera,
    setIsActive,
    setSoundEnabled,
  };
};

export default useCamera;
