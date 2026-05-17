-- Insertion des Utilisateurs
-- Mot de passe (en clair pour l'exemple, normalement hashé)
INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role, points_ecologiques)
VALUES
    ('Martin', 'Jean', 'jean.martin@example.com', '$2a$10$n9R.0fcQY709.D9WRjtvpe7EETb/D6bKPVG7EPSIwapeegd7LXXsy', 'USER', 150),
    ('Sow', 'Oumar', 'oumar.sow@example.com', '$2a$10$x.KIlWOQx1R9lFkxHCAngueXJ0Xi0LLDa3i23NZfn3JwBbdd72CMG', 'USER', 155),
    ('Dubois', 'Sophie', 'sophie.dubois@example.com', '$2a$10$CjWANgUPjJvoRJkZ7dN4aePzNQvp.cuCWaHPgBPAEfur5jM7DGq5e', 'USER', 45),
    ('RecycleService', 'Admin', 'contact@recycleservice.com', '$2a$10$KY2r1kApYEXrEj6deDDWiuQXyvptcnXkdUzBEAQsRi3Wrwo6yKOca', 'COLLECTOR', 0),
    ('Admin', 'System', 'admin@greencycle.org', '$2a$10$jK5WqX/I8fVGbl2.tyoPwe/mfGrfmaqx8P2Dtd6R.AKoHyKX50VVy', 'ADMIN', 0);

-- Insertion des Collectes
INSERT INTO collectes (type_dechet, quantite, localisation, statut, citoyen_id, collecteur_id)
VALUES
    ('PLASTIQUE', 5.5, '12 Rue des Lilas, Paris', 'TERMINE', 1, 3),
    ('VERRE', 12.0, '45 Avenue de la République, Lyon', 'EN_COURS', 2, 3),
    ('PAPIER', 2.0, '8 Boulevard Haussmann, Paris', 'EN_ATTENTE', 1, NULL),
    ('METAL', 3.5, '23 Rue de la Paix, Nantes', 'EN_ATTENTE', 2, NULL);
