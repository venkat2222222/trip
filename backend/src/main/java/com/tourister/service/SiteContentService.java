package com.tourister.service;

import com.tourister.entity.SiteContent;
import com.tourister.repository.SiteContentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SiteContentService {

    private final SiteContentRepository siteContentRepository;

    public SiteContentService(SiteContentRepository siteContentRepository) {
        this.siteContentRepository = siteContentRepository;
    }

    public SiteContent getSiteContent() {
        return siteContentRepository.findAll().stream().findFirst().orElseGet(this::createDefaultContent);
    }

    @Transactional
    public SiteContent updateSiteContent(SiteContent details) {
        SiteContent content = getSiteContent();
        content.setContactPhone(details.getContactPhone());
        content.setContactEmail(details.getContactEmail());
        content.setContactAddress(details.getContactAddress());
        content.setOperatingHours(details.getOperatingHours());

        content.setAboutTitle(details.getAboutTitle());
        content.setAboutTagline(details.getAboutTagline());
        content.setAboutStory(details.getAboutStory());
        content.setAboutMission(details.getAboutMission());
        content.setAboutVision(details.getAboutVision());

        content.setHappyTravelers(details.getHappyTravelers());
        content.setDestinationsCount(details.getDestinationsCount());
        content.setExperienceYears(details.getExperienceYears());

        return siteContentRepository.save(content);
    }

    @Transactional
    public SiteContent createDefaultContent() {
        SiteContent content = new SiteContent();
        content.setContactPhone("+91 98765 43210");
        content.setContactEmail("support@tripmax.com");
        content.setContactAddress("TRIP MAX Towers, Brigade Road, Bengaluru, Karnataka 560001, India");
        content.setOperatingHours("Monday - Saturday: 9:00 AM - 8:00 PM IST");

        content.setAboutTitle("Crafting Extraordinary Journeys Beyond Limits");
        content.setAboutTagline("TRIP MAX - India's Premier Custom Travel Planner");
        content.setAboutStory("Founded in 2024, TRIP MAX was born out of a desire to make custom travel seamless, memorable, and thrilling. We craft bespoke itineraries, handpick luxury accommodations, and deliver unmatched travel experiences across domestic and international destinations.");
        content.setAboutMission("To empower travelers with tailor-made, hassle-free travel itineraries, exceptional service, and transparent pricing in Indian Rupees.");
        content.setAboutVision("To become the most trusted and innovative travel planning brand worldwide, inspiring wanderlust and creating lifelong memories.");

        content.setHappyTravelers("25,000+");
        content.setDestinationsCount("150+");
        content.setExperienceYears("10+");

        return siteContentRepository.save(content);
    }
}
