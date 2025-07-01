import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { rateLimit, apiLimiter } from '@/lib/rate-limit'
import { usernameSchema } from '@/lib/validation'

// Cache configuration
export const revalidate = 600 // 10 minutes
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    // Resolve params promise
    const resolvedParams = await params
    
    // Rate limiting
    const rateLimitResult = await rateLimit(request, apiLimiter, resolvedParams.username)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.message },
        { 
          status: 429,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      )
    }

    // Input validation
    const validatedUsername = usernameSchema.safeParse(resolvedParams.username)
    if (!validatedUsername.success) {
      return NextResponse.json(
        { error: 'Geçersiz kullanıcı adı' },
        { status: 400 }
      )
    }

    // Kullanıcı profilini getir
    const { data: userProfile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('username', validatedUsername.data)
      .single()

    if (error || !userProfile) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // Performance headers
    const response = NextResponse.json({ userProfile })
    
    // Cache headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200')
    response.headers.set('X-Cache-Status', 'MISS')
    
    // Compression hint
    response.headers.set('Vary', 'Accept-Encoding')
    
    return response
  } catch (error) {
    console.error('API hatası:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    )
  }
} 