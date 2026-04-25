import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import DetectionPage from './pages/DetectionPage';
import ForestPage from './pages/ForestPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AuthPage from './pages/AuthPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  return user ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/detection" element={<DetectionPage />} />
                  <Route path="/forest" element={<ForestPage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
