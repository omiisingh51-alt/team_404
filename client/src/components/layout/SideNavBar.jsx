import React from 'react';
import { NavLink } from 'react-router-dom';
import { Map, Camera, TreePine, Trophy, LogOut, Home, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/', icon: Home, labelKey: 'nav.home' },
  { path: '/map', icon: Map, labelKey: 'nav.map' },
  { path: '/detection', icon: Camera, labelKey: 'nav.detection' },
  { path: '/forest', icon: TreePine, labelKey: 'nav.forest' },
  { path: '/leaderboard', icon: Trophy, labelKey: 'nav.leaderboard' },
];

const SideNavBar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav className="hidden lg:flex fixed left-0 top-16 bottom-0 w-72 flex-col bg-surface-container-low border-r border-white/5 z-40">
      {/* User profile card */}
      {user && (
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-lg font-semibold">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-semibold text-sm">{user.name}</p>
              <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                <Shield className="w-3 h-3" />
                <span>Level {user.level || 1}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 p-3 space-y-1">
        {navItems.map(({ path, icon: Icon, labelKey }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{t(labelKey)}</span>
          </NavLink>
        ))}
      </div>

      <div className="p-3 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-red-500/10 hover:text-red-400 transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>{t('nav.logout')}</span>
        </button>
      </div>
    </nav>
  );
};

export default SideNavBar;
