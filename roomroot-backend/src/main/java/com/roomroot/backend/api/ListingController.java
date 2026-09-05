package com.roomroot.backend.api;

import com.roomroot.backend.common.ApiResponse;
import com.roomroot.backend.listing.ListingService;
import com.roomroot.backend.listing.dto.ListingCreateRequest;
import com.roomroot.backend.listing.dto.ListingResponse;
import com.roomroot.backend.listing.dto.ListingSearchCriteria;
import com.roomroot.backend.listing.dto.ListingUpdateRequest;
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
@RequestMapping("/api/listings")
@Tag(name = "Listings", description = "Accommodation and room discovery endpoints")
public class ListingController {

    private final ListingService listingService;

    public ListingController(ListingService listingService) {
        this.listingService = listingService;
    }

    @PostMapping
    @Operation(summary = "Create a new accommodation listing")
    public ResponseEntity<ApiResponse<ListingResponse>> createListing(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ListingCreateRequest request) {
        ListingResponse response = listingService.createListing(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Listing created successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get all active listings (paginated)")
    public ResponseEntity<ApiResponse<Page<ListingResponse>>> getAllListings(
            @ParameterObject @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ListingResponse> response = listingService.getAllActiveListings(pageable);
        return ResponseEntity.ok(ApiResponse.success("Listings fetched successfully", response));
    }

    @GetMapping("/search")
    @Operation(summary = "Search listings by criteria (city, locality, rent, roomType, etc.)")
    public ResponseEntity<ApiResponse<Page<ListingResponse>>> searchListings(
            @ModelAttribute ListingSearchCriteria criteria,
            @ParameterObject @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ListingResponse> response = listingService.searchListings(criteria, pageable);
        return ResponseEntity.ok(ApiResponse.success("Search completed successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get listing details by ID")
    public ResponseEntity<ApiResponse<ListingResponse>> getListingById(@PathVariable Long id) {
        ListingResponse response = listingService.getListingById(id);
        return ResponseEntity.ok(ApiResponse.success("Listing details fetched successfully", response));
    }

    @GetMapping("/my-listings")
    @Operation(summary = "Get listings created by the authenticated user")
    public ResponseEntity<ApiResponse<Page<ListingResponse>>> getMyListings(
            @AuthenticationPrincipal UserDetails userDetails,
            @ParameterObject @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ListingResponse> response = listingService.getMyListings(userDetails.getUsername(), pageable);
        return ResponseEntity.ok(ApiResponse.success("User listings fetched successfully", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update listing details (owner or admin only)")
    public ResponseEntity<ApiResponse<ListingResponse>> updateListing(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ListingUpdateRequest request) {
        ListingResponse response = listingService.updateListing(id, userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Listing updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete listing (owner or admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteListing(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        listingService.deleteListing(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Listing deleted successfully"));
    }
}
