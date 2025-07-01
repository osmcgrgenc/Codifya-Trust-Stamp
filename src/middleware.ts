import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  rateLimit,
  apiLimiter,
  authLimiter,
  RateLimitResult,
} from '@/lib/rate-limit-edge'

export async function middleware(request: NextRequest) {
  const startTime = Date.now()
  const { pathname } = request.nextUrl
  const isDevelopment = process.env.NODE_ENV === 'development'

  // Rate limiting for API routes
  let rateLimitResult: RateLimitResult | null = null
  if (pathname.startsWith('/api/')) {
    try {
      const limiter = pathname.startsWith('/api/auth')
        ? authLimiter
        : apiLimiter
      rateLimitResult = await rateLimit(request, limiter)

      if (!rateLimitResult.success) {
        return new NextResponse(
          JSON.stringify({
            error: rateLimitResult.message || 'Rate limit exceeded',
            retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': rateLimitResult.limit.toString(),
              'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
              'X-RateLimit-Reset': rateLimitResult.reset.toString(),
              'Retry-After': Math.ceil(
                (rateLimitResult.reset - Date.now()) / 1000
              ).toString(),
            },
          }
        )
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Rate limiting error in middleware:', error)
      }
      // Continue without rate limiting if it fails
    }
  }

  // Security headers
  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )

  // Content Security Policy - Enhanced for Next.js compatibility
  if (!isDevelopment) {
    const serverUrlEnv = process.env.NEXT_PUBLIC_SERVER_URL
    const cspDirectives = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://*.supabase.co ${serverUrlEnv}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      `img-src 'self' data: https: blob: https://*.supabase.co ${serverUrlEnv}`,
      "font-src 'self' https://fonts.gstatic.com",
      `connect-src 'self' https://*.supabase.co https://api.stripe.com https://*.supabase.com ${serverUrlEnv}`,
      'frame-src https://js.stripe.com',
      "media-src 'self' blob: https:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      'upgrade-insecure-requests',
    ]
    response.headers.set('Content-Security-Policy', cspDirectives.join('; '))
  }

  // Add rate limit headers to response if available
  if (pathname.startsWith('/api/') && rateLimitResult?.success) {
    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString())
    response.headers.set(
      'X-RateLimit-Remaining',
      rateLimitResult.remaining.toString()
    )
    response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString())
  }

  // Block suspicious requests with more patterns (less aggressive in development)
  const userAgent = request.headers.get('user-agent') || ''

  // Only block obvious bots in development
  const suspiciousPatterns = isDevelopment
    ? [/bot/i, /crawler/i, /spider/i, /scraper/i]
    : [
        /bot/i,
        /crawler/i,
        /spider/i,
        /scraper/i,
        /curl/i,
        /wget/i,
        /python/i,
        /java/i,
        /perl/i,
        /ruby/i,
        /php/i,
        /go-http-client/i,
        /okhttp/i,
        /axios/i,
        /fetch/i,
      ]

  if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Blocked suspicious request from: ${userAgent}`)
    }
    return new NextResponse('Forbidden', { status: 403 })
  }

  // Performance monitoring
  const duration = Date.now() - startTime
  if (duration > 100) {
    // Log slow middleware executions
    if (process.env.NODE_ENV === 'development') {
      console.log(`Slow middleware execution: ${duration}ms for ${pathname}`)
    } else {
      console.warn(`Slow middleware: ${duration}ms`, { pathname, duration })
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|api/).*)',
  ],
}
