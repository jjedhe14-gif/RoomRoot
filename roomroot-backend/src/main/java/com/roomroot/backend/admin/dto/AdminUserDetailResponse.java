package com.roomroot.backend.admin.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.roomroot.backend.user.User;

import java.time.LocalDateTime;

/**
 * Full user profile plus related-entity counters, served only to admins.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdminUserDetailResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
    private boolean emailVerified;
    private String status;
    private String suspensionReason;
    private String phone;
    private String avatarUrl;
    private String university;
    private String course;
    private Integer yearOfStudy;
    private Double budget;
    private String preferredLocation;
    private String bio;
    private String genderPreference;
    private String smokingPreference;
    private String cleanlinessPreference;
    private String sleepSchedule;
    private LocalDateTime createdAt;

    private long totalListings;
    private long totalApplications;
    private long totalFavorites;
    private long totalReviews;

    public AdminUserDetailResponse() {
    }

    public static AdminUserDetailResponse fromEntity(User user) {
        if (user == null) return null;
        AdminUserDetailResponse dto = new AdminUserDetailResponse();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setEmailVerified(user.isEmailVerified());
        dto.setStatus(user.getStatus());
        dto.setSuspensionReason(user.getSuspensionReason());
        dto.setPhone(user.getPhone());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setUniversity(user.getUniversity());
        dto.setCourse(user.getCourse());
        dto.setYearOfStudy(user.getYearOfStudy());
        dto.setBudget(user.getBudget());
        dto.setPreferredLocation(user.getPreferredLocation());
        dto.setBio(user.getBio());
        dto.setGenderPreference(user.getGenderPreference());
        dto.setSmokingPreference(user.getSmokingPreference());
        dto.setCleanlinessPreference(user.getCleanlinessPreference());
        dto.setSleepSchedule(user.getSleepSchedule());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSuspensionReason() { return suspensionReason; }
    public void setSuspensionReason(String suspensionReason) { this.suspensionReason = suspensionReason; }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getUniversity() {
        return university;
    }

    public void setUniversity(String university) {
        this.university = university;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public Integer getYearOfStudy() {
        return yearOfStudy;
    }

    public void setYearOfStudy(Integer yearOfStudy) {
        this.yearOfStudy = yearOfStudy;
    }

    public Double getBudget() {
        return budget;
    }

    public void setBudget(Double budget) {
        this.budget = budget;
    }

    public String getPreferredLocation() {
        return preferredLocation;
    }

    public void setPreferredLocation(String preferredLocation) {
        this.preferredLocation = preferredLocation;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getGenderPreference() {
        return genderPreference;
    }

    public void setGenderPreference(String genderPreference) {
        this.genderPreference = genderPreference;
    }

    public String getSmokingPreference() {
        return smokingPreference;
    }

    public void setSmokingPreference(String smokingPreference) {
        this.smokingPreference = smokingPreference;
    }

    public String getCleanlinessPreference() {
        return cleanlinessPreference;
    }

    public void setCleanlinessPreference(String cleanlinessPreference) {
        this.cleanlinessPreference = cleanlinessPreference;
    }

    public String getSleepSchedule() {
        return sleepSchedule;
    }

    public void setSleepSchedule(String sleepSchedule) {
        this.sleepSchedule = sleepSchedule;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public long getTotalListings() {
        return totalListings;
    }

    public void setTotalListings(long totalListings) {
        this.totalListings = totalListings;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getTotalFavorites() {
        return totalFavorites;
    }

    public void setTotalFavorites(long totalFavorites) {
        this.totalFavorites = totalFavorites;
    }

    public long getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(long totalReviews) {
        this.totalReviews = totalReviews;
    }
}
