package com.tourister.entity;

import com.tourister.entity.enums.TripStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "trip_requests")
public class TripRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String requestId;

    @Column(nullable = false)
    private Long userId;

    private String userFullName;
    private String userEmail;
    private String userPhone;

    private String startingLocation;

    @Column(nullable = false)
    private String destination;

    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean flexibleDates = false;

    private Integer numberOfTravelers = 1;

    private String transportation;
    private String accommodation;
    private Integer numberOfRooms = 1;
    private String roomPreferences;
    private String foodPreference;

    private BigDecimal estimatedBudget;
    private String currency = "USD";

    @Column(columnDefinition = "TEXT")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String specialRequirements;

    @Column(columnDefinition = "TEXT")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String travelPreferences;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TripStatus status = TripStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public TripRequest() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserFullName() { return userFullName; }
    public void setUserFullName(String userFullName) { this.userFullName = userFullName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserPhone() { return userPhone; }
    public void setUserPhone(String userPhone) { this.userPhone = userPhone; }

    public String getStartingLocation() { return startingLocation; }
    public void setStartingLocation(String startingLocation) { this.startingLocation = startingLocation; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Boolean getFlexibleDates() { return flexibleDates; }
    public void setFlexibleDates(Boolean flexibleDates) { this.flexibleDates = flexibleDates; }

    public Integer getNumberOfTravelers() { return numberOfTravelers; }
    public void setNumberOfTravelers(Integer numberOfTravelers) { this.numberOfTravelers = numberOfTravelers; }

    public String getTransportation() { return transportation; }
    public void setTransportation(String transportation) { this.transportation = transportation; }

    public String getAccommodation() { return accommodation; }
    public void setAccommodation(String accommodation) { this.accommodation = accommodation; }

    public Integer getNumberOfRooms() { return numberOfRooms; }
    public void setNumberOfRooms(Integer numberOfRooms) { this.numberOfRooms = numberOfRooms; }

    public String getRoomPreferences() { return roomPreferences; }
    public void setRoomPreferences(String roomPreferences) { this.roomPreferences = roomPreferences; }

    public String getFoodPreference() { return foodPreference; }
    public void setFoodPreference(String foodPreference) { this.foodPreference = foodPreference; }

    public BigDecimal getEstimatedBudget() { return estimatedBudget; }
    public void setEstimatedBudget(BigDecimal estimatedBudget) { this.estimatedBudget = estimatedBudget; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getSpecialRequirements() { return specialRequirements; }
    public void setSpecialRequirements(String specialRequirements) { this.specialRequirements = specialRequirements; }

    public String getTravelPreferences() { return travelPreferences; }
    public void setTravelPreferences(String travelPreferences) { this.travelPreferences = travelPreferences; }

    public TripStatus getStatus() { return status; }
    public void setStatus(TripStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
