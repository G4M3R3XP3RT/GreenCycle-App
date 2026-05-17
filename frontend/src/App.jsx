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
  //always call useAuth to check if user logged in / stored jwt token

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</div>;
  if (!user) return <Navigate to="/login" replace />;

  // does user have single role?    no. does it have array of role? select first
  let userRole = user.role || (user.roles && user.roles[0]);

  if (userRole && userRole.startsWith('ROLE_')) {
    userRole = userRole.substring(5); // remove "ROLE_" prefix from db attribute
  }

  // check if user has role role
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    //send collector or admin to collector dashboard, citoyen to user dashboard
    if (userRole === 'COLLECTOR' || userRole === 'ADMIN') return <Navigate to="/collector" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

//put navbar over all routes so that navbar component stays fixed on top of app/every pages
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
