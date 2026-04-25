import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TreePine, Sprout, Award, Leaf, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Forest from '../components/features/Forest';
import { getUserProgress } from '../services/gamificationService';

const ForestPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getUserProgress();
        setProgress(data);
      } catch (err) {
        setProgress({
          obstaclesReported: user?.obstaclesReported || 7,
          treesPlanted: user?.treesPlanted || 2,
          forestsCompleted: user?.forestsCompleted || 0,
          points: user?.points || 420,
          checkpointsDiscovered: user?.checkpointsDiscovered || 3,
        });
      }
    };
    fetchProgress();
  }, [user]);

  const data = progress || {
    obstaclesReported: 7, treesPlanted: 2,
    forestsCompleted: 0, points: 420, checkpointsDiscovered: 3,
  };

  const treeProgress = (data.points % 100) / 100;
  const forestProgress = data.treesPlanted / 10;

  const statCards = [
    { icon: TreePine, label: t('forest.trees'), value: data.treesPlanted, color: '#4ade80' },
    { icon: Target, label: t('forest.points'), value: data.points, color: '#60a5fa' },
    { icon: Award, label: 'Checkpoints', value: data.checkpointsDiscovered, color: '#fbbf24' },
  ];

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-600/20 via-green-600/10 to-teal-600/20 p-6 animate-fade-in">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <TreePine className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl lg:text-3xl font-bold font-['Lexend']" style={{
              background: 'linear-gradient(135deg, #4ade80, #2dd4bf)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>{t('forest.title')}</h1>
          </div>
          <p className="text-on-surface-variant text-sm">Every obstacle you report helps grow your virtual forest!</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {statCards.map((stat, i) => (
          <div key={i} className="glass rounded-2xl p-4 text-center animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
            <stat.icon className="w-6 h-6 mx-auto mb-2" style={{ color: stat.color }} />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-on-surface-variant mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Progress Bars */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium">{t('forest.next_tree')}</span>
            </div>
            <span className="text-xs text-on-surface-variant">{Math.round(treeProgress * 100)}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-1000" style={{ width: `${treeProgress * 100}%` }} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-medium">Next Forest</span>
            </div>
            <span className="text-xs text-on-surface-variant">{data.treesPlanted}/10 trees</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-1000" style={{ width: `${forestProgress * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Forest */}
      <div>
        <h2 className="text-lg font-semibold font-['Lexend'] mb-3">Your Forest</h2>
        <Forest treeCount={data.treesPlanted} maxTrees={10} />
      </div>

      {/* How It Works */}
      <div className="glass rounded-2xl p-5">
        <h2 className="text-lg font-semibold font-['Lexend'] mb-4">{t('forest.how_it_works')}</h2>
        <div className="space-y-3">
          {[
            { icon: '🔍', title: 'Report Obstacles', desc: 'Find and report accessibility barriers' },
            { icon: '🌱', title: 'Earn Points', desc: 'Get 10 points per report' },
            { icon: '🌳', title: 'Plant Trees', desc: 'Every 100 points plants a tree' },
            { icon: '🌲', title: 'Grow Forests', desc: '10 trees form a forest' },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-xl">{step.icon}</span>
              <div>
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-on-surface-variant">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForestPage;
