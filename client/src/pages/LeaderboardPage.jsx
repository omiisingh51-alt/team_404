import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy, TreePine, Target, Crown, Medal, Star, ChevronUp } from 'lucide-react';
import { getLeaderboard } from '../services/gamificationService';
import { useAuth } from '../context/AuthContext';

const MOCK_LEADERS = [
  { _id: '1', name: 'Maya Chen', treesPlanted: 24, forestsCompleted: 2, obstaclesReported: 87, points: 2400, accessibilityMode: 'visual' },
  { _id: '2', name: 'James Wilson', treesPlanted: 18, forestsCompleted: 1, obstaclesReported: 64, points: 1800, accessibilityMode: 'mobility' },
  { _id: '3', name: 'Priya Patel', treesPlanted: 15, forestsCompleted: 1, obstaclesReported: 52, points: 1500, accessibilityMode: 'hearing' },
  { _id: '4', name: 'SafeStep Explorer', treesPlanted: 2, forestsCompleted: 0, obstaclesReported: 7, points: 420, accessibilityMode: 'visual' },
  { _id: '5', name: 'Alex Kim', treesPlanted: 8, forestsCompleted: 0, obstaclesReported: 31, points: 800, accessibilityMode: 'cognitive' },
  { _id: '6', name: 'Sam Rivera', treesPlanted: 6, forestsCompleted: 0, obstaclesReported: 22, points: 600, accessibilityMode: 'visual' },
];

const modeEmoji = { visual: '👁️', mobility: '♿', hearing: '👂', cognitive: '🧠' };
const podiumColors = ['from-amber-400 to-yellow-500', 'from-slate-300 to-gray-400', 'from-amber-600 to-orange-700'];
const podiumIcons = [Crown, Medal, Star];

const LeaderboardPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getLeaderboard();
        setLeaders(data.length > 0 ? data : MOCK_LEADERS);
      } catch (err) {
        setLeaders(MOCK_LEADERS);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const sorted = [...leaders].sort((a, b) => (b.points || 0) - (a.points || 0));
  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-600/20 via-yellow-600/10 to-orange-600/20 p-6 animate-fade-in">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl lg:text-3xl font-bold font-['Lexend']" style={{
              background: 'linear-gradient(135deg, #fbbf24, #f97316)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>{t('leaderboard.title')}</h1>
          </div>
          <p className="text-on-surface-variant text-sm">Top contributors making paths accessible for everyone</p>
        </div>
      </div>

      {/* Podium */}
      {top3.length >= 3 && (
        <div className="flex items-end justify-center gap-3 h-52 animate-fade-in" style={{ animationDelay: '200ms' }}>
          {[1, 0, 2].map((idx) => {
            const leader = top3[idx];
            const heights = ['h-40', 'h-32', 'h-24'];
            const PodiumIcon = podiumIcons[idx];
            const isCurrentUser = leader.name === user?.name;
            return (
              <div key={idx} className="flex flex-col items-center gap-2 flex-1 max-w-[120px]">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${podiumColors[idx]} flex items-center justify-center text-white text-lg font-bold shadow-lg ${isCurrentUser ? 'ring-2 ring-indigo-400' : ''}`}>
                  {leader.name?.charAt(0)}
                </div>
                <p className="text-xs font-medium text-center truncate w-full">{leader.name}</p>
                <div className={`w-full ${heights[idx]} rounded-t-xl bg-gradient-to-b ${podiumColors[idx]} bg-opacity-20 flex flex-col items-center justify-start pt-3 relative`} style={{ background: `linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.02))` }}>
                  <PodiumIcon className="w-5 h-5 text-amber-400 mb-1" />
                  <span className="text-lg font-bold">{leader.points}</span>
                  <span className="text-[10px] text-on-surface-variant">pts</span>
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-xs font-bold border border-white/10">
                    {idx + 1}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden animate-fade-in" style={{ animationDelay: '400ms' }}>
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-4 px-4 py-3 border-b border-white/5 text-xs text-on-surface-variant font-medium">
          <span>{t('leaderboard.rank')}</span>
          <span>{t('leaderboard.name')}</span>
          <span className="text-center">🌳</span>
          <span className="text-center">🌲</span>
          <span className="text-center">📋</span>
        </div>
        {sorted.map((leader, i) => {
          const isCurrentUser = leader.name === user?.name;
          return (
            <div
              key={leader._id}
              className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-4 px-4 py-3 items-center text-sm border-b border-white/3 transition-colors ${
                isCurrentUser ? 'bg-indigo-500/10' : 'hover:bg-white/3'
              }`}
            >
              <span className="w-6 text-center font-bold text-on-surface-variant">{i + 1}</span>
              <div className="flex items-center gap-2 min-w-0">
                <span className="truncate font-medium">{leader.name}</span>
                <span className="text-xs">{modeEmoji[leader.accessibilityMode] || ''}</span>
                {isCurrentUser && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">You</span>}
              </div>
              <span className="text-center">{leader.treesPlanted || 0}</span>
              <span className="text-center">{leader.forestsCompleted || 0}</span>
              <span className="text-center">{leader.obstaclesReported || 0}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaderboardPage;
