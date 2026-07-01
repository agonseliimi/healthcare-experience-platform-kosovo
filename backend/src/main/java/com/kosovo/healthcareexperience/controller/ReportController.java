package com.kosovo.healthcareexperience.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kosovo.healthcareexperience.dto.report.ReportRequest;
import com.kosovo.healthcareexperience.dto.report.ReportResponse;
import com.kosovo.healthcareexperience.enums.ReportStatus;
import com.kosovo.healthcareexperience.exception.BadRequestException;
import com.kosovo.healthcareexperience.service.ReportService;

import jakarta.validation.Valid;

/** Moderation reports: users create, admins review. */
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReportResponse> create(@Valid @RequestBody ReportRequest request) {
        return ResponseEntity.ok(reportService.create(request));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReportResponse>> getAll() {
        return ResponseEntity.ok(reportService.getAll());
    }

    // Admin updates report status. Body: { "status": "REVIEWED" }.
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportResponse> updateStatus(@PathVariable Long id,
                                                       @RequestBody Map<String, String> body) {
        String raw = body.get("status");
        if (raw == null) {
            throw new BadRequestException("'status' is required.");
        }
        ReportStatus status;
        try {
            status = ReportStatus.valueOf(raw.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid report status.");
        }
        return ResponseEntity.ok(reportService.updateStatus(id, status));
    }
}
