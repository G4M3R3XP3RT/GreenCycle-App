package com.project.greencycle.controller;

import com.project.greencycle.dto.CollecteRequest;
import com.project.greencycle.dto.CollecteResponse;
import com.project.greencycle.service.CollecteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/collectes")
@RequiredArgsConstructor
public class CollecteController {

    private final CollecteService collecteService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CollecteResponse> creerCollecte(@Valid @RequestBody CollecteRequest request) {
        return new ResponseEntity<>(collecteService.creerCollecte(request), HttpStatus.CREATED);
    }
}
