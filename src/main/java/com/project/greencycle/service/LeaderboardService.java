package com.project.greencycle.service;

import com.project.greencycle.dto.LeaderboardResponse;
import com.project.greencycle.dto.UserScoreDTO;
import com.project.greencycle.entity.Role;
import com.project.greencycle.entity.Utilisateur;
import com.project.greencycle.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final UtilisateurRepository utilisateurRepository;

    public LeaderboardResponse getLeaderboard() {
        // Fetch top 10 citizens
        List<Utilisateur> top10Users = utilisateurRepository.findTop10ByRoleOrderByPointsEcologiquesDesc(Role.USER);

        List<UserScoreDTO> top10 = IntStream.range(0, top10Users.size())
                .mapToObj(i -> {
                    Utilisateur u = top10Users.get(i);
                    return UserScoreDTO.builder()
                            .id(u.getId())
                            .nom(u.getNom())
                            .prenom(u.getPrenom())
                            .points(u.getPointsEcologiques() != null ? u.getPointsEcologiques() : 0)
                            .rank(i + 1)
                            .build();
                })
                .collect(Collectors.toList());

        // Get current user
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }

        Utilisateur currentUser = utilisateurRepository.findByEmail(username).orElse(null);
        UserScoreDTO currentUserScore = null;

        if (currentUser != null && currentUser.getRole() == Role.USER) {
            int currentPoints = currentUser.getPointsEcologiques() != null ? currentUser.getPointsEcologiques() : 0;
            // Rank is the number of users with STRICTLY MORE points + 1
            int rank = utilisateurRepository.countByRoleAndPointsEcologiquesGreaterThan(Role.USER, currentPoints) + 1;

            currentUserScore = UserScoreDTO.builder()
                    .id(currentUser.getId())
                    .nom(currentUser.getNom())
                    .prenom(currentUser.getPrenom())
                    .points(currentPoints)
                    .rank(rank)
                    .build();
        }

        return LeaderboardResponse.builder()
                .top10(top10)
                .currentUser(currentUserScore)
                .build();
    }
}
