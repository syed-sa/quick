package com.justsearch.backend.service.Authentication.impl;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.justsearch.backend.dto.SignInDto;
import com.justsearch.backend.dto.SignupRequestDto;
import com.justsearch.backend.dto.TokenResponseDto;
import com.justsearch.backend.model.EmailVerificationToken;
import com.justsearch.backend.model.RefreshToken;
import com.justsearch.backend.model.Role;
import com.justsearch.backend.model.User;
import com.justsearch.backend.repository.EmailVerificationTokenRepository;
import com.justsearch.backend.repository.RefreshTokenRepository;
import com.justsearch.backend.repository.UserRepository;
import com.justsearch.backend.security.JwtUtils;
import com.justsearch.backend.service.Authentication.AuthService;
import com.justsearch.backend.service.Notification.EmailService;
//test123
@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private UserRepository _userRepository;

    private RefreshTokenRepository _refreshTokenRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtils jwtUtils;

    private RoleServiceImpl _roleService;

    private final String frontendBaseUrl = "http://localhost:3000";

    private final EmailService emailService;

    private final EmailVerificationTokenRepository emailVerificationTokenRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthServiceImpl(PasswordEncoder passwordEncoder, JwtUtils jwtUtils,
            RefreshTokenRepository refreshTokenRepository, RoleServiceImpl roleService,
            AuthenticationManager authenticationManager, EmailService emailService,
            EmailVerificationTokenRepository emailVerificationTokenRepository) {
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this._refreshTokenRepository = refreshTokenRepository;
        _roleService = roleService;
        this.authenticationManager = authenticationManager;
        this.emailVerificationTokenRepository = emailVerificationTokenRepository;
        this.emailService = emailService;

    }

    public void userSignUp(SignupRequestDto signUpRequest) {

        if (_userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Email already taken");
        }

        // 1. Create user
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setName(signUpRequest.getName());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setPhone(signUpRequest.getPhone());
        user.setVerified(false);

        // roles
        Set<Role> roleSet = new HashSet<>();
        roleSet.add(_roleService.findByName("USER"));

        if (user.getEmail().endsWith("@admin.edu")) {
            roleSet.add(_roleService.findByName("ADMIN"));
        }
        user.setRoles(roleSet);

        _userRepository.save(user);

        // 2. Create verification token (separate model)
        String token = UUID.randomUUID().toString();

        EmailVerificationToken verificationToken = new EmailVerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationToken.setExpiry(LocalDateTime.now().plusHours(24));

        emailVerificationTokenRepository.save(verificationToken);

        // 3. Send verification email (async)
        String verificationLink = frontendBaseUrl + "/verify-email?token=" + token;

        emailService.sendVerificationEmail(
                user.getEmail(),
                verificationLink);
    }

    @Transactional
    @Override
    public void verifyEmail(String token) {

        EmailVerificationToken verificationToken = emailVerificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        if (verificationToken.getExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification token expired");
        }

        User user = verificationToken.getUser();

        if (user.isVerified()) {
            return; // idempotent
        }

        // ✅ THIS IS WHERE VERIFIED BECOMES TRUE
        user.setVerified(true);
        _userRepository.save(user);

        // cleanup
        emailVerificationTokenRepository.delete(verificationToken);
    }

    public ResponseEntity<?> userSignIn(SignInDto request) {
        Optional<User> userOptional = _userRepository.findByEmail(request.getEmail());
        if (userOptional.isEmpty()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "User not found");
            errorResponse.put("error", "INVALID_EMAIL");
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(errorResponse);
        }
        User user = userOptional.get();
        try {
            final String token = getAccessToken(user, request.getPassword());
            RefreshToken refreshToken = jwtUtils.generateRefreshToken(user.getId());
            _refreshTokenRepository.save(refreshToken);

            String role = user.getRoles().stream()
                    .anyMatch(r -> r.getName().equalsIgnoreCase("ADMIN")) ? "ADMIN" : "USER";

            TokenResponseDto tokenResponse = new TokenResponseDto(
                    user.getName(),
                    token,
                    refreshToken.getToken(),
                    user.getId(),
                    role // pass the role string here
            );

            return ResponseEntity.ok(tokenResponse);
        } catch (Exception ex) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Invalid credentials");
            errorResponse.put("error", "BAD_CREDENTIALS");
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(errorResponse);
        }

    }

    @Transactional
    public void forgotPassword(String email) {

        Optional<User> userOpt = _userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return; // do NOT reveal user existence
        }

        User user = userOpt.get();

        // delete old tokens
        emailVerificationTokenRepository.deleteByUser(user);
        emailVerificationTokenRepository.flush();

        String token = UUID.randomUUID().toString();

        EmailVerificationToken resetToken = new EmailVerificationToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiry(LocalDateTime.now().plusMinutes(30));

        emailVerificationTokenRepository.save(resetToken);

        String resetLink = frontendBaseUrl + "/reset-password?token=" + token;

        emailService.sendPasswordResetEmail(
                user.getEmail(),
                resetLink);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {

        EmailVerificationToken resetToken = emailVerificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (resetToken.getExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token expired");
        }

        User user = resetToken.getUser();

        user.setPassword(passwordEncoder.encode(newPassword));
        _userRepository.save(user);

        // invalidate sessions
        _refreshTokenRepository.deleteAllByUserId(user.getId());

        emailVerificationTokenRepository.delete(resetToken);
    }

    @Transactional
    public ResponseEntity<TokenResponseDto> refresh(String refreshToken) {

        Optional<RefreshToken> storedTokenOpt = _refreshTokenRepository.findByToken(refreshToken);

        // Token not found → reuse or invalid
        if (storedTokenOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        RefreshToken storedToken = storedTokenOpt.get();

        // Expired or already used → real security issue
        if (storedToken.isRevoked() || storedToken.getExpiryDate().before(new Date())) {
            // cleanup all tokens for this user
            _refreshTokenRepository.deleteAllByUserId(storedToken.getUserId());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        storedToken.setRevoked(true);
        _refreshTokenRepository.save(storedToken);

        // Load user
        User user = _userRepository.findById(storedToken.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Build authentication
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                user.getRoles().stream()
                        .map(role -> new SimpleGrantedAuthority(role.getName()))
                        .toList());

        Authentication auth = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());

        // Generate new tokens
        String newAccessToken = jwtUtils.generateToken(auth);
        RefreshToken newRefreshToken = jwtUtils.generateRefreshToken(user.getId());

        _refreshTokenRepository.save(newRefreshToken);

        String role = user.getRoles().stream()
                .anyMatch(r -> r.getName().equalsIgnoreCase("ADMIN")) ? "ADMIN" : "USER";

        return ResponseEntity.ok(
                new TokenResponseDto(
                        user.getName(),
                        newAccessToken,
                        newRefreshToken.getToken(),
                        user.getId(),
                        role));
    }

    public void logout(String refreshToken) {
        if (refreshToken == null || refreshToken.isEmpty()) {
            throw new RuntimeException("Refresh token is required");
        }
        RefreshToken refreshTokenEntity = _refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));
        refreshTokenEntity.setRevoked(true);
        _refreshTokenRepository.save(refreshTokenEntity);
    }

    private String getAccessToken(User user, String rawPassword) {
        final Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), rawPassword));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        final String token = jwtUtils.generateToken(authentication);
        return token;
    }

}