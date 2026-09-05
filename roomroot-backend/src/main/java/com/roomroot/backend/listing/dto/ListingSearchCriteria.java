package com.roomroot.backend.listing.dto;

import com.roomroot.backend.listing.BathroomType;
import com.roomroot.backend.listing.FurnishedType;
import com.roomroot.backend.listing.GenderPreference;
import com.roomroot.backend.listing.RoomType;

public class ListingSearchCriteria {

    private String city;
    private String locality;
    private Double minRent;
    private Double maxRent;
    private RoomType roomType;
    private FurnishedType furnished;
    private BathroomType bathroomType;
    private GenderPreference genderPreference;
    private Boolean available = true;

    public ListingSearchCriteria() {
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

    public Double getMinRent() {
        return minRent;
    }

    public void setMinRent(Double minRent) {
        this.minRent = minRent;
    }

    public Double getMaxRent() {
        return maxRent;
    }

    public void setMaxRent(Double maxRent) {
        this.maxRent = maxRent;
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

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }
}
