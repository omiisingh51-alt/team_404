import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Accessibility, Eye, Ear, Shield, ChevronRight } from 'lucide-react';

const modes = [
  { id: 'visual', icon: Eye, label: 'Visual', desc: 'Enhanced contrast & large text', color: '#60a5fa' },
  { id: 'mobility', icon: Accessibility, label: 'Mobility', desc: 'Wheelchair-friendly routes', color: '#4ade80' },
  { id: 'hearing', icon: Ear, label: 'Hearing', desc: 'Visual alerts & vibrations', color: '#fbbf24' },
  { id: 'cognitive', icon: Shield, label: 'Cognitive', desc: 'Simplified interface', color: '#a78bfa' },
];

const AuthPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessibilityMode, setAccessibilityMode] = useState('visual');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password, accessibilityMode);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            <Accessibility className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold font-['Lexend'] text-gradient">{t('app_name')}</h1>
          <p className="text-on-surface-variant text-sm mt-1">Smart Accessible Navigation</p>
        </div>

        {/* Form Card */}
        <div className="glass-heavy rounded-3xl p-6">
          <h2 className="text-xl font-semibold font-['Lexend'] mb-5">
            {isLogin ? t('auth.login') : t('auth.signup')}
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm text-on-surface-variant mb-1.5">{t('auth.name')}</label>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-on-surface placeholder:text-on-surface-variant/50 focus:border-indigo-500 focus:outline-none transition-colors"
                  placeholder="Your name" required
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-on-surface-variant mb-1.5">{t('auth.email')}</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-on-surface placeholder:text-on-surface-variant/50 focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="you@example.com" required
              />
            </div>

            <div>
              <label className="block text-sm text-on-surface-variant mb-1.5">{t('auth.password')}</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-on-surface placeholder:text-on-surface-variant/50 focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="••••••••" required minLength={6}
              />
            </div>

            {/* Accessibility Mode Selector (signup only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm text-on-surface-variant mb-2">Accessibility Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  {modes.map((mode) => (
                    <button
                      key={mode.id} type="button"
                      onClick={() => setAccessibilityMode(mode.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-left transition-all text-sm ${
                        accessibilityMode === mode.id
                          ? 'bg-indigo-500/15 ring-1 ring-indigo-500/30'
                          : 'bg-white/3 hover:bg-white/5'
                      }`}
                    >
                      <mode.icon className="w-4 h-4" style={{ color: mode.color }} />
                      <span className="font-medium text-xs">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  {isLogin ? t('auth.login') : t('auth.signup')}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="w-full text-center text-sm text-on-surface-variant hover:text-primary mt-4 transition-colors"
          >
            {isLogin ? t('auth.no_account') : t('auth.have_account')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
