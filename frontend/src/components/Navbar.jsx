import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isCollector = user?.role === 'COLLECTOR' || (user?.roles && user.roles.includes('COLLECTOR'));

  return (
    <nav style={{ padding: '1rem 0', marginBottom: '2rem' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: '700' }}>
          🌱 GreenCycle
        </Link>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/leaderboard">Classement</Link>
          
          {user ? (
            <>
              {isCollector ? (
                <Link to="/collector">Espace Collecteur</Link>
              ) : (
                <Link to="/dashboard">Mon Tableau de bord</Link>
              )}
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Connexion</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>S'inscrire</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
