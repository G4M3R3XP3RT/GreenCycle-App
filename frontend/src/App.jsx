import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CollectorDashboard from './pages/CollectorDashboard';
import Leaderboard from './pages/Leaderboard';
import ChatWidget from './components/ChatWidget';
import './index.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  // If no specific roles required, or user has required role
  let userRole = user.role || (user.roles && user.roles[0]); // Adjust based on JWT structure
  
  if (userRole && userRole.startsWith('ROLE_')) {
    userRole = userRole.substring(5); // Remove "ROLE_" prefix
  }
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (userRole === 'COLLECTOR' || userRole === 'ADMIN') return <Navigate to="/collector" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/collector" 
              element={
                <ProtectedRoute allowedRoles={['COLLECTOR', 'ADMIN']}>
                  <CollectorDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <ChatWidget />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
