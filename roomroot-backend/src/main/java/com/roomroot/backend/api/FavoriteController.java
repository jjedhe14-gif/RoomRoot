package com.roomroot.backend.api;

import com.roomroot.backend.common.ApiResponse;
import com.roomroot.backend.favorite.FavoriteService;
import com.roomroot.backend.favorite.dto.FavoriteResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Favorites", description = "Endpoints for managing saved/favorite listings")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping("/api/listings/{id}/favorite")
    @Operation(summary = "Save a listing to favorites")
    public ResponseEntity<ApiResponse<FavoriteResponse>> addFavorite(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        FavoriteResponse response = favoriteService.addFavorite(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Listing added to favorites", response));
    }

    @DeleteMapping("/api/listings/{id}/favorite")
    @Operation(summary = "Remove a listing from favorites")
    public ResponseEntity<ApiResponse<Void>> removeFavorite(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        favoriteService.removeFavorite(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Listing removed from favorites"));
    }

    @GetMapping("/api/users/me/favorites")
    @Operation(summary = "Get current student's favorite listings")
    public ResponseEntity<ApiResponse<Page<FavoriteResponse>>> getMyFavorites(
            @AuthenticationPrincipal UserDetails userDetails,
            @ParameterObject @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<FavoriteResponse> response = favoriteService.getUserFavorites(userDetails.getUsername(), pageable);
        return ResponseEntity.ok(ApiResponse.success("Favorites fetched successfully", response));
    }
}
