package com.kosovo.healthcareexperience.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kosovo.healthcareexperience.dto.report.ReportRequest;
import com.kosovo.healthcareexperience.dto.report.ReportResponse;
import com.kosovo.healthcareexperience.entity.Experience;
import com.kosovo.healthcareexperience.entity.Report;
import com.kosovo.healthcareexperience.entity.User;
import com.kosovo.healthcareexperience.enums.ReportStatus;
import com.kosovo.healthcareexperience.exception.BadRequestException;
import com.kosovo.healthcareexperience.exception.ResourceNotFoundException;
import com.kosovo.healthcareexperience.repository.ReportRepository;
import com.kosovo.healthcareexperience.repository.UserRepository;

/**
 * Handles user-submitted moderation reports and admin review actions.
 */
@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final ExperienceService experienceService;
    private final TrustScoreService trustScoreService;

    public ReportService(ReportRepository reportRepository,
                         UserRepository userRepository,
                         UserService userService,
                         ExperienceService experienceService,
                         TrustScoreService trustScoreService) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.experienceService = experienceService;
        this.trustScoreService = trustScoreService;
    }

    public ReportResponse create(ReportRequest request) {
        if (request.getExperienceId() == null && request.getReportedUserId() == null) {
            throw new BadRequestException("A report must reference an experience or a user.");
        }

        User reporter = userService.getCurrentUser();

        Report report = new Report();
        report.setReporter(reporter);
        report.setReason(request.getReason());
        report.setExplanation(request.getExplanation());
        report.setStatus(ReportStatus.PENDING);

        User reportedUser = null;

        if (request.getExperienceId() != null) {
            Experience experience = experienceService.getEntity(request.getExperienceId());
            report.setExperience(experience);
            reportedUser = experience.getAuthor();
        }

        if (request.getReportedUserId() != null) {
            reportedUser = userRepository.findById(request.getReportedUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Reported user not found."));
        }

        if (reportedUser != null) {
            report.setReportedUser(reportedUser);
            // Increase the reported user's counter and lower their trust score.
            reportedUser.setReportsReceived(nz(reportedUser.getReportsReceived()) + 1);
            trustScoreService.recalculate(reportedUser);
        }

        reportRepository.save(report);
        return toResponse(report);
    }

    public List<ReportResponse> getAll() {
        return reportRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<Report> findByStatus(ReportStatus status) {
        return reportRepository.findByStatus(status);
    }

    public ReportResponse updateStatus(Long id, ReportStatus status) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + id));
        report.setStatus(status);
        reportRepository.save(report);
        return toResponse(report);
    }

    private int nz(Integer v) {
        return v == null ? 0 : v;
    }

    public ReportResponse toResponse(Report report) {
        ReportResponse r = new ReportResponse();
        r.setId(report.getId());
        r.setReason(report.getReason());
        r.setExplanation(report.getExplanation());
        r.setStatus(report.getStatus());
        r.setCreatedAt(report.getCreatedAt());
        if (report.getExperience() != null) {
            r.setExperienceId(report.getExperience().getId());
        }
        if (report.getReportedUser() != null) {
            r.setReportedUserId(report.getReportedUser().getId());
            r.setReportedUserDisplayName(report.getReportedUser().getDisplayName());
        }
        if (report.getReporter() != null) {
            r.setReporterId(report.getReporter().getId());
            r.setReporterDisplayName(report.getReporter().getDisplayName());
        }
        return r;
    }
}
