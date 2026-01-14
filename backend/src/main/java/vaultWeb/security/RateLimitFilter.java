package vaultWeb.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Order(1)
public class RateLimitFilter implements Filter {

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    @Value("${spring.rateLimitPerMinute}")
    private Integer rateLimit;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
            FilterChain chain) throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String clientId = getClientId(httpRequest);
        Bucket bucket = resolveBucket(clientId);

        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

        if (probe.isConsumed()) {
            httpResponse.addHeader("X-Rate-Limit-Remaining",
                    String.valueOf(probe.getRemainingTokens()));
            chain.doFilter(request, response);
        } else {
            httpResponse.setStatus(429); // Too Many Requests
            httpResponse.addHeader("X-Rate-Limit-Retry-After-Seconds",
                    String.valueOf(probe.getNanosToWaitForRefill() / 1_000_000_000));
            httpResponse.getWriter().write("Rate limit exceeded");
        }
    }

    private Bucket resolveBucket(String clientId) {
        return cache.computeIfAbsent(clientId, k -> createNewBucket());
    }

    private Bucket createNewBucket() {
        Bandwidth limit = Bandwidth.builder()
                .capacity(rateLimit) // 100 requests
                .refillGreedy(rateLimit, Duration.ofMinutes(1)) // per minute
                .build();

        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    private String getClientId(HttpServletRequest request) {
        // First, try to get the Bearer token from Authorization header
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            // Option 1: Use the entire token as identifier
            return token;

        }
        // Option 1: use IP address
        return request.getRemoteAddr();
    }
}

// for i in {1..110}; do echo "Request $i"; curl --location
// 'http://localhost:8080/api/dashboard/me' --header 'Authorization: Bearer
// eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJOaWtoaWwiLCJpYXQiOjE3NjgzMjQ2MDIsImV4cCI6MTc2ODMyNTUwMn0.lhaYKBS76XuMOnILyh5tEmzJl_hHJ_dwr9I1At3dzDYccOOzanAXp2dsGCjeT0O_TCHqf3PXOwUQoAs86wl-rg'
// -w "\nStatus: %{http_code}\n" -s -o /dev/null; echo "---"; done