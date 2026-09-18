package com.tourister.service;

import com.tourister.entity.Place;
import com.tourister.entity.enums.PlaceCategory;
import com.tourister.exception.ResourceNotFoundException;
import com.tourister.repository.PlaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PlaceService {

    private final PlaceRepository placeRepository;

    public PlaceService(PlaceRepository placeRepository) {
        this.placeRepository = placeRepository;
    }

    public List<Place> getAllPlaces(String search, String location, PlaceCategory category) {
        return placeRepository.searchPlaces(search, location, category);
    }

    public List<Place> getPopularPlaces() {
        return placeRepository.findByPopularTrue();
    }

    public Place getPlaceById(Long id) {
        return placeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Place not found with id: " + id));
    }

    @Transactional
    public Place createPlace(Place place) {
        return placeRepository.save(place);
    }

    @Transactional
    public Place updatePlace(Long id, Place details) {
        Place existing = getPlaceById(id);
        existing.setName(details.getName());
        existing.setLocation(details.getLocation());
        existing.setCategory(details.getCategory());
        existing.setDescription(details.getDescription());
        existing.setImageUrl(details.getImageUrl());
        existing.setEstimatedCost(details.getEstimatedCost());
        existing.setRecommendedDuration(details.getRecommendedDuration());
        existing.setBestTimeToVisit(details.getBestTimeToVisit());
        existing.setAttractions(details.getAttractions());
        existing.setPopular(details.getPopular());
        return placeRepository.save(existing);
    }

    @Transactional
    public void deletePlace(Long id) {
        Place existing = getPlaceById(id);
        placeRepository.delete(existing);
    }
}
