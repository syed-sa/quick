
package com.justsearch.backend.ratelimit.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
public @interface RateLimit {
    String key(); // logical key

    long capacity(); // max tokens

    long refillTokens(); // refill amount

    long refillDurationSeconds(); // refill duration

    boolean perUser() default false;
}
