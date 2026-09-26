package com.tourister.service;

import com.tourister.dto.TripRequestDTO;
import com.tourister.entity.TripRequest;
import com.tourister.entity.User;
import com.tourister.entity.enums.Role;
import com.tourister.entity.enums.TripStatus;
import com.tourister.exception.ResourceNotFoundException;
import com.tourister.exception.UnauthorizedException;
import com.tourister.repository.TripRequestRepository;
import com.tourister.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class TripService {

    private final TripRequestRepository tripRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public TripService(TripRequestRepository tripRepository, UserRepository userRepository, EmailService emailService) {
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @Transactional
    public TripRequestDTO createTripRequest(TripRequestDTO dto, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        TripRequest trip = new TripRequest();
        trip.setRequestId(generateUniqueRequestId());
        trip.setUserId(user.getId());
        trip.setUserFullName(dto.getUserFullName() != null ? dto.getUserFullName() : user.getFullName());
        trip.setUserEmail(dto.getUserEmail() != null ? dto.getUserEmail() : user.getEmail());
        trip.setUserPhone(dto.getUserPhone() != null ? dto.getUserPhone() : user.getPhone());
        
        trip.setStartingLocation(dto.getStartingLocation());
        trip.setDestination(dto.getDestination());
        trip.setStartDate(dto.getStartDate());
        trip.setEndDate(dto.getEndDate());
        trip.setFlexibleDates(dto.getFlexibleDates() != null ? dto.getFlexibleDates() : false);
        
        trip.setNumberOfTravelers(dto.getNumberOfTravelers() != null ? dto.getNumberOfTravelers() : 1);
        trip.setTransportation(dto.getTransportation());
        trip.setAccommodation(dto.getAccommodation());
        trip.setNumberOfRooms(dto.getNumberOfRooms() != null ? dto.getNumberOfRooms() : 1);
        trip.setRoomPreferences(dto.getRoomPreferences());
        trip.setFoodPreference(dto.getFoodPreference());
        
        trip.setEstimatedBudget(dto.getEstimatedBudget());
        trip.setCurrency(dto.getCurrency() != null ? dto.getCurrency() : "INR");
        trip.setSpecialRequirements(dto.getSpecialRequirements());
        trip.setTravelPreferences(dto.getTravelPreferences());
        trip.setStatus(TripStatus.PENDING);

        TripRequest saved = tripRepository.save(trip);
        
        // Trigger confirmation email to user
        try {
            emailService.sendTripConfirmationEmail(saved);
        } catch (Exception e) {
            // Log but do not interrupt trip creation transaction
            System.err.println("Notice: Confirmation email dispatch log: " + e.getMessage());
        }

        return mapToDTO(saved);
    }

    public List<TripRequestDTO> getMyTrips(Long userId) {
        return tripRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public TripRequestDTO getTripById(Long id, Long currentUserId, Role currentUserRole) {
        TripRequest trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip request not found with id: " + id));

        if (!currentUserRole.equals(Role.ROLE_ADMIN) && !trip.getUserId().equals(currentUserId)) {
            throw new UnauthorizedException("You are not authorized to view this trip request");
        }

        return mapToDTO(trip);
    }

    public List<TripRequestDTO> getAllTripsForAdmin() {
        return tripRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TripRequestDTO updateTripStatus(Long id, TripStatus status) {
        TripRequest trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip request not found with id: " + id));

        trip.setStatus(status);
        TripRequest updated = tripRepository.save(trip);
        return mapToDTO(updated);
    }

    private String generateUniqueRequestId() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder("TRIP-2026-");
        Random random = new Random();
        for (int i = 0; i < 6; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    private TripRequestDTO mapToDTO(TripRequest entity) {
        TripRequestDTO dto = new TripRequestDTO();
        dto.setId(entity.getId());
        dto.setRequestId(entity.getRequestId());
        dto.setUserId(entity.getUserId());
        dto.setUserFullName(entity.getUserFullName());
        dto.setUserEmail(entity.getUserEmail());
        dto.setUserPhone(entity.getUserPhone());
        dto.setStartingLocation(entity.getStartingLocation());
        dto.setDestination(entity.getDestination());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        dto.setFlexibleDates(entity.getFlexibleDates());
        dto.setNumberOfTravelers(entity.getNumberOfTravelers());
        dto.setTransportation(entity.getTransportation());
        dto.setAccommodation(entity.getAccommodation());
        dto.setNumberOfRooms(entity.getNumberOfRooms());
        dto.setRoomPreferences(entity.getRoomPreferences());
        dto.setFoodPreference(entity.getFoodPreference());
        dto.setEstimatedBudget(entity.getEstimatedBudget());
        dto.setCurrency(entity.getCurrency());
        dto.setSpecialRequirements(entity.getSpecialRequirements());
        dto.setTravelPreferences(entity.getTravelPreferences());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
}
