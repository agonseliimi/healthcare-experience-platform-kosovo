package com.kosovo.healthcareexperience.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kosovo.healthcareexperience.dto.auth.AuthResponse;
import com.kosovo.healthcareexperience.dto.auth.LoginRequest;
import com.kosovo.healthcareexperience.dto.auth.RegisterRequest;
import com.kosovo.healthcareexperience.entity.User;
import com.kosovo.healthcareexperience.enums.Role;
import com.kosovo.healthcareexperience.exception.BadRequestException;
import com.kosovo.healthcareexperience.repository.UserRepository;
import com.kosovo.healthcareexperience.security.JwtService;

/**
 * Handles registration and login. Passwords are hashed with BCrypt and never
 * stored or returned in plaintext.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists.");
        }

        User user = new User();
        user.setDisplayName(request.getDisplayName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setTrustScore(50);
        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());
        return toAuthResponse(token, user);
    }

    public AuthResponse login(LoginRequest request) {
        // Throws BadCredentialsException (handled globally) if invalid.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password."));

        String token = jwtService.generateToken(user.getEmail());
        return toAuthResponse(token, user);
    }

    private AuthResponse toAuthResponse(String token, User user) {
        return new AuthResponse(
                token,
                user.getId(),
                user.getDisplayName(),
                user.getEmail(),
                user.getRole(),
                user.getTrustScore());
    }
}
