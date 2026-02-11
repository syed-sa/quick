package com.justsearch.backend.ratelimit.service;

import org.springframework.stereotype.Service;
import org.redisson.api.RRateLimiter;
import org.redisson.api.RateIntervalUnit;
import org.redisson.api.RateType;
import org.redisson.api.RedissonClient;

import com.justsearch.backend.exception.RateLimitExceededException;

@Service
public class RateLimitService {

    private final RedissonClient redissonClient;
    private static final String RATE_LIMITER_KEY_PREFIX = "rate-limit:";
    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(RateLimitService.class);

    public RateLimitService(RedissonClient redissonClient) {
        this.redissonClient = redissonClient;
    }

    public void consume(String key, long capacity, long refill, long seconds) {
        String rateLimitKey = RATE_LIMITER_KEY_PREFIX + key;
        RRateLimiter rateLimiter = redissonClient.getRateLimiter(rateLimitKey);

        logger.info("Consuming rate limit for key: {}, capacity: {}, refill: {}, seconds: {}", key, capacity, refill, seconds);
        
        // Set the rate if not already set

            if (!rateLimiter.isExists()) {
            rateLimiter.trySetRate(
                    RateType.OVERALL,
                    capacity,
                    refill,
                    RateIntervalUnit.SECONDS
            );
        }

        if (!rateLimiter.tryAcquire()) {
            throw new RateLimitExceededException(
                    "Rate limit exceeded for key: " + key
            );
        }
    }
}
