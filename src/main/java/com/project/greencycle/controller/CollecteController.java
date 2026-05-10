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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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

    @GetMapping("/en-attente")
    @PreAuthorize("hasRole('COLLECTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<CollecteResponse>> getCollectesEnAttente() {
        return ResponseEntity.ok(collecteService.getCollectesEnAttente());
    }

    @PutMapping("/{id}/accepter")
    @PreAuthorize("hasRole('COLLECTOR') or hasRole('ADMIN')")
    public ResponseEntity<CollecteResponse> accepterCollecte(@PathVariable Long id) {
        return ResponseEntity.ok(collecteService.accepterCollecte(id));
    }
}
