package com.justsearch.backend.service.QuickServices;
import java.util.List;
import com.justsearch.backend.dto.BookingDetailsDto;
import com.justsearch.backend.dto.ServiceDto;
import org.springframework.data.domain.Page;

public interface BookService {

    void createBookingRequest(BookingDetailsDto bookserviceDto);

    List<BookingDetailsDto> getBookingRequests(long userId);

    List<BookingDetailsDto> getMyBookings(long userId);

    void updateBooking(long bookingId, String status);

    List<BookingDetailsDto> getRecentBookings();

    List<String> getGlobalSuggestions(String q);

    List<ServiceDto> getAllServices(String category);

    Page<ServiceDto> getResults(String selectedKeyword, String postalCode, int page, int size);

}