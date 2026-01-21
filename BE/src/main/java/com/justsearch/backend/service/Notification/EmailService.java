package com.justsearch.backend.service.Notification;
public interface EmailService {

    void sendVerificationEmail(String to, String verificationLink);

    void sendPasswordResetEmail(String to, String resetLink);
}
