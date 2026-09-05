package com.roomroot.backend.favorite;

import com.roomroot.backend.exception.ConflictException;
import com.roomroot.backend.exception.ResourceNotFoundException;
import com.roomroot.backend.favorite.dto.FavoriteResponse;
import com.roomroot.backend.listing.Listing;
import com.roomroot.backend.listing.ListingService;
import com.roomroot.backend.user.User;
import com.roomroot.backend.user.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserService userService;
    private final ListingService listingService;

    public FavoriteService(
            FavoriteRepository favoriteRepository,
            UserService userService,
            ListingService listingService) {
        this.favoriteRepository = favoriteRepository;
        this.userService = userService;
        this.listingService = listingService;
    }

    @Transactional
    public FavoriteResponse addFavorite(String userEmail, Long listingId) {
        User user = userService.findByEmailOrThrow(userEmail);
        Listing listing = listingService.findEntityById(listingId);

        if (favoriteRepository.existsByUserAndListing(user, listing)) {
            throw new ConflictException("Listing is already in your favorites");
        }

        Favorite favorite = new Favorite(user, listing);
        Favorite saved = favoriteRepository.save(favorite);
        return FavoriteResponse.fromEntity(saved);
    }

    @Transactional
    public void removeFavorite(String userEmail, Long listingId) {
        User user = userService.findByEmailOrThrow(userEmail);
        Listing listing = listingService.findEntityById(listingId);

        if (!favoriteRepository.existsByUserAndListing(user, listing)) {
            throw new ResourceNotFoundException("Favorite not found for this listing");
        }

        favoriteRepository.deleteByUserAndListing(user, listing);
    }

    @Transactional(readOnly = true)
    public Page<FavoriteResponse> getUserFavorites(String userEmail, Pageable pageable) {
        User user = userService.findByEmailOrThrow(userEmail);
        return favoriteRepository.findByUser(user, pageable)
                .map(FavoriteResponse::fromEntity);
    }
}
