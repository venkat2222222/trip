package com.tourister.controller;

import com.tourister.dto.ApiResponse;
import com.tourister.entity.TourPackage;
import com.tourister.service.PackageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/packages")
public class PackageController {

    private final PackageService packageService;

    public PackageController(PackageService packageService) {
        this.packageService = packageService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TourPackage>>> getAllPackages(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer maxDuration) {
        List<TourPackage> packages = packageService.getAllPackages(search, destination, maxPrice, maxDuration);
        return ResponseEntity.ok(ApiResponse.success("Packages retrieved successfully", packages));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<TourPackage>>> getFeaturedPackages() {
        List<TourPackage> packages = packageService.getFeaturedPackages();
        return ResponseEntity.ok(ApiResponse.success("Featured packages retrieved successfully", packages));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TourPackage>> getPackageById(@PathVariable Long id) {
        TourPackage pkg = packageService.getPackageById(id);
        return ResponseEntity.ok(ApiResponse.success("Package retrieved successfully", pkg));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<TourPackage>> createPackage(@Valid @RequestBody TourPackage pkg) {
        TourPackage created = packageService.createPackage(pkg);
        return ResponseEntity.status(201).body(ApiResponse.created("Package created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<TourPackage>> updatePackage(@PathVariable Long id, @Valid @RequestBody TourPackage pkg) {
        TourPackage updated = packageService.updatePackage(id, pkg);
        return ResponseEntity.ok(ApiResponse.success("Package updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deletePackage(@PathVariable Long id) {
        packageService.deletePackage(id);
        return ResponseEntity.ok(ApiResponse.success("Package deleted successfully", null));
    }
}
