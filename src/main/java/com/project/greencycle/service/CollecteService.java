package com.project.greencycle.service;

import com.project.greencycle.dto.CollecteRequest;
import com.project.greencycle.dto.CollecteResponse;
import com.project.greencycle.entity.Collecte;
import com.project.greencycle.entity.StatutCollecte;
import com.project.greencycle.entity.Utilisateur;
import com.project.greencycle.repository.CollecteRepository;
import com.project.greencycle.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CollecteService {

    private final CollecteRepository collecteRepository;
    private final UtilisateurRepository utilisateurRepository;

    public CollecteResponse creerCollecte(CollecteRequest request) {
        // Get currently authenticated user
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }

        Utilisateur citoyen = utilisateurRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));

        Collecte collecte = Collecte.builder()
                .typeDechet(request.getTypeDechet())
                .quantite(request.getQuantite())
                .localisation(request.getLocalisation())
                .statut(StatutCollecte.EN_ATTENTE)
                .dateSignalement(LocalDateTime.now())
                .citoyen(citoyen)
                .build();

        collecte = collecteRepository.save(collecte);

        return CollecteResponse.builder()
                .id(collecte.getId())
                .typeDechet(collecte.getTypeDechet())
                .quantite(collecte.getQuantite())
                .localisation(collecte.getLocalisation())
                .dateSignalement(collecte.getDateSignalement())
                .statut(collecte.getStatut())
                .citoyenId(citoyen.getId())
                .build();
    }
}
