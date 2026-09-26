package com.tourister.controller;

import com.tourister.dto.ApiResponse;
import com.tourister.entity.SiteContent;
import com.tourister.service.SiteContentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SiteContentController {

    private final SiteContentService siteContentService;

    public SiteContentController(SiteContentService siteContentService) {
        this.siteContentService = siteContentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<SiteContent>> getSiteSettings() {
        SiteContent content = siteContentService.getSiteContent();
        return ResponseEntity.ok(ApiResponse.success("Site content retrieved successfully", content));
    }

    @PutMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<SiteContent>> updateSiteSettings(@RequestBody SiteContent content) {
        SiteContent updated = siteContentService.updateSiteContent(content);
        return ResponseEntity.ok(ApiResponse.success("Site content updated successfully", updated));
    }
}
