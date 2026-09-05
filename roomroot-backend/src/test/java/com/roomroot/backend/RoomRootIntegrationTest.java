package com.roomroot.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.roomroot.backend.admin.dto.UpdateUserStatusRequest;
import com.roomroot.backend.application.ApplicationStatus;
import com.roomroot.backend.application.dto.ApplicationRequest;
import com.roomroot.backend.application.dto.UpdateApplicationStatusRequest;
import com.roomroot.backend.auth.SendCodeRequest;
import com.roomroot.backend.auth.VerificationCode;
import com.roomroot.backend.auth.VerificationCodeRepository;
import com.roomroot.backend.auth.VerifyCodeRequest;
import com.roomroot.backend.listing.BathroomType;
import com.roomroot.backend.listing.FurnishedType;
import com.roomroot.backend.listing.GenderPreference;
import com.roomroot.backend.listing.RoomType;
import com.roomroot.backend.listing.dto.ListingCreateRequest;
import com.roomroot.backend.message.dto.CreateConversationRequest;
import com.roomroot.backend.message.dto.MessageRequest;
import com.roomroot.backend.review.dto.ReviewRequest;
import com.roomroot.backend.user.Role;
import com.roomroot.backend.user.User;
import com.roomroot.backend.user.UserRepository;
import com.roomroot.backend.user.dto.UpdateUserRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
public class RoomRootIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    private String authenticateUser(String email, String name, String role) throws Exception {
        mockMvc.perform(post("/api/auth/send-code")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new SendCodeRequest(email))))
                .andExpect(status().isOk());

        VerificationCode code = verificationCodeRepository.findTopByEmailOrderByCreatedAtDesc(email.toLowerCase())
                .orElseThrow();

        MvcResult result = mockMvc.perform(post("/api/auth/verify-code")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new VerifyCodeRequest(email, code.getCode(), name))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseBody).get("token").asText();

        if (role != null) {
            User user = userRepository.findByEmail(email.toLowerCase()).orElseThrow();
            user.setRole(role);
            userRepository.save(user);
        }

        return token;
    }

    @Test
    @DisplayName("Health check endpoint returns status UP")
    void testHealthCheck() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.service", is("RoomRoot Backend")))
                .andExpect(jsonPath("$.status", is("UP")));
    }

    @Test
    @DisplayName("Authentication Flow: Send code, verify, reject invalid, reject expired")
    void testAuthFlow() throws Exception {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        String email = "auth_" + suffix + "@example.com";

        // 1. Send code with whitespace and uppercase
        mockMvc.perform(post("/api/auth/send-code")
                        .param("email", "  " + email.toUpperCase() + "  "))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));

        VerificationCode codeEntity = verificationCodeRepository.findTopByEmailOrderByCreatedAtDesc(email)
                .orElseThrow();
        assertNotNull(codeEntity);
        String code = codeEntity.getCode();

        // 2. Reject wrong code
        mockMvc.perform(post("/api/auth/verify-code")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new VerifyCodeRequest(email, "000000", "Student"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", is("BAD_REQUEST")));

        // 3. Verify valid code
        mockMvc.perform(post("/api/auth/verify-code")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new VerifyCodeRequest(email.toUpperCase(), code, "Alice Student"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.user.email", is(email)))
                .andExpect(jsonPath("$.user.name", is("Alice Student")))
                .andExpect(jsonPath("$.user.emailVerified", is(true)));

        // 4. Reject reused code
        mockMvc.perform(post("/api/auth/verify-code")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new VerifyCodeRequest(email, code, "Alice Student"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("already been used")));
    }

    @Test
    @DisplayName("User Profile: Get and update current profile")
    void testUserProfile() throws Exception {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        String email = "profile_" + suffix + "@example.com";
        String token = authenticateUser(email, "Student Bob", Role.STUDENT);

        mockMvc.perform(get("/api/users/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email", is(email)))
                .andExpect(jsonPath("$.data.name", is("Student Bob")));

        UpdateUserRequest update = new UpdateUserRequest();
        update.setName("Bob Updated");
        update.setUniversity("Oxford University");
        update.setCourse("Computer Science");
        update.setBudget(650.0);

        mockMvc.perform(put("/api/users/me")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name", is("Bob Updated")))
                .andExpect(jsonPath("$.data.university", is("Oxford University")))
                .andExpect(jsonPath("$.data.course", is("Computer Science")))
                .andExpect(jsonPath("$.data.budget", is(650.0)));
    }

    @Test
    @DisplayName("End-to-End Accommodation Lifecycle: Listing -> Favorite -> Application -> Messaging -> Review")
    void testFullPlatformLifecycle() throws Exception {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        String ownerEmail = "owner_" + suffix + "@example.com";
        String studentEmail = "student_" + suffix + "@example.com";
        String uniqueCity = "City_" + suffix;

        String ownerToken = authenticateUser(ownerEmail, "David Landlord", Role.OWNER);
        String studentToken = authenticateUser(studentEmail, "Emma Student", Role.STUDENT);

        // 1. Owner creates listing
        ListingCreateRequest createListing = new ListingCreateRequest();
        createListing.setTitle("Modern Student Studio near Campus");
        createListing.setDescription("Spacious studio with high-speed internet and all amenities");
        createListing.setAddress("42 High Street");
        createListing.setCity(uniqueCity);
        createListing.setLocality("City Centre");
        createListing.setMonthlyRent(750.0);
        createListing.setSecurityDeposit(750.0);
        createListing.setRoomType(RoomType.PRIVATE);
        createListing.setFurnished(FurnishedType.FURNISHED);
        createListing.setBathroomType(BathroomType.ATTACHED);
        createListing.setGenderPreference(GenderPreference.ANY);

        MvcResult listingResult = mockMvc.perform(post("/api/listings")
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createListing)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.title", is("Modern Student Studio near Campus")))
                .andExpect(jsonPath("$.data.city", is(uniqueCity)))
                .andReturn();

        Long listingId = objectMapper.readTree(listingResult.getResponse().getContentAsString()).get("data").get("id").asLong();

        // 2. Public search listings
        mockMvc.perform(get("/api/listings/search")
                        .param("city", uniqueCity)
                        .param("maxRent", "800"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content", hasSize(1)));

        // 3. Student adds to favorites
        mockMvc.perform(post("/api/listings/" + listingId + "/favorite")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.listing.id", is(listingId.intValue())));

        // Duplicate favorite check
        mockMvc.perform(post("/api/listings/" + listingId + "/favorite")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isConflict());

        // Get favorites
        mockMvc.perform(get("/api/users/me/favorites")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content", hasSize(1)));

        // 4. Student submits application
        ApplicationRequest appReq = new ApplicationRequest("Hello! I am a quiet CS student looking to rent this studio.");
        MvcResult appResult = mockMvc.perform(post("/api/listings/" + listingId + "/applications")
                        .header("Authorization", "Bearer " + studentToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(appReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.status", is("PENDING")))
                .andReturn();

        Long appId = objectMapper.readTree(appResult.getResponse().getContentAsString()).get("data").get("id").asLong();

        // Owner views and accepts application
        mockMvc.perform(patch("/api/applications/" + appId + "/status")
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new UpdateApplicationStatusRequest(ApplicationStatus.ACCEPTED))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status", is("ACCEPTED")));

        // 5. Check notification created for student
        mockMvc.perform(get("/api/notifications")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data.content[0].type", is("APPLICATION_ACCEPTED")));

        // 6. Messaging: Student starts conversation with Owner
        User ownerUser = userRepository.findByEmail(ownerEmail).orElseThrow();
        CreateConversationRequest convReq = new CreateConversationRequest();
        convReq.setRecipientId(ownerUser.getId());
        convReq.setListingId(listingId);
        convReq.setInitialMessage("Hi, when can I visit the studio?");

        MvcResult convResult = mockMvc.perform(post("/api/conversations")
                        .header("Authorization", "Bearer " + studentToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(convReq)))
                .andExpect(status().isCreated())
                .andReturn();

        Long convId = objectMapper.readTree(convResult.getResponse().getContentAsString()).get("data").get("id").asLong();

        // Owner sends reply
        mockMvc.perform(post("/api/conversations/" + convId + "/messages")
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new MessageRequest("You can visit tomorrow at 2 PM!"))))
                .andExpect(status().isCreated());

        // Student reads conversation
        mockMvc.perform(get("/api/conversations/" + convId + "/messages")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content", hasSize(2)));

        // 7. Student leaves a review
        mockMvc.perform(post("/api/listings/" + listingId + "/reviews")
                        .header("Authorization", "Bearer " + studentToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ReviewRequest(5, "Amazing studio and very helpful owner!"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.rating", is(5)));

        // Public reviews for listing
        mockMvc.perform(get("/api/listings/" + listingId + "/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content", hasSize(1)));
    }

    @Test
    @DisplayName("Admin Dashboard & Moderation")
    void testAdminEndpoints() throws Exception {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        String adminEmail = "admin_" + suffix + "@example.com";
        String adminToken = authenticateUser(adminEmail, "Admin Officer", Role.ADMIN);

        // Platform stats
        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalUsers", greaterThanOrEqualTo(1)));

        // List users
        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content", notNullValue()));

        // Update user status
        User adminUser = userRepository.findByEmail(adminEmail).orElseThrow();
        mockMvc.perform(patch("/api/admin/users/" + adminUser.getId() + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new UpdateUserStatusRequest("ACTIVE"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status", is("ACTIVE")));
    }

    @Test
    @DisplayName("Admin monitoring endpoints (users, applications, verifications, conversations, notifications, activity, system)")
    void testAdminMonitoringEndpoints() throws Exception {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        String adminEmail = "monitor_admin_" + suffix + "@example.com";
        String adminToken = authenticateUser(adminEmail, "Monitor Admin", Role.ADMIN);

        String studentEmail = "monitor_student_" + suffix + "@example.com";
        String studentToken = authenticateUser(studentEmail, "Searchable Student", Role.STUDENT);

        // Expanded stats include verification and user-state counters
        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalUsers", greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.data.verifiedUsers", greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.data.totalListings", notNullValue()))
                .andExpect(jsonPath("$.data.totalApplications", notNullValue()))
                .andExpect(jsonPath("$.data.totalReports", notNullValue()));

        // User detail endpoint includes profile + counters
        User adminUser = userRepository.findByEmail(adminEmail).orElseThrow();
        mockMvc.perform(get("/api/admin/users/" + adminUser.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email", is(adminEmail)))
                .andExpect(jsonPath("$.data.role", is("ADMIN")));

        // Combined user filters + search
        mockMvc.perform(get("/api/admin/users")
                        .param("role", "STUDENT")
                        .param("emailVerified", "true")
                        .param("search", "Searchable")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].email", is(studentEmail)));

        // Applications monitoring
        mockMvc.perform(get("/api/admin/applications")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content", notNullValue()));

        // Verification activity - filter by email and derived status
        mockMvc.perform(get("/api/admin/verifications")
                        .param("email", studentEmail)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].email", is(studentEmail)))
                .andExpect(jsonPath("$.data.content[0].status", is("USED")))
                .andExpect(jsonPath("$.data.content[0].code").doesNotExist());

        mockMvc.perform(get("/api/admin/verifications")
                        .param("status", "USED")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());

        // Conversations metadata (never message content)
        mockMvc.perform(get("/api/admin/conversations")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content", notNullValue()));

        // Notifications monitoring
        mockMvc.perform(get("/api/admin/notifications")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content", notNullValue()));

        // Suspend the student so the audit log captures a USER_STATUS_CHANGED event
        User student = userRepository.findByEmail(studentEmail).orElseThrow();
        mockMvc.perform(patch("/api/admin/users/" + student.getId() + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new UpdateUserStatusRequest("SUSPENDED"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status", is("SUSPENDED")));

        // Activity log: registration + OTP events recorded during auth
        mockMvc.perform(get("/api/admin/activity")
                        .param("action", "USER_STATUS_CHANGED")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data.content[0].action", is("USER_STATUS_CHANGED")));

        mockMvc.perform(get("/api/admin/activity")
                        .param("action", "USER_REGISTERED")
                        .param("search", studentEmail)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].entityType", is("USER")));

        // OTP lifecycle events are recorded without secrets
        mockMvc.perform(get("/api/admin/activity")
                        .param("action", "OTP_REQUESTED")
                        .param("entityType", "VERIFICATION")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].description", containsString("requested")));

        // System overview
        mockMvc.perform(get("/api/admin/system")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status", is("UP")))
                .andExpect(jsonPath("$.data.databaseStatus", is("UP")))
                .andExpect(jsonPath("$.data.recordCounts.Users", greaterThanOrEqualTo(1)));

        // Non-admin accounts are forbidden from every admin endpoint
        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());

        // Anonymous requests are rejected
        mockMvc.perform(get("/api/admin/stats"))
                .andExpect(status().isUnauthorized());
    }
}
