import React, { useState, useEffect } from 'react';
import { collectionService } from '../services/api';

//Collector dashboard page
const CollectorDashboard = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [optimizing, setOptimizing] = useState(false);
  const [startLocation, setStartLocation] = useState('Salaberry-de-Valleyfield, QC'); //default start location for algorithme de trajet

  const fetchCollections = async () => {
    try {
      const response = await collectionService.getMyTours();
      const data = response.data;
      if (Array.isArray(data)) {
        setCollections(data);
      } else if (data && data.disponibles) {
        setCollections([...data.actives, ...data.disponibles, ...data.historique]);
      } else {
        setCollections([]);
      }
    } catch (err) {
      setError('Erreur lors du chargement des collectes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleAccept = async (id) => {
    if (actionLoadingId) return;
    setActionLoadingId(id);
    try {
      await collectionService.acceptCollection(id);
      fetchCollections(); // refresh list for ui
    } catch (err) {
      alert("Erreur lors de l'acceptation de la collecte. Il se peut qu'elle soit déjà prise en charge.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleValidate = async (id) => {
    try {
      await collectionService.validateCollection(id);
      fetchCollections(); // refresh list for ui
    } catch (err) {
      alert("Erreur lors de la validation de la collecte.");
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    //calculate distance between two points to determine shortest path for collection tours
    //we use openstreetmap api to get lat et lon for address of collecte
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const geocode = async (address) => {
    try {
      //get lat and lon for address of collecte
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      }
    } catch (err) {
      console.error("Geocoding failed for", address, err);
    }
    return null;
  };

  const optimizeTour = async () => {
    //optimization of path for collection tours, updates ui to show 1,2,3 from start location
    setOptimizing(true);
    //triggered by button, bool to stop when stop

    const startCoords = await geocode(startLocation);
    if (!startCoords) {
      alert("Impossible de localiser le point de service.");
      setOptimizing(false);
      return;
    }

    const activeCollectes = collections.filter(c => c.statut === 'EN_COURS');
    const otherCollectes = collections.filter(c => c.statut !== 'EN_COURS');

    if (activeCollectes.length === 0) {
      alert("Vous n'avez aucune collecte EN COURS à optimiser.");
      setOptimizing(false);
      return;
    }

    const geocodedCollectes = [];
    for (const c of activeCollectes) {
      const coords = await geocode(c.localisation);
      await new Promise(r => setTimeout(r, 1000)); // nominatim policy to not spam requests
      geocodedCollectes.push({ ...c, coords: coords || startCoords });
    }

    let currentLoc = startCoords;
    let unvisited = [...geocodedCollectes];
    const sorted = [];

    while (unvisited.length > 0) {
      let nearestIdx = 0;
      let minD = calculateDistance(currentLoc.lat, currentLoc.lon, unvisited[0].coords.lat, unvisited[0].coords.lon);

      for (let i = 1; i < unvisited.length; i++) {
        const d = calculateDistance(currentLoc.lat, currentLoc.lon, unvisited[i].coords.lat, unvisited[i].coords.lon);
        if (d < minD) {
          minD = d;
          nearestIdx = i;
        }
      }

      currentLoc = unvisited[nearestIdx].coords;
      sorted.push(unvisited[nearestIdx]);
      unvisited.splice(nearestIdx, 1);
    }

    //clean the sorted list of coords and merge back to ui. ex: 2,3,1 return in order 1,2,3 to ui
    const cleanSorted = sorted.map(({ coords, ...rest }) => ({ ...rest, optimized: true }));
    setCollections([...cleanSorted, ...otherCollectes]);
    setOptimizing(false); //stop calling this function
  };

  const activeTours = collections.filter(c => c.statut === 'EN_COURS');
  const availableTours = collections.filter(c => c.statut === 'EN_ATTENTE');
  const historyTours = collections.filter(c => c.statut === 'TERMINE');

  const renderCard = (collecte, index, isOptimizedList = false) => (
    <div key={collecte.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', border: collecte.optimized ? '2px solid var(--accent-color)' : '1px solid var(--card-border)' }}>
      {isOptimizedList && (
        <div style={{ background: 'var(--accent-color)', color: '#000', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: '1rem' }}>
          {index + 1}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--primary-color)' }}>{collecte.typeDechet || collecte.type}</h3>
        <span style={{
          background: collecte.statut === 'EN_COURS' ? 'var(--accent-color)' : collecte.statut === 'TERMINE' ? 'var(--primary-color)' : 'rgba(16, 185, 129, 0.2)',
          color: collecte.statut === 'TERMINE' ? '#fff' : collecte.statut === 'EN_COURS' ? '#000' : 'var(--primary-color)',
          padding: '0.25rem 0.75rem',
          borderRadius: '999px',
          fontSize: '0.875rem',
          fontWeight: 'bold'
        }}>
          {collecte.statut}
        </span>
      </div>

      <div style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
        <p style={{ marginBottom: '0.5rem' }}><strong>Quantité :</strong> {collecte.quantite} kg</p>
        <p><strong>Lieu :</strong> {collecte.localisation}</p>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
        {collecte.statut === 'EN_ATTENTE' && (
          <button
            onClick={() => handleAccept(collecte.id)}
            disabled={actionLoadingId === collecte.id}
            className="btn btn-primary"
            style={{ flex: 1, padding: '0.5rem', opacity: actionLoadingId === collecte.id ? 0.7 : 1 }}
          >
            {actionLoadingId === collecte.id ? 'Chargement...' : 'Prendre en charge'}
          </button>
        )}
        {collecte.statut === 'EN_COURS' && (
          <button onClick={() => handleValidate(collecte.id)} className="btn btn-outline" style={{ flex: 1, padding: '0.5rem', borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }}>
            Valider (Terminé)
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2>Espace Collecteur</h2>
        {activeTours.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <select
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                className="form-control"
                style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'var(--text-primary)' }}
              >
                <option value="Salaberry-de-Valleyfield, QC">Valleyfield</option>
                <option value="Montréal, QC">Montréal</option>
                <option value="Vaudreuil-Dorion, QC">Vaudreuil</option>
              </select>
            </div>
            <button
              onClick={optimizeTour}
              disabled={optimizing}
              className="btn btn-primary"
              style={{ background: 'var(--accent-color)', color: '#000', whiteSpace: 'nowrap' }}
            >
              {optimizing ? 'Calcul en cours...' : 'Optimiser le trajet'}
            </button>
          </div>
        )}
      </div>

      {error && <div style={{ background: 'var(--danger-color)', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>}

      {loading ? (
        <p>Chargement de vos tournées...</p>
      ) : (
        <>
          {/* Active Tours */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Tournées Actives (En cours)</h3>
            {activeTours.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>Aucune collecte en cours. Prenez-en charge une ci-dessous !</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {activeTours.map((c, idx) => renderCard(c, idx, c.optimized))}
              </div>
            )}
          </div>

          {/* Available Tours */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Collectes Disponibles (En attente)</h3>
            {availableTours.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>Aucune collecte en attente pour le moment.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {availableTours.map((c, idx) => renderCard(c, idx, false))}
              </div>
            )}
          </div>

          {/* History Tours */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Historique (Terminé)</h3>
            {historyTours.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>Vous n'avez pas encore terminé de collecte.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {historyTours.map((c, idx) => renderCard(c, idx, false))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CollectorDashboard;
