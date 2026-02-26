package com.justsearch.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


import com.justsearch.backend.ratelimit.RateLimitInterceptor;
import com.justsearch.backend.service.QuickServices.impl.BookServiceImpl;
import com.justsearch.backend.service.idempotency.IdempotencyInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final Logger log = LoggerFactory.getLogger(BookServiceImpl.class);

    private final IdempotencyInterceptor idempotencyInterceptor;
    private final RateLimitInterceptor rateLimitInterceptor;

    public WebConfig(IdempotencyInterceptor idempotencyInterceptor, RateLimitInterceptor rateLimitInterceptor) {
        this.idempotencyInterceptor = idempotencyInterceptor;
        this.rateLimitInterceptor = rateLimitInterceptor;
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {

        /*
         * 1️⃣ Rate limiting — ONLY critical endpoints
         */
        registry.addInterceptor(rateLimitInterceptor)
                .addPathPatterns(
                        // Auth
                        "/api/user/signup",
                        "/api/user/signin",
                        "/api/user/forgot-password",
                        "/api/user/reset-password",
                        "/api/user/refresh",

                        // Search & suggestions
                        "/api/services/getByCategory",
                        "/api/services/suggestions",
                        "/api/services/category/suggestions",

                        // Mutations
                        "/api/services/register",
                        "/api/bookservice/RequestBooking",
                        "/api/bookservice/UpdateBookingStatus/**")
                .excludePathPatterns(
                        "/images/**",
                        "/v3/api-docs/**",
                        "/swagger-ui/**",
                        "/swagger-ui.html");
        registry.addInterceptor(idempotencyInterceptor)
                .addPathPatterns("/api/**");
    }
}