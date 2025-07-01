import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { rateLimit, apiLimiter } from '@/lib/rate-limit'
import { usernameSchema, sanitizeHtml } from '@/lib/validation'
import { z } from 'zod'

// Profile update validation schema
const profileUpdateSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Ad soyad en az 2 karakter olmalıdır')
    .max(50, 'Ad soyad en fazla 50 karakter olabilir')
    .transform(val => sanitizeHtml(val.trim())),
  username: usernameSchema,
  bio: z
    .string()
    .max(500, 'Bio en fazla 500 karakter olabilir')
    .optional()
    .transform(val => (val ? sanitizeHtml(val.trim()) : null)),
  website: z
    .string()
    .url('Geçerli bir URL giriniz')
    .optional()
    .or(z.literal(''))
    .transform(val => (val && val !== '' ? val : null)),
})

export async function PUT(request: NextRequest) {
  try {
    // Rate limiting
    const { success } = await rateLimit(request, apiLimiter)
    if (!success) {
      return new NextResponse('Çok fazla istek gönderildi', { status: 429 })
    }

    // Kullanıcı kimlik doğrulaması
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return new NextResponse('Kimlik doğrulama gerekli', { status: 401 })
    }

    // Request body'yi al ve validate et
    const body = await request.json()

    const validationResult = profileUpdateSchema.safeParse(body)
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }))

      return NextResponse.json(
        {
          error: 'Validation hatası',
          details: errors,
        },
        { status: 400 }
      )
    }

    const { fullName, username, bio, website } = validationResult.data

    // Username benzersizlik kontrolü (kendi username'i hariç)
    const { data: existingUser, error: checkError } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('username', username)
      .neq('user_id', user.id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      if (process.env.NODE_ENV === 'development') {
        console.error('Username check error:', checkError)
      } else {
        console.error('Username check failed', { userId: user.id })
      }
      return NextResponse.json(
        { error: 'Kullanıcı adı kontrolü başarısız' },
        { status: 500 }
      )
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu kullanıcı adı zaten kullanılıyor' },
        { status: 409 }
      )
    }

    // Profil güncelleme
    const { data: updatedProfile, error: updateError } = await supabase
      .from('user_profiles')
      .update({
        display_name: fullName,
        username: username.toLowerCase(),
        bio: bio || null,
        website_url: website || null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Profile update error:', updateError)
      } else {
        console.error('Profile update failed', { userId: user.id })
      }
      return NextResponse.json(
        { error: 'Profil güncellenemedi' },
        { status: 500 }
      )
    }

    // User metadata güncelleme
    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        username: username.toLowerCase(),
        bio: bio || null,
        website: website || null,
      },
    })

    if (metadataError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Metadata update error:', metadataError)
      }
      // Metadata hatası kritik değil, profil güncellendi
    }

    return NextResponse.json({
      success: true,
      message: 'Profil başarıyla güncellendi',
      profile: updatedProfile,
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Profile update API error:', error)
    } else {
      console.error('Profile update API error occurred')
    }
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
