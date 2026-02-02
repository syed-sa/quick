package com.justsearch.backend.service.QuickServices.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.CompletableFuture;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.justsearch.backend.constants.AppConstants;
import com.justsearch.backend.dto.BookingDetailsDto;
import com.justsearch.backend.dto.PageResponse;
import com.justsearch.backend.dto.ServiceDto;
import com.justsearch.backend.mapper.BookingDetailsMapper;
import com.justsearch.backend.mapper.ServiceMapper;
import com.justsearch.backend.model.BookingDetails;
import com.justsearch.backend.model.BuisnessCategory;
import com.justsearch.backend.model.Services;
import com.justsearch.backend.model.User;
import com.justsearch.backend.repository.BookingDetailsRepository;
import com.justsearch.backend.repository.CategoryRepository;
import com.justsearch.backend.repository.ServicesRepository;
import com.justsearch.backend.repository.UserRepository;
import com.justsearch.backend.service.Notification.NotificationService;
import com.justsearch.backend.service.QuickServices.BookService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@Transactional
public class BookServiceImpl implements BookService {

    private static final Logger log = LoggerFactory.getLogger(BookServiceImpl.class);

    private final BookingDetailsRepository bookingDetailsRepository;
    private final ServicesRepository servicesRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final BookingDetailsMapper bookingDetailsMapper;
    private final ServiceMapper serviceMapper;
    private final CategoryRepository categoryRepository;

    public BookServiceImpl(
            BookingDetailsRepository bookingDetailsRepository,
            ServicesRepository servicesRepository,
            UserRepository userRepository,
            NotificationService notificationService,
            BookingDetailsMapper bookingDetailsMapper,
            ServiceMapper serviceMapper,
            CategoryRepository categoryRepository) {

        this.bookingDetailsRepository = bookingDetailsRepository;
        this.servicesRepository = servicesRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.bookingDetailsMapper = bookingDetailsMapper;
        this.serviceMapper = serviceMapper;
        this.categoryRepository = categoryRepository;
    }
    /// Get global keyword suggestions from both categories and services
    /// @param query The input query string for suggestions
    /// @return A list of up to 10 unique keyword suggestions

    @Transactional(readOnly = true)
    public List<String> getGlobalSuggestions(String query) {
        log.debug("Fetching global suggestions for query={}", query);

        String cleanQuery = query.trim().toLowerCase();

        CompletableFuture<List<String>> categoriesFuture = CompletableFuture
                .supplyAsync(() -> categoryRepository.findKeywordSuggestions(cleanQuery, PageRequest.of(0, 10)));

        CompletableFuture<List<String>> servicesFuture = CompletableFuture
                .supplyAsync(() -> servicesRepository.findKeywordSuggestions(cleanQuery, PageRequest.of(0, 10)));

        List<String> result = categoriesFuture.thenCombine(servicesFuture, (cats, services) -> {
            Set<String> combined = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
            combined.addAll(cats);
            combined.addAll(services);
            return combined.stream().limit(10).toList();
        }).join();
        log.debug("Suggestions count={}", result.size());
        return result;
    }

    // -------------------- SEARCH RESULTS --------------------
    @Cacheable(value = "service-search", key = "#keyword + ':' + #postalCode + ':' + #page + ':' + #size")
    @Transactional(readOnly = true)
    public PageResponse<ServiceDto> getResults(String keyword, String postalCode, int page, int size) {

        log.info("Service search initiated keyword={}, postalCode={}, page={}, size={}",
                keyword, postalCode, page, size);

        Pageable pageable = PageRequest.of(page, size, Sort.by("companyName").ascending());

        Page<ServiceDto> result = servicesRepository
                .findByUnifiedKeyword(keyword, postalCode, pageable)
                .map(serviceMapper::toDto);

         PageResponse<ServiceDto> response =
                new PageResponse<>(
                        result.getContent(),
                        result.getTotalElements(),
                        result.getTotalPages(),
                        result.getNumber(),
                        result.getSize()
                );
        log.info("Search completed resultsCount={}", response.getTotalElements());
        return response;
    }

    // -------------------- CREATE BOOKING --------------------

    public void createBookingRequest(BookingDetailsDto dto) {

        if (dto == null) {
            log.warn("Booking request failed: dto is null");
            throw new IllegalArgumentException("Booking details must not be null");
        }
        log.info("Creating booking request customerId={}, serviceId={}",
                dto.getCustomerId(), dto.getServiceId());
        User customer = userRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid customer ID"));

        Services service = servicesRepository.findById(dto.getServiceId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid service ID"));

        BookingDetails booking = new BookingDetails();
        booking.setCustomer(customer);
        booking.setService(service);

        booking.setBookingStatus(AppConstants.BOOKING_STATUS_PENDING);
        booking.setDescription(dto.getDescription());
        booking.setLocation(dto.getLocation());
        booking.setCreatedAt(LocalDateTime.now());
        booking.setActive(true);

        bookingDetailsRepository.save(booking);

        // async side effect
        notificationService.createNotificationAsync(booking);

        log.info("Booking created: bookingId={}, service={}",
                booking.getId(), service.getCompanyName());
    }

    // -------------------- FETCH BOOKINGS --------------------

    @Transactional(readOnly = true)
    public List<BookingDetailsDto> getBookingRequests(long serviceProviderId) {
        return bookingDetailsMapper.toDtoList(
                bookingDetailsRepository.fetchBookingsWithCustomerInfo(serviceProviderId));
    }

    @Transactional(readOnly = true)
    public List<BookingDetailsDto> getMyBookings(long userId) {
        log.debug("Fetching bookings for userId={}", userId);

        return bookingDetailsMapper.toDtoList(
                bookingDetailsRepository.fetchBookingsWithServiceProviderInfo(userId));
    }

    // -------------------- UPDATE BOOKING --------------------

    public void updateBooking(long bookingId, String status) {
        log.info("Updating booking bookingId={}, newStatus={}", bookingId, status);

        BookingDetails booking = bookingDetailsRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid booking ID"));

        booking.setBookingStatus(status);

        if (AppConstants.BOOKING_STATUS_CANCELLED.equals(status)
                || AppConstants.BOOKING_STATUS_REJECTED.equals(status)) {

            booking.setActive(false);
            notificationService.createBookingRejectedNotificationAsync(booking);
            log.info("Booking deactivated bookingId={}", bookingId);

        }

        bookingDetailsRepository.save(booking);
    }

    public List<BookingDetailsDto> getRecentBookings() {
        List<BookingDetails> recentBookings = bookingDetailsRepository.findTop10ByOrderByCreatedAtDesc();
        return bookingDetailsMapper.toDtoList(recentBookings);
    }

    public List<ServiceDto> getAllServices(String category) {
        if (category == null || category.trim().isEmpty()) {
            log.debug("Fetching all services (no category filter)");

            return servicesRepository.findAll()
                    .stream()
                    .map(serviceMapper::toDto)
                    .toList();
        }
        log.info("Fetching services for category={}", category);

        BuisnessCategory categoryEntity = categoryRepository.findByExactKeyword(category)
                .orElseThrow(() -> {
                    log.warn("Invalid category filter={}", category);
                    return new IllegalArgumentException("Invalid category: " + category);
                });

        return servicesRepository.findByBusinessCategory_Id(categoryEntity.getId())
                .stream()
                .map(serviceMapper::toDto)
                .toList();
    }

}
