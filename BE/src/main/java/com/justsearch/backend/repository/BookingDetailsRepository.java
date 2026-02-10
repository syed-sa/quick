package com.justsearch.backend.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.justsearch.backend.model.BookingDetails;
@Repository
public interface BookingDetailsRepository extends JpaRepository<BookingDetails,Long> {


  @Query("SELECT b FROM BookingDetails b " +
       "JOIN FETCH b.customer c " +
       "JOIN FETCH b.service s " +
       "JOIN FETCH s.serviceProvider sp " +
       "WHERE s.id = :serviceId")
List<BookingDetails> fetchbookingbyServiceId(@Param("serviceId") Long serviceId);

@Query("SELECT b FROM BookingDetails b " +
       "JOIN FETCH b.customer c " +
       "JOIN FETCH b.service s " +
       "JOIN FETCH s.serviceProvider sp " +
       "WHERE c.id = :customerId")
List<BookingDetails> fetchBookingsWithServiceProviderInfo(@Param("customerId") Long customerId);

 List<BookingDetails> findTop10ByOrderByCreatedAtDesc();

} 