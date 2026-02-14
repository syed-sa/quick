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

                log.debug("Fetching notifications for userId={}", userId);

                List<Notification> notifications = notificationRepository.findByUserIdAndIsActiveTrueOrderByTimestampDesc(userId);

                log.debug("Notifications fetched count={} userId={}",
                                notifications.size(), userId);

                return notificationMapper.toDtoList(notifications);
        }

        @Override
        public void markNotificationAsRead(Long notificationId) {

                log.info("Mark notification as read notificationId={}", notificationId);

                Notification notification = notificationRepository.findById(notificationId)
                                .orElseThrow(() -> {
                                        log.warn("Notification not found notificationId={}", notificationId);
                                        return new IllegalArgumentException("Notification not found");
                                });

                notification.setRead(true);
                notificationRepository.save(notification);

                log.info("Notification marked as read notificationId={}", notificationId);
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

                log.info("Creating provider notification bookingId={}",
                                bookingDetails.getId());

                Notification notification = buildProviderNotification(bookingDetails);
                notificationRepository.save(notification);

                log.info("Provider notification saved notificationId={} userId={}",
                                notification.getId(), notification.getUserId());

                pushToastAsync(notification);
        }

        /**
         * Customer gets notification for rejected/cancelled booking
         */
        @Async
        @Override
        public void createBookingRejectedNotificationAsync(BookingDetails bookingDetails) {

                log.info("Creating customer notification bookingId={} status={}",
                                bookingDetails.getId(), bookingDetails.getBookingStatus());

                Notification notification = buildCustomerNotification(bookingDetails);
                notificationRepository.save(notification);

                log.info("Customer notification saved notificationId={} userId={}",
                                notification.getId(), notification.getUserId());

                pushToastAsync(notification);
        }

        // ---------------------------------------------------------
        // PRIVATE HELPERS
        // ---------------------------------------------------------

        private Notification buildProviderNotification(BookingDetails booking) {

                Notification n = new Notification();
                n.setUserId(booking.getService().getServiceProvider().getId());
                n.setMessage("New booking request from customer: " + booking.getCustomer().getId());
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
                                "Your booking request for service has been " +
                                                booking.getBookingStatus());
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
                        log.debug("Sending toast notification notificationId={} userId={}",
                                        notification.getId(), notification.getUserId());

                        User user = userRepository.findById(notification.getUserId())
                                        .orElse(null);

                        if (user == null) {
                                log.warn("User not found for notification notificationId={}",
                                                notification.getId());
                                return;
                        }

                        ToastMessage toast = new ToastMessage(
                                        notification.getId(),
                                        notification.getNotificationTitle(),
                                        notification.getMessage(),
                                        notification.getTimestamp());

                        messagingTemplate.convertAndSendToUser(
                                        user.getEmail(), // routing only, not logged
                                        "/queue/toast",
                                        toast);

                        log.info("Toast sent notificationId={} userId={}",
                                        notification.getId(), notification.getUserId());

                } catch (Exception e) {
                        log.error("Toast delivery failed notificationId={}",
                                        notification.getId(), e);
                }

        }

        @Override
        public void deactivateNotification(Long notificationId) {
                Notification notification = notificationRepository
                                .findById(notificationId)
                                .orElseThrow(() -> new RuntimeException("Notification not found"));

                notification.setActive(false);
                notificationRepository.save(notification);
        }

}
