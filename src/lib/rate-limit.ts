import Redis from 'ioredis'
import { serverEnv } from './env'

// Redis client (optional - falls back to memory if not configured)
const redis = serverEnv.REDIS_URL ? new Redis(serverEnv.REDIS_URL) : undefined

// Memory fallback için basit sayaç
const memoryCounters = new Map<string, { count: number; reset: number }>()

// Helper function to create rate limiters with fallback
type RateLimiterConfig = {
  prefix: string
  limit: number
  window: number // ms cinsinden
}

function createRateLimiter({ prefix, limit, window }: RateLimiterConfig) {
  return {
    async limit(id: string) {
      const key = `${prefix}:${id}`
      const now = Date.now()
      let remaining = limit
      let reset = now + window
      let count = 0
      let success = true

      if (redis) {
        // Redis ile atomic increment ve expire
        count = await redis.incr(key)
        if (count === 1) {
          await redis.pexpire(key, window)
        }
        remaining = Math.max(0, limit - count)
        reset = now + (await redis.pttl(key))
        success = count <= limit
      } else {
        // Memory fallback
        let entry = memoryCounters.get(key)
        if (!entry || entry.reset < now) {
          entry = { count: 1, reset: now + window }
        } else {
          entry.count++
        }
        memoryCounters.set(key, entry)
        count = entry.count
        remaining = Math.max(0, limit - count)
        reset = entry.reset
        success = count <= limit
      }

      return {
        success,
        limit,
        reset,
        remaining,
      }
    },
  }
}

// Rate limiters
export const apiLimiter = createRateLimiter({
  prefix: 'api_limiter',
  limit: 10,
  window: 60_000,
})
export const authLimiter = createRateLimiter({
  prefix: 'auth_limiter',
  limit: 5,
  window: 5 * 60_000,
})
export const testimonialLimiter = createRateLimiter({
  prefix: 'testimonial_limiter',
  limit: 3,
  window: 60 * 60_000,
})

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
  limiter: {
    limit: (id: string) => Promise<{
      success: boolean
      limit: number
      reset: number
      remaining: number
    }>
  },
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
