package com.kosovo.healthcareexperience.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kosovo.healthcareexperience.entity.User;
import com.kosovo.healthcareexperience.service.UserService;

/** User lookups. Some endpoints are admin-only. */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Admin only: list all users.
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAll() {
        List<Map<String, Object>> users = userService.getAllUsers().stream()
                .map(this::toUserMap).toList();
        return ResponseEntity.ok(users);
    }

    // A logged-in user (or admin) can view a user profile.
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(toUserMap(userService.getById(id)));
    }

    // Public: view just the trust score/label of a user.
    @GetMapping("/{id}/trust")
    public ResponseEntity<Map<String, Object>> getTrust(@PathVariable Long id) {
        User user = userService.getById(id);
        Map<String, Object> body = new HashMap<>();
        body.put("userId", user.getId());
        body.put("trustScore", user.getTrustScore());
        body.put("trustLabel", userService.trustLabel(user.getTrustScore()));
        return ResponseEntity.ok(body);
    }

    private Map<String, Object> toUserMap(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("displayName", user.getDisplayName());
        map.put("email", user.getEmail());
        map.put("role", user.getRole());
        map.put("trustScore", user.getTrustScore());
        map.put("trustLabel", userService.trustLabel(user.getTrustScore()));
        map.put("likesReceived", user.getLikesReceived());
        map.put("dislikesReceived", user.getDislikesReceived());
        map.put("reportsReceived", user.getReportsReceived());
        map.put("createdAt", user.getCreatedAt());
        return map;
    }
}
