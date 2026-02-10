package com.justsearch.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.justsearch.backend.dto.BookingDetailsDto;
import com.justsearch.backend.model.CachedResponse;
import com.justsearch.backend.ratelimit.annotation.RateLimit;
import com.justsearch.backend.service.QuickServices.BookService;
import com.justsearch.backend.service.idempotency.IdempotencyService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("api/bookservice")
public class BookServiceController {

    private BookService _bookService;
    private IdempotencyService idempotencyService;
    private static final org.slf4j.Logger _logger = org.slf4j.LoggerFactory.getLogger(BookServiceController.class);

    public BookServiceController(BookService bookService, IdempotencyService idempotencyService) {
        _bookService = bookService;
        this.idempotencyService = idempotencyService;
    }

    @RateLimit(key = "BOOK_SERVICE", capacity = 10, refillTokens = 10, refillDurationSeconds = 600, perUser = true)
    @PostMapping("/RequestBooking")

    public ResponseEntity<?> bookService(@RequestBody BookingDetailsDto bookServiceDto, HttpServletRequest request) {
        try {

            _bookService.createBookingRequest(bookServiceDto);
            String body = """
                    {"message":"Booking created successfully"}
                    """;

            String redisKey = (String) request.getAttribute("IDEMPOTENCY_KEY");

            if (redisKey != null) {
                idempotencyService.saveResponse(
                        redisKey,
                        new CachedResponse(200, body));
            }
            return ResponseEntity.ok().body(body);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error Booking service: " + e.getMessage());
        }
    }

    @GetMapping("/GetBookingRequests/{serviceId}")
    public ResponseEntity<?> getBookingRequests(@PathVariable long serviceId) {
        try {
            _logger.info("Fetching booking requests for service ID: " + serviceId);
            var response = _bookService.getBookingRequests(serviceId);
            _logger.info("Successfully fetched booking requests for service ID: " + serviceId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            _logger.error("Error fetching booking requests for service ID: " + serviceId, e);   
            return ResponseEntity.internalServerError().body("Error fetching booking requests: " + e.getMessage());
        }
    }

    @GetMapping("/GetMyBookings/{userId}")
    
    public ResponseEntity<?> getMyBookings(@PathVariable long userId) {
        try {
            return ResponseEntity.ok(_bookService.getMyBookings(userId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching my bookings: " + e.getMessage());
        }
    }

    @RateLimit(key = "UPDATE_BOOKING", capacity = 20, refillTokens = 20, refillDurationSeconds = 600, perUser = true)
    @PostMapping("/UpdateBookingStatus/{bookingId}")
    public ResponseEntity<?> updateBooking(@PathVariable long bookingId, @RequestParam String status,
            HttpServletRequest request) {
        try {
            _bookService.updateBooking(bookingId, status);
            String body = """
                    {"message":"Booking updated successfully"}
                    """;
            String redisKey = (String) request.getAttribute("IDEMPOTENCY_KEY");
            if (redisKey != null) {
                idempotencyService.saveResponse(
                        redisKey,
                        new CachedResponse(200, body));
            }
            return ResponseEntity.ok().body(body);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating booking: " + e.getMessage());
        }
    }

    @GetMapping("/getRecentBookings")
    public ResponseEntity<?> getRecentBookings() {
        try {
            return ResponseEntity.ok(_bookService.getRecentBookings());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching recent bookings: " + e.getMessage());
        }
    }
}