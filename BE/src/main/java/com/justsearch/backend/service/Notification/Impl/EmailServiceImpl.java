package com.justsearch.backend.service.Notification.Impl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import com.justsearch.backend.service.Notification.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    @Override
    public void sendVerificationEmail(String to, String verificationLink) {
        String subject = "Verify your email";
        String body =
                "Welcome!\n\n" +
                "Click the link below to verify your email:\n" +
                verificationLink + "\n\n" +
                "This link expires in 24 hours.";

        sendMail(to, subject, body);
    }

    @Async
    @Override
    public void sendOtpEmail(String to, String otp) {
        String subject = "Your OTP Code";
        String body =
                "Your OTP is: " + otp + "\n\n" +
                "Valid for 10 minutes. Do not share it.";

        sendMail(to, subject, body);
    }

    private void sendMail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }
}
