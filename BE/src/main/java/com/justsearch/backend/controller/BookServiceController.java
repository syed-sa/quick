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
import com.justsearch.backend.service.QuickServices.BookService;

@RestController
@RequestMapping("api/bookservice")
public class BookServiceController {

    private BookService _bookService;

    public BookServiceController(BookService bookService) {
        _bookService = bookService;
    }

    @PostMapping("/RequestBooking")
    public ResponseEntity<?> bookService(@RequestBody BookingDetailsDto bookServiceDto) {
        try {

            _bookService.createBookingRequest(bookServiceDto);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error Booking service: " + e.getMessage());
        }
    }

    @GetMapping("/GetBookingRequests/{userId}")
    public ResponseEntity<?> getBookingRequests(@PathVariable long userId) {
        try {
            return ResponseEntity.ok(_bookService.getBookingRequests(userId));
        } catch (Exception e) {
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

    @PostMapping("/UpdateBookingStatus/{bookingId}")
    public ResponseEntity<?> updateBooking(@PathVariable long bookingId, @RequestParam String status) {
        try {
            _bookService.updateBooking(bookingId, status);
            return ResponseEntity.ok().build();
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