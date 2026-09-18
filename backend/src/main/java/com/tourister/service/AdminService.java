package com.tourister.service;

import com.tourister.dto.AdminCreateRequest;
import com.tourister.dto.UserDTO;
import com.tourister.entity.User;
import com.tourister.entity.enums.Role;
import com.tourister.entity.enums.TripStatus;
import com.tourister.exception.BadRequestException;
import com.tourister.repository.ContactMessageRepository;
import com.tourister.repository.TripRequestRepository;
import com.tourister.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final TripRequestRepository tripRepository;
    private final ContactMessageRepository contactRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(UserRepository userRepository,
                        TripRequestRepository tripRepository,
                        ContactMessageRepository contactRepository,
                        PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tripRepository = tripRepository;
        this.contactRepository = contactRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalAdmins", userRepository.countByRole(Role.ROLE_ADMIN));
        stats.put("totalTripRequests", tripRepository.count());
        stats.put("pendingRequests", tripRepository.countByStatus(TripStatus.PENDING));
        stats.put("confirmedRequests", tripRepository.countByStatus(TripStatus.CONFIRMED));
        stats.put("totalContactMessages", contactRepository.count());
        return stats;
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(u -> new UserDTO(u.getId(), u.getFullName(), u.getEmail(), u.getPhone(), u.getRole(), u.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDTO createAdmin(AdminCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User admin = new User();
        admin.setFullName(request.getFullName().trim());
        admin.setEmail(request.getEmail().toLowerCase().trim());
        admin.setPhone(request.getPhone().trim());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setRole(Role.ROLE_ADMIN);

        User savedAdmin = userRepository.save(admin);
        return new UserDTO(savedAdmin.getId(), savedAdmin.getFullName(), savedAdmin.getEmail(), savedAdmin.getPhone(), savedAdmin.getRole(), savedAdmin.getCreatedAt());
    }
}
