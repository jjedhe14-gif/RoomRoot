package com.roomroot.backend.user;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_user_role", columnList = "role"),
        @Index(name = "idx_user_status", columnList = "status"),
        @Index(name = "idx_user_created_at", columnList = "created_at")
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String role = "STUDENT";

    @Column(nullable = false)
    private boolean emailVerified = false;

    @Column(nullable = false)
    private String status = "ACTIVE";

    /** The explanation shown to a user whose account has been suspended. */
    @Column(name = "suspension_reason", length = 1000)
    private String suspensionReason;

    // Profile fields (nullable for backward compatibility with existing users)
    @Column(name = "phone")
    private String phone;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "university")
    private String university;

    @Column(name = "course")
    private String course;

    @Column(name = "year_of_study")
    private Integer yearOfStudy;

    @Column(name = "budget")
    private Double budget;

    @Column(name = "preferred_location")
    private String preferredLocation;

    @Column(name = "bio", length = 1000)
    private String bio;

    @Column(name = "gender_preference")
    private String genderPreference;

    @Column(name = "smoking_preference")
    private String smokingPreference;

    @Column(name = "cleanliness_preference")
    private String cleanlinessPreference;

    @Column(name = "sleep_schedule")
    private String sleepSchedule;

    // Registration timestamp. Nullable so the column can be added safely to
    // databases that already contain users; new rows always get a value.
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    public User() {
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

    public String getSuspensionReason() {
        return suspensionReason;
    }

    public void setSuspensionReason(String suspensionReason) {
        this.suspensionReason = suspensionReason;
    }

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
}
