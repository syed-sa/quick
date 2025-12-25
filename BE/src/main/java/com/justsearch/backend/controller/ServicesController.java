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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.justsearch.backend.dto.CategorySuggestionDto;
import com.justsearch.backend.dto.RegisterBusinessDto;
import com.justsearch.backend.dto.ServiceDto;
import com.justsearch.backend.service.BusinessRegistry.BuisnessRegistry;
import com.justsearch.backend.service.BusinessRegistry.BusinessCategoryService;

import org.springframework.data.domain.Page;

@RestController
@RequestMapping("api/services")

public class ServicesController {

    public BuisnessRegistry _registerServicesService;
    public BusinessCategoryService _categoryService;

    public ServicesController(BuisnessRegistry registerServicesService, BusinessCategoryService categoryService) {
        this._registerServicesService = registerServicesService;
        this._categoryService = categoryService;
    }

    @PostMapping(value = "/register", consumes = "multipart/form-data")
    public ResponseEntity<?> registerService(@ModelAttribute RegisterBusinessDto service) {
        try {
            _registerServicesService.registerBusiness(service);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getSuggestions(@RequestParam String q) {
        if (q == null || q.trim().length() < 3) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(_registerServicesService.getGlobalSuggestions(q));
    }

    @GetMapping("/getByCategory")
    public ResponseEntity<?> getServicesByKeyword(
            @RequestParam String keyWord,
            @RequestParam String postalCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<ServiceDto> services = _registerServicesService.getResults(keyWord, postalCode, page, size);
            services.getContent().forEach(service -> System.out.println("Company Name: " + service.getCompanyName()));
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
}

