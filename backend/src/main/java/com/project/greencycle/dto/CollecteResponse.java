package com.project.greencycle.dto;

import com.project.greencycle.entity.StatutCollecte;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CollecteResponse {
    private Long id;
    private String typeDechet;
    private Double quantite;
    private String localisation;
    private LocalDateTime dateSignalement;
    private StatutCollecte statut;
    private Long citoyenId;
}
