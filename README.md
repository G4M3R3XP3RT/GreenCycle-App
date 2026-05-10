# 🌱 GreenCycle (Monorepo)

Bienvenue sur le dépôt principal de **GreenCycle**, l'application communautaire qui gamifie le recyclage et récompense vos actions écologiques quotidiennes.

Ce dépôt centralise le **Backend** (Spring Boot) et le **Frontend** (React) de l'application.

## 📂 Structure du projet

- **[`/backend`](./backend)** : API REST construite en Java avec Spring Boot 3. Gère la logique métier, l'authentification (JWT), la base de données (MariaDB) et l'IA (Ollama).
- **[`/frontend`](./frontend)** : Interface utilisateur construite en React 18 avec Vite. Design éco-responsable (Glassmorphism, Mode sombre) et communication fluide avec l'API.

## 🚀 Architecture de Production

L'application est configurée pour fonctionner de concert :
- **Backend Port** : `8080`
- **Frontend Port** : `7777`
- **Base de données** : MySQL / MariaDB hébergée sur Alwaysdata.
- **Documentation API** : Swagger UI disponible sur `http://localhost:8080/swagger-ui/index.html` (une fois le backend lancé).

## 🛠️ Lancer l'application en développement

### 1. Démarrer le Backend (API)
Ouvrez un terminal, placez-vous dans le dossier `backend`, et exécutez Spring Boot :
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
*L'API sera disponible sur `http://localhost:8080`.*

### 2. Démarrer le Frontend (UI)
Ouvrez un **deuxième** terminal, placez-vous dans le dossier `frontend`, et lancez Vite :
```bash
cd frontend
npm install
npm run dev
```
*L'application web s'ouvrira sur `http://localhost:7777`.*

---

## 🔑 Identifiants de Test (Déjà en Base de Données)

La base de données MariaDB contient déjà des utilisateurs préconfigurés pour vous permettre de tester les deux rôles de l'application :

**Rôle: Citoyen (USER)** - *Pour signaler des déchets*
- **Email :** `jean.martin@example.com`
- **Mot de passe :** `securePass123`

**Rôle: Collecteur (COLLECTOR)** - *Pour accepter et valider des collectes*
- **Email :** `contact@recycleservice.com`
- **Mot de passe :** `adminPass789`

---

*Chaque sous-dossier (`backend` et `frontend`) contient son propre `README.md` avec des détails techniques plus approfondis spécifiques à sa stack.*
