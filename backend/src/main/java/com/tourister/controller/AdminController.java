package com.tourister.controller;

import com.tourister.dto.*;
import com.tourister.entity.ContactMessage;
import com.tourister.service.AdminService;
import com.tourister.service.ContactService;
import com.tourister.service.TripService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final TripService tripService;
    private final ContactService contactService;

    public AdminController(AdminService adminService,
                           TripService tripService,
                           ContactService contactService) {
        this.adminService = adminService;
        this.tripService = tripService;
        this.contactService = contactService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard statistics retrieved", stats));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
        List<UserDTO> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("User list retrieved", users));
    }

    @GetMapping("/trips")
    public ResponseEntity<ApiResponse<List<TripRequestDTO>>> getAllTripRequests() {
        List<TripRequestDTO> trips = tripService.getAllTripsForAdmin();
        return ResponseEntity.ok(ApiResponse.success("All trip requests retrieved", trips));
    }

    @PutMapping("/trips/{id}/status")
    public ResponseEntity<ApiResponse<TripRequestDTO>> updateTripStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        TripRequestDTO updated = tripService.updateTripStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Trip status updated to " + request.getStatus(), updated));
    }

    @PostMapping("/admins")
    public ResponseEntity<ApiResponse<UserDTO>> createAdmin(@Valid @RequestBody AdminCreateRequest request) {
        UserDTO admin = adminService.createAdmin(request);
        return ResponseEntity.status(201).body(ApiResponse.created("New administrator account created successfully", admin));
    }

    @GetMapping("/contact-messages")
    public ResponseEntity<ApiResponse<List<ContactMessage>>> getContactMessages() {
        List<ContactMessage> messages = contactService.getAllContactMessages();
        return ResponseEntity.ok(ApiResponse.success("Contact messages retrieved", messages));
    }
}
