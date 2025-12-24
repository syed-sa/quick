package com.justsearch.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.justsearch.backend.model.BuisnessCategory;

@Repository
public interface CategoryRepository extends JpaRepository<BuisnessCategory, Long> {

    @Query("""
            SELECT DISTINCT k
            FROM BuisnessCategory c JOIN c.keywords k
            WHERE LOWER(k) LIKE LOWER(CONCAT('%', :q, '%'))
            """)
    List<String> findKeywordSuggestions(
            @Param("q") String q,
            Pageable pageable);

    // 2. FOR SELECTION: Finds the specific category once a keyword is picked
    @Query("SELECT c FROM BuisnessCategory c WHERE :selectedKeyword MEMBER OF c.keywords")
    Optional<BuisnessCategory> findByExactKeyword(@Param("selectedKeyword") String selectedKeyword);

        @Query("""
        SELECT DISTINCT c
        FROM BuisnessCategory c
        JOIN c.keywords k
        WHERE LOWER(k) LIKE LOWER(CONCAT('%', :query, '%'))
           OR LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%'))
    """)
    List<BuisnessCategory> findMatchingCategories(@Param("query") String query);
}
