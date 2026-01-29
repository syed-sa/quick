package com.justsearch.backend.service.idempotency;

import java.time.Duration;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class IdempotencyService {

    private static final Duration TTL = Duration.ofHours(24);

    private final RedisTemplate<String, Object> redisTemplate;

    public IdempotencyService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public boolean exists(String key) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    public void markInProgress(String key) {
        redisTemplate.opsForValue().set(key, "IN_PROGRESS", TTL);
    }

    public void markCompleted(String key) {
        redisTemplate.opsForValue().set(key, "COMPLETED", TTL);
    }

    public void clear(String key) {
        redisTemplate.delete(key);
    }
}
