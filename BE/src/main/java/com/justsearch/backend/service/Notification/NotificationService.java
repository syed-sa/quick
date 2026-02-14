package com.justsearch.backend.service.Notification;

import java.util.List;
import com.justsearch.backend.dto.NotificationDto;
import com.justsearch.backend.model.BookingDetails;

public interface NotificationService {

    public List<NotificationDto> getNotificationsForUser(Long userId);

    public void markNotificationAsRead(Long notificationId);

    public void createNotificationAsync(BookingDetails bookingDetails);

    public void createBookingRejectedNotificationAsync(BookingDetails bookingDetails);


    void deactivateNotification(Long notificationId);

}
