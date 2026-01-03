package com.justsearch.backend.service.QuickServices.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.justsearch.backend.constants.AppConstants;
import com.justsearch.backend.dto.BookingDetailsDto;
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

@Service
public class BookServiceImpl implements BookService {

    private BookingDetailsRepository _bookingDetailsRepository;
    private ServicesRepository _servicesRepository;
    private UserRepository _userRepository;
    private NotificationService _notificationService;
    private BookingDetailsMapper _bookingDetailsMapper;
    private final ServiceMapper _serviceMapper;
    private CategoryRepository _categoryRepository;

    public BookServiceImpl(BookingDetailsRepository bookingDetailsRepository, ServicesRepository servicesRepository,
            UserRepository userRepository, NotificationService notificationService,
            BookingDetailsMapper bookingDetailsMapper, ServiceMapper serviceMapper,
            CategoryRepository categoryRepository) {
        _bookingDetailsRepository = bookingDetailsRepository;
        _servicesRepository = servicesRepository;
        _userRepository = userRepository;
        _notificationService = notificationService;
        _bookingDetailsMapper = bookingDetailsMapper;
        _serviceMapper = serviceMapper;
        _categoryRepository = categoryRepository;
    }
    /// Get global keyword suggestions from both categories and services
    /// @param query The input query string for suggestions
    /// @return A list of up to 10 unique keyword suggestions

    public List<String> getGlobalSuggestions(String query) {

        String cleanQuery = query.trim().toLowerCase();

        // 2. Fetch from both sources with a strict limit (Top 10 from each)
        // We use Limit.of(10) to prevent deep database scanning
        List<String> catKeywords = _categoryRepository.findKeywordSuggestions(
                cleanQuery,
                PageRequest.of(0, 10));

        List<String> serviceKeywords = _servicesRepository.findKeywordSuggestions(
                cleanQuery,
                PageRequest.of(0, 10));

        // 3. Merge into a Set to remove duplicates
        // TreeSet with CASE_INSENSITIVE_ORDER keeps them alphabetical
        Set<String> combinedResults = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);

        combinedResults.addAll(catKeywords);
        combinedResults.addAll(serviceKeywords);

        return combinedResults.stream()
                .limit(10)
                .toList();
    }

    public Page<ServiceDto> getResults(String selectedKeyword, String postalCode, int page, int size) {
        // Create the pageable object (sorted by company name by default)
        Pageable pageable = PageRequest.of(page, size, Sort.by("companyName").ascending());

        // Fetch the page of entities
        Page<Services> servicesPage = _servicesRepository.findByUnifiedKeyword(selectedKeyword, postalCode, pageable);

        // Map the Page of Entities to a Page of DTOs
        return servicesPage.map(service -> _serviceMapper.toDto(service));
    }

    public void createBookingRequest(BookingDetailsDto bookserviceDto) {
        if (bookserviceDto == null) {
            throw new IllegalArgumentException("service must not be null");
        }

        User customer = _userRepository.findById(bookserviceDto.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid customer ID"));

        Services service = _servicesRepository.findById(bookserviceDto.getServiceId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid service ID"));

        BookingDetails bookingDetails = new BookingDetails();
        bookingDetails.setCustomer(customer);
        bookingDetails.setService(service);
        bookingDetails.setBookingStatus(AppConstants.BOOKING_STATUS_PENDING);
        bookingDetails.setDescription(bookserviceDto.getDescription());
        bookingDetails.setCreatedAt(LocalDateTime.now());
        bookingDetails.setLocation(bookserviceDto.getLocation());
        bookingDetails.setActive(true);
        _bookingDetailsRepository.save(bookingDetails);
        _notificationService.createNotification(bookingDetails);
        System.out.println("Booking request created successfully for service: " +
                bookingDetails.getService().getCompanyName() + " with ID: " + bookingDetails.getId());
    }

    public List<BookingDetailsDto> getBookingRequests(long serviceProviderId) {
        var bookService = _bookingDetailsRepository.fetchBookingsWithCustomerInfo(serviceProviderId);
        return _bookingDetailsMapper.toDtoList(bookService);
    }

    public List<BookingDetailsDto> getMyBookings(long userId) {
        List<BookingDetails> bookService = _bookingDetailsRepository.fetchBookingsWithServiceProviderInfo(userId);
        return _bookingDetailsMapper.toDtoList(bookService);
    }

    public void updateBooking(long bookingId, String status) {
        BookingDetails bookingDetails = _bookingDetailsRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid booking ID"));
        bookingDetails.setBookingStatus(status);
        if (status.equals(AppConstants.BOOKING_STATUS_CANCELLED)
                || status.equals(AppConstants.BOOKING_STATUS_REJECTED)) {
            _notificationService.createBookingRejectedNotification(bookingDetails);
            bookingDetails.setActive(false);
        }
        _bookingDetailsRepository.save(bookingDetails);
    }

    public List<BookingDetailsDto> getRecentBookings() {
        List<BookingDetails> recentBookings = _bookingDetailsRepository.findTop10ByOrderByCreatedAtDesc();
        return _bookingDetailsMapper.toDtoList(recentBookings);
    }

    public List<ServiceDto> getAllServices(String category) {

        // If category is absent or empty → return all
        if (category == null || category.trim().isEmpty()) {
            return _servicesRepository.findAll()
                    .stream()
                    .map(_serviceMapper::toDto)
                    .toList();
        }

        // Otherwise, return filtered list
        BuisnessCategory categoryEntity = _categoryRepository.findByExactKeyword(category)
                .orElseThrow(() -> new IllegalArgumentException("Invalid category: " + category));

        return _servicesRepository.findAll()
                .stream()
                .filter(service -> service.getBusinessCategory().getId() == categoryEntity.getId())
                .map(_serviceMapper::toDto)
                .toList();
    }

}
