package com.justsearch.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.justsearch.backend.model.Notification;
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {


   List<Notification> findByUserIdAndIsActiveTrueOrderByTimestampDesc(Long userId);

}
