package com.kosovo.healthcareexperience.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.kosovo.healthcareexperience.entity.Experience;
import com.kosovo.healthcareexperience.entity.User;
import com.kosovo.healthcareexperience.enums.ExperienceStatus;

/**
 * JpaSpecificationExecutor lets us build dynamic filter queries
 * (search, city, category, cost range, ...) in ExperienceService.
 */
public interface ExperienceRepository
        extends JpaRepository<Experience, Long>, JpaSpecificationExecutor<Experience> {

    List<Experience> findByAuthor(User author);

    long countByStatus(ExperienceStatus status);
}
