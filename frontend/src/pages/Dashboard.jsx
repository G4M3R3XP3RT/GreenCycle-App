import React, { useState, useEffect } from 'react';
import { collectionService, userService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    typeDechet: 'Plastique',
    quantite: '',
    localisation: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [myCollections, setMyCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greenPoints, setGreenPoints] = useState(0);

  const fetchCollections = async () => {
    try {
      const [colRes, leadRes] = await Promise.all([
        collectionService.getMyCollections(),
        userService.getLeaderboard()
      ]);
      setMyCollections(Array.isArray(colRes.data) ? colRes.data : colRes.data.content || []);
      
      let leadData = [];
      if (leadRes.data.top10) leadData = leadRes.data.top10;
      else if (Array.isArray(leadRes.data)) leadData = leadRes.data;
      else if (leadRes.data.content) leadData = leadRes.data.content;
      
      // Try to find the user in the top 10, or use currentUser if the backend returns it
      if (leadRes.data.currentUser) {
        setGreenPoints(leadRes.data.currentUser.points);
      } else {
        const found = leadData.find(u => u.email === user?.email || u.nom === user?.nom);
        if (found) setGreenPoints(found.points);
        else setGreenPoints(user?.greenPoints || 0); // fallback
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des données", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert quantite to a number
      const payload = {
        ...formData,
        quantite: parseFloat(formData.quantite)
      };
      await collectionService.signalCollection(payload);
      setMessage('Collecte signalée avec succès ! En attente d\'un collecteur.');
      setError('');
      setFormData({ typeDechet: 'Plastique', quantite: '', localisation: '' });
      fetchCollections(); // Refresh list after successful submission
    } catch (err) {
      console.error(err);
      let errorMessage = "Erreur lors du signalement de la collecte.";
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.errors) {
          errorMessage = Object.values(err.response.data.errors).join(', ');
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else {
          errorMessage = JSON.stringify(err.response.data);
        }
      }
      setError(errorMessage);
      setMessage('');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Mon Tableau de bord</h2>
        <div className="glass-panel" style={{ padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🌱</span>
          <span style={{ fontWeight: 'bold' }}>{greenPoints} GreenPoints</span>
        </div>
      </div>

      {/* Mes Collectes Section */}
      <div style={{ marginBottom: '4rem' }}>
        <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Mes demandes de collectes</h3>

        {loading ? (
          <p style={{ textAlign: 'center' }}>Chargement de vos collectes...</p>
        ) : myCollections.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Vous n'avez pas encore signalé de collecte.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {myCollections.map((collecte) => (
              <div key={collecte.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h4 style={{ margin: 0, color: 'var(--primary-color)' }}>{collecte.typeDechet}</h4>
                  <span style={{
                    background: collecte.statut === 'EN_COURS' ? 'var(--accent-color)' : collecte.statut === 'TERMINE' ? 'var(--primary-color)' : 'rgba(255,255,255,0.2)',
                    color: collecte.statut === 'TERMINE' ? '#fff' : '#000',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {collecte.statut}
                  </span>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <p><strong>Quantité :</strong> {collecte.quantite} kg</p>
                  <p><strong>Lieu :</strong> {collecte.localisation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Signaler une collecte</h3>

        {message && <div style={{ background: 'var(--primary-color)', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{message}</div>}
        {error && <div style={{ background: 'var(--danger-color)', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Type de déchet</label>
            <select
              name="typeDechet"
              className="form-control"
              value={formData.typeDechet}
              onChange={handleChange}
              style={{ background: 'rgba(0,0,0,0.4)' }}
            >
              <option value="Plastique">Plastique</option>
              <option value="Verre">Verre</option>
              <option value="Métal">Métal</option>
              <option value="Papier/Carton">Papier / Carton</option>
              <option value="Électronique">Électronique</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Quantité (en kg)</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              name="quantite"
              className="form-control"
              value={formData.quantite}
              onChange={handleChange}
              placeholder="ex: 5.5"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Localisation (Adresse exacte)</label>
            <input
              type="text"
              name="localisation"
              className="form-control"
              value={formData.localisation}
              onChange={handleChange}
              placeholder="ex: 12 Rue de l'Écologie, Paris"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Signaler la collecte
          </button>
        </form>
      </div>


    </div>
  );
};

export default Dashboard;
