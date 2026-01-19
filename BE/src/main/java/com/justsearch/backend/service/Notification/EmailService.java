package com.justsearch.backend.service.Notification;
public interface EmailService {

    void sendVerificationEmail(String to, String verificationLink);

    void sendOtpEmail(String to, String otp);
}
