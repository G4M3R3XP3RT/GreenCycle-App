import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

//top navbar with navs to all pages
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); // auto go to landing page first
    setTimeout(() => {
      logout(); // clear state after navigation
    }, 100); // give timeout to not go to login again
  };

  //const to update navbar if user is collector (Espace Collecteur)
  const isCollector =
    ['COLLECTOR', 'ROLE_COLLECTOR', 'ADMIN', 'ROLE_ADMIN'].includes(user?.role) ||
    (user?.roles && (user.roles.includes('COLLECTOR') || user.roles.includes('ROLE_COLLECTOR') || user.roles.includes('ADMIN') || user.roles.includes('ROLE_ADMIN')));

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
