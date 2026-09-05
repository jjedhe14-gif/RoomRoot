package com.roomroot.backend.listing.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.roomroot.backend.listing.*;
import com.roomroot.backend.user.dto.UserResponse;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ListingResponse {

    private Long id;
    private UserResponse owner;
    private String title;
    private String description;
    private String address;
    private String city;
    private String locality;
    private Double latitude;
    private Double longitude;
    private Double monthlyRent;
    private Double securityDeposit;
    private LocalDate availableFrom;
    private boolean available;
    private RoomType roomType;
    private FurnishedType furnished;
    private BathroomType bathroomType;
    private GenderPreference genderPreference;
    private Integer totalRooms;
    private Integer availableRooms;
    private ListingStatus status;
    private List<String> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ListingResponse() {
    }

    public static ListingResponse fromEntity(Listing listing) {
        if (listing == null) return null;
        ListingResponse dto = new ListingResponse();
        dto.setId(listing.getId());
        dto.setOwner(UserResponse.fromEntity(listing.getOwner()));
        dto.setTitle(listing.getTitle());
        dto.setDescription(listing.getDescription());
        dto.setAddress(listing.getAddress());
        dto.setCity(listing.getCity());
        dto.setLocality(listing.getLocality());
        dto.setLatitude(listing.getLatitude());
        dto.setLongitude(listing.getLongitude());
        dto.setMonthlyRent(listing.getMonthlyRent());
        dto.setSecurityDeposit(listing.getSecurityDeposit());
        dto.setAvailableFrom(listing.getAvailableFrom());
        dto.setAvailable(listing.isAvailable());
        dto.setRoomType(listing.getRoomType());
        dto.setFurnished(listing.getFurnished());
        dto.setBathroomType(listing.getBathroomType());
        dto.setGenderPreference(listing.getGenderPreference());
        dto.setTotalRooms(listing.getTotalRooms());
        dto.setAvailableRooms(listing.getAvailableRooms());
        dto.setStatus(listing.getStatus());
        dto.setImages(listing.getImages());
        dto.setCreatedAt(listing.getCreatedAt());
        dto.setUpdatedAt(listing.getUpdatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserResponse getOwner() {
        return owner;
    }

    public void setOwner(UserResponse owner) {
        this.owner = owner;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getLocality() {
        return locality;
    }

    public void setLocality(String locality) {
        this.locality = locality;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getMonthlyRent() {
        return monthlyRent;
    }

    public void setMonthlyRent(Double monthlyRent) {
        this.monthlyRent = monthlyRent;
    }

    public Double getSecurityDeposit() {
        return securityDeposit;
    }

    public void setSecurityDeposit(Double securityDeposit) {
        this.securityDeposit = securityDeposit;
    }

    public LocalDate getAvailableFrom() {
        return availableFrom;
    }

    public void setAvailableFrom(LocalDate availableFrom) {
        this.availableFrom = availableFrom;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public RoomType getRoomType() {
        return roomType;
    }

    public void setRoomType(RoomType roomType) {
        this.roomType = roomType;
    }

    public FurnishedType getFurnished() {
        return furnished;
    }

    public void setFurnished(FurnishedType furnished) {
        this.furnished = furnished;
    }

    public BathroomType getBathroomType() {
        return bathroomType;
    }

    public void setBathroomType(BathroomType bathroomType) {
        this.bathroomType = bathroomType;
    }

    public GenderPreference getGenderPreference() {
        return genderPreference;
    }

    public void setGenderPreference(GenderPreference genderPreference) {
        this.genderPreference = genderPreference;
    }

    public Integer getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(Integer totalRooms) {
        this.totalRooms = totalRooms;
    }

    public Integer getAvailableRooms() {
        return availableRooms;
    }

    public void setAvailableRooms(Integer availableRooms) {
        this.availableRooms = availableRooms;
    }

    public ListingStatus getStatus() {
        return status;
    }

    public void setStatus(ListingStatus status) {
        this.status = status;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
