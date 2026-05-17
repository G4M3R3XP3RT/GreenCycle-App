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
3. **Important :** Avant de compiler ou lancer le projet, vous **devez** définir vos identifiants de base de données en tant que variables d'environnement (voir la section **Configuration** ci-dessous). Sans ces identifiants, la compilation (`mvn clean install`) et l'exécution (`mvn spring-boot:run`) échoueront.
4. Lancer la commande `mvn clean install` pour installer les dépendances et compiler le projet.
5. Lancer l'application via votre IDE ou avec la commande (Windows) : `.\mvnw.cmd spring-boot:run` ou (Mac/Linux) : `mvn spring-boot:run`

## 3. Configuration
- **Base de données** : Le projet est configuré pour utiliser **MySQL / MariaDB**. Vous devez utiliser votre propre base de données. Pour cela, exportez simplement vos identifiants dans votre terminal avant de lancer le projet :
  ```bash
  export DB_URL="jdbc:mariadb://votre_serveur/votre_base"
  export DB_USERNAME="votre_utilisateur"
  export DB_PASSWORD="votre_mot_de_passe"
  ```
  *Note : Des fichiers de base (`schema.sql` et/ou `data.sql`) sont disponibles dans le dossier `src/main/resources/`. Vous êtes libre de les utiliser pour initialiser facilement votre base de données locale ou distante !*
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

## 6. Exemples de Requêtes (Postman)

### A. Se connecter (Obtenir le Token JWT)
**Requête :** `POST http://localhost:8080/api/auth/login`  
**Headers :** `Content-Type: application/json`  
**Body (JSON) :**
```json
{
  "email": "jean.martin@example.com",
  "password": "securePass123"
}
```
*Copiez le champ `token` reçu dans la réponse pour les appels suivants.*

### B. Signaler une collecte (Rôle: USER)
**Requête :** `POST http://localhost:8080/api/collectes`  
**Headers :** 
- `Content-Type: application/json`
- `Authorization: Bearer <VOTRE_TOKEN>`  
**Body (JSON) :**
```json
{
  "typeDechet": "Vieux câbles et ordinateurs",
  "quantite": 5.5,
  "localisation": "123 Rue de la Nature, Montréal"
}
```

### C. Poser une question au Chatbot IA
**Requête :** `POST http://localhost:8080/api/chat`  
**Headers :** 
- `Content-Type: application/json`
- `Authorization: Bearer <VOTRE_TOKEN>`  
**Body (JSON) :**
```json
{
  "message": "Où dois-je jeter mes piles usagées ?"
}
```

### D. Voir le Leaderboard
**Requête :** `GET http://localhost:8080/api/leaderboard`  
**Headers :** 
- `Authorization: Bearer <VOTRE_TOKEN>`  
*(Aucun Body requis)*