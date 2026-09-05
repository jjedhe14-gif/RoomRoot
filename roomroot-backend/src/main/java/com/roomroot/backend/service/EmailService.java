package com.roomroot.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

/**
 * Sends OTP verification emails via the EmailJS REST API.
 * <p>
 * This reuses the same EmailJS service and template configured in the standalone
 * OTP project ({@code /Users/jayesh/Documents/OTP/}), so no new email provider
 * setup is required.
 * <p>
 * Environment variables required (same as the OTP project):
 * <ul>
 *   <li>{@code EMAILJS_PUBLIC_KEY}   – EmailJS public key</li>
 *   <li>{@code EMAILJS_SERVICE_ID}   – EmailJS service ID</li>
 *   <li>{@code EMAILJS_TEMPLATE_ID}  – EmailJS template ID</li>
 * </ul>
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private static final String EMAILJS_API_URL =
            "https://api.emailjs.com/api/v1.0/email/send";

    private final String publicKey;
    private final String serviceId;
    private final String templateId;
    private final HttpClient httpClient;

    public EmailService(
            @Value("${roomroot.email.js-public-key}") String publicKey,
            @Value("${roomroot.email.js-service-id}") String serviceId,
            @Value("${roomroot.email.js-template-id}") String templateId) {
        this.publicKey = publicKey;
        this.serviceId = serviceId;
        this.templateId = templateId;
        this.httpClient = HttpClient.newHttpClient();
    }

    /**
     * Send a 6-digit OTP code to the given email address via EmailJS.
     *
     * @param recipientEmail the user's email address (OTP is sent HERE, not to admin)
     * @param otpCode        the 6-digit verification code
     * @throws RuntimeException if the email service call fails
     */
    public void sendOtpEmail(String recipientEmail, String otpCode) {
        // Build the JSON payload matching the OTP project's template variables:
        //   { to_email: email, otp: generatedOTP }
        String jsonPayload = """
                {
                    "service_id": "%s",
                    "template_id": "%s",
                    "user_id": "%s",
                    "template_params": {
                        "to_email": "%s",
                        "otp": "%s"
                    }
                }
                """.formatted(serviceId, templateId, publicKey, recipientEmail, otpCode);

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(EMAILJS_API_URL))
                    .header("Content-Type", "application/json")
                    .header("Origin", "http://localhost:5173")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            // EmailJS returns status 200 with the plain-text body "OK" on success.
            if (response.statusCode() == 200 && "OK".equalsIgnoreCase(response.body().trim())) {
                log.info("OTP email sent successfully to {}", recipientEmail);
            } else {
                log.error("EmailJS returned status {}: {}", response.statusCode(), response.body());
                throw new RuntimeException(
                        "Email delivery failed (EmailJS status " + response.statusCode() + ")");
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Email sending interrupted for {}", recipientEmail, e);
            throw new RuntimeException("Email delivery was interrupted", e);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}", recipientEmail, e);
            throw new RuntimeException("Unable to send verification email: " + e.getMessage(), e);
        }
    }
}
