package com.tourister.repository;

import com.tourister.entity.TripRequest;
import com.tourister.entity.enums.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripRequestRepository extends JpaRepository<TripRequest, Long> {
    List<TripRequest> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT t FROM TripRequest t WHERE t.requestId = :requestId")
    Optional<TripRequest> findByRequestId(@Param("requestId") String requestId);

    long countByStatus(TripStatus status);
    List<TripRequest> findAllByOrderByCreatedAtDesc();
}
