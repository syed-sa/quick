package com.justsearch.backend.service.Notification.Impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.justsearch.backend.service.Notification.EmailProvider;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class BrevoEmailProvider implements EmailProvider {

    private static final Logger log = LoggerFactory.getLogger(BrevoEmailProvider.class);

    @Value("${brevo.api-key}")
    private String apiKey;

    @Value("${brevo.sender-email}")
    private String senderEmail;

    @Value("${brevo.sender-name}")
    private String senderName;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://api.brevo.com/v3/smtp/email")
            .build();

    @Override
    public void send(String to, String subject, String htmlContent) {
        try {
            var requestBody = new java.util.HashMap<String, Object>();
            requestBody.put("sender", java.util.Map.of("name", senderName, "email", senderEmail));
            requestBody.put("to", java.util.List.of(java.util.Map.of("email", to)));
            requestBody.put("subject", subject);
            requestBody.put("htmlContent", htmlContent);

            Mono<String> response = webClient.post()
                    .header("api-key", apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class);

            response.subscribe(
                    res -> log.info("Email sent successfully to {}: {}", to, res),
                    err -> log.error("Failed to send email to {}: {}", to, err.getMessage())
            );

        } catch (Exception e) {
            log.error("Exception while sending email to {}: {}", to, e.getMessage());
        }
    }
}
