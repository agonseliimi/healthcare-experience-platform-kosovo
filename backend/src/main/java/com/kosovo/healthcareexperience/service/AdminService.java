package com.kosovo.healthcareexperience.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.kosovo.healthcareexperience.entity.User;
import com.kosovo.healthcareexperience.enums.ExperienceStatus;
import com.kosovo.healthcareexperience.enums.ReportStatus;
import com.kosovo.healthcareexperience.enums.VerificationStatus;
import com.kosovo.healthcareexperience.repository.ExperienceRepository;
import com.kosovo.healthcareexperience.repository.ReportRepository;
import com.kosovo.healthcareexperience.repository.UserRepository;
import com.kosovo.healthcareexperience.repository.VerificationRequestRepository;

/**
 * Aggregated statistics for the admin dashboard.
 */
@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ExperienceRepository experienceRepository;
    private final ReportRepository reportRepository;
    private final VerificationRequestRepository verificationRepository;

    public AdminService(UserRepository userRepository,
                        ExperienceRepository experienceRepository,
                        ReportRepository reportRepository,
                        VerificationRequestRepository verificationRepository) {
        this.userRepository = userRepository;
        this.experienceRepository = experienceRepository;
        this.reportRepository = reportRepository;
        this.verificationRepository = verificationRepository;
    }

    public Map<String, Object> getDashboard() {
        Map<String, Object> stats = new HashMap<>();

        long totalUsers = userRepository.count();
        stats.put("totalUsers", totalUsers);
        stats.put("totalExperiences", experienceRepository.count());
        stats.put("pendingReports", reportRepository.countByStatus(ReportStatus.PENDING));
        stats.put("pendingVerificationRequests",
                verificationRepository.countByStatus(VerificationStatus.PENDING));
        stats.put("hiddenExperiences", experienceRepository.countByStatus(ExperienceStatus.HIDDEN));

        // Average trust score across all users.
        List<User> users = userRepository.findAll();
        double avg = users.isEmpty() ? 0.0
                : users.stream().mapToInt(u -> u.getTrustScore() == null ? 0 : u.getTrustScore()).average().orElse(0.0);
        stats.put("averageTrustScore", Math.round(avg));

        return stats;
    }
}
