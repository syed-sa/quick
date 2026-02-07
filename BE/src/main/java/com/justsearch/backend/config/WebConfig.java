package com.justsearch.backend.config;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.io.File;
import com.justsearch.backend.constants.AppConstants;
import com.justsearch.backend.service.QuickServices.impl.BookServiceImpl;
import com.justsearch.backend.service.idempotency.IdempotencyInterceptor;
import org.springframework.web.servlet.HandlerInterceptor;
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Value("${basepath}")
    private String basePath;
    private static final Logger log = LoggerFactory.getLogger(BookServiceImpl.class);


    private final IdempotencyInterceptor idempotencyInterceptor;
    private final RateLimitInterceptor rateLimitInterceptor;


    public WebConfig(IdempotencyInterceptor idempotencyInterceptor, RateLimitInterceptor rateLimitInterceptor) {
        this.idempotencyInterceptor = idempotencyInterceptor;
        this.rateLimitInterceptor = rateLimitInterceptor;
    }
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Add trailing slash - this is crucial!
        String imageLocation = "file:" + basePath + AppConstants.USER_DATA + AppConstants.IMAGE_FOLDER;
        if (!imageLocation.endsWith("/")) {
            imageLocation += "/";
        }
        
        
        
        // Verify the directory exists
        String directoryPath = basePath + AppConstants.USER_DATA + AppConstants.IMAGE_FOLDER;
        File imageDir = new File(directoryPath);
        if (imageDir.exists()) {
            log.info(" Serving images from directory: " + imageDir.getAbsolutePath());
        } else {
            log.error(" Image directory does not exist: " + imageDir.getAbsolutePath());
        }
        
        registry.addResourceHandler("/images/**")
                .addResourceLocations(imageLocation)
                .setCachePeriod(3600)
                .resourceChain(true);
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
                    "/api/bookservice/UpdateBookingStatus/**"
            )
            .excludePathPatterns(
                    "/images/**",
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html"
            );
        registry.addInterceptor(idempotencyInterceptor)
                .addPathPatterns("/api/**");
    }
}