package com.project.greencycle.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CollectorDashboardResponse {
    private List<CollecteResponse> disponibles; // EN_ATTENTE
    private List<CollecteResponse> actives;     // EN_COURS
    private List<CollecteResponse> historique;  // TERMINE
}
