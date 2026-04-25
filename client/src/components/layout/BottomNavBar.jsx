import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Map, Camera, TreePine, Trophy, Home } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/map', icon: Map, label: 'Map' },
  { path: '/detection', icon: Camera, label: 'Detect' },
  { path: '/forest', icon: TreePine, label: 'Forest' },
  { path: '/leaderboard', icon: Trophy, label: 'Rank' },
];

const BottomNavBar = () => {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-heavy border-t border-white/5">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          return (
            <NavLink
              key={path}
              to={path}
              className="flex flex-col items-center justify-center gap-0.5 py-1 px-3 relative"
            >
              <div className={`relative p-1.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-primary/15' : ''}`}>
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
              </div>
              <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
