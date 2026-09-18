package com.tourister.service;

import com.tourister.entity.TourPackage;
import com.tourister.exception.ResourceNotFoundException;
import com.tourister.repository.TourPackageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PackageService {

    private final TourPackageRepository packageRepository;

    public PackageService(TourPackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }

    public List<TourPackage> getAllPackages(String search, String destination, BigDecimal maxPrice, Integer maxDuration) {
        return packageRepository.searchPackages(search, destination, maxPrice, maxDuration);
    }

    public List<TourPackage> getFeaturedPackages() {
        return packageRepository.findByFeaturedTrue();
    }

    public TourPackage getPackageById(Long id) {
        return packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour package not found with id: " + id));
    }

    @Transactional
    public TourPackage createPackage(TourPackage pkg) {
        return packageRepository.save(pkg);
    }

    @Transactional
    public TourPackage updatePackage(Long id, TourPackage details) {
        TourPackage existing = getPackageById(id);
        existing.setName(details.getName());
        existing.setDestination(details.getDestination());
        existing.setDescription(details.getDescription());
        existing.setImageUrl(details.getImageUrl());
        existing.setDurationDays(details.getDurationDays());
        existing.setPrice(details.getPrice());
        existing.setAccommodation(details.getAccommodation());
        existing.setTransportation(details.getTransportation());
        existing.setFood(details.getFood());
        existing.setIncludedItems(details.getIncludedItems());
        existing.setExcludedItems(details.getExcludedItems());
        existing.setItinerary(details.getItinerary());
        existing.setFeatured(details.getFeatured());
        return packageRepository.save(existing);
    }

    @Transactional
    public void deletePackage(Long id) {
        TourPackage existing = getPackageById(id);
        packageRepository.delete(existing);
    }
}
