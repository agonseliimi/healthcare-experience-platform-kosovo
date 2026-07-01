package com.kosovo.healthcareexperience.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kosovo.healthcareexperience.dto.auth.AuthResponse;
import com.kosovo.healthcareexperience.dto.auth.LoginRequest;
import com.kosovo.healthcareexperience.dto.auth.RegisterRequest;
import com.kosovo.healthcareexperience.entity.User;
import com.kosovo.healthcareexperience.service.AuthService;
import com.kosovo.healthcareexperience.service.UserService;

import jakarta.validation.Valid;

/** Authentication endpoints: register, login, and current-user lookup. */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /** Returns the profile of the currently authenticated user (requires JWT). */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me() {
        User user = userService.getCurrentUser();
        Map<String, Object> body = new HashMap<>();
        body.put("id", user.getId());
        body.put("displayName", user.getDisplayName());
        body.put("email", user.getEmail());
        body.put("role", user.getRole());
        body.put("trustScore", user.getTrustScore());
        body.put("trustLabel", userService.trustLabel(user.getTrustScore()));
        body.put("likesReceived", user.getLikesReceived());
        body.put("dislikesReceived", user.getDislikesReceived());
        body.put("reportsReceived", user.getReportsReceived());
        return ResponseEntity.ok(body);
    }
}
