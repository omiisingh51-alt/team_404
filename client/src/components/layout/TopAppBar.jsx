import React from 'react';
import { Mic, Settings, Bell, Accessibility, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const TopAppBar = ({ onToggleSpeech, isSpeechOpen }) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-heavy flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <Accessibility className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-lg font-semibold font-['Lexend'] hidden sm:block text-gradient">
          {t('app_name')}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSpeech}
          className={`p-2.5 rounded-xl transition-all ${isSpeechOpen ? 'bg-indigo-500/20 text-indigo-400' : 'hover:bg-white/5 text-on-surface-variant'}`}
          aria-label="Toggle speech-to-text"
        >
          <Mic className="w-5 h-5" />
        </button>

        <button className="p-2.5 rounded-xl hover:bg-white/5 text-on-surface-variant relative" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {user && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold ml-1">
            {user.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        )}
      </div>
    </header>
  );
};

export default TopAppBar;
