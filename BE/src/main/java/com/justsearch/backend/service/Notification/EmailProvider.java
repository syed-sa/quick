package com.justsearch.backend.service.Notification;

public interface EmailProvider {
    void send(String to, String subject, String htmlContent);
}
