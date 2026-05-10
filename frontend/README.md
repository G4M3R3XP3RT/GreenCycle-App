# 🌱 GreenCycle - Frontend React

Ce dépôt contient le code source de l'application frontend React pour **GreenCycle**, une plateforme communautaire de gestion du recyclage et de l'économie circulaire.

## Fonctionnalités 🚀

- **Gamification du Recyclage** : Gagnez des GreenPoints à chaque collecte validée et participez au classement communautaire.
- **Tableau de Bord Citoyen** : Signalez vos déchets (plastique, verre, métal, etc.) et suivez l'avancement de la collecte.
- **Espace Collecteur & TSP** : Visualisez et prenez en charge les collectes, et utilisez l'algorithme "du plus proche voisin" (TSP) via l'API Nominatim pour optimiser votre tournée routière.
- **Assistant IA** : Demandez de l'aide à notre chatbot intégré pour optimiser votre tri.
- **UI Premium et Éco-responsable** : Design moderne avec Glassmorphism et Mode Sombre par défaut pour une expérience optimale et moins énergivore.

## Technologies Utilisées 🛠️

- **React 18** via **Vite** (Rapidité et HMR)
- **React Router DOM v6** (Gestion des routes et de la navigation)
- **Axios** (Communication API)
- **JWT-Decode** (Gestion des sessions utilisateurs)
- **CSS Vanilla** (Aucun framework CSS lourd, performances optimisées)

## Installation et Démarrage 💻

### Prérequis
- Node.js (v16 ou supérieure)
- Le backend GreenCycle opérationnel sur le port `8080`.

### Lancer le projet en local

1. Clonez ce dépôt ou rendez-vous dans le dossier du projet :
   ```bash
   cd GreenCycle-Frontend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Lancez le serveur de développement Vite :
   ```bash
   npm run dev
   ```

4. Ouvrez votre navigateur sur `http://localhost:7777`. Le proxy redirigera automatiquement les requêtes `/api` vers le backend Spring Boot.

## Architecture 📂

```
src/
├── assets/          # Images et icônes
├── components/      # Composants réutilisables (Navbar, etc.)
├── context/         # React Context (AuthContext pour l'authentification globale)
├── pages/           # Pages de l'application (Landing, Login, Dashboard, etc.)
├── services/        # Appels API (api.js via Axios)
├── App.jsx          # Configuration du Router et des routes protégées
├── main.jsx         # Point d'entrée de l'application
└── index.css        # Styles globaux, variables CSS et utilitaires
```

## Identifiants de Test 🔑

La base de données (MariaDB) contient déjà des identifiants préchargés par le backend pour faciliter vos tests :

- **Citoyen (Rôle: USER)**
  - Email : `jean.martin@example.com`
  - Mot de passe : `securePass123`

- **Collecteur (Rôle: COLLECTOR)**
  - Email : `contact@recycleservice.com`
  - Mot de passe : `adminPass789`

---

*Fait avec ❤️ pour la planète.*
