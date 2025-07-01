import { Duration, Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { serverEnv } from './env'

// Redis client (optional - falls back to memory if not configured)
const redis =
  serverEnv.UPSTASH_REDIS_REST_URL && serverEnv.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: serverEnv.UPSTASH_REDIS_REST_URL!,
        token: serverEnv.UPSTASH_REDIS_REST_TOKEN!,
      })
    : undefined

// Helper function to create rate limiters with fallback
const createRateLimiter = (prefix: string, limit: number, window: string) => {
  if (!redis) {
    console.warn('Redis not configured, using memory-based rate limiting')
    return new Ratelimit({
      redis: null as unknown as Redis, // Force memory mode
      limiter: Ratelimit.slidingWindow(limit, window as Duration),
      analytics: true,
      prefix,
    })
  }

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window as Duration),
    analytics: true,
    prefix,
  })
}

// Rate limiters
export const apiLimiter = createRateLimiter('api_limiter', 10, '1 m')
export const authLimiter = createRateLimiter('auth_limiter', 5, '5 m')
export const testimonialLimiter = createRateLimiter(
  'testimonial_limiter',
  3,
  '1 h'
)

// IP cache for performance with proper cleanup
interface CacheEntry {
  ip: string
  timeoutId: NodeJS.Timeout
}

const ipCache = new Map<string, CacheEntry>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Helper function to get client IP with caching and collision prevention
export function getClientIP(request: Request): string {
  // Create a more unique cache key to prevent collisions
  const cacheKey = `${request.url}-${request.headers.get('user-agent') || ''}-${request.headers.get('x-forwarded-for') || ''}`

  // Check cache first
  if (ipCache.has(cacheKey)) {
    const entry = ipCache.get(cacheKey)!
    return entry.ip
  }

  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')

  let ip = 'unknown'

  if (forwarded) {
    ip = forwarded.split(',')[0].trim()
  } else if (realIP) {
    ip = realIP
  } else if (cfConnectingIP) {
    ip = cfConnectingIP
  }

  // Create timeout for cleanup
  const timeoutId = setTimeout(() => {
    ipCache.delete(cacheKey)
  }, CACHE_TTL)

  // Cache the result with timeout reference
  ipCache.set(cacheKey, { ip, timeoutId })

  return ip
}

// Rate limit result type
export interface RateLimitResult {
  success: boolean
  limit: number
  reset: number
  remaining: number
  message?: string
}

// Rate limit middleware for API routes
export async function rateLimit(
  request: Request,
  limiter: Ratelimit,
  identifier?: string | number
): Promise<RateLimitResult> {
  try {
    const ip = getClientIP(request)
    const id = identifier?.toString() || ip

    const { success, limit, reset, remaining } = await limiter.limit(id)

    if (!success) {
      return {
        success: false,
        limit,
        reset,
        remaining,
        message: 'Rate limit exceeded. Please try again later.',
      }
    }

    return {
      success: true,
      limit,
      reset,
      remaining,
    }
  } catch (error) {
    console.error('Rate limiting error:', error)

    // Fallback: allow request if rate limiting fails
    return {
      success: true,
      limit: 0,
      reset: 0,
      remaining: 0,
    }
  }
}

// Utility function to get rate limit headers
export function getRateLimitHeaders(
  result: RateLimitResult
): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  }
}

// Cleanup function for testing and memory management
export function clearIPCache(): void {
  for (const entry of ipCache.values()) {
    clearTimeout(entry.timeoutId)
  }
  ipCache.clear()
}

// Get cache statistics for monitoring
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: ipCache.size,
    keys: Array.from(ipCache.keys()),
  }
}
