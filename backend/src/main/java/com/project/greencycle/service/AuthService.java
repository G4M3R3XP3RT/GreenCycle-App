package com.project.greencycle.service;

import org.springframework.beans.factory.annotation.Autowired;

import com.project.greencycle.dto.AuthResponse;
import com.project.greencycle.dto.RegisterRequest;
import com.project.greencycle.entity.Utilisateur;
import com.project.greencycle.repository.UtilisateurRepository;
import com.project.greencycle.security.CustomUserDetails;
import com.project.greencycle.security.JwtUtil;
import com.project.greencycle.dto.LoginRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

        @Autowired
        private UtilisateurRepository repository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Autowired
        private JwtUtil jwtUtil;

        @Autowired
        private AuthenticationManager authenticationManager;

        public AuthResponse register(RegisterRequest request) {
                if (repository.existsByEmail(request.getEmail())) {
                        throw new IllegalArgumentException("Email déjà utilisé");
                }

                var user = Utilisateur.builder()
                                .nom(request.getNom())
                                .prenom(request.getPrenom())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(request.getRole())
                                .pointsEcologiques(0)
                                .build();

                repository.save(user);

                var customUserDetails = new CustomUserDetails(user);
                var jwtToken = jwtUtil.generateToken(customUserDetails);

                return AuthResponse.builder()
                                .token(jwtToken)
                                .message("Inscription réussie")
                                .build();
        }

        public AuthResponse login(LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                var user = repository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new IllegalArgumentException("Email ou mot de passe incorrect"));

                var customUserDetails = new CustomUserDetails(user);
                var jwtToken = jwtUtil.generateToken(customUserDetails);

                return AuthResponse.builder()
                                .token(jwtToken)
                                .message("Connexion réussie")
                                .build();
        }
}
