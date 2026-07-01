package com.kosovo.healthcareexperience.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kosovo.healthcareexperience.entity.Experience;
import com.kosovo.healthcareexperience.entity.User;
import com.kosovo.healthcareexperience.entity.Vote;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByUserAndExperience(User user, Experience experience);
}
