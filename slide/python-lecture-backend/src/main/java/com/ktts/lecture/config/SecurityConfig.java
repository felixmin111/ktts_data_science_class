package com.ktts.lecture.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.ktts.lecture.config.properties.AppProperties;
import com.ktts.lecture.exception.ApiErrorResponse;
import com.ktts.lecture.exception.ErrorCode;
import com.ktts.lecture.repository.AppUserRepository;
import com.ktts.lecture.security.AuthRateLimitFilter;
import com.ktts.lecture.security.JwtAuthenticationFilter;
import com.ktts.lecture.security.JwtService;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private static final int BCRYPT_STRENGTH = 12;

    private final AppProperties appProperties;
    private final JwtService jwtService;
    private final AppUserRepository userRepository;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // CSRF protection is not needed for the Bearer-token API; the refresh cookie is SameSite=Strict
        // and the endpoints that read it also require the X-Requested-With header (AuthController).
        http.csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .headers(headers -> headers.contentSecurityPolicy(
                        csp -> csp.policyDirectives("default-src 'none'; frame-ancestors 'none'")))
                .authorizeHttpRequests(auth -> auth.requestMatchers(
                                HttpMethod.POST,
                                "/api/v1/auth/register",
                                "/api/v1/auth/login",
                                "/api/v1/auth/refresh",
                                "/api/v1/auth/logout")
                        .permitAll()
                        .requestMatchers("/api/v1/teacher/**")
                        .hasRole("TEACHER")
                        .requestMatchers("/api/v1/**")
                        .authenticated()
                        .requestMatchers("/error")
                        .permitAll()
                        .anyRequest()
                        .denyAll())
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, e) -> {
                            response.setStatus(
                                    ErrorCode.UNAUTHORIZED.getStatus().value());
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.getWriter().write(ApiErrorResponse.json(ErrorCode.UNAUTHORIZED));
                        })
                        .accessDeniedHandler((request, response, e) -> {
                            response.setStatus(ErrorCode.FORBIDDEN.getStatus().value());
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.getWriter().write(ApiErrorResponse.json(ErrorCode.FORBIDDEN));
                        }))
                .addFilterBefore(
                        new AuthRateLimitFilter(appProperties.rateLimit().authRequestsPerMinute()),
                        UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(
                        new JwtAuthenticationFilter(jwtService, userRepository),
                        UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(BCRYPT_STRENGTH);
    }

    /** Stops Spring Boot from creating its default in-memory user with a generated password. */
    @Bean
    public UserDetailsService userDetailsService() {
        return new InMemoryUserDetailsManager();
    }

    private CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        List<String> origins = appProperties.cors().allowedOrigins() == null
                ? List.of()
                : appProperties.cors().allowedOrigins().stream()
                        .filter(origin -> !origin.isBlank())
                        .toList();
        if (!origins.isEmpty()) {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowedOrigins(origins);
            config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
            config.setAllowCredentials(true);
            source.registerCorsConfiguration("/api/**", config);
        }
        return source;
    }
}
