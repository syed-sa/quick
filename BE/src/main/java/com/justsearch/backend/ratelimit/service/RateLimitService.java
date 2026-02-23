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

    public void consume(String key, long permits, long durationSeconds) {
        String rateLimitKey = RATE_LIMITER_KEY_PREFIX + key;
        RRateLimiter rateLimiter = redissonClient.getRateLimiter(rateLimitKey);

        // CRITICAL: Only initialize if it does not exist in Redis
        if (!rateLimiter.isExists()) {
            logger.info("Initializing NEW bucket for key: {}", key);
            rateLimiter.trySetRate(
                    RateType.OVERALL,
                    permits,
                    durationSeconds,
                    RateIntervalUnit.SECONDS);

            // Set an expiry so unused keys are deleted from Upstash
            rateLimiter.expire(java.time.Duration.ofHours(24));
        }

        // Now try to acquire
        boolean acquired = rateLimiter.tryAcquire(1);

        // Use availablePermits() to see the count
        logger.info("Key: {}, Remaining: {}", key, rateLimiter.availablePermits());

        if (!acquired) {
            throw new RateLimitExceededException("Rate limit exceeded for key: " + key);
        }
    }

}
