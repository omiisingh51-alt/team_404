import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Map, Camera, TreePine, Trophy, AlertTriangle, 
  Navigation, Eye, Ear, Shield, ChevronRight, 
  TrendingUp, Zap, Users
} from 'lucide-react';

const MOCK_ALERTS = [
  { id: 1, type: 'pothole', distance: '120m', direction: 'ahead', severity: 'high' },
  { id: 2, type: 'construction', distance: '300m', direction: 'left', severity: 'medium' },
  { id: 3, type: 'stairs', distance: '50m', direction: 'right', severity: 'low' },
];

const quickActions = [
  { icon: Map, label: 'Navigate', path: '/map', gradient: 'from-blue-500 to-cyan-500', desc: 'Find safe routes' },
  { icon: Camera, label: 'Detect', path: '/detection', gradient: 'from-purple-500 to-pink-500', desc: 'Scan obstacles' },
  { icon: TreePine, label: 'Forest', path: '/forest', gradient: 'from-emerald-500 to-green-500', desc: 'Grow your forest' },
  { icon: Trophy, label: 'Rank', path: '/leaderboard', gradient: 'from-amber-500 to-orange-500', desc: 'View rankings' },
];

const accessibilityModes = [
  { id: 'visual', icon: Eye, label: 'Visual', desc: 'Enhanced visuals & large text' },
  { id: 'mobility', icon: Navigation, label: 'Mobility', desc: 'Wheelchair-friendly routes' },
  { id: 'hearing', icon: Ear, label: 'Hearing', desc: 'Visual alerts & vibrations' },
  { id: 'cognitive', icon: Shield, label: 'Cognitive', desc: 'Simplified interface' },
];

const HomePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState(user?.accessibilityMode || 'visual');

  const stats = [
    { label: t('home.obstacles_reported'), value: user?.obstaclesReported || 7, icon: AlertTriangle, color: '#f87171' },
    { label: t('home.trees_planted'), value: user?.treesPlanted || 2, icon: TreePine, color: '#4ade80' },
    { label: t('home.forests_completed'), value: user?.forestsCompleted || 0, icon: Users, color: '#60a5fa' },
  ];

  const treeProgress = ((user?.points || 420) % 100) / 100;

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 space-y-6 max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-pink-600/20 p-6 lg:p-8 animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent animate-gradient" />
        <div className="relative z-10">
          <p className="text-indigo-400 text-sm font-medium mb-1">
            {t('home.welcome')}, 
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold font-['Lexend'] mb-2 text-gradient">
            {user?.name || 'Explorer'}
          </h1>
          <p className="text-on-surface-variant text-sm max-w-md">
            Navigate your world safely. Your contributions make paths accessible for everyone.
          </p>

          {/* Stats ribbon */}
          <div className="flex flex-wrap gap-4 mt-5">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-2.5 glass rounded-xl px-4 py-2.5 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                <div>
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-[10px] text-on-surface-variant">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold font-['Lexend'] mb-3">{t('home.quick_actions')}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action, i) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className="group relative rounded-2xl p-4 glass card-glow text-left animate-fade-in"
              style={{ animationDelay: `${i * 100 + 200}ms` }}
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-sm">{action.label}</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">{action.desc}</p>
              <ChevronRight className="absolute top-4 right-4 w-4 h-4 text-on-surface-variant/30 group-hover:text-on-surface-variant group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Accessibility Mode */}
        <div>
          <h2 className="text-lg font-semibold font-['Lexend'] mb-3">{t('home.accessibility_mode')}</h2>
          <div className="grid grid-cols-2 gap-2">
            {accessibilityModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                  activeMode === mode.id
                    ? 'bg-primary/15 ring-1 ring-primary/30'
                    : 'glass hover:bg-white/5'
                }`}
              >
                <mode.icon className={`w-5 h-5 ${activeMode === mode.id ? 'text-primary' : 'text-on-surface-variant'}`} />
                <div>
                  <p className="text-sm font-medium">{mode.label}</p>
                  <p className="text-[10px] text-on-surface-variant">{mode.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Nearby Alerts */}
        <div>
          <h2 className="text-lg font-semibold font-['Lexend'] mb-3">{t('home.nearby_alerts')}</h2>
          <div className="space-y-2">
            {MOCK_ALERTS.map((alert, i) => (
              <div
                key={alert.id}
                className="flex items-center gap-3 p-3 rounded-xl glass animate-fade-in"
                style={{ animationDelay: `${i * 100 + 400}ms` }}
              >
                <div className={`w-2 h-2 rounded-full ${
                  alert.severity === 'high' ? 'bg-red-400' :
                  alert.severity === 'medium' ? 'bg-amber-400' : 'bg-green-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium capitalize">{alert.type.replace('_', ' ')}</p>
                  <p className="text-xs text-on-surface-variant">{alert.distance} {alert.direction}</p>
                </div>
                <AlertTriangle className={`w-4 h-4 ${
                  alert.severity === 'high' ? 'text-red-400' :
                  alert.severity === 'medium' ? 'text-amber-400' : 'text-green-400'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tree Progress */}
      <div className="glass rounded-2xl p-5 animate-fade-in" style={{ animationDelay: '600ms' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TreePine className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">Next Tree</span>
          </div>
          <span className="text-xs text-on-surface-variant">{Math.round(treeProgress * 100)}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-1000"
            style={{ width: `${treeProgress * 100}%` }}
          />
        </div>
        <p className="text-xs text-on-surface-variant mt-2">
          Report {Math.ceil((1 - treeProgress) * 10)} more obstacles to plant a new tree!
        </p>
      </div>
    </div>
  );
};

export default HomePage;
