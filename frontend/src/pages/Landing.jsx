import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { user } = useAuth();
  
  let mainActionLink = "/register";
  let mainActionText = "Commencer maintenant";
  
  if (user) {
    const isCollector = user?.role === 'COLLECTOR' || (user?.roles && user.roles.includes('COLLECTOR'));
    mainActionLink = isCollector ? "/collector" : "/dashboard";
    mainActionText = "Aller au Tableau de bord";
  }

  return (
    <div className="container animate-fade-in" style={{ textAlign: 'center', paddingTop: '4rem', paddingBottom: '4rem' }}>
      <h1 className="text-gradient" style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
        Transformez vos déchets en récompenses
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: '1.6' }}>
        GreenCycle gamifie le recyclage. Suivez votre impact écologique, gagnez des GreenPoints et grimpez dans le classement tout en contribuant à une planète plus propre.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '5rem' }}>
        <Link to={mainActionLink} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
          {mainActionText}
        </Link>
        <Link to="/leaderboard" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
          Voir le classement
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="glass-panel delay-100" style={{ padding: '2rem', textAlign: 'left' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>♻️</div>
          <h3>Tri Intelligent</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Notre assistant IA vous aide à savoir exactement où jeter chaque type de déchet. Demandez-lui !
          </p>
        </div>
        
        <div className="glass-panel delay-200" style={{ padding: '2rem', textAlign: 'left' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏆</div>
          <h3>Gagnez des GreenPoints</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Chaque collecte validée vous rapporte des points. Concourez avec votre communauté pour devenir le meilleur éco-citoyen.
          </p>
        </div>
        
        <div className="glass-panel delay-300" style={{ padding: '2rem', textAlign: 'left' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚚</div>
          <h3>Collectes Optimisées</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Les collecteurs bénéficient d'itinéraires optimisés, réduisant l'empreinte carbone tout en gardant la ville propre.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
