package com.justsearch.backend.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.justsearch.backend.dto.CategorySuggestionDto;
import com.justsearch.backend.dto.PageResponse;
import com.justsearch.backend.dto.RegisterBusinessDto;
import com.justsearch.backend.dto.ServiceDto;
import com.justsearch.backend.model.CachedResponse;
import com.justsearch.backend.ratelimit.annotation.RateLimit;
import com.justsearch.backend.service.BusinessRegistry.BuisnessRegistry;
import com.justsearch.backend.service.BusinessRegistry.BusinessCategoryService;
import com.justsearch.backend.service.QuickServices.BookService;
import com.justsearch.backend.service.idempotency.IdempotencyService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("api/services")

public class ServicesController {

    public BuisnessRegistry _registerServicesService;
    public BusinessCategoryService _categoryService;
    public BookService _bookService;
    private IdempotencyService idempotencyService;

    public ServicesController(BuisnessRegistry registerServicesService, BusinessCategoryService categoryService,
            BookService bookService, IdempotencyService idempotencyService) {
        this._registerServicesService = registerServicesService;
        this._categoryService = categoryService;
        this._bookService = bookService;
        this.idempotencyService = idempotencyService;
    }
@RateLimit(key = "REGISTER_SERVICE", capacity = 5, refillTokens = 5, refillDurationSeconds = 3600, perUser = true)
    @PostMapping(value = "/register", consumes = "multipart/form-data")
    public ResponseEntity<String> registerService(
            @ModelAttribute RegisterBusinessDto service,
            HttpServletRequest request) {

        _registerServicesService.registerBusiness(service);

        String body = """
                {"message":"Service registered successfully"}
                """;

        String redisKey = (String) request.getAttribute("IDEMPOTENCY_KEY");

        if (redisKey != null) {
            idempotencyService.saveResponse(
                    redisKey,
                    new CachedResponse(200, body));
        }

        return ResponseEntity.ok(body);
    }

    @RateLimit(key = "SUGGESTIONS", capacity = 30, refillTokens = 30, refillDurationSeconds = 60)
    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getSuggestions(@RequestParam String q) {
        if (q == null || q.trim().length() < 3) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(_bookService.getGlobalSuggestions(q));
    
    }

    @RateLimit(key = "SEARCH", capacity = 60, refillTokens = 60, refillDurationSeconds = 60)
    @GetMapping("/getByCategory")
    public ResponseEntity<?> getServicesByKeyword(
            @RequestParam String keyWord,
            @RequestParam String postalCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            PageResponse<ServiceDto> services = _bookService.getResults(keyWord, postalCode, page, size);
            return ResponseEntity.ok(services);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/getImages")
    public ResponseEntity<?> getImages(@RequestParam long serviceId) {
        {
            try {
                // Assuming you have a method to fetch images from the folder path
                List<String> images = _registerServicesService.getImages(serviceId);
                return ResponseEntity.ok(images);
            } catch (Exception e) {
                return ResponseEntity.internalServerError().body("Error fetching images: " + e.getMessage());
            }
        }

    }

    @GetMapping("/getservice/userId/{userId}")
    public ResponseEntity<?> getServicesByUserId(@PathVariable long userId) {
        try {
            List<ServiceDto> services = _registerServicesService.getServiceByUserId(userId);
            if (services.isEmpty()) {
                return ResponseEntity.status(404).body("No services found for user ID: " + userId);
            }
            return ResponseEntity.ok(services);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching services: " + e.getMessage());
        }
    }

    @PutMapping("/updateService")
    public ResponseEntity<?> updateService(@RequestBody ServiceDto serviceDto) {
        try {
            _registerServicesService.updateService(serviceDto);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating service: " + e.getMessage());
        }
    }

    @GetMapping("/category/suggestions")
    public List<CategorySuggestionDto> getCategorySuggestions(
            @RequestParam String q) {
        return _categoryService.getSuggestions(q);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllServices(
            @RequestParam(required = false) String category // nullable
    ) {
        try {
            List<ServiceDto> services = _bookService.getAllServices(category);
            return ResponseEntity.ok(services);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

}
