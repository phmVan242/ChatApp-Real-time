package com.example.ChatApp.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * CORS cấu hình theo property, không hardcode origin.
 *
 * app.cors.allowed-origin-patterns=https://*.example.com,http://localhost:5173
 *
 * Dùng "origin pattern" (thay vì allowedOrigins) để hỗ trợ wildcard
 * và vẫn giữ được allowCredentials=true.
 */
@Configuration
@Slf4j
public class CorsConfig {

    @Value("${app.cors.allowed-origin-patterns:*}")
    private String[] allowedOriginPatterns;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(Arrays.asList(allowedOriginPatterns));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);
        // Cache preflight 1h để đỡ round-trip OPTIONS
        config.setMaxAge(3600L);

        log.info("CORS allowed origin patterns: {}", Arrays.toString(allowedOriginPatterns));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
