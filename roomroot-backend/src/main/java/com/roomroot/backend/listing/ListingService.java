package com.roomroot.backend.listing;

import com.roomroot.backend.audit.AuditActions;
import com.roomroot.backend.audit.AuditLogService;
import com.roomroot.backend.exception.ForbiddenException;
import com.roomroot.backend.exception.ResourceNotFoundException;
import com.roomroot.backend.listing.dto.ListingCreateRequest;
import com.roomroot.backend.listing.dto.ListingResponse;
import com.roomroot.backend.listing.dto.ListingSearchCriteria;
import com.roomroot.backend.listing.dto.ListingUpdateRequest;
import com.roomroot.backend.user.Role;
import com.roomroot.backend.user.User;
import com.roomroot.backend.user.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ListingService {

    private final ListingRepository listingRepository;
    private final UserService userService;
    private final AuditLogService auditLogService;

    public ListingService(ListingRepository listingRepository, UserService userService, AuditLogService auditLogService) {
        this.listingRepository = listingRepository;
        this.userService = userService;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public ListingResponse createListing(String userEmail, ListingCreateRequest request) {
        User user = userService.findByEmailOrThrow(userEmail);

        Listing listing = new Listing();
        listing.setOwner(user);
        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setAddress(request.getAddress());
        listing.setCity(request.getCity());
        listing.setLocality(request.getLocality());
        listing.setLatitude(request.getLatitude());
        listing.setLongitude(request.getLongitude());
        listing.setMonthlyRent(request.getMonthlyRent());
        listing.setSecurityDeposit(request.getSecurityDeposit() != null ? request.getSecurityDeposit() : 0.0);
        listing.setAvailableFrom(request.getAvailableFrom());
        listing.setAvailable(request.getAvailable() != null ? request.getAvailable() : true);
        listing.setRoomType(request.getRoomType() != null ? request.getRoomType() : RoomType.PRIVATE);
        listing.setFurnished(request.getFurnished() != null ? request.getFurnished() : FurnishedType.FURNISHED);
        listing.setBathroomType(request.getBathroomType() != null ? request.getBathroomType() : BathroomType.ATTACHED);
        listing.setGenderPreference(request.getGenderPreference() != null ? request.getGenderPreference() : GenderPreference.ANY);
        listing.setTotalRooms(request.getTotalRooms() != null ? request.getTotalRooms() : 1);
        listing.setAvailableRooms(request.getAvailableRooms() != null ? request.getAvailableRooms() : 1);
        listing.setStatus(ListingStatus.ACTIVE);

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            listing.setImages(request.getImages());
        }

        Listing saved = listingRepository.save(listing);

        auditLogService.record(AuditActions.LISTING_CREATED, "LISTING", saved.getId(),
                user.getName() + " created listing \"" + saved.getTitle() + "\" (#" + saved.getId() + ")", user);

        return ListingResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public ListingResponse getListingById(Long id) {
        Listing listing = findEntityById(id);
        return ListingResponse.fromEntity(listing);
    }

    @Transactional(readOnly = true)
    public Page<ListingResponse> getAllActiveListings(Pageable pageable) {
        return listingRepository.findByStatus(ListingStatus.ACTIVE, pageable)
                .map(ListingResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<ListingResponse> searchListings(ListingSearchCriteria criteria, Pageable pageable) {
        return listingRepository.findAll(ListingSpecification.withCriteria(criteria), pageable)
                .map(ListingResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<ListingResponse> getMyListings(String userEmail, Pageable pageable) {
        User user = userService.findByEmailOrThrow(userEmail);
        return listingRepository.findByOwner(user, pageable)
                .map(ListingResponse::fromEntity);
    }

    @Transactional
    public ListingResponse updateListing(Long id, String userEmail, ListingUpdateRequest request) {
        User user = userService.findByEmailOrThrow(userEmail);
        Listing listing = findEntityById(id);

        verifyOwnership(listing, user);

        if (request.getTitle() != null) listing.setTitle(request.getTitle());
        if (request.getDescription() != null) listing.setDescription(request.getDescription());
        if (request.getAddress() != null) listing.setAddress(request.getAddress());
        if (request.getCity() != null) listing.setCity(request.getCity());
        if (request.getLocality() != null) listing.setLocality(request.getLocality());
        if (request.getLatitude() != null) listing.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) listing.setLongitude(request.getLongitude());
        if (request.getMonthlyRent() != null) listing.setMonthlyRent(request.getMonthlyRent());
        if (request.getSecurityDeposit() != null) listing.setSecurityDeposit(request.getSecurityDeposit());
        if (request.getAvailableFrom() != null) listing.setAvailableFrom(request.getAvailableFrom());
        if (request.getAvailable() != null) listing.setAvailable(request.getAvailable());
        if (request.getRoomType() != null) listing.setRoomType(request.getRoomType());
        if (request.getFurnished() != null) listing.setFurnished(request.getFurnished());
        if (request.getBathroomType() != null) listing.setBathroomType(request.getBathroomType());
        if (request.getGenderPreference() != null) listing.setGenderPreference(request.getGenderPreference());
        if (request.getTotalRooms() != null) listing.setTotalRooms(request.getTotalRooms());
        if (request.getAvailableRooms() != null) listing.setAvailableRooms(request.getAvailableRooms());
        if (request.getImages() != null) listing.setImages(request.getImages());

        Listing updated = listingRepository.save(listing);

        auditLogService.record(AuditActions.LISTING_UPDATED, "LISTING", updated.getId(),
                user.getName() + " updated listing \"" + updated.getTitle() + "\" (#" + updated.getId() + ")", user);

        return ListingResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteListing(Long id, String userEmail) {
        User user = userService.findByEmailOrThrow(userEmail);
        Listing listing = findEntityById(id);

        verifyOwnership(listing, user);

        String title = listing.getTitle();
        listingRepository.delete(listing);

        auditLogService.record(AuditActions.LISTING_DELETED, "LISTING", id,
                user.getName() + " deleted listing \"" + title + "\" (#" + id + ")", user);
    }

    public Listing findEntityById(Long id) {
        return listingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found with id: " + id));
    }

    private void verifyOwnership(Listing listing, User user) {
        if (!listing.getOwner().getId().equals(user.getId()) && !Role.ADMIN.equalsIgnoreCase(user.getRole())) {
            throw new ForbiddenException("You do not have permission to modify this listing");
        }
    }
}
