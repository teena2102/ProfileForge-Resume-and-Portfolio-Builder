import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import Preview from './pages/Preview';
import Layout from './pages/Layout';
import Login from './pages/Login';
import AtsChecker from './pages/AtsChecker';
import PortfolioBuilder from './pages/PortfolioBuilder';
import AIAtsChecker from './pages/AIAtsChecker';
import ViewPortfolio from "./pages/ViewPortfolio";


// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={user ? <Navigate to="/app" replace /> : <Login />} />
      <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="builder/:resumeId" element={<ResumeBuilder />} />
      </Route>
      <Route path="/view/:resumeId" element={<Preview />} />
      <Route path="/ats-checker" element={<AtsChecker />} />
      <Route path="/portfolio/:slug" element={<ViewPortfolio />} />
      <Route path="/ai-ats-checker" element={<AIAtsChecker />} />
      <Route path="/portfolio-builder" element={<PortfolioBuilder />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    
  );
};

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
