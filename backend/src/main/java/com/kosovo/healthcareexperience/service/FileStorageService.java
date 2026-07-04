package com.kosovo.healthcareexperience.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.kosovo.healthcareexperience.exception.BadRequestException;
import com.kosovo.healthcareexperience.exception.ResourceNotFoundException;

/**
 * Stores verification documents privately on disk.
 *
 * PRIVACY: Files are saved under a private folder (data/uploads) that is NOT
 * served publicly. Only administrators can read them through a protected
 * endpoint. Each file gets a random name so the original name is never exposed
 * in the path. A production system would add encryption, virus scanning,
 * retention/auto-deletion and audit logs.
 */
@Service
public class FileStorageService {

    // Basic allow-list so only documents / images can be uploaded.
    private static final long MAX_SIZE_BYTES = 5L * 1024 * 1024; // 5 MB

    private final Path uploadRoot;

    public FileStorageService(@Value("${app.upload.dir:data/uploads}") String uploadDir) {
        this.uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadRoot);
        } catch (IOException e) {
            throw new IllegalStateException("Could not create upload directory: " + this.uploadRoot, e);
        }
    }

    /**
     * Saves the uploaded file with a random name and returns the stored name.
     * Validates size and content type.
     */
    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file is empty.");
        }
        if (file.getSize() > MAX_SIZE_BYTES) {
            throw new BadRequestException("File is too large. Maximum size is 5 MB.");
        }

        String contentType = file.getContentType();
        if (!isAllowedType(contentType)) {
            throw new BadRequestException("Only PDF or image files are allowed.");
        }

        String extension = extractExtension(file.getOriginalFilename());
        String storedName = UUID.randomUUID().toString() + extension;
        Path target = this.uploadRoot.resolve(storedName).normalize();

        // Guard against path traversal.
        if (!target.getParent().equals(this.uploadRoot)) {
            throw new BadRequestException("Invalid file name.");
        }

        try {
            file.transferTo(target);
        } catch (IOException e) {
            throw new IllegalStateException("Could not store file.", e);
        }
        return storedName;
    }

    /** Loads a previously stored file as a readable resource (admin only). */
    public Resource loadAsResource(String storedName) {
        try {
            Path filePath = this.uploadRoot.resolve(storedName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new ResourceNotFoundException("Document file not found: " + storedName);
            }
            return resource;
        } catch (Exception e) {
            throw new ResourceNotFoundException("Document file not found: " + storedName);
        }
    }

    private boolean isAllowedType(String contentType) {
        if (contentType == null) return false;
        return contentType.equals("application/pdf")
                || contentType.startsWith("image/");
    }

    private String extractExtension(String originalName) {
        if (originalName == null) return "";
        int dot = originalName.lastIndexOf('.');
        if (dot < 0 || dot == originalName.length() - 1) return "";
        String ext = originalName.substring(dot).toLowerCase();
        // keep only simple, safe extensions
        if (ext.matches("\\.[a-z0-9]{1,6}")) return ext;
        return "";
    }
}
