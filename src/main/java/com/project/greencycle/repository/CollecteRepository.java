package com.project.greencycle.repository;

import com.project.greencycle.entity.Collecte;
import com.project.greencycle.entity.StatutCollecte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollecteRepository extends JpaRepository<Collecte, Long> {
    List<Collecte> findByStatut(StatutCollecte statut);
}
