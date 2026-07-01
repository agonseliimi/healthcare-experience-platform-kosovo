package com.kosovo.healthcareexperience.dto.auth;

import com.kosovo.healthcareexperience.enums.Role;

/** Returned after successful register/login. Contains the JWT and basic profile. */
public class AuthResponse {

    private String token;
    private Long id;
    private String displayName;
    private String email;
    private Role role;
    private Integer trustScore;

    public AuthResponse() {
    }

    public AuthResponse(String token, Long id, String displayName, String email, Role role, Integer trustScore) {
        this.token = token;
        this.id = id;
        this.displayName = displayName;
        this.email = email;
        this.role = role;
        this.trustScore = trustScore;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Integer getTrustScore() { return trustScore; }
    public void setTrustScore(Integer trustScore) { this.trustScore = trustScore; }
}
