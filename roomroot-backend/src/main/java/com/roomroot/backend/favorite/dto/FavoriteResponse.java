package com.roomroot.backend.favorite.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.roomroot.backend.favorite.Favorite;
import com.roomroot.backend.listing.dto.ListingResponse;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class FavoriteResponse {

    private Long id;
    private ListingResponse listing;
    private LocalDateTime createdAt;

    public FavoriteResponse() {
    }

    public static FavoriteResponse fromEntity(Favorite favorite) {
        if (favorite == null) return null;
        FavoriteResponse dto = new FavoriteResponse();
        dto.setId(favorite.getId());
        dto.setListing(ListingResponse.fromEntity(favorite.getListing()));
        dto.setCreatedAt(favorite.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ListingResponse getListing() {
        return listing;
    }

    public void setListing(ListingResponse listing) {
        this.listing = listing;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
