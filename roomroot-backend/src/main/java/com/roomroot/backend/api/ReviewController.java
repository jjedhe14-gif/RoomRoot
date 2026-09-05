package com.roomroot.backend.api;

import com.roomroot.backend.common.ApiResponse;
import com.roomroot.backend.review.ReviewService;
import com.roomroot.backend.review.dto.ReviewRequest;
import com.roomroot.backend.review.dto.ReviewResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Reviews", description = "Accommodation ratings and reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/api/listings/{id}/reviews")
    @Operation(summary = "Submit a review and 1-5 star rating for a listing")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ReviewRequest request) {
        ReviewResponse response = reviewService.createReview(id, userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Review submitted successfully", response));
    }

    @GetMapping("/api/listings/{id}/reviews")
    @Operation(summary = "Get reviews for a listing (public, paginated)")
    public ResponseEntity<ApiResponse<Page<ReviewResponse>>> getListingReviews(
            @PathVariable Long id,
            @ParameterObject @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ReviewResponse> response = reviewService.getListingReviews(id, pageable);
        return ResponseEntity.ok(ApiResponse.success("Reviews fetched successfully", response));
    }
}
