# Projet : GreenCycle

**Objectif :** Développer une plateforme communautaire de gestion du recyclage et de l'économie circulaire, permettant aux utilisateurs de suivre leur impact écologique et de gérer des collectes de déchets recyclables.

## 1. Fonctionnalités Principales

*   **Gestion des Utilisateurs (Citoyens et Collecteurs) :**
    *   Inscription et authentification sécurisée (JWT).
    *   Profil utilisateur avec suivi des points écologiques accumulés ("GreenPoints").
*   **Gestion des Collectes de Déchets (Assistée par IA) :**
    *   **Classification Automatique :** Identification du type de déchet (plastique, verre, métal) via analyse d'image par IA.
    *   **Chatbot d'Assistance :** Un assistant textuel pour répondre aux questions des utilisateurs sur le tri (ex: "Où jeter mes piles ?") et l'impact écologique.
    *   Signalement de déchets recyclables (type, quantité, localisation).
    *   **Optimisation des Tournées :** Algorithme prédictif pour suggérer aux collecteurs les trajets les plus courts et écologiques.
    *   Suivi d'état : `EN_ATTENTE`, `EN_COURS`, `TERMINE`.
*   **Système de Récompenses (Gamification) :**
    *   Attribution de points lors de la validation d'une collecte.
    *   Leaderboard des utilisateurs les plus actifs.
*   **Tableau de Bord / Statistiques :**
    *   API fournissant les statistiques globales et personnelles (kg recyclés, CO2 économisé).

## 2. Architecture Technique (Spring Boot)

*   **Backend :** Java 17+, Framework Spring Boot 3.
*   **Intelligence Artificielle :**
    *   **Spring AI :** Intégration de modèles de Vision (OpenAI GPT-4o ou modèle local via Ollama) pour la reconnaissance des déchets.
    *   **Algorithmes de Graphe :** Pour l'optimisation des tournées de ramassage.
*   **Persistance :** Spring Data JPA / H2 (Dév) / PostgreSQL (Prod).
*   **Sécurité :** Spring Security + JWT (Rôles : `USER`, `COLLECTOR`, `ADMIN`).
*   **Validation :** Bean Validation (Hibernate Validator).
*   **Documentation :** Swagger / OpenAPI via SpringDoc.
