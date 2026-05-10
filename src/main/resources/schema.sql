-- Suppression des tables si elles existent (pour H2)
DROP TABLE IF EXISTS collectes;
DROP TABLE IF EXISTS utilisateurs;

-- Table des Utilisateurs
CREATE TABLE utilisateurs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- USER, COLLECTOR, ADMIN
    points_ecologiques INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des Collectes
CREATE TABLE collectes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type_dechet VARCHAR(255) NOT NULL, -- Texte libre
    quantite DOUBLE NOT NULL, -- en kg
    localisation VARCHAR(255) NOT NULL,
    date_signalement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'EN_ATTENTE', -- EN_ATTENTE, EN_COURS, TERMINE
    citoyen_id BIGINT,
    collecteur_id BIGINT,
    FOREIGN KEY (citoyen_id) REFERENCES utilisateurs(id),
    FOREIGN KEY (collecteur_id) REFERENCES utilisateurs(id)
);
