package com.kosovo.healthcareexperience.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kosovo.healthcareexperience.dto.verification.VerificationRequestDto;
import com.kosovo.healthcareexperience.dto.verification.VerificationResponse;
import com.kosovo.healthcareexperience.service.VerificationService;

import jakarta.validation.Valid;

/** Optional privacy-first verification workflow. */
@RestController
@RequestMapping("/api/verification")
public class VerificationController {

    private final VerificationService verificationService;

    public VerificationController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }

    // Logged-in user requests verification for one of their experiences.
    @PostMapping("/request")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VerificationResponse> create(@Valid @RequestBody VerificationRequestDto dto) {
        return ResponseEntity.ok(verificationService.create(dto));
    }

    // Logged-in user views their own verification requests.
    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<VerificationResponse>> getMine() {
        return ResponseEntity.ok(verificationService.getMine());
    }

    // Admin views all verification requests.
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<VerificationResponse>> getAll() {
        return ResponseEntity.ok(verificationService.getAll());
    }

    // Admin approves/rejects. Body may include status, adminNote, newVerificationLevel.
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VerificationResponse> updateStatus(@PathVariable Long id,
                                                             @RequestBody VerificationRequestDto dto) {
        return ResponseEntity.ok(verificationService.updateStatus(id, dto));
    }
}
