package com.justsearch.backend.service.Notification.Impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.justsearch.backend.service.Notification.EmailProvider;
import com.justsearch.backend.service.Notification.EmailService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private static final Logger log =
            LoggerFactory.getLogger(EmailServiceImpl.class);

    private final EmailProvider emailProvider;

    private String getEmailTemplate(String content, String buttonText, String buttonLink) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
                <table width="100%%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <!-- Header with Logo -->
                    <tr>
                        <td style="padding: 30px 20px; text-align: center; border-bottom: 1px solid #eaeaea;">
                            <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #f97316, #ef4444); padding: 8px 16px; border-radius: 8px;">
                                        <span style="color: #ffffff; font-size: 24px; font-weight: bold;">Q</span>
                                    </td>
                                    <td style="padding-left: 8px;">
                                        <span style="font-size: 28px; font-weight: bold; background: linear-gradient(135deg, #f97316, #ef4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Quick</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 20px;">
                            %s
                        </td>
                    </tr>
                    
                    <!-- Button -->
                    <tr>
                        <td style="padding: 0 20px 40px 20px; text-align: center;">
                            <a href="%s" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #f97316, #ef4444); color: #ffffff; text-decoration: none; font-weight: 500; border-radius: 8px; font-size: 16px;">%s</a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px; text-align: center; border-top: 1px solid #eaeaea; color: #6b7280; font-size: 14px;">
                            <p style="margin: 5px 0;">&copy; 2024 Quick. All rights reserved.</p>
                            <p style="margin: 5px 0;">If you didn't request this email, you can safely ignore it.</p>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """.formatted(content, buttonLink, buttonText);
    }

    @Async
    @Override
    public void sendVerificationEmail(String to, String verificationLink) {

        log.info("Preparing verification email for {}", to);

        String subject = "Verify your email - Quick";

        String content = """
            <h1 style="margin: 0 0 20px 0; font-size: 24px; color: #1f2937; text-align: center;">Welcome to Quick!</h1>
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #4b5563; line-height: 1.5; text-align: center;">
                Thanks for signing up! Please verify your email address to get started with your account.
            </p>
            """;

        String html = getEmailTemplate(content, "Verify Email", verificationLink);
        emailProvider.send(to, subject, html);

        log.info("Verification email process completed for {}", to);
    }

    @Async
    @Override
    public void sendPasswordResetEmail(String to, String resetLink) {

        log.info("Preparing password reset email for {}", to);

        String subject = "Reset your password - Quick";

        String content = """
            <h1 style="margin: 0 0 20px 0; font-size: 24px; color: #1f2937; text-align: center;">Reset your password</h1>
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #4b5563; line-height: 1.5; text-align: center;">
                We received a request to reset your password. Click the button below to choose a new one.
            </p>
            """;

        String html = getEmailTemplate(content, "Reset Password", resetLink);
        emailProvider.send(to, subject, html);

        log.info("Password reset email process completed for {}", to);
    }
}