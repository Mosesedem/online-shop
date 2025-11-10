/**
 * Rate Limiting Utilities
 * Protects verification and sensitive endpoints
 */

import { redis } from "./redis";

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

/**
 * Check rate limit for a given identifier
 * Uses Redis for distributed rate limiting
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 5, windowMs: 3600000 }
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const key = `rate-limit:${identifier}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;

  try {
    // Remove old entries
    await redis.zremrangebyscore(key, 0, windowStart);

    // Count requests in current window
    const requestCount = await redis.zcard(key);

    if (requestCount >= config.maxRequests) {
      const oldestRequest = await redis.zrange(key, 0, 0, "WITHSCORES");
      const resetAt = oldestRequest[1]
        ? Number(oldestRequest[1]) + config.windowMs
        : now + config.windowMs;

      return {
        allowed: false,
        remaining: 0,
        resetAt,
      };
    }

    // Add current request
    await redis.zadd(key, now, `${now}-${Math.random()}`);
    await redis.expire(key, Math.ceil(config.windowMs / 1000));

    return {
      allowed: true,
      remaining: config.maxRequests - requestCount - 1,
      resetAt: now + config.windowMs,
    };
  } catch (error) {
    console.error("Rate limit check failed:", error);
    // Fail open in case of Redis errors
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowMs,
    };
  }
}

/**
 * Rate limit middleware for API routes
 */
export function withRateLimit(handler: Function, config?: RateLimitConfig) {
  return async (request: Request) => {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const { allowed, remaining, resetAt } = await checkRateLimit(ip, config);

    if (!allowed) {
      return new Response(
        JSON.stringify({
          error: "Too many requests",
          resetAt: new Date(resetAt).toISOString(),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": config?.maxRequests.toString() || "5",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": resetAt.toString(),
            "Retry-After": Math.ceil((resetAt - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Add rate limit headers to response
    const response = await handler(request);

    if (response instanceof Response) {
      response.headers.set(
        "X-RateLimit-Limit",
        config?.maxRequests.toString() || "5"
      );
      response.headers.set("X-RateLimit-Remaining", remaining.toString());
      response.headers.set("X-RateLimit-Reset", resetAt.toString());
    }

    return response;
  };
}
