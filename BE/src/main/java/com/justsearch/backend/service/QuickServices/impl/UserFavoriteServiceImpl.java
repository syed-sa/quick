package com.justsearch.backend.service.QuickServices.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.justsearch.backend.model.FavoriteService;
import com.justsearch.backend.model.User;
import com.justsearch.backend.model.Services;
import com.justsearch.backend.repository.FavoriteServiceRepository;
import com.justsearch.backend.repository.ServicesRepository;
import com.justsearch.backend.repository.UserRepository;
import com.justsearch.backend.service.QuickServices.UserFavoriteService;
import com.justsearch.backend.dto.ServiceDto;
import com.justsearch.backend.mapper.ServiceMapper;

@Service
public class UserFavoriteServiceImpl implements UserFavoriteService {

    private final UserRepository userRepository;
    private final ServicesRepository servicesRepository;
    private final FavoriteServiceRepository favoriteServiceRepository;
    private final ServiceMapper serviceMapper;

    public UserFavoriteServiceImpl(UserRepository userRepository,
            ServicesRepository servicesRepository,
            FavoriteServiceRepository favoriteServiceRepository,
            ServiceMapper serviceMapper) {
        this.userRepository = userRepository;
        this.servicesRepository = servicesRepository;
        this.favoriteServiceRepository = favoriteServiceRepository;
        this.serviceMapper = serviceMapper;
    }

    @Transactional
    public void addFavorite(Long userId, Long serviceId) {
        User user = userRepository.findById(userId).orElseThrow();
        Services service = servicesRepository.findById(serviceId).orElseThrow();

        favoriteServiceRepository.findByUserAndService(user, service)
                .ifPresent(fav -> {
                    throw new RuntimeException("Already added");
                });

        favoriteServiceRepository.save(new FavoriteService(user, service));
    }

    @Transactional
    public void removeFavorite(Long userId, Long serviceId) {
        User user = userRepository.findById(userId).orElseThrow();
        Services service = servicesRepository.findById(serviceId).orElseThrow();
        favoriteServiceRepository.deleteByUserAndService(user, service);
    }

    public List<ServiceDto> getFavorites(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return favoriteServiceRepository.findByUser(user)
                .stream()
                .map(FavoriteService::getService)
                .map(serviceMapper::toDto)
                .collect(Collectors.toList());
    }
}
