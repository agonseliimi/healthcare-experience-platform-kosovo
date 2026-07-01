package com.kosovo.healthcareexperience.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kosovo.healthcareexperience.dto.experience.ExperienceResponse;
import com.kosovo.healthcareexperience.dto.report.ReportResponse;
import com.kosovo.healthcareexperience.dto.verification.VerificationResponse;
import com.kosovo.healthcareexperience.entity.User;
import com.kosovo.healthcareexperience.enums.ExperienceStatus;
import com.kosovo.healthcareexperience.exception.BadRequestException;
import com.kosovo.healthcareexperience.service.AdminService;
import com.kosovo.healthcareexperience.service.ExperienceService;
import com.kosovo.healthcareexperience.service.ReportService;
import com.kosovo.healthcareexperience.service.UserService;
import com.kosovo.healthcareexperience.service.VerificationService;

/** Admin-only aggregate + moderation endpoints. */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final ReportService reportService;
    private final VerificationService verificationService;
    private final ExperienceService experienceService;
    private final UserService userService;

    public AdminController(AdminService adminService,
                          ReportService reportService,
                          VerificationService verificationService,
                          ExperienceService experienceService,
                          UserService userService) {
        this.adminService = adminService;
        this.reportService = reportService;
        this.verificationService = verificationService;
        this.experienceService = experienceService;
        this.userService = userService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    @GetMapping("/reports")
    public ResponseEntity<List<ReportResponse>> reports() {
        return ResponseEntity.ok(reportService.getAll());
    }

    @GetMapping("/verification-requests")
    public ResponseEntity<List<VerificationResponse>> verificationRequests() {
        return ResponseEntity.ok(verificationService.getAll());
    }

    // Body: { "status": "HIDDEN" }.
    @PatchMapping("/experiences/{id}/status")
    public ResponseEntity<ExperienceResponse> updateExperienceStatus(@PathVariable Long id,
                                                                     @RequestBody Map<String, String> body) {
        String raw = body.get("status");
        if (raw == null) {
            throw new BadRequestException("'status' is required.");
        }
        ExperienceStatus status;
        try {
            status = ExperienceStatus.valueOf(raw.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid experience status.");
        }
        return ResponseEntity.ok(experienceService.updateStatus(id, status));
    }

    // Body: { "trustScore": 65 }.
    @PatchMapping("/users/{id}/trust")
    public ResponseEntity<Map<String, Object>> updateUserTrust(@PathVariable Long id,
                                                               @RequestBody Map<String, Object> body) {
        Object raw = body.get("trustScore");
        if (raw == null) {
            throw new BadRequestException("'trustScore' is required.");
        }
        int trustScore;
        try {
            trustScore = (int) Double.parseDouble(raw.toString());
        } catch (NumberFormatException ex) {
            throw new BadRequestException("'trustScore' must be a number.");
        }
        User user = userService.updateTrustScore(id, trustScore);
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "trustScore", user.getTrustScore(),
                "trustLabel", userService.trustLabel(user.getTrustScore())));
    }
}
