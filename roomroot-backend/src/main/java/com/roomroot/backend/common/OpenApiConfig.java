package com.roomroot.backend.common;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "RoomRoot Backend API",
                version = "v1.0",
                description = "Production-ready REST API documentation for RoomRoot - Student Accommodation Platform",
                contact = @Contact(
                        name = "RoomRoot Team",
                        email = "support@roomroot.com"
                )
        ),
        security = {
                @SecurityRequirement(name = "BearerAuth")
        }
)
@SecurityScheme(
        name = "BearerAuth",
        description = "Enter JWT Bearer token obtained from /api/auth/verify-code",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        scheme = "bearer"
)
public class OpenApiConfig {
}
