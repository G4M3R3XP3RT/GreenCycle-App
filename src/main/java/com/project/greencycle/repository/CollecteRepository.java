package com.project.greencycle.repository;

import com.project.greencycle.entity.Collecte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CollecteRepository extends JpaRepository<Collecte, Long> {
}
