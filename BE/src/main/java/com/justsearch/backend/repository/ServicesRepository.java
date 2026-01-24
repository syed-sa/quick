package com.justsearch.backend.repository;

import java.util.List;

import org.hibernate.query.spi.Limit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.justsearch.backend.model.Services;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface ServicesRepository extends JpaRepository<Services, Long> {

        // Checks if a service exists by service provider (user) ID and company name
        boolean existsByServiceProviderIdAndCompanyName(long serviceProviderId, String companyName);

        @Query("""
                        SELECT DISTINCT k
                        FROM Services s JOIN s.keywords k
                        WHERE LOWER(k) LIKE LOWER(CONCAT('%', :q, '%'))
                        """)
        List<String> findKeywordSuggestions(
                        @Param("q") String q,
                        Pageable pageable);

        @Query("""
                            SELECT DISTINCT s FROM Services s
                            LEFT JOIN s.businessCategory c
                            LEFT JOIN c.keywords ck
                            LEFT JOIN s.keywords sk
                            WHERE (LOWER(ck) LIKE LOWER(CONCAT('%', TRIM(:keyword), '%'))
                               OR LOWER(sk) LIKE LOWER(CONCAT('%', TRIM(:keyword), '%')))
                            AND s.postalCode = :postalCode
                        """)
        Page<Services> findByUnifiedKeyword(
                        @Param("keyword") String keyword,
                        @Param("postalCode") String postalCode,
                        Pageable pageable);

        // Find all services by service provider (user) ID
        List<Services> findAllByServiceProviderId(long serviceProviderId);

        List<Services> findAll();

        List<Services> findByBusinessCategory_Id(Long categoryId);

}
