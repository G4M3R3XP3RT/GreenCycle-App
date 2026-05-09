-- Insertion des Utilisateurs
-- Mot de passe (en clair pour l'exemple, normalement hashé)
INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role, points_ecologiques)
VALUES
    ('Martin', 'Jean', 'jean.martin@example.com', 'securePass123', 'USER', 150),
    ('Sow', 'Oumar', 'oumar.sow@example.com', 'SuperSecurePass754@-&', 'USER', 1389),
    ('Dubois', 'Sophie', 'sophie.dubois@example.com', 'pass456', 'USER', 45),
    ('RecycleService', 'Admin', 'contact@recycleservice.com', 'adminPass789', 'COLLECTOR', 0),
    ('Admin', 'System', 'admin@greencycle.org', 'rootAdmin', 'ADMIN', 0);

-- Insertion des Collectes
INSERT INTO collectes (type_dechet, quantite, localisation, statut, citoyen_id, collecteur_id)
VALUES
    ('PLASTIQUE', 5.5, '12 Rue des Lilas, Paris', 'TERMINE', 1, 3),
    ('VERRE', 12.0, '45 Avenue de la République, Lyon', 'EN_COURS', 2, 3),
    ('PAPIER', 2.0, '8 Boulevard Haussmann, Paris', 'EN_ATTENTE', 1, NULL),
    ('METAL', 3.5, '23 Rue de la Paix, Nantes', 'EN_ATTENTE', 2, NULL);
