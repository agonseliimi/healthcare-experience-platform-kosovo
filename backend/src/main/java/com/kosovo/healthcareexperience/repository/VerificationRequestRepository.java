package com.kosovo.healthcareexperience.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kosovo.healthcareexperience.entity.User;
import com.kosovo.healthcareexperience.entity.VerificationRequest;
import com.kosovo.healthcareexperience.enums.VerificationStatus;

public interface VerificationRequestRepository extends JpaRepository<VerificationRequest, Long> {
    List<VerificationRequest> findByUser(User user);
    long countByStatus(VerificationStatus status);
}
