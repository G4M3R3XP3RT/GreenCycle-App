import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await userService.getLeaderboard();
        let leaderboardData = [];
        if (response.data.top10) {
          leaderboardData = response.data.top10;
        } else if (Array.isArray(response.data)) {
          leaderboardData = response.data;
        } else if (response.data.content) {
          leaderboardData = response.data.content;
        }
        setUsers(leaderboardData);
      } catch (err) {
        setError('Erreur lors du chargement du classement.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', maxWidth: '800px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Top Éco-Citoyens</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Découvrez ceux qui ont le plus grand impact sur notre planète.</p>
      </div>

      {error && <div style={{ background: 'var(--danger-color)', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>}

      {loading ? (
        <p style={{ textAlign: 'center' }}>Chargement du classement...</p>
      ) : (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {users.map((user, index) => (
              <div 
                key={user.id || index} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '1rem', 
                  background: index === 0 ? 'rgba(251, 191, 36, 0.1)' : 'rgba(0,0,0,0.2)',
                  border: index === 0 ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid var(--card-border)',
                  borderRadius: '12px',
                  transition: 'transform var(--transition-fast)'
                }}
                className="leaderboard-item"
              >
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  background: index === 0 ? 'var(--accent-color)' : index === 1 ? '#9CA3AF' : index === 2 ? '#B45309' : 'var(--glass-bg)',
                  color: index < 3 ? '#000' : 'var(--text-secondary)',
                  borderRadius: '50%',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  marginRight: '1.5rem'
                }}>
                  {index + 1}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{user.prenom} {user.nom}</h4>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    {user.points}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>pts</span>
                </div>
              </div>
            ))}
            
            {users.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>Aucun utilisateur dans le classement pour le moment.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
