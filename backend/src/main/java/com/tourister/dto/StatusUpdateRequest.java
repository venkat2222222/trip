package com.tourister.dto;

import com.tourister.entity.enums.TripStatus;
import jakarta.validation.constraints.NotNull;

public class StatusUpdateRequest {

    @NotNull(message = "Status is required")
    private TripStatus status;

    public StatusUpdateRequest() {}

    public StatusUpdateRequest(TripStatus status) {
        this.status = status;
    }

    public TripStatus getStatus() { return status; }
    public void setStatus(TripStatus status) { this.status = status; }
}
