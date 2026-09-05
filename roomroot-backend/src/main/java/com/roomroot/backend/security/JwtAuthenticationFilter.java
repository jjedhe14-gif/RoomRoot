package com.roomroot.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.roomroot.backend.user.UserStatus;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, CustomUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7).trim();
        try {
            userEmail = jwtService.extractUsername(jwt);
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                // Preserve only the two routes needed to show the ban reason and
                // submit an appeal. A pre-existing JWT must not keep a suspended
                // account usable while the client is waiting for its next poll.
                if (userDetails instanceof UserPrincipal principal
                        && UserStatus.SUSPENDED.equalsIgnoreCase(principal.getUser().getStatus())
                        && !isSuspensionRoute(request)) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"success\":false,\"message\":\"This account has been suspended\",\"error\":\"ACCOUNT_SUSPENDED\"}");
                    return;
                }

                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Invalid or expired token: proceed without authentication; Spring Security handles authorization
            logger.debug("JWT authentication failed: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private boolean isSuspensionRoute(HttpServletRequest request) {
        String uri = request.getRequestURI();
        return ("/api/users/me".equals(uri) && "GET".equalsIgnoreCase(request.getMethod()))
                || ("/api/users/me/appeal".equals(uri) && "POST".equalsIgnoreCase(request.getMethod()));
    }
}
