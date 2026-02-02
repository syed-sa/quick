package com.justsearch.backend.model;

public class CachedResponse {
    private int status;
    private String body;

    public CachedResponse() {}

    public CachedResponse(int status, String body) {
        this.status = status;
        this.body = body;
    }

    public int getStatus() {
        return status;
    }

    public String getBody() {
        return body;
    }
}
