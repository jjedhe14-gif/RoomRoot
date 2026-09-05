package com.roomroot.backend.review;

import com.roomroot.backend.exception.BadRequestException;
import com.roomroot.backend.exception.ConflictException;
import com.roomroot.backend.listing.Listing;
import com.roomroot.backend.listing.ListingService;
import com.roomroot.backend.review.dto.ReviewRequest;
import com.roomroot.backend.review.dto.ReviewResponse;
import com.roomroot.backend.user.User;
import com.roomroot.backend.user.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ListingService listingService;
    private final UserService userService;

    public ReviewService(
            ReviewRepository reviewRepository,
            ListingService listingService,
            UserService userService) {
        this.reviewRepository = reviewRepository;
        this.listingService = listingService;
        this.userService = userService;
    }

    @Transactional
    public ReviewResponse createReview(Long listingId, String authorEmail, ReviewRequest request) {
        User author = userService.findByEmailOrThrow(authorEmail);
        Listing listing = listingService.findEntityById(listingId);

        if (listing.getOwner().getId().equals(author.getId())) {
            throw new BadRequestException("You cannot review your own listing");
        }

        if (reviewRepository.existsByAuthorAndListing(author, listing)) {
            throw new ConflictException("You have already reviewed this listing");
        }

        Review review = new Review();
        review.setAuthor(author);
        review.setListing(listing);
        review.setRating(request.getRating());
        review.setComment(request.getComment() != null ? request.getComment().trim() : null);

        Review saved = reviewRepository.save(review);
        return ReviewResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public Page<ReviewResponse> getListingReviews(Long listingId, Pageable pageable) {
        Listing listing = listingService.findEntityById(listingId);
        return reviewRepository.findByListingOrderByCreatedAtDesc(listing, pageable)
                .map(ReviewResponse::fromEntity);
    }
}
