package com.roomroot.backend.user;

import com.roomroot.backend.audit.AuditActions;
import com.roomroot.backend.audit.AuditLogService;
import com.roomroot.backend.exception.ResourceNotFoundException;
import com.roomroot.backend.user.dto.UpdateUserRequest;
import com.roomroot.backend.user.dto.SubmitAppealRequest;
import com.roomroot.backend.user.dto.UserResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public UserService(UserRepository userRepository, AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUserProfile(String email) {
        User user = findByEmailOrThrow(email);
        return UserResponse.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return UserResponse.fromEntity(user);
    }

    @Transactional
    public UserResponse updateUserProfile(String email, UpdateUserRequest request) {
        User user = findByEmailOrThrow(email);

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl().trim());
        }
        if (request.getUniversity() != null) {
            user.setUniversity(request.getUniversity().trim());
        }
        if (request.getCourse() != null) {
            user.setCourse(request.getCourse().trim());
        }
        if (request.getYearOfStudy() != null) {
            user.setYearOfStudy(request.getYearOfStudy());
        }
        if (request.getBudget() != null) {
            user.setBudget(request.getBudget());
        }
        if (request.getPreferredLocation() != null) {
            user.setPreferredLocation(request.getPreferredLocation().trim());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio().trim());
        }
        if (request.getGenderPreference() != null) {
            user.setGenderPreference(request.getGenderPreference().trim());
        }
        if (request.getSmokingPreference() != null) {
            user.setSmokingPreference(request.getSmokingPreference().trim());
        }
        if (request.getCleanlinessPreference() != null) {
            user.setCleanlinessPreference(request.getCleanlinessPreference().trim());
        }
        if (request.getSleepSchedule() != null) {
            user.setSleepSchedule(request.getSleepSchedule().trim());
        }

        User saved = userRepository.save(user);

        auditLogService.record(AuditActions.USER_PROFILE_UPDATED, "USER", saved.getId(),
                saved.getName() + " updated their profile", saved);

        return UserResponse.fromEntity(saved);
    }

    /** Records a suspension appeal for administrator review in the activity log. */
    @Transactional
    public void submitSuspensionAppeal(String email, SubmitAppealRequest request) {
        User user = findByEmailOrThrow(email);
        if (!UserStatus.SUSPENDED.equalsIgnoreCase(user.getStatus())) {
            throw new com.roomroot.backend.exception.BadRequestException("Only suspended accounts can submit an appeal");
        }
        auditLogService.record(AuditActions.ADMIN_ACTION, "USER", user.getId(),
                "Suspension appeal from " + user.getName() + ": " + request.getMessage().trim(), user);
    }

    public User findByEmailOrThrow(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
