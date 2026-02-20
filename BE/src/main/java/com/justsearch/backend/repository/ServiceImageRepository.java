package com.justsearch.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.justsearch.backend.model.ServiceImage;

public interface ServiceImageRepository extends JpaRepository<ServiceImage, Long> {
    
}
