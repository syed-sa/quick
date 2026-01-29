package com.justsearch.backend.service.idempotency;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class IdempotencyInterceptor implements HandlerInterceptor {

    private final IdempotencyService idempotencyService;

    public IdempotencyInterceptor(IdempotencyService service) {
        this.idempotencyService = service;
    }

    @Override
    public boolean preHandle(HttpServletRequest request,
            HttpServletResponse response,
            Object handler) {

        if (!"POST".equals(request.getMethod())) {
            return true;
        }
                    System.out.println("Request URI: " + request.getRequestURI());

        if (!request.getRequestURI().startsWith("/api/bookservice") && !request.getRequestURI().startsWith("/api/services")) {
        return true;

    }

        String key = request.getHeader("Idempotency-Key");
        if (key == null || key.isBlank()) {
            throw new IllegalArgumentException("Missing Idempotency-Key");
        }



        String redisKey = request.getRequestURI() + ":" + key;

        if (idempotencyService.exists(redisKey)) {
            throw new IllegalStateException("Duplicate request");
        }

        request.setAttribute("IDEMPOTENCY_KEY", redisKey);
        idempotencyService.markInProgress(redisKey);
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request,
            HttpServletResponse response,
            Object handler,
            Exception ex) {

        String redisKey = (String) request.getAttribute("IDEMPOTENCY_KEY");

        if (redisKey == null)
            return;

        if (ex == null && response.getStatus() < 400) {
            idempotencyService.markCompleted(redisKey);
        } else {
            idempotencyService.clear(redisKey); // allow retry
        }
    }

}
