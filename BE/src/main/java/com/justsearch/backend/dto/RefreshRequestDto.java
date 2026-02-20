package com.justsearch.backend.dto;

public class RefreshRequestDto {
    private String refreshToken;

    public RefreshRequestDto() {
    }

    public RefreshRequestDto(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
