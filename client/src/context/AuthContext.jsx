import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

// Demo user for when backend is not available
const DEMO_USER = {
  _id: 'demo-user-001',
  name: 'SafeStep Explorer',
  email: 'demo@safestep.com',
  accessibilityMode: 'visual',
  obstaclesReported: 7,
  checkpointsDiscovered: 3,
  treesPlanted: 2,
  forestsCompleted: 0,
  points: 420,
  level: 4,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          // If backend is unreachable, switch to demo mode
          console.warn('Backend unreachable, using demo mode');
          const demoData = localStorage.getItem('demo_user');
          if (demoData) {
            setUser(JSON.parse(demoData));
          } else {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
          }
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      // Demo mode fallback
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network')) {
        const demoUser = { ...DEMO_USER, email };
        localStorage.setItem('token', 'demo-token');
        localStorage.setItem('demo_user', JSON.stringify(demoUser));
        setUser(demoUser);
        return { user: demoUser, token: 'demo-token' };
      }
      throw err;
    }
  };

  const signup = async (name, email, password, accessibilityMode) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, accessibilityMode });
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      // Demo mode fallback
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network')) {
        const demoUser = { ...DEMO_USER, name, email, accessibilityMode };
        localStorage.setItem('token', 'demo-token');
        localStorage.setItem('demo_user', JSON.stringify(demoUser));
        setUser(demoUser);
        return { user: demoUser, token: 'demo-token' };
      }
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('demo_user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
