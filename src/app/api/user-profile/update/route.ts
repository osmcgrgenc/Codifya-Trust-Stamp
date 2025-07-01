import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { rateLimit, apiLimiter } from '@/lib/rate-limit'

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

    // Request body'yi al
    const body = await request.json()
    const { fullName, username, bio, website } = body

    // Validation
    if (!fullName || !username) {
      return new NextResponse('Ad soyad ve kullanıcı adı gerekli', {
        status: 400,
      })
    }

    if (username.length < 3 || username.length > 20) {
      return new NextResponse('Kullanıcı adı 3-20 karakter arasında olmalı', {
        status: 400,
      })
    }

    if (fullName.length < 2 || fullName.length > 50) {
      return new NextResponse('Ad soyad 2-50 karakter arasında olmalı', {
        status: 400,
      })
    }

    // Username benzersizlik kontrolü (kendi username'i hariç)
    const { data: existingUser, error: checkError } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('username', username)
      .neq('user_id', user.id)
      .single()

    if (existingUser) {
      return new NextResponse('Bu kullanıcı adı zaten kullanılıyor', {
        status: 409,
      })
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
      console.error('Profile update error:', updateError)
      return new NextResponse('Profil güncellenemedi', { status: 500 })
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
      console.error('Metadata update error:', metadataError)
      // Metadata hatası kritik değil, profil güncellendi
    }

    return NextResponse.json({
      success: true,
      message: 'Profil başarıyla güncellendi',
      profile: updatedProfile,
    })
  } catch (error) {
    console.error('Profile update API error:', error)
    return new NextResponse('Sunucu hatası', { status: 500 })
  }
}
