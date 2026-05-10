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
import java.util.List;
import java.util.stream.Collectors;

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

        return mapToResponse(collecte);
    }

    public List<CollecteResponse> getCollectesEnAttente() {
        return collecteRepository.findByStatut(StatutCollecte.EN_ATTENTE).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<CollecteResponse> getMesTournees() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }

        List<Collecte> enAttente = collecteRepository.findByStatut(StatutCollecte.EN_ATTENTE);
        List<Collecte> mesCollectes = collecteRepository.findByCollecteurEmail(username);

        // Combine both lists
        enAttente.addAll(mesCollectes);

        return enAttente.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<CollecteResponse> getMesCollectes() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }

        return collecteRepository.findByCitoyenEmail(username).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CollecteResponse accepterCollecte(Long id) {
        Collecte collecte = collecteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Collecte non trouvée"));

        if (collecte.getStatut() != StatutCollecte.EN_ATTENTE) {
            throw new IllegalArgumentException("La collecte n'est pas en attente");
        }

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }

        Utilisateur collecteur = utilisateurRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("Collecteur non trouvé"));

        collecte.setStatut(StatutCollecte.EN_COURS);
        collecte.setCollecteur(collecteur);

        collecte = collecteRepository.save(collecte);
        return mapToResponse(collecte);
    }

    public CollecteResponse validerCollecte(Long id) {
        Collecte collecte = collecteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Collecte non trouvée"));

        if (collecte.getStatut() != StatutCollecte.EN_COURS) {
            throw new IllegalArgumentException("La collecte n'est pas en cours de traitement");
        }

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }

        if (collecte.getCollecteur() == null || !collecte.getCollecteur().getEmail().equals(username)) {
            throw new IllegalArgumentException("Vous n'êtes pas le collecteur assigné à cette collecte");
        }

        collecte.setStatut(StatutCollecte.TERMINE);

        // Attribution des points (10 points par kg)
        int pointsGagnes = (int) Math.round(collecte.getQuantite() * 10);

        if (collecte.getCitoyen() != null) {
            Utilisateur citoyen = collecte.getCitoyen();
            if (citoyen.getPointsEcologiques() == null) {
                citoyen.setPointsEcologiques(0);
            }
            citoyen.setPointsEcologiques(citoyen.getPointsEcologiques() + pointsGagnes);
            utilisateurRepository.save(citoyen);
        }

        collecte = collecteRepository.save(collecte);
        return mapToResponse(collecte);
    }

    private CollecteResponse mapToResponse(Collecte collecte) {
        return CollecteResponse.builder()
                .id(collecte.getId())
                .typeDechet(collecte.getTypeDechet())
                .quantite(collecte.getQuantite())
                .localisation(collecte.getLocalisation())
                .dateSignalement(collecte.getDateSignalement())
                .statut(collecte.getStatut())
                .citoyenId(collecte.getCitoyen() != null ? collecte.getCitoyen().getId() : null)
                .build();
    }
}
