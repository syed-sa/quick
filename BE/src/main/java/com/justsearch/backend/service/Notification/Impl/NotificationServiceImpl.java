package com.justsearch.backend.service.Notification.Impl;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.justsearch.backend.constants.AppConstants;
import com.justsearch.backend.dto.NotificationDto;
import com.justsearch.backend.dto.ToastMessage;
import com.justsearch.backend.mapper.NotificationMapper;
import com.justsearch.backend.model.BookingDetails;
import com.justsearch.backend.model.Notification;
import com.justsearch.backend.model.User;
import com.justsearch.backend.repository.NotificationRepository;
import com.justsearch.backend.repository.UserRepository;
import com.justsearch.backend.service.Notification.NotificationService;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationServiceImpl.class);

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
            NotificationMapper notificationMapper,
            SimpMessagingTemplate messagingTemplate,
            UserRepository userRepository) {

        this.notificationRepository = notificationRepository;
        this.notificationMapper = notificationMapper;
        this.messagingTemplate = messagingTemplate;
        this.userRepository = userRepository;
    }

    // ---------------------------------------------------------
    // READ OPERATIONS
    // ---------------------------------------------------------

    @Transactional(readOnly = true)
    @Override
    public List<NotificationDto> getNotificationsForUser(Long userId) {
        List<Notification> notifications = notificationRepository.findAllByUserId(userId);
        return notificationMapper.toDtoList(notifications);
    }

    @Override
    public void markNotificationAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));

        notification.setRead(true);
        notificationRepository.save(notification);

        log.info("Notification {} marked as read", notificationId);
    }

    // ---------------------------------------------------------
    // BOOKING NOTIFICATIONS (ASYNC)
    // ---------------------------------------------------------

    /**
     * Provider gets notification for new booking
     */
    @Async
    @Override
    public void createNotificationAsync(BookingDetails bookingDetails) {
        Notification notification = buildProviderNotification(bookingDetails);
        notificationRepository.save(notification);
        pushToastAsync(notification);
    }

    /**
     * Customer gets notification for rejected/cancelled booking
     */
    @Async
    @Override
    public void createBookingRejectedNotificationAsync(BookingDetails bookingDetails) {
        Notification notification = buildCustomerNotification(bookingDetails);
        notificationRepository.save(notification);
        pushToastAsync(notification);
    }

    // ---------------------------------------------------------
    // PRIVATE HELPERS
    // ---------------------------------------------------------

    private Notification buildProviderNotification(BookingDetails booking) {
        Notification n = new Notification();
        n.setUserId(booking.getService().getServiceProvider().getId());
        n.setMessage("New booking request from customer: " +
                booking.getCustomer().getId());
        n.setNotificationTitle(AppConstants.NEW_BOOKING_REQUEST);
        n.setNotificationType(AppConstants.BOOKING_STATUS_PENDING);
        n.setBookingId(booking.getId());
        n.setTimestamp(LocalDateTime.now());
        n.setRead(false);
        return n;
    }

    private Notification buildCustomerNotification(BookingDetails booking) {
        Notification n = new Notification();
        n.setUserId(booking.getCustomer().getId());
        n.setMessage(
                "Your booking request for service: " +
                        booking.getService().getCompanyName() +
                        " has been " + booking.getBookingStatus());
        n.setNotificationTitle(AppConstants.BOOKING_STATUS_REJECTED);
        n.setNotificationType(AppConstants.BOOKING_STATUS_REJECTED);
        n.setBookingId(booking.getId());
        n.setTimestamp(LocalDateTime.now());
        n.setRead(false);
        return n;
    }

    @Async
    protected void pushToastAsync(Notification notification) {
        try {
            User user = userRepository.findById(notification.getUserId())
                    .orElse(null);

            if (user == null || user.getEmail() == null) {
                log.warn("User not found for notification {}", notification.getId());
                return;
            }

            ToastMessage toast = new ToastMessage(
                    notification.getId(),
                    notification.getNotificationTitle(),
                    notification.getMessage(),
                    notification.getTimestamp());

            messagingTemplate.convertAndSendToUser(
                    user.getEmail(),
                    "/queue/toast",
                    toast);

            log.info("Toast sent to user {} for notification {}",
                    user.getEmail(), notification.getId());

        } catch (Exception e) {
            log.error("Failed to send toast for notification {}",
                    notification.getId(), e);
        }
    }
}
