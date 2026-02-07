package com.justsearch.backend.ratelimit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.method.HandlerMethod;
import com.justsearch.backend.ratelimit.annotation.RateLimit;
import com.justsearch.backend.ratelimit.service.RateLimitService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private final RateLimitService rateLimitService;
    private static final Logger logger = LoggerFactory.getLogger(RateLimitInterceptor.class);

    public RateLimitInterceptor(RateLimitService rateLimitService) {
        this.rateLimitService = rateLimitService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) {

        if (!(handler instanceof HandlerMethod method)) {
            return true;
        }
        logger.info("RateLimitInterceptor triggered for: " + request.getRequestURI());
        RateLimit rateLimit = method.getMethodAnnotation(RateLimit.class);
        System.out.println("RateLimit annotation found: " + (rateLimit != null));

        if (rateLimit == null) return true;

        String key = resolveKey(request, rateLimit);
        rateLimitService.consume(
                key,
                rateLimit.capacity(),
                rateLimit.refillTokens(),
                rateLimit.refillDurationSeconds()
        );

        return true;
    }

    private String resolveKey(HttpServletRequest request, RateLimit rateLimit) {
        if (rateLimit.perUser() && request.getUserPrincipal() != null) {
            return rateLimit.key() + ":USER:" + request.getUserPrincipal().getName();
        }
        return rateLimit.key() + ":IP:" + request.getRemoteAddr();
    }
}
