package com.justsearch.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.justsearch.backend.dto.SignInDto;
import com.justsearch.backend.dto.SignupRequestDto;
import com.justsearch.backend.ratelimit.annotation.RateLimit;
import com.justsearch.backend.service.Authentication.AuthService;

import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@RequestMapping("api/user")
public class AuthController {
    @Autowired
    private AuthService _authService;

    public AuthController(AuthService authService)

    {
        _authService = authService;

    }

    @RateLimit(key = "SIGNUP", capacity = 5, refillTokens = 5, refillDurationSeconds = 3600)
    @PostMapping("/signup")

    public ResponseEntity<Map<String, String>> SignupUser(@RequestBody SignupRequestDto request) {
        try {
            _authService.userSignUp(request);
            return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        _authService.verifyEmail(token);
        return ResponseEntity.ok(Map.of("message", "Email verified successfully"));
    }

    @RateLimit(key = "SIGNIN", capacity = 5, refillTokens = 5, refillDurationSeconds = 3600)
    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody SignInDto signInCredentials) {
        return _authService.userSignIn(signInCredentials);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody String refreshToken) {
        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Refresh token is required"));
        }
        try {
            refreshToken = refreshToken.replace("\"", "").trim();
            return _authService.refresh(refreshToken);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@RequestHeader("x-refresh-token") String refreshToken) {
        try {
            _authService.logout(refreshToken);
            return ResponseEntity.ok(Map.of("message", "User logged out successfully!"));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @RateLimit(key = "FORGOT_PASSWORD", capacity = 3, refillTokens = 3, refillDurationSeconds = 3600)
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        _authService.forgotPassword(email);
        return ResponseEntity.ok(Map.of(
                "message", "If the email exists, a reset link has been sent"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword) {

        _authService.resetPassword(token, newPassword);
        return ResponseEntity.ok(Map.of("message", "Password reset successful"));
    }

}