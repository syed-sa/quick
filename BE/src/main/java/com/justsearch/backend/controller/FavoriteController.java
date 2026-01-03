package com.justsearch.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.justsearch.backend.dto.ServiceDto;
import com.justsearch.backend.model.Services;
import com.justsearch.backend.service.QuickServices.UserFavoriteService;
@RestController
@RequestMapping("api/users/{userId}/favorites")
public class FavoriteController {

    private final UserFavoriteService userFavoriteService;

    public FavoriteController(UserFavoriteService userFavoriteService) {
        this.userFavoriteService = userFavoriteService;
    }

    @PostMapping("/{serviceId}")
    public void addFavorite(@PathVariable Long userId, @PathVariable Long serviceId) {
        userFavoriteService.addFavorite(userId, serviceId);
    }

    @DeleteMapping("/{serviceId}")
    public void removeFavorite(@PathVariable Long userId, @PathVariable Long serviceId) {
        userFavoriteService.removeFavorite(userId, serviceId);
    }

    @GetMapping
    public List<ServiceDto> getFavorites(@PathVariable Long userId) {
        try
        {
        return userFavoriteService.getFavorites(userId);
        }catch(Exception e){
            System.out.println("Error: " + e.getMessage());
            throw new RuntimeException( e.getMessage());
        }
    }
}
