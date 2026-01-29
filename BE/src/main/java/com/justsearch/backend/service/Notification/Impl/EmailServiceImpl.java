package com.justsearch.backend.service.Notification.Impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.justsearch.backend.service.Notification.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log =
            LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // ---------------------------------------------------------
    // VERIFICATION EMAIL
    // ---------------------------------------------------------

    @Async
    @Override
    public void sendVerificationEmail(String to, String verificationLink) {

        log.info("Sending verification email");

        String subject = "Verify your email";
        String body = "Welcome!\n\n" +
                "Click the link below to verify your email:\n" +
                verificationLink + "\n\n" +
                "This link expires in 24 hours.";

        sendMailInternal(to, subject, body);

        log.info("Verification email dispatched");
    }

    // ---------------------------------------------------------
    // PASSWORD RESET EMAIL
    // ---------------------------------------------------------

    @Async
    @Override
    public void sendPasswordResetEmail(String to, String resetLink) {

        log.info("Sending password reset email");

        String subject = "Reset your password";
        String body = "You requested a password reset.\n\n" +
                "Click the link below to reset your password:\n" +
                resetLink + "\n\n" +
                "This link expires in 15 minutes.\n" +
                "If you didn't request this, ignore this email.";

        sendMailInternal(to, subject, body);

        log.info("Password reset email dispatched");
    }

    // ---------------------------------------------------------
    // INTERNAL MAIL SENDER
    // ---------------------------------------------------------

    private void sendMailInternal(String to, String subject, String body) {

    try {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to); // ✅ REQUIRED
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);

        log.debug("Mail sent successfully subject={}", subject);

    } catch (Exception e) {
        log.error("Email sending failed subject={}", subject, e);
        throw e;
    }
}

}
