package com.justsearch.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.justsearch.backend.model.FavoriteService;
import com.justsearch.backend.model.User;
import com.justsearch.backend.model.Services;

@Repository
public interface FavoriteServiceRepository extends JpaRepository<FavoriteService, Long> {

    List<FavoriteService> findByUser(User user);

    Optional<FavoriteService> findByUserAndService(User user, Services service);

    void deleteByUserAndService(User user, Services service);
}
