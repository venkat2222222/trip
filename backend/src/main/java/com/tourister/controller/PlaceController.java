package com.tourister.controller;

import com.tourister.dto.ApiResponse;
import com.tourister.entity.Place;
import com.tourister.entity.enums.PlaceCategory;
import com.tourister.service.PlaceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
public class PlaceController {

    private final PlaceService placeService;

    public PlaceController(PlaceService placeService) {
        this.placeService = placeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Place>>> getAllPlaces(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) PlaceCategory category) {
        List<Place> places = placeService.getAllPlaces(search, location, category);
        return ResponseEntity.ok(ApiResponse.success("Places retrieved successfully", places));
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<Place>>> getPopularPlaces() {
        List<Place> places = placeService.getPopularPlaces();
        return ResponseEntity.ok(ApiResponse.success("Popular places retrieved successfully", places));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Place>> getPlaceById(@PathVariable Long id) {
        Place place = placeService.getPlaceById(id);
        return ResponseEntity.ok(ApiResponse.success("Place retrieved successfully", place));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Place>> createPlace(@Valid @RequestBody Place place) {
        Place created = placeService.createPlace(place);
        return ResponseEntity.status(201).body(ApiResponse.created("Place created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Place>> updatePlace(@PathVariable Long id, @Valid @RequestBody Place place) {
        Place updated = placeService.updatePlace(id, place);
        return ResponseEntity.ok(ApiResponse.success("Place updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deletePlace(@PathVariable Long id) {
        placeService.deletePlace(id);
        return ResponseEntity.ok(ApiResponse.success("Place deleted successfully", null));
    }
}
