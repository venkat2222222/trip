package com.tourister.controller;

import com.tourister.dto.ApiResponse;
import com.tourister.dto.ContactRequest;
import com.tourister.entity.ContactMessage;
import com.tourister.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ContactMessage>> submitContactForm(@Valid @RequestBody ContactRequest request) {
        ContactMessage saved = contactService.createContactMessage(request);
        return ResponseEntity.status(201).body(ApiResponse.created("Thank you! Your message has been sent successfully.", saved));
    }
}
