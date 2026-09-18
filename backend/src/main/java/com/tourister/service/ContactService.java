package com.tourister.service;

import com.tourister.dto.ContactRequest;
import com.tourister.entity.ContactMessage;
import com.tourister.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ContactService {

    private final ContactMessageRepository contactRepository;

    public ContactService(ContactMessageRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Transactional
    public ContactMessage createContactMessage(ContactRequest request) {
        ContactMessage message = new ContactMessage(
                request.getName().trim(),
                request.getEmail().toLowerCase().trim(),
                request.getPhone() != null ? request.getPhone().trim() : null,
                request.getSubject() != null ? request.getSubject().trim() : "General Inquiry",
                request.getMessage().trim()
        );
        return contactRepository.save(message);
    }

    public List<ContactMessage> getAllContactMessages() {
        return contactRepository.findAllByOrderByCreatedAtDesc();
    }
}
