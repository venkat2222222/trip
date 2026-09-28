package com.tourister.repository;

import com.tourister.entity.Place;
import com.tourister.entity.enums.PlaceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {

    List<Place> findByPopularTrueOrderByIdDesc();
    List<Place> findAllByOrderByIdDesc();

    @Query("SELECT p FROM Place p WHERE " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.location) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:location IS NULL OR LOWER(p.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:category IS NULL OR p.category = :category) " +
           "ORDER BY p.id DESC")
    List<Place> searchPlaces(
            @Param("search") String search,
            @Param("location") String location,
            @Param("category") PlaceCategory category
    );
}
