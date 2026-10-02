package com.tourister;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tourister.dto.AdminCreateRequest;
import com.tourister.dto.AuthRequest;
import com.tourister.dto.RegisterRequest;
import com.tourister.dto.TripRequestDTO;
import com.tourister.entity.User;
import com.tourister.entity.enums.Role;
import com.tourister.entity.enums.TripStatus;
import com.tourister.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class TouristerSecurityAndFlowTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    private String userToken;
    private String adminToken;

    @BeforeEach
    public void setup() throws Exception {
        userRepository.findByEmail("admin2@tourister.com").ifPresent(userRepository::delete);
        userRepository.findByEmail("hacker@example.com").ifPresent(userRepository::delete);
        userRepository.findByEmail("traveler@example.com").ifPresent(userRepository::delete);

        // Register regular user
        RegisterRequest userReg = new RegisterRequest("Test Traveler", "traveler@example.com", "+1234567890", "password123");
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userReg)));

        // Login regular user to get JWT token
        AuthRequest userLogin = new AuthRequest("traveler@example.com", "password123");
        MvcResult userLoginRes = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userLogin)))
                .andExpect(status().isOk())
                .andReturn();

        Map<?, ?> userMap = objectMapper.readValue(userLoginRes.getResponse().getContentAsString(), Map.class);
        Map<?, ?> userData = (Map<?, ?>) userMap.get("data");
        this.userToken = (String) userData.get("token");

        // Login Admin (seeded on startup admin@tourister.com / Admin@12345)
        AuthRequest adminLogin = new AuthRequest("admin@tourister.com", "Admin@12345");
        MvcResult adminLoginRes = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(adminLogin)))
                .andExpect(status().isOk())
                .andReturn();

        Map<?, ?> adminMap = objectMapper.readValue(adminLoginRes.getResponse().getContentAsString(), Map.class);
        Map<?, ?> adminData = (Map<?, ?>) adminMap.get("data");
        this.adminToken = (String) adminData.get("token");
    }

    @Test
    @DisplayName("1. Registration & Password BCrypt Hashing Test")
    public void testUserRegistrationAndPasswordHashing() {
        User user = userRepository.findByEmail("traveler@example.com").orElse(null);
        assertNotNull(user);
        assertEquals("Test Traveler", user.getFullName());
        assertEquals(Role.ROLE_USER, user.getRole());
        // Verify password is BCrypt hashed and not plaintext
        assertNotEquals("password123", user.getPassword());
        assertTrue(user.getPassword().startsWith("$2a$") || user.getPassword().startsWith("$2b$"));
    }

    @Test
    @DisplayName("2. Security Rule: USER cannot access ADMIN endpoints (403 Forbidden)")
    public void testUserCannotAccessAdminEndpoints() throws Exception {
        mockMvc.perform(get("/api/admin/stats")
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("3. Security Rule: USER cannot create another ADMIN account (403 Forbidden)")
    public void testUserCannotCreateAdmin() throws Exception {
        AdminCreateRequest createAdminReq = new AdminCreateRequest();
        createAdminReq.setFullName("Malicious Admin");
        createAdminReq.setEmail("hacker@example.com");
        createAdminReq.setPhone("+1999888777");
        createAdminReq.setPassword("hacked123");

        mockMvc.perform(post("/api/admin/admins")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createAdminReq)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("4. Security Rule: ADMIN can create another ADMIN successfully")
    public void testAdminCanCreateAdmin() throws Exception {
        AdminCreateRequest createAdminReq = new AdminCreateRequest();
        createAdminReq.setFullName("Second Admin");
        createAdminReq.setEmail("admin2@tourister.com");
        createAdminReq.setPhone("+18005550200");
        createAdminReq.setPassword("Admin2Password!");

        mockMvc.perform(post("/api/admin/admins")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createAdminReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.email").value("admin2@tourister.com"))
                .andExpect(jsonPath("$.data.role").value("ROLE_ADMIN"));
    }

    @Test
    @DisplayName("5. Trip Flow: USER submits trip request & views in Dashboard")
    public void testUserTripSubmissionFlow() throws Exception {
        TripRequestDTO dto = new TripRequestDTO();
        dto.setStartingLocation("New York");
        dto.setDestination("Swiss Alps & European Delights");
        dto.setNumberOfTravelers(2);
        dto.setTransportation("Flight, Local Transportation");
        dto.setAccommodation("Premium");
        dto.setEstimatedBudget(new BigDecimal("4000.00"));

        MvcResult createRes = mockMvc.perform(post("/api/trips")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.status").value("PENDING"))
                .andReturn();

        // Verify it appears in user's trip list
        mockMvc.perform(get("/api/trips/my")
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].destination").value("Swiss Alps & European Delights"));
    }

    @Test
    @DisplayName("6. Admin Flow: ADMIN views trips and updates status")
    public void testAdminViewAndUpdateTripStatus() throws Exception {
        // Create trip as user
        TripRequestDTO dto = new TripRequestDTO();
        dto.setDestination("Bali Tropical Paradise");
        dto.setNumberOfTravelers(1);

        MvcResult createRes = mockMvc.perform(post("/api/trips")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andReturn();

        Map<?, ?> map = objectMapper.readValue(createRes.getResponse().getContentAsString(), Map.class);
        Map<?, ?> tripData = (Map<?, ?>) map.get("data");
        Number tripId = (Number) tripData.get("id");

        // Admin updates status to CONFIRMED
        mockMvc.perform(put("/api/admin/trips/" + tripId + "/status")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\": \"CONFIRMED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("CONFIRMED"));
    }
}
