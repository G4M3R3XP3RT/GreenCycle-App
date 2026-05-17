import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

//Register page
const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    prenom: '',
    nom: '',
    role: 'USER' //par defaut
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.register(formData);
      login(response.data.token); //autologin and store jwt token locally in web browser (localstorage) 

      // redirect based on role selection instead of doing a pull db on user cuz redundant (i know not based)
      if (formData.role === 'COLLECTOR') {
        navigate('/collector');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      let errorMessage = "Erreur lors de l'inscription. Veuillez vérifier vos informations.";
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.errors) {
          // for spring validation errors
          errorMessage = Object.values(err.response.data.errors).join(', ');
        } else {
          errorMessage = JSON.stringify(err.response.data);
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '600px', paddingTop: '4rem' }}>
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Rejoignez GreenCycle</h2>

        {error && <div style={{ background: 'var(--danger-color)', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Prénom</label>
              <input
                type="text"
                name="prenom"
                className="form-control"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nom</label>
              <input
                type="text"
                name="nom"
                className="form-control"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Rôle</label>
            <select
              name="role"
              className="form-control"
              value={formData.role}
              onChange={handleChange}
              style={{ background: 'var(--bg-color)' }}
            >
              <option value="USER">Citoyen (Recycleur)</option>
              <option value="COLLECTOR">Collecteur</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Créer mon compte
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
          Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
