package com.justsearch.backend.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.justsearch.backend.dto.NotificationDto;
import com.justsearch.backend.service.Notification.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private NotificationService _notificationService;

    public NotificationController(NotificationService notificationService) {
        _notificationService = notificationService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<NotificationDto>> getNotificationsForUser(@PathVariable Long userId) {
        List<NotificationDto> notifications = _notificationService.getNotificationsForUser(userId);
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/read/{notificationId}")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Long notificationId) {
        _notificationService.markNotificationAsRead(notificationId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/deactivate/{notificationId}")
    public ResponseEntity<Void> deactivateNotification(@PathVariable Long notificationId) {
        _notificationService.deactivateNotification(notificationId);
        return ResponseEntity.noContent().build();
    }
}