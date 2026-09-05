package com.roomroot.backend.review.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.roomroot.backend.review.Review;
import com.roomroot.backend.user.dto.UserResponse;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReviewResponse {

    private Long id;
    private UserResponse author;
    private Long listingId;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;

    public ReviewResponse() {
    }

    public static ReviewResponse fromEntity(Review review) {
        if (review == null) return null;
        ReviewResponse dto = new ReviewResponse();
        dto.setId(review.getId());
        dto.setAuthor(UserResponse.fromEntity(review.getAuthor()));
        dto.setListingId(review.getListing().getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserResponse getAuthor() {
        return author;
    }

    public void setAuthor(UserResponse author) {
        this.author = author;
    }

    public Long getListingId() {
        return listingId;
    }

    public void setListingId(Long listingId) {
        this.listingId = listingId;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
