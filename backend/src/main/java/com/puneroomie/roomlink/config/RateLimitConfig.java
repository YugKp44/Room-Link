package com.puneroomie.roomlink.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class RateLimitConfig {
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    private Bucket resolveBucket(String key) {
        return cache.computeIfAbsent(key, k -> Bucket.builder()
                .addLimit(Bandwidth.classic(60, Refill.greedy(60, Duration.ofMinutes(1)))) // 60 req/min
                .build());
    }

    @Bean
    @Order(1)
    public Filter rateLimitingFilter() {
        return new Filter() {
            private boolean protectedPath(String uri, String method) {
                if (uri.startsWith("/api/auth/"))
                    return true; // register/login
                // listing creation endpoint
                return uri.equals("/api/listings") && "POST".equalsIgnoreCase(method);
            }

            @Override
            public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
                    throws IOException, ServletException {
                HttpServletRequest req = (HttpServletRequest) request;
                HttpServletResponse res = (HttpServletResponse) response;
                String ip = request.getRemoteAddr();
                String key = ip + ":" + req.getRequestURI();
                if (!protectedPath(req.getRequestURI(), req.getMethod())) {
                    chain.doFilter(request, response);
                    return;
                }
                Bucket bucket = resolveBucket(key);
                if (bucket.tryConsume(1))
                    chain.doFilter(request, response);
                else {
                    res.setStatus(429);
                    res.getWriter().write("Too Many Requests");
                }
            }
        };
    }
}
