package com.tourister.repository;

import com.tourister.entity.TourPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface TourPackageRepository extends JpaRepository<TourPackage, Long> {
    
    List<TourPackage> findByFeaturedTrue();

    @Query("SELECT p FROM TourPackage p WHERE " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.destination) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:destination IS NULL OR LOWER(p.destination) LIKE LOWER(CONCAT('%', :destination, '%'))) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:maxDuration IS NULL OR p.durationDays <= :maxDuration)")
    List<TourPackage> searchPackages(
            @Param("search") String search,
            @Param("destination") String destination,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("maxDuration") Integer maxDuration
    );
}
