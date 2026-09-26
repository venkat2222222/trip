package com.tourister.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "site_contents")
public class SiteContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Contact Information
    private String contactPhone;
    private String contactEmail;
    @Column(columnDefinition = "TEXT")
    private String contactAddress;
    private String operatingHours;

    // About Us Content
    private String aboutTitle;
    private String aboutTagline;
    @Column(columnDefinition = "TEXT")
    private String aboutStory;
    @Column(columnDefinition = "TEXT")
    private String aboutMission;
    @Column(columnDefinition = "TEXT")
    private String aboutVision;

    private String happyTravelers;
    private String destinationsCount;
    private String experienceYears;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public SiteContent() {}

    @PrePersist
    @PreUpdate
    protected void onSave() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getContactAddress() { return contactAddress; }
    public void setContactAddress(String contactAddress) { this.contactAddress = contactAddress; }

    public String getOperatingHours() { return operatingHours; }
    public void setOperatingHours(String operatingHours) { this.operatingHours = operatingHours; }

    public String getAboutTitle() { return aboutTitle; }
    public void setAboutTitle(String aboutTitle) { this.aboutTitle = aboutTitle; }

    public String getAboutTagline() { return aboutTagline; }
    public void setAboutTagline(String aboutTagline) { this.aboutTagline = aboutTagline; }

    public String getAboutStory() { return aboutStory; }
    public void setAboutStory(String aboutStory) { this.aboutStory = aboutStory; }

    public String getAboutMission() { return aboutMission; }
    public void setAboutMission(String aboutMission) { this.aboutMission = aboutMission; }

    public String getAboutVision() { return aboutVision; }
    public void setAboutVision(String aboutVision) { this.aboutVision = aboutVision; }

    public String getHappyTravelers() { return happyTravelers; }
    public void setHappyTravelers(String happyTravelers) { this.happyTravelers = happyTravelers; }

    public String getDestinationsCount() { return destinationsCount; }
    public void setDestinationsCount(String destinationsCount) { this.destinationsCount = destinationsCount; }

    public String getExperienceYears() { return experienceYears; }
    public void setExperienceYears(String experienceYears) { this.experienceYears = experienceYears; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
