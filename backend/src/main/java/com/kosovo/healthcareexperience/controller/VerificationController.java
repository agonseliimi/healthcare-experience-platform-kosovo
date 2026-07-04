package com.kosovo.healthcareexperience.controller;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.kosovo.healthcareexperience.dto.verification.VerificationRequestDto;
import com.kosovo.healthcareexperience.dto.verification.VerificationResponse;
import com.kosovo.healthcareexperience.entity.VerificationRequest;
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
    // Sent as multipart/form-data so an optional supporting document can be uploaded.
    // The document is stored privately and is NEVER shown publicly.
    @PostMapping(value = "/request", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VerificationResponse> create(
            @RequestParam Long experienceId,
            @RequestParam(required = false) String documentNote,
            @RequestParam(required = false, defaultValue = "false") Boolean redactionConfirmed,
            @RequestParam(required = false) MultipartFile file) {
        return ResponseEntity.ok(
                verificationService.create(experienceId, documentNote, redactionConfirmed, file));
    }

    // Admin-only: download the private supporting document (never exposed publicly).
    @GetMapping("/{id}/document")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        VerificationRequest vr = verificationService.getEntity(id);
        Resource resource = verificationService.loadDocument(id);
        String contentType = vr.getFileContentType() != null
                ? vr.getFileContentType()
                : MediaType.APPLICATION_OCTET_STREAM_VALUE;
        String downloadName = vr.getFileName() != null ? vr.getFileName() : "document";
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + downloadName + "\"")
                .body(resource);
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
