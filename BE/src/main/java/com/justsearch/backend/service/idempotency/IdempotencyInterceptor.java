package com.justsearch.backend.service.idempotency;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.justsearch.backend.model.CachedResponse;

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
            Object handler) throws Exception {

        if (!"POST".equals(request.getMethod())) {
            return true;
        }

        if (!request.getRequestURI().startsWith("/api/bookservice")
                && !request.getRequestURI().startsWith("/api/services")) {
            return true;
        }

        String key = request.getHeader("Idempotency-Key");
        if (key == null || key.isBlank()) {
            throw new IllegalArgumentException("Missing Idempotency-Key");
        }

        String redisKey = request.getRequestURI() + ":" + key;

        Object cached = idempotencyService.get(redisKey);

        //  Retry → return cached response
        if (cached instanceof CachedResponse cachedResponse) {
            response.setStatus(cachedResponse.getStatus());
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(cachedResponse.getBody());
            return false; //  stop controller execution
        }

        idempotencyService.markInProgress(redisKey);
        request.setAttribute("IDEMPOTENCY_KEY", redisKey);
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

        if (ex != null || response.getStatus() >= 400) {
            idempotencyService.clear(redisKey);
        }
    }

}
