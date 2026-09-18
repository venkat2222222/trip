package com.tourister.controller;

import com.tourister.dto.ApiResponse;
import com.tourister.dto.TripRequestDTO;
import com.tourister.entity.enums.Role;
import com.tourister.service.TripService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TripRequestDTO>> createTripRequest(
            @Valid @RequestBody TripRequestDTO dto,
            HttpServletRequest request) {
        String email = (String) request.getAttribute("userEmail");
        TripRequestDTO created = tripService.createTripRequest(dto, email);
        return ResponseEntity.status(201).body(ApiResponse.created("Trip request submitted successfully", created));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<TripRequestDTO>>> getMyTrips(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        List<TripRequestDTO> trips = tripService.getMyTrips(userId);
        return ResponseEntity.ok(ApiResponse.success("Your trip requests retrieved successfully", trips));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TripRequestDTO>> getTripById(@PathVariable Long id, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        String roleStr = (String) request.getAttribute("userRole");
        Role role = Role.valueOf(roleStr);

        TripRequestDTO trip = tripService.getTripById(id, userId, role);
        return ResponseEntity.ok(ApiResponse.success("Trip request details retrieved", trip));
    }
}
