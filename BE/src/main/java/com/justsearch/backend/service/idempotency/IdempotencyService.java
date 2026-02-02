package com.justsearch.backend.service.idempotency;

import java.time.Duration;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class IdempotencyService {

    private static final Duration TTL = Duration.ofMinutes(10);

    private final RedisTemplate<String, Object> redisTemplate;

    public IdempotencyService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

     public Object get(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public void markInProgress(String key) {
        redisTemplate.opsForValue().set(key, "IN_PROGRESS", TTL);
    }

  public void saveResponse(String key, Object response) {
        redisTemplate.opsForValue().set(key, response, TTL);
    }


    public void clear(String key) {
        redisTemplate.delete(key);
    }
}
