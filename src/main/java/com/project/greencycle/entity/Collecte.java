package com.project.greencycle.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "collectes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Collecte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type_dechet", nullable = false, length = 255)
    private String typeDechet;

    @Column(nullable = false)
    private Double quantite;

    @Column(nullable = false, length = 255)
    private String localisation;

    @Column(name = "date_signalement")
    @Builder.Default
    private LocalDateTime dateSignalement = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private StatutCollecte statut = StatutCollecte.EN_ATTENTE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citoyen_id")
    private Utilisateur citoyen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collecteur_id")
    private Utilisateur collecteur;
}
