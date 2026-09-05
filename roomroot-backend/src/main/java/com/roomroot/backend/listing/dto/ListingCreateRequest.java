package com.roomroot.backend.listing.dto;

import com.roomroot.backend.listing.BathroomType;
import com.roomroot.backend.listing.FurnishedType;
import com.roomroot.backend.listing.GenderPreference;
import com.roomroot.backend.listing.RoomType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public class ListingCreateRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Locality is required")
    private String locality;

    private Double latitude;
    private Double longitude;

    @NotNull(message = "Monthly rent is required")
    @Min(value = 0, message = "Monthly rent cannot be negative")
    private Double monthlyRent;

    @Min(value = 0, message = "Security deposit cannot be negative")
    private Double securityDeposit;

    private LocalDate availableFrom;
    private Boolean available = true;

    @NotNull(message = "Room type is required")
    private RoomType roomType = RoomType.PRIVATE;

    private FurnishedType furnished = FurnishedType.FURNISHED;
    private BathroomType bathroomType = BathroomType.ATTACHED;
    private GenderPreference genderPreference = GenderPreference.ANY;

    @Min(value = 1, message = "Total rooms must be at least 1")
    private Integer totalRooms = 1;

    @Min(value = 1, message = "Available rooms must be at least 1")
    private Integer availableRooms = 1;

    private List<String> images;

    public ListingCreateRequest() {
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

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
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

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }
}
