package com.project.greencycle.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CollecteRequest {

    @NotBlank(message = "Le type de déchet est obligatoire")
    private String typeDechet;

    @NotNull(message = "La quantité est obligatoire")
    @Positive(message = "La quantité doit être supérieure à 0")
    private Double quantite;

    @NotBlank(message = "La localisation est obligatoire")
    private String localisation;
}
