package com.justsearch.backend.service.QuickServices;

import java.util.List;
import com.justsearch.backend.dto.ServiceDto;

public interface UserFavoriteService {

    void addFavorite(Long userId, Long serviceId);

    void removeFavorite(Long userId, Long serviceId);

    List<ServiceDto> getFavorites(Long userId);

}
