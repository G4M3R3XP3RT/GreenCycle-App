package com.project.greencycle.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserScoreDTO {
    private Long id;
    private String nom;
    private String prenom;
    private int points;
    private int rank;
}
