package com.roomroot.backend.admin.dto;

import com.roomroot.backend.listing.ListingStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateListingStatusRequest {

    @NotNull(message = "Listing status is required")
    private ListingStatus status;

    public UpdateListingStatusRequest() {
    }

    public UpdateListingStatusRequest(ListingStatus status) {
        this.status = status;
    }

    public ListingStatus getStatus() {
        return status;
    }

    public void setStatus(ListingStatus status) {
        this.status = status;
    }
}
