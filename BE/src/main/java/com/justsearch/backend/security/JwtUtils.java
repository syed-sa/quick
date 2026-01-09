package com.justsearch.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.justsearch.backend.model.RefreshToken;
import com.justsearch.backend.repository.RefreshTokenRepository;

@Component
public class JwtUtils {

    private final Key secretKey;
    private final long jwtExpirationMs;
    private RefreshTokenRepository _refreshTokenRepository;

    public JwtUtils(@Value("${jwt.secret}") String secret,
            @Value("${jwt.expirationMs}") long jwtExpirationMs,
            RefreshTokenRepository refreshTokenRepository) {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.jwtExpirationMs = jwtExpirationMs;
        this._refreshTokenRepository = refreshTokenRepository;
    }

    public String generateToken(Authentication authentication) {

        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        return Jwts.builder()
                .setSubject(authentication.getName())
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }

    public RefreshToken generateRefreshToken(long userId) {
        String token = UUID.randomUUID().toString();
        Date expiryDate = new Date(System.currentTimeMillis() + jwtExpirationMs * 30);
        RefreshToken refreshToken = new RefreshToken(token, userId, expiryDate);
        return refreshToken;
    }

    public String extractUsername(String token) {
        return Jwts
                .parser()
                .verifyWith((javax.crypto.SecretKey) secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith((javax.crypto.SecretKey) secretKey).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean validateRefreshToken(String token) {
        try {
            Optional<RefreshToken> refreshToken = _refreshTokenRepository.findByToken(token);
            return refreshToken.isPresent() &&
                    refreshToken.get().getExpiryDate().after(new Date()) &&
                    !refreshToken.get().isRevoked();
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public long getUserIdFromRefreshToken(String token) {
        Optional<RefreshToken> refreshToken = _refreshTokenRepository.findByToken(token);
        if (refreshToken.isPresent()) {
            return refreshToken.get().getUserId();
        } else {
            throw new RuntimeException("Invalid refresh token");
        }
    }

}
