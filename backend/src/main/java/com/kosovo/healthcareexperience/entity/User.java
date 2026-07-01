package com.kosovo.healthcareexperience.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.kosovo.healthcareexperience.enums.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

/**
 * A registered account. Passwords are stored only as BCrypt hashes.
 *
 * trustScore is community credibility (0-100), NOT medical correctness.
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String displayName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    private Integer trustScore = 50;
    private Integer likesReceived = 0;
    private Integer dislikesReceived = 0;
    private Integer reportsReceived = 0;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // One user can author many experiences.
    @OneToMany(mappedBy = "author")
    private List<Experience> experiences = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ---- Getters / setters ----

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Integer getTrustScore() { return trustScore; }
    public void setTrustScore(Integer trustScore) { this.trustScore = trustScore; }

    public Integer getLikesReceived() { return likesReceived; }
    public void setLikesReceived(Integer likesReceived) { this.likesReceived = likesReceived; }

    public Integer getDislikesReceived() { return dislikesReceived; }
    public void setDislikesReceived(Integer dislikesReceived) { this.dislikesReceived = dislikesReceived; }

    public Integer getReportsReceived() { return reportsReceived; }
    public void setReportsReceived(Integer reportsReceived) { this.reportsReceived = reportsReceived; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<Experience> getExperiences() { return experiences; }
    public void setExperiences(List<Experience> experiences) { this.experiences = experiences; }
}
