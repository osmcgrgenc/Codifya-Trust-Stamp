import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { rateLimit, testimonialLimiter } from '@/lib/rate-limit'
import { usernameSchema } from '@/lib/validation'

// Cache configuration
export const revalidate = 300 // 5 minutes
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    // Resolve params promise
    const resolvedParams = await params

    // Rate limiting
    const rateLimitResult = await rateLimit(
      request,
      testimonialLimiter,
      resolvedParams.username
    )
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.message },
        {
          status: 429,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
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

    // Kullanıcı profilini bul
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('username', validatedUsername.data)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // Onaylanmış yorumları getir
    const { data: testimonials, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('user_id', userProfile.user_id)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Yorumlar getirilirken hata:', error)
      return NextResponse.json(
        { error: 'Yorumlar yüklenemedi' },
        { status: 500 }
      )
    }

    // Performance headers
    const response = NextResponse.json({ testimonials: testimonials || [] })

    // Cache headers for better performance
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600'
    )
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
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    )
  }
}
