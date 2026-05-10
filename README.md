# 🌱 GreenCycle - Backend API

Bienvenue sur le dépôt du Backend de **GreenCycle**, l'application qui gamifie le recyclage et récompense les actions écologiques !

## 1. Prérequis
- Java 17 ou version supérieure
- Maven 3.6 ou version supérieure
- Un IDE Java (IntelliJ IDEA recommandé)
- **Ollama** installé avec le modèle `gemma4:e2b` (ou modifiez `application.properties` pour utiliser un autre modèle comme `llama3`).

## 2. Installation
1. Cloner le dépôt Git : `git clone <url-du-dépôt>`
2. Ouvrir le projet dans l'IDE.
3. Lancer la commande `mvn clean install` pour installer les dépendances.
4. Lancer l'application via votre IDE ou avec la commande (Windows) : `.\mvnw.cmd spring-boot:run` ou (Mac/Linux) : `mvn spring-boot:run`

## 3. Configuration
- **Base de données** : Le projet utilise **MariaDB / MySQL** en production (hébergé sur Alwaysdata). La configuration JDBC est gérée dans le fichier `application.properties`. La persistance des données est maintenant assurée entre les redémarrages.
- **Ollama** : L'URL par défaut est `http://localhost:11434`.

## 4. Endpoints de l'API Principale
*Toutes les routes (sauf l'authentification) nécessitent un Header `Authorization: Bearer <votre_token_jwt>`.*

**Authentification :**
- `POST /api/auth/register` : Enregistrement d'un nouvel utilisateur
- `POST /api/auth/login` : Connexion et récupération du Token JWT

**Citoyens (Rôle : USER) :**
- `POST /api/collectes` : Signaler une nouvelle collecte de déchets
- `GET /api/leaderboard` : Consulter le classement des meilleurs recycleurs

**Collecteurs (Rôle : COLLECTOR) :**
- `GET /api/collectes/mes-tournees` : Obtenir toutes les collectes pertinentes (en attente + celles assignées au collecteur)
- `PUT /api/collectes/{id}/accepter` : Prendre en charge une collecte
- `PUT /api/collectes/{id}/valider` : Confirmer le ramassage et attribuer les GreenPoints au citoyen

**Intelligence Artificielle :**
- `POST /api/chat` : Poser une question écologique à l'assistant GreenCycle (Body : `{"message": "..."}`)

## 5. Identifiants de Test (Préchargés)
La base de données contient déjà des utilisateurs pour faciliter vos tests :

- **Citoyens (Rôle: USER)**
  - Email : `jean.martin@example.com` | Mot de passe : `securePass123`
  - Email : `oumar.sow@example.com` | Mot de passe : `SuperSecurePass754@-&` (Top du leaderboard !)
  - Email : `sophie.dubois@example.com` | Mot de passe : `pass456`

- **Collecteur (Rôle: COLLECTOR)**
  - Email : `contact@recycleservice.com` | Mot de passe : `adminPass789`

- **Administrateur (Rôle: ADMIN)**
  - Email : `admin@greencycle.org` | Mot de passe : `rootAdmin`