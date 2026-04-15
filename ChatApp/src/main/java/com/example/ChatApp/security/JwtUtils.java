//package com.example.ChatApp.security;
//
//import io.jsonwebtoken.*;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Component;
//import javax.crypto.SecretKey;
//import java.util.Date;
//
//@Component
//public class JwtUtils {
//    private final SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
//    @Value("${jwt.expiration}") private long expiration;
//
//    public String generateToken(Long userId, String username) {
//        return Jwts.builder()
//                .setSubject(username)
//                .claim("userId", userId)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + expiration))
//                .signWith(key)
//                .compact();
//    }
//
//    public Long getUserIdFromToken(String token) {
//        Claims claims = Jwts.parserBuilder().setSigningKey(key).build()
//                .parseClaimsJws(token).getBody();
//        return claims.get("userId", Long.class);
//    }
//
//    public String getUsernameFromToken(String token) {
//        return Jwts.parserBuilder().setSigningKey(key).build()
//                .parseClaimsJws(token).getBody().getSubject();
//    }
//
//    public boolean validateToken(String token) {
//        try {
//            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
//            return true;
//        } catch (JwtException | IllegalArgumentException e) {
//            return false;
//        }
//    }
//}