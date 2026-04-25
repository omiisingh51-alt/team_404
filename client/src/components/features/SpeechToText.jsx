import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, X, Minimize2, Maximize2 } from 'lucide-react';

// Mock transcription phrases for demo mode
const MOCK_PHRASES = [
  "The pedestrian crossing is ahead on your left.",
  "A construction zone is detected 50 meters ahead.",
  "Turn right at the next intersection for the accessible ramp.",
  "Caution: uneven sidewalk surface detected.",
  "You are approaching a bus stop. Route 42 arrives in 5 minutes.",
  "Safe crossing window available now.",
];

const SpeechToText = ({ onClose }) => {
  const [isListening, setIsListening] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const scrollRef = useRef(null);

  // Mock typing animation
  useEffect(() => {
    if (!isListening) return;

    const phraseInterval = setInterval(() => {
      const phrase = MOCK_PHRASES[Math.floor(Math.random() * MOCK_PHRASES.length)];
      setCurrentPhrase(phrase);
      setCharIndex(0);
    }, 5000);

    return () => clearInterval(phraseInterval);
  }, [isListening]);

  useEffect(() => {
    if (!currentPhrase || charIndex >= currentPhrase.length) {
      if (currentPhrase && charIndex >= currentPhrase.length) {
        setTranscript(prev => [...prev.slice(-9), { text: currentPhrase, time: new Date().toLocaleTimeString() }]);
        setCurrentPhrase('');
      }
      return;
    }

    const timer = setTimeout(() => {
      setCharIndex(prev => prev + 1);
    }, 30);

    return () => clearTimeout(timer);
  }, [currentPhrase, charIndex]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, currentPhrase]);

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-50 w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-pulse"
      >
        <Mic className="w-5 h-5 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-50 w-80 animate-slide-up">
      <div className="glass-heavy rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-sm font-medium">Voice Guide</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setMinimized(true)} className="p-1.5 rounded-lg hover:bg-white/5">
              <Minimize2 className="w-4 h-4 text-on-surface-variant" />
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5">
              <X className="w-4 h-4 text-on-surface-variant" />
            </button>
          </div>
        </div>

        {/* Transcript */}
        <div ref={scrollRef} className="h-48 overflow-y-auto p-4 space-y-2">
          {transcript.map((entry, i) => (
            <div key={i} className="text-sm">
              <span className="text-on-surface-variant text-xs">{entry.time}</span>
              <p className="text-on-surface mt-0.5">{entry.text}</p>
            </div>
          ))}
          {currentPhrase && (
            <div className="text-sm">
              <p className="text-indigo-400">
                {currentPhrase.slice(0, charIndex)}
                <span className="animate-pulse">|</span>
              </p>
            </div>
          )}
          {transcript.length === 0 && !currentPhrase && (
            <p className="text-on-surface-variant text-sm text-center mt-8">
              {isListening ? 'Listening for navigation cues...' : 'Paused'}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center py-3 border-t border-white/5">
          <button
            onClick={() => setIsListening(!isListening)}
            className={`p-3 rounded-full transition-all ${isListening ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/5 text-on-surface-variant'}`}
          >
            {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpeechToText;
